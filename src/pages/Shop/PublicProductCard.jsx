// src/components/Shop/PublicProductCard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function PublicProductCard({
  product,
  theme,
  apiBase,
  accentColor,
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const images = React.useMemo(() => {
    if (!product.images || !Array.isArray(product.images)) return [];
    return product.images.map((img) => {
      const imgUrl = typeof img === "string" ? img : img?.url || img;
      if (!imgUrl) return "";
      return imgUrl;
    });
  }, [product.images, apiBase]);

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
        borderRadius: 1.5,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.gray[200]}`,
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 30px rgba(15,23,42,0.08)",
        },
      }}
    >
      {/* Image + badges */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          backgroundColor: theme.palette.gray[50],
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
            <Typography sx={{ fontSize: 32 }}>📦</Typography>
          </Box>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Box
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 1),
                },
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 18,
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
                right: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 1),
                },
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 18,
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

        {/* Image counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              px: 1,
              py: 0.4,
              borderRadius: 999,
              backgroundColor: "rgba(15,23,42,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </Typography>
          </Box>
        )}

        {/* Price badge */}
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            px: 1.1,
            py: 0.45,
            borderRadius: 999,
            backgroundColor: alpha(accentColor, 0.7),
          }}
        >
          <Typography
            sx={{
              color: theme.palette.common.white,
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            ${price.toFixed ? price.toFixed(2) : price}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 1.6,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.35,
            color: theme.palette.primary.main,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.title}
        </Typography>

        {category && (
          <Typography
            sx={{
              fontSize: 11.5,
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            🏷️ {category}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
