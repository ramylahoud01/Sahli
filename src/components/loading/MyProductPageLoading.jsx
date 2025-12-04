// src/components/loading/ProductCardSkeleton.jsx
import React from "react";
import { Box, Skeleton } from "@mui/material";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

export default function ProductCardSkeleton({ theme }) {
  return (
    <Box
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
        {/* Product Title Skeleton */}
        <Skeleton
          variant="text"
          width="85%"
          height={18}
          sx={{
            animation: `${pulse} 1.4s ease-in-out infinite`,
          }}
        />

        {/* Category Skeleton */}
        <Skeleton
          variant="text"
          width="55%"
          height={14}
          sx={{
            animation: `${pulse} 1.4s ease-in-out infinite`,
          }}
        />
      </Box>
    </Box>
  );
}
