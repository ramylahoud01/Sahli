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
            borderRadius: 1.25,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.gray[200]}`,
          }}
        >
          {/* Image placeholder */}
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              paddingTop: "56.25%", // 16:9
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
            <Skeleton variant="text" width="80%" height={18} />
            <Skeleton variant="text" width="50%" height={14} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
