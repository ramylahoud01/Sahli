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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { OpenInNew as ExternalIcon } from "@mui/icons-material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import { getShopById, getShopSubcategories } from "../../api/shops";
import { listPublicShopProducts } from "../../api/products";
import NoResults from "../../components/Empty/NoResults";
import PublicShopPageLoading from "../../components/loading/PublicShopPageLoading";
import PublicShopHeader from "./PublicShopHeader";
import PublicProductCard from "./PublicProductCard";
import CardLoading from "../../components/loading/CardLoading";

const API_BASE = "http://10.5.50.243:4000";

// debounce for search
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 🔧 Helper: convert hex or rgb/rgba string to rgba with custom alpha
function toAlphaColor(color, alpha = 0.6) {
  if (!color || typeof color !== "string") return color;
  const c = color.trim();

  // HEX: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (c.startsWith("#")) {
    let hex = c.slice(1);

    // #rgb or #rgba → expand to #rrggbb and ignore existing a
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .slice(0, 3)
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }

    // #rrggbb or #rrggbbaa → use first 6 chars for rgb
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some((v) => Number.isNaN(v))) return color;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Fallback if weird hex
    return color;
  }

  // rgb(...) or rgba(...)
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

  // Anything else (CSS variable, named color, etc.) → keep as is
  return color;
}

export default function PublicShopPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [shop, setShop] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  // ✅ Separate loading states
  const [shopLoading, setShopLoading] = React.useState(true); // full page first load
  const [productsLoading, setProductsLoading] = React.useState(false); // cards skeleton after first load
  const [initialProductsLoaded, setInitialProductsLoaded] =
    React.useState(false); // first products load done

  const [error, setError] = React.useState("");
  const [notFound, setNotFound] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  // "all" or a real subcategoryId
  const [subcategoryFilter, setSubcategoryFilter] = React.useState("all");
  const [subcategories, setSubcategories] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(16);
  const [totalProducts, setTotalProducts] = React.useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Load shop (initial)
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

  // Load products (every time page / filters change)
  React.useEffect(() => {
    if (!shopId) return;

    let cancelled = false;

    async function loadProducts() {
      try {
        // ✅ Only show cards skeleton AFTER initial products have been loaded once
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

        // ✅ Mark that initial products load is done
        if (!initialProductsLoaded) {
          setInitialProductsLoaded(true);
        }
      } catch (e) {
        if (cancelled) return;
        console.error("[PublicShopPage] products fetch error:", e);
        // Keep previous products on error
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, page, itemsPerPage, debouncedSearchQuery, subcategoryFilter]);

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

  // ✅ Full-page loading ONLY for first load (shop + first products)
  if ((shopLoading || !initialProductsLoaded) && !notFound && !error) {
    return <PublicShopPageLoading />;
  }

  // ⚠️ These two branches run before shopThemeColor exists, so we don't pass it here
  if (error && !notFound) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.background.default,
          px: theme.spacing(2),
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

  if (notFound || !shop) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.background.default,
          px: theme.spacing(2),
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

  // 🎨 Background = theme color with alpha 0.6 if possible
  const statsBgColor = shopThemeColor
    ? toAlphaColor(shopThemeColor, 0.6)
    : theme.palette.gray[50];

  const accentColor = shopThemeColor || theme.palette.secondary.main;
  const accentSoftBg = toAlphaColor(accentColor, 0.35);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
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

      {/* 🧾 SHOP SUMMARY CARD (name + description) – FULL ROW WIDTH */}
      {(shop.name || shop.description) && (
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5, md: 4 },
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              border: `1px solid ${theme.palette.gray[200]}`,
              p: 2.5,
              display: "flex",
              gap: 2,
            }}
          >
            {/* Accent bar */}
            <Box
              sx={{
                width: 5,
                borderRadius: 999,
                background: `linear-gradient(180deg, ${accentColor}, ${accentSoftBg})`,
              }}
            />

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              {shop.name && (
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: shop.description ? 0.5 : 0,
                  }}
                >
                  {shop.name}
                </Typography>
              )}

              {shop.description && (
                <Typography
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: theme.palette.text.secondary,
                    maxWidth: "100%",
                  }}
                >
                  {shop.description}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1 }}>
        {/* FILTER / STATS STRIP */}
        <Box
          sx={{
            bgcolor: statsBgColor,
            mt: 2,
            py: 2.2,
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 2.5, sm: 3.5, md: 4 },
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Stats pill */}
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                Showing{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {fromItem}-{toItem}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {totalProducts}
                </Box>{" "}
                {totalProducts === 1 ? "product" : "products"}
              </Typography>
            </Box>

            {/* Controls: subcategory + items per page */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
              }}
            >
              {/* Subcategory pill-select */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 240,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    height: 38,
                    paddingRight: 1.5,
                    paddingLeft: 1.5,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${theme.palette.gray[300]}`,
                    transition: "all 0.18s ease",
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
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 1.25,
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
                        "& .MuiMenuItem-root": {
                          fontSize: 14,
                          minHeight: 36,
                          py: 0.75,
                          px: 1.5,
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      padding: 0,
                    },
                    "& .MuiSelect-icon": {
                      right: 8,
                      color: theme.palette.text.secondary,
                    },
                  }}
                  renderValue={(selected) => {
                    const label = "Subcategory";
                    const valueLabel =
                      selected === "all"
                        ? "All subcategories"
                        : subcategories.find((s) => s.id === selected)?.name ||
                          "Select";

                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </Typography>
                        <Box
                          sx={{
                            width: "1px",
                            height: "16px",
                            bgcolor: theme.palette.gray[300],
                            mx: 0.5,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {valueLabel}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="all">All subcategories</MenuItem>
                  {subcategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Items per page pill-select */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 190,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    height: 38,
                    paddingRight: 1.5,
                    paddingLeft: 1.5,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${theme.palette.gray[300]}`,
                    transition: "all 0.18s ease",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 1.25,
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
                        "& .MuiMenuItem-root": {
                          fontSize: 14,
                          minHeight: 36,
                          py: 0.75,
                          px: 1.5,
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      padding: 0,
                    },
                    "& .MuiSelect-icon": {
                      right: 8,
                      color: theme.palette.text.secondary,
                    },
                  }}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Items per page
                      </Typography>
                      <Box
                        sx={{
                          width: "1px",
                          height: "16px",
                          bgcolor: theme.palette.gray[300],
                          mx: 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {selected}
                      </Typography>
                    </Box>
                  )}
                >
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={32}>32</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* PRODUCTS SECTION */}
        <Box
          sx={{
            py: { xs: theme.spacing(5), md: theme.spacing(6) },
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 2.5, sm: 3.5, md: 4 },
            }}
          >
            {productsLoading ? (
              // ✅ Cards-only skeleton loading (only after first load)
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
                  gap: 2.5,
                }}
              >
                {products.map((product) => (
                  <PublicProductCard
                    key={product._id}
                    product={product}
                    theme={theme}
                    apiBase={API_BASE}
                    accentColor={shopThemeColor}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.gray[200]}`,
          mt: "auto",
          py: 3,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {totalPages > 1 && totalProducts > 0 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: 14,
                  fontWeight: 500,
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                },
              }}
            />
          )}

          <Button
            endIcon={<ExternalIcon />}
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontSize: 12,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              "&:hover": {
                color: theme.palette.primary.main,
                bgcolor: "transparent",
              },
            }}
          >
            Powered by Sahle – Explore more shops
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
