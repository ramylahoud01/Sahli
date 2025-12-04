// src/pages/Shop/PublicShopPageLoading.jsx
import React from "react";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

export default function PublicShopPageLoading() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER LOADING */}
      <Box
        sx={{
          py: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5, md: 4 },
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 3 },
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Logo skeleton */}
          <Box
            sx={{
              width: 180,
              height: 60,
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />
          </Box>

          {/* Search bar skeleton (desktop) */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 500,
              display: { xs: "none", md: "block" },
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={44}
              sx={{
                borderRadius: "24px",
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />
          </Box>

          {/* Location button skeleton */}
          <Box sx={{ flexShrink: 0 }}>
            <Skeleton
              variant="rectangular"
              width={140}
              height={48}
              sx={{
                borderRadius: "12px",
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />
          </Box>
        </Box>

        {/* Mobile Search bar skeleton */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            px: { xs: 2.5, sm: 3.5 },
            mt: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={48}
            sx={{
              borderRadius: "12px",
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>
      </Box>

      {/* SHOP DESCRIPTION CARD SKELETON */}
      <Box
        sx={{
          mt: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5, md: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              border: `1px solid ${theme.palette.gray?.[200] || "#e5e7eb"}`,
              p: 2.5,
              display: "flex",
              gap: 2,
            }}
          >
            {/* Accent bar skeleton */}
            <Skeleton
              variant="rectangular"
              width={5}
              height={60}
              sx={{
                borderRadius: 999,
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />

            {/* Text content skeleton */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {/* Title skeleton */}
              <Skeleton
                variant="text"
                width="40%"
                height={24}
                sx={{
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                }}
              />
              {/* Description skeleton - 2 lines */}
              <Skeleton
                variant="text"
                width="90%"
                height={16}
                sx={{
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                  animationDelay: "0.1s",
                }}
              />
              <Skeleton
                variant="text"
                width="75%"
                height={16}
                sx={{
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                  animationDelay: "0.2s",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FILTER STRIP LOADING */}
      <Box
        sx={{
          bgcolor: theme.palette.gray?.[50] || "#f9fafb",
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
          {/* Stats pill skeleton */}
          <Skeleton
            variant="rectangular"
            width={200}
            height={36}
            sx={{
              borderRadius: 999,
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />

          {/* Filter pills skeleton */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={240}
              height={38}
              sx={{
                borderRadius: 999,
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.1s",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={190}
              height={38}
              sx={{
                borderRadius: 999,
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.2s",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* PRODUCTS SECTION LOADING */}
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
          {/* Product cards grid skeleton */}
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
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: 1.25,
                  overflow: "hidden",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.gray?.[200] || "#e5e7eb"}`,
                }}
              >
                {/* Image placeholder */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  sx={{
                    paddingTop: "56.25%", // 16:9
                    animation: `${pulse} 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.06}s`,
                  }}
                />

                {/* Content skeleton */}
                <Box
                  sx={{
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.75,
                  }}
                >
                  {/* Title */}
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={18}
                    sx={{
                      animation: `${pulse} 1.4s ease-in-out infinite`,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  />
                  {/* Category / meta */}
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={14}
                    sx={{
                      animation: `${pulse} 1.4s ease-in-out infinite`,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
