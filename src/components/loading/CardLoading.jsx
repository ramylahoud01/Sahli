// src/components/loading/CardLoading.jsx
import React from "react";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function CardLoading({ items = 8 }) {
  const theme = useTheme();
  const count = Math.min(items, 8);

  return (
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
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: "18px",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.grey[200]}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          {/* Image placeholder – match new card ratio */}
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              paddingTop: "68%", // match PublicProductCard image height
              backgroundColor: theme.palette.grey[100],
            }}
          />

          {/* Content skeleton – match new padding + height */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              minHeight: 95,
            }}
          >
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="55%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
