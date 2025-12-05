// src/pages/Shop/PublicShopPageLoading.jsx
import React from "react";
import { Box, Skeleton, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import CardLoading from "../../components/loading/CardLoading";

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

      {/* HERO BANNER CARD SKELETON */}
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, md: 3 }, px: { xs: 2, sm: 2.5, md: 3 } }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            boxShadow: "0 3px 14px rgba(15, 23, 42, 0.05)",
            border: `1px solid ${theme.palette.grey[300]}`,
            p: { xs: 2.5, sm: 3, md: 3.5 },
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "4px",
              bgcolor: theme.palette.grey[300],
              borderRadius: "16px 0 0 16px",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Title skeleton */}
            <Skeleton
              variant="text"
              width="40%"
              height={28}
              sx={{
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />
            {/* Description skeleton - 2 lines */}
            <Skeleton
              variant="text"
              width="85%"
              height={16}
              sx={{
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.1s",
              }}
            />
            <Skeleton
              variant="text"
              width="70%"
              height={16}
              sx={{
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.2s",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* STATS & FILTER BAR SKELETON */}
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2.5, md: 4 }, px: { xs: 2.5, sm: 3, md: 4 } }}
      >
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "18px",
            p: { xs: 2.5, sm: 3 },
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
            border: `1px solid ${theme.palette.grey[200]}`,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2.5,
            alignItems: { xs: "stretch", lg: "center" },
            justifyContent: "space-between",
          }}
        >
          {/* Left: Stats skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Skeleton
                variant="text"
                width={100}
                height={14}
                sx={{
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                }}
              />
              <Skeleton
                variant="text"
                width={140}
                height={18}
                sx={{
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                  animationDelay: "0.1s",
                }}
              />
            </Box>
          </Box>

          {/* Right: Filter skeletons */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={220}
              height={44}
              sx={{
                borderRadius: "12px",
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.1s",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={140}
              height={44}
              sx={{
                borderRadius: "12px",
                animation: `${pulse} 1.4s ease-in-out infinite`,
                animationDelay: "0.2s",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* PRODUCTS SECTION LOADING */}
      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: { xs: 5, md: 6 },
          px: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        {/* Use the same CardLoading component as the products grid */}
        <CardLoading items={16} />
      </Container>
    </Box>
  );
}
