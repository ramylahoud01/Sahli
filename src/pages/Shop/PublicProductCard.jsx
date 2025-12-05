// src/components/Shop/PublicProductCard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function PublicProductCard({ product, theme, accentColor }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const images = React.useMemo(() => {
    if (!product.images || !Array.isArray(product.images)) return [];
    return product.images.map((img) => {
      const imgUrl = typeof img === "string" ? img : img?.url || img;
      if (!imgUrl) return "";
      return imgUrl;
    });
  }, [product.images]);

  const price = product.price || 0;
  const category =
    typeof product.category === "object"
      ? product.category?.name || "Uncategorized"
      : product.category || "Uncategorized";

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        cursor: "default",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.grey[200]}`,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
          borderColor: theme.palette.grey[300],
        },
      }}
    >
      {/* Image + badges - BIGGER IMAGE */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "75%", // Changed from 56.25% (16:9) to 75% (4:3) for bigger image
          backgroundColor: theme.palette.grey[50],
        }}
      >
        {images.length > 0 ? (
          <Box
            component="img"
            src={images[currentImageIndex]}
            alt={product.title}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain", // Changed from cover to contain to show full image
              transition: "transform 0.3s ease",
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
            <Typography sx={{ fontSize: 40 }}>📦</Typography>
          </Box>
        )}

        {/* Navigation arrows - Refined styling */}
        {images.length > 1 && (
          <>
            <Box
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)",
                transition: "all 0.2s ease",
                opacity: 0.9,
                "&:hover": {
                  opacity: 1,
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </Typography>
            </Box>

            <Box
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)",
                transition: "all 0.2s ease",
                opacity: 0.9,
                "&:hover": {
                  opacity: 1,
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </Typography>
            </Box>
          </>
        )}

        {/* Image counter - Enhanced styling */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.2)",
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
              {currentImageIndex + 1} / {images.length}
            </Typography>
          </Box>
        )}

        {/* Price badge - Enhanced styling */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            px: 1.5,
            py: 0.6,
            borderRadius: "12px",
            backgroundColor: accentColor || theme.palette.primary.main,
            boxShadow: `0 2px 12px ${alpha(
              accentColor || theme.palette.primary.main,
              0.4
            )}`,
          }}
        >
          <Typography
            sx={{
              color: theme.palette.common.white,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ${price.toFixed ? price.toFixed(2) : price}
          </Typography>
        </Box>
      </Box>

      {/* Content - Reduced padding to balance larger image */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14.5,
            lineHeight: 1.4,
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.8em", // Ensures consistent height
          }}
        >
          {product.title}
        </Typography>

        {category && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              alignSelf: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              🏷️ {category}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
