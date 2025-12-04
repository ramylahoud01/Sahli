// src/pages/Shop/MyShopsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  InputBase,
  Pagination,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import AppButton from "../../components/UI/AppButton";
import { getMyShops } from "../../api/shops";
import { getAccessToken } from "../../api/auth";
import NoResults from "../../components/Empty/NoResults";
import ProductCardSkeleton from "../../components/loading/MyProductPageLoading";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function MyShopsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [shops, setShops] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(16);
  const [totalItems, setTotalItems] = React.useState(0);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const hasSearch = debouncedSearchQuery.trim().length > 0;

  React.useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);

        // Build query params
        const params = {
          page,
          limit: itemsPerPage,
        };

        // Add search param if exists
        if (debouncedSearchQuery.trim()) {
          params.search = debouncedSearchQuery.trim();
        }

        const res = await getMyShops(params);

        // Handle different response structures
        let shopItems = [];
        let total = 0;

        if (Array.isArray(res)) {
          shopItems = res;
          total = res.length;
        } else if (res.items && Array.isArray(res.items)) {
          shopItems = res.items;
          total = res.total || res.items.length;
        } else if (res.data && Array.isArray(res.data)) {
          shopItems = res.data;
          total = res.total || res.data.length;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          shopItems = res.data.items;
          total = res.data.total || res.data.items.length;
        }

        setShops(shopItems);
        setTotalItems(total);
      } catch (err) {
        setError(err?.message || "Failed to load shops");
        setShops([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, page, itemsPerPage, debouncedSearchQuery]);

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setPage(1);
    }
  }, [debouncedSearchQuery]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const totalProducts = shops.reduce(
    (sum, s) => sum + (s.productCount || 0),
    0
  );

  const handleShopPress = (shop) => {
    navigate(`/products?shopId=${shop._id}`);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setLoading(true); // Show loading state when clearing search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2.5, sm: 3.5, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 3,
          }}
        >
          <Box sx={{ mb: 2.5, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: theme.palette.text.primary,
                mb: 0.75,
                opacity: 0.85,
              }}
            >
              Your{" "}
              <Box
                component="span"
                sx={{ color: theme.palette.secondary.main }}
              >
                Shop
              </Box>{" "}
              Collection
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                color: theme.palette.gray[500],
                opacity: 0.9,
                fontStyle: "italic",
              }}
            >
              Manage and track all your shops in one place
            </Typography>
          </Box>

          {/* Search Bar + Create Button Row */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Search Bar */}
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", sm: "auto" },
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: theme.palette.gray[50],
                  border: `1.5px solid ${
                    focused
                      ? theme.palette.secondary.main
                      : theme.palette.gray[200]
                  }`,
                  borderRadius: 1.25,
                  px: 2,
                  height: 48,
                  transition: "all 0.2s ease",
                }}
              >
                <SearchIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    mr: 1,
                    fontSize: 22,
                  }}
                />
                <InputBase
                  placeholder="Search shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  sx={{
                    flex: 1,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: 15.5,
                    letterSpacing: 0.1,
                    color: theme.palette.text.primary,
                    "& input::placeholder": {
                      color: theme.palette.text.secondary,
                      opacity: 0.8,
                    },
                  }}
                />
                {searchQuery && (
                  <Box
                    onClick={handleSearchClear}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>×</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Create Shop Button */}
            <AppButton
              onClick={() => navigate("/shops/new")}
              sx={{
                py: 1.25,
                px: 3,
                fontSize: 14,
                fontWeight: 500,
                height: 48,
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Create Shop
            </AppButton>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              borderRadius: 1.5,
              backgroundColor: "#fee",
              border: "1px solid #fcc",
            }}
          >
            <Typography
              sx={{
                color: "#c33",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Stats and Items Per Page */}
        {!loading && totalItems > 0 && (
          <Box
            sx={{
              mb: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              {hasSearch && (
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  Search results:{" "}
                </Box>
              )}
              Showing {(page - 1) * itemsPerPage + 1} -{" "}
              {Math.min(page * itemsPerPage, totalItems)} of {totalItems}{" "}
              {totalItems === 1 ? "shop" : "shops"} • {totalProducts}{" "}
              {totalProducts === 1 ? "product" : "products"}
            </Typography>

            {/* Items Per Page Selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                Items per page:
              </Typography>
              <FormControl size="small">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  sx={{
                    fontSize: 14,
                    height: 36,
                    backgroundColor: theme.palette.background.paper,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.gray[200],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.gray[300],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.secondary.main,
                    },
                  }}
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
        )}

        {/* Loading State - Show Skeleton Cards */}
        {loading && (
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
              mb: 4,
            }}
          >
            {[...Array(itemsPerPage)].map((_, index) => (
              <ProductCardSkeleton key={index} theme={theme} />
            ))}
          </Box>
        )}

        {/* No Shops - Empty State (base, no search) */}
        {!loading && totalItems === 0 && !hasSearch && (
          <NoResults
            title="No shops yet"
            subtitle="Create your first shop to start managing products and grow your business."
            actionLabel="Create Shop"
            onActionPress={() => navigate("/shops/new")}
          />
        )}

        {/* No Search Results */}
        {!loading && totalItems === 0 && hasSearch && (
          <NoResults
            title="No shops found"
            subtitle={`No results for "${debouncedSearchQuery}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onActionPress={handleSearchClear}
          />
        )}

        {/* Shop Grid */}
        {!loading && shops.length > 0 && (
          <>
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
                mb: 4,
              }}
            >
              {shops.map((shop) => (
                <ShopCard
                  key={shop._id}
                  shop={shop}
                  onClick={() => handleShopPress(shop)}
                  theme={theme}
                />
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
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
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

// Shop Card Component
function ShopCard({ shop, onClick, theme }) {
  const logoUri = shop.image?.url ? shop.image.url : null;

  const location = shop.city || shop.address || "Unknown";
  const productCount = shop.productCount || 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: 1.25,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.gray[200]}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      {/* Image + Badge */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          backgroundColor: theme.palette.gray[50],
        }}
      >
        {logoUri ? (
          <Box
            component="img"
            src={logoUri}
            alt={shop.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <Typography sx={{ fontSize: 32 }}>🏪</Typography>
          </Box>
        )}

        {/* Product Count Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 0.75,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            📦 {productCount} prod{productCount === 1 ? "" : "s"}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        {/* Shop Name */}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.3,
            color: theme.palette.primary.main,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {shop.name}
        </Typography>

        {/* Location */}
        {location && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              📍 {location}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
