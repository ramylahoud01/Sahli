// src/pages/Shop/PublicShopPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  OpenInNew as ExternalIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Store as StoreIcon,
  Inventory2Outlined as InventoryIcon,
  TuneOutlined as FilterIcon,
  GridViewOutlined as GridIcon,
} from "@mui/icons-material";

import { getShopById, getShopSubcategories } from "../../api/shops";
import { listPublicShopProducts } from "../../api/products";
import NoResults from "../../components/Empty/NoResults";
import PublicShopPageLoading from "../../components/loading/PublicShopPageLoading";
import PublicShopHeader from "./PublicShopHeader";
import PublicProductCard from "./PublicProductCard";
import CardLoading from "../../components/loading/CardLoading";

// Debounce hook
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Helper: convert color to rgba with custom alpha
function toAlphaColor(color, alpha = 0.6) {
  if (!color || typeof color !== "string") return color;
  const c = color.trim();

  if (c.startsWith("#")) {
    let hex = c.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .slice(0, 3)
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some((v) => Number.isNaN(v))) return color;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  if (c.startsWith("rgb")) {
    const match = c.match(/rgba?\s*\(([^)]+)\)/i);
    if (!match) return color;
    const parts = match[1]
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 3) return color;
    const r = parseInt(parts[0], 10);
    const g = parseInt(parts[1], 10);
    const b = parseInt(parts[2], 10);
    if ([r, g, b].some((v) => Number.isNaN(v))) return color;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

export default function PublicShopPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [shop, setShop] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  const [shopLoading, setShopLoading] = React.useState(true);
  const [productsLoading, setProductsLoading] = React.useState(false);
  const [initialProductsLoaded, setInitialProductsLoaded] =
    React.useState(false);

  const [error, setError] = React.useState("");
  const [notFound, setNotFound] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const [subcategoryFilter, setSubcategoryFilter] = React.useState("all");
  const [subcategories, setSubcategories] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(16);
  const [totalProducts, setTotalProducts] = React.useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Load shop
  React.useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    async function loadShop() {
      try {
        setShopLoading(true);
        setError("");
        setNotFound(false);

        const foundShop = await getShopById(shopId);
        if (cancelled) return;

        if (!foundShop) {
          setNotFound(true);
          setShopLoading(false);
          return;
        }

        setShop(foundShop);
      } catch (e) {
        if (cancelled) return;
        console.error("[PublicShopPage] shop fetch error:", e);
        const msg = String(e?.message || "").toLowerCase();
        if (msg.includes("not found")) {
          setNotFound(true);
        } else {
          setError(e?.message || "Failed to load shop");
        }
      } finally {
        if (!cancelled) setShopLoading(false);
      }
    }

    loadShop();
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  // Load products
  React.useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    async function loadProducts() {
      try {
        if (initialProductsLoaded) {
          setProductsLoading(true);
        }

        const result = await listPublicShopProducts(shopId, {
          page,
          limit: itemsPerPage,
          q: debouncedSearchQuery,
          subcategoryId:
            subcategoryFilter !== "all" ? subcategoryFilter : undefined,
        });

        if (cancelled) return;

        const items = Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result)
          ? result
          : [];
        const total =
          typeof result?.total === "number" ? result.total : items.length;

        setProducts(items);
        setTotalProducts(total);

        if (!initialProductsLoaded) {
          setInitialProductsLoaded(true);
        }
      } catch (e) {
        if (cancelled) return;
        console.error("[PublicShopPage] products fetch error:", e);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [
    shopId,
    page,
    itemsPerPage,
    debouncedSearchQuery,
    subcategoryFilter,
    initialProductsLoaded,
  ]);

  // Load subcategories
  React.useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    async function loadSubcategories() {
      try {
        const subs = await getShopSubcategories(shopId);
        if (cancelled) return;
        setSubcategories(subs || []);
      } catch (e) {
        console.error("[PublicShopPage] error loading subcategories:", e);
      }
    }

    loadSubcategories();
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts === 0 ? 1 : totalProducts / itemsPerPage)
  );
  const currentPage = Math.min(page, totalPages);
  const fromItem =
    totalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const toItem =
    totalProducts === 0
      ? 0
      : Math.min(currentPage * itemsPerPage, totalProducts);

  const handleSearchClear = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handleSubcategoryChange = (value) => {
    setSubcategoryFilter(value);
    setPage(1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Full-page loading
  if ((shopLoading || !initialProductsLoaded) && !notFound && !error) {
    return <PublicShopPageLoading />;
  }

  // Error state
  if (error && !notFound) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.grey[50],
          px: 2,
        }}
      >
        <NoResults
          title="Something went wrong"
          subtitle={error}
          actionLabel="Back to home"
          onActionPress={() => navigate("/")}
        />
      </Box>
    );
  }

  // Not found state
  if (notFound || !shop) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.grey[50],
          px: 2,
        }}
      >
        <NoResults
          title="Shop not found"
          subtitle="This shop does not exist anymore or the link is incorrect."
          actionLabel="Back to home"
          onActionPress={() => navigate("/")}
        />
      </Box>
    );
  }

  const logoSrc = shop?.image && shop.image.url;
  const logoUrl = logoSrc ? logoSrc : "";
  const locationText = shop.address;
  const shopThemeColor = shop.themeColor;

  const accentColor = shopThemeColor || theme.palette.primary.main;
  const accentSoftBg = toAlphaColor(accentColor, 0.08);
  const accentHoverBg = toAlphaColor(accentColor, 0.12);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <PublicShopHeader
        shop={shop}
        logoUrl={logoUrl}
        locationText={locationText}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        focused={focused}
        setFocused={setFocused}
        handleSearchClear={handleSearchClear}
        theme={theme}
        shopThemeColor={shopThemeColor}
      />

      {/* HERO BANNER CARD */}
      {(shop.name || shop.description) && (
        <Container
          maxWidth="xl"
          sx={{ mt: { xs: 2, md: 3 }, px: { xs: 2, sm: 2.5, md: 3 } }} // smaller margin + padding
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "16px", // smaller
              bgcolor: "#FFFFFF",
              boxShadow: "0 3px 14px rgba(15, 23, 42, 0.05)", // softer shadow
              border: `1px solid ${theme.palette.grey[300]}`,
              p: { xs: 2.5, sm: 3, md: 3.5 }, // reduced padding
              overflow: "hidden",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
                transform: "translateY(-1px)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "4px", // smaller accent bar
                background: `linear-gradient(180deg, ${accentColor}, ${toAlphaColor(
                  accentColor,
                  0.6
                )})`,
                borderRadius: "16px 0 0 16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {shop.name && (
                  <Typography
                    sx={{
                      fontSize: { xs: 18, sm: 22, md: 24 }, // smaller title
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: shop.description ? 1 : 0,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {shop.name}
                  </Typography>
                )}

                {shop.description && (
                  <Typography
                    sx={{
                      fontSize: { xs: 13, sm: 14 }, // smaller desc
                      lineHeight: 1.6,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {shop.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      )}

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1 }}>
        {/* STATS & FILTER BAR */}
        <Container
          maxWidth="xl"
          sx={{ mt: { xs: 2.5, md: 4 }, px: { xs: 2.5, sm: 3, md: 4 } }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2.5,
              alignItems: { xs: "stretch", lg: "center" },
              justifyContent: "space-between",
              bgcolor: "#FFFFFF",
              borderRadius: "18px",
              p: { xs: 2.5, sm: 3 },
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
              border: `1px solid ${theme.palette.grey[200]}`,
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0 6px 24px rgba(15, 23, 42, 0.08)",
              },
            }}
          >
            {/* Left: Stats with modern styling */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.5,
                  }}
                >
                  Product Catalog
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1,
                  }}
                >
                  {fromItem}-{toItem}{" "}
                  <Box
                    component="span"
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    of {totalProducts}
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* Right: Filters with premium styling */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* Subcategory filter */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 220 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: 44,
                    backgroundColor: theme.palette.grey[50],
                    border: `1.5px solid ${theme.palette.grey[300]}`,
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: `0 0 0 3px ${toAlphaColor(accentColor, 0.05)}`,
                    },
                    "&.Mui-focused": {
                      //   borderColor: accentColor,
                      //   bgcolor: "#FFFFFF",
                      //   boxShadow: `0 0 0 3px ${toAlphaColor(accentColor, 0.15)}`,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <Select
                  value={subcategoryFilter}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "14px",
                        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.15)",
                        mt: 1,
                        border: `1px solid ${theme.palette.grey[200]}`,
                        "& .MuiMenuItem-root": {
                          fontSize: 14,
                          minHeight: 42,
                          py: 1.25,
                          px: 2,
                          borderRadius: "10px",
                          mx: 1,
                          my: 0.25,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: accentSoftBg,
                            color: accentColor,
                          },
                          "&.Mui-selected": {
                            bgcolor: accentSoftBg,
                            color: accentColor,
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: accentHoverBg,
                            },
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    "& .MuiSelect-icon": {
                      color: theme.palette.text.secondary,
                      transition: "transform 0.2s ease",
                    },
                    "&.Mui-expanded .MuiSelect-icon": {
                      transform: "rotate(180deg)",
                    },
                  }}
                >
                  <MenuItem value="all">
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Chip
                        label="All"
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: 11,
                          fontWeight: 700,
                          bgcolor: accentSoftBg,
                          color: accentColor,
                          border: `1px solid ${toAlphaColor(accentColor, 0.2)}`,
                        }}
                      />
                      All Categories
                    </Box>
                  </MenuItem>
                  {subcategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Items per page */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 140 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: 44,
                    backgroundColor: theme.palette.grey[50],
                    border: `1.5px solid ${theme.palette.grey[300]}`,
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: `0 0 0 3px ${toAlphaColor(accentColor, 0.05)}`,
                    },
                    "&.Mui-focused": {
                      //   borderColor: accentColor,
                      //   bgcolor: "#FFFFFF",
                      //   boxShadow: `0 0 0 3px ${toAlphaColor(accentColor, 0.15)}`,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  IconComponent={KeyboardArrowDownIcon}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "14px",
                        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.15)",
                        mt: 1,
                        border: `1px solid ${theme.palette.grey[200]}`,
                        "& .MuiMenuItem-root": {
                          fontSize: 14,
                          minHeight: 42,
                          py: 1.25,
                          px: 2,
                          borderRadius: "10px",
                          mx: 1,
                          my: 0.25,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: accentSoftBg,
                            color: accentColor,
                          },
                          "&.Mui-selected": {
                            bgcolor: accentSoftBg,
                            color: accentColor,
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: accentHoverBg,
                            },
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    "& .MuiSelect-icon": {
                      color: theme.palette.text.secondary,
                      transition: "transform 0.2s ease",
                    },
                    "&.Mui-expanded .MuiSelect-icon": {
                      transform: "rotate(180deg)",
                    },
                  }}
                >
                  <MenuItem value={8}>8 per page</MenuItem>
                  <MenuItem value={16}>16 per page</MenuItem>
                  <MenuItem value={24}>24 per page</MenuItem>
                  <MenuItem value={32}>32 per page</MenuItem>
                  <MenuItem value={48}>48 per page</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Container>

        {/* PRODUCTS SECTION */}
        <Container
          maxWidth="xl"
          sx={{ mt: 4, mb: { xs: 5, md: 6 }, px: { xs: 2.5, sm: 3, md: 4 } }}
        >
          {productsLoading ? (
            <CardLoading items={itemsPerPage} />
          ) : totalProducts === 0 ? (
            <NoResults
              title={
                debouncedSearchQuery.trim() || subcategoryFilter !== "all"
                  ? "No products match your filters"
                  : "No products available yet"
              }
              subtitle={
                debouncedSearchQuery.trim() || subcategoryFilter !== "all"
                  ? "Try clearing your search or selecting another subcategory."
                  : "This shop hasn't listed any products yet. Please check back later."
              }
              actionLabel={
                debouncedSearchQuery.trim() || subcategoryFilter !== "all"
                  ? "Clear filters"
                  : undefined
              }
              onActionPress={
                debouncedSearchQuery.trim() || subcategoryFilter !== "all"
                  ? () => {
                      setSearchQuery("");
                      setSubcategoryFilter("all");
                      setPage(1);
                    }
                  : undefined
              }
              shopThemeColor={shopThemeColor}
            />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 2.5, md: 3 },
              }}
            >
              {products.map((product) => (
                <PublicProductCard
                  key={product._id}
                  product={product}
                  theme={theme}
                  accentColor={shopThemeColor}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* PREMIUM FOOTER */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          mt: "auto",
          py: { xs: 4, md: 5 },
          bgcolor: "#FFFFFF",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3.5,
            }}
          >
            {totalPages > 1 && totalProducts > 0 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: "12px",
                    minWidth: 42,
                    height: 42,
                    border: `1.5px solid ${theme.palette.grey[300]}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: accentColor,
                      bgcolor: accentSoftBg,
                      color: accentColor,
                    },
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: accentColor,
                    color: "#fff",
                    fontWeight: 700,
                    border: `1.5px solid ${accentColor}`,
                    boxShadow: `0 4px 12px ${toAlphaColor(accentColor, 0.3)}`,
                    "&:hover": {
                      backgroundColor: accentColor,
                      opacity: 0.9,
                    },
                  },
                }}
              />
            )}

            <Button
              endIcon={<ExternalIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                px: 3,
                py: 1.25,
                borderRadius: "12px",
                border: `1.5px solid ${theme.palette.grey[300]}`,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  color: accentColor,
                  bgcolor: accentSoftBg,
                  //   borderColor: accentColor,
                  //   boxShadow: `0 0 0 3px ${toAlphaColor(accentColor, 0.1)}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Powered by Sahli – Explore more shops
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
