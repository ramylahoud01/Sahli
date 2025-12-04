// src/pages/Shop/MyShopsPageLoading.jsx
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

export default function MyShopsPageLoading() {
  const theme = useTheme();

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
        {/* Header - Title */}
        <Box sx={{ mb: 2.5, textAlign: "center" }}>
          <Skeleton
            variant="text"
            width="60%"
            height={60}
            sx={{
              mx: "auto",
              mb: 1,
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={24}
            sx={{
              mx: "auto",
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>

        {/* Search Bar + Create Button Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            mb: 3,
          }}
        >
          {/* Search Bar Skeleton */}
          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
            <Skeleton
              variant="rounded"
              height={48}
              sx={{
                borderRadius: 1.25,
                animation: `${pulse} 1.4s ease-in-out infinite`,
              }}
            />
          </Box>

          {/* Create Button Skeleton */}
          <Skeleton
            variant="rounded"
            width={{ xs: "100%", sm: 160 }}
            height={48}
            sx={{
              borderRadius: 1.5,
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>

        {/* Stats Line Skeleton */}
        <Box sx={{ mb: 2.5 }}>
          <Skeleton
            variant="text"
            width={180}
            height={16}
            sx={{
              animation: `${pulse} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>

        {/* Shop Grid Skeleton (2 columns, 6 cards) */}
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
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                borderRadius: 1.25,
                overflow: "hidden",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.gray[200]}`,
              }}
            >
              {/* Image Placeholder (16:9 aspect ratio) */}
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />

              {/* Content Section */}
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                }}
              >
                {/* Shop Name Skeleton */}
                <Skeleton
                  variant="text"
                  width="80%"
                  height={18}
                  sx={{
                    animation: `${pulse} 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />

                {/* Location Skeleton */}
                <Skeleton
                  variant="text"
                  width="60%"
                  height={14}
                  sx={{
                    animation: `${pulse} 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
