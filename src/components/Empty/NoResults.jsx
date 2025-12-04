// src/components/UI/NoResults.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppButton from "../UI/AppButton";

export default function NoResults({
  title = "No results found",
  subtitle = "Try adjusting your filters or search for something else.",
  actionLabel,
  onActionPress,
  shopThemeColor,
}) {
  const theme = useTheme();
  const normalizeColor = (color) => {
    if (!color) return theme.palette.secondary.main;
    return color.trim();
  };

  const secondary = shopThemeColor
    ? normalizeColor(shopThemeColor)
    : theme.palette.secondary.main;

  const gray100 = theme.palette.gray[100];
  const outline = theme.palette.gray[300];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 260,
        px: 3,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG Illustration */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="230"
          height="230"
          viewBox="0 0 230 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ maxWidth: "100%" }}
        >
          {/* Background blob */}
          <path
            d="M26 112C22 68 52 34 96 30L162 22C188 20 214 40 218 66C224 108 188 150 150 158L86 166C50 172 28 146 26 120C26 114 26 112 26 112Z"
            fill={gray100}
          />

          {/* Tilted card */}
          <g transform="rotate(-4 115 105)">
            <rect
              x="62"
              y="66"
              width="118"
              height="90"
              rx="22"
              fill="#FFFFFF"
            />
            <rect
              x="62.5"
              y="66.5"
              width="117"
              height="89"
              rx="21.5"
              stroke={outline}
              strokeWidth="0.9"
              opacity="0.7"
            />

            <rect x="74" y="80" width="86" height="14" rx="7" fill={gray100} />
            <rect
              x="80"
              y="84"
              width="50"
              height="4.5"
              rx="2"
              fill={outline}
              opacity="0.75"
            />

            <rect
              x="74"
              y="104"
              width="34"
              height="11"
              rx="6"
              fill={secondary}
              opacity="0.14"
            />
            <rect
              x="114"
              y="104"
              width="28"
              height="11"
              rx="6"
              fill={secondary}
              opacity="0.12"
            />
            <rect
              x="148"
              y="104"
              width="24"
              height="11"
              rx="6"
              fill={secondary}
              opacity="0.1"
            />

            <rect
              x="74"
              y="128"
              width="70"
              height="5"
              rx="2.5"
              fill={outline}
              opacity="0.7"
            />
            <rect
              x="74"
              y="138"
              width="50"
              height="5"
              rx="2.5"
              fill={outline}
              opacity="0.55"
            />
          </g>

          {/* Magnifying glass */}
          <g
            transform="translate(155 158)"
            stroke={secondary}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="-10" cy="-10" r="12" fill="#FFFFFF" />
            <path d="M0 0 L18 18" />
            <path d="M-16 -16 L -4 -4" />
            <path d="M-4 -16 L -16 -4" />
          </g>

          {/* Decorative dots */}
          <circle cx="56" cy="72" r="2.4" fill={secondary} opacity="0.6" />
          <circle cx="168" cy="84" r="2.2" fill={secondary} opacity="0.45" />
          <circle cx="174" cy="156" r="2.2" fill={secondary} opacity="0.55" />
        </svg>
      </Box>

      {/* Text Block */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 260,
          mt: -1.25,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: { xs: 16, sm: 17 },
            fontWeight: 500,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              textAlign: "center",
              mt: 0.5,
              fontSize: { xs: 14, sm: 15 },
              lineHeight: 1.5,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Action Button */}
        {actionLabel && onActionPress && (
          <AppButton
            onClick={onActionPress}
            sx={{
              mt: 2,
              py: 1,
              px: 3,
              height: 40,
              fontSize: 14,
            }}
          >
            {actionLabel}
          </AppButton>
        )}
      </Box>
    </Box>
  );
}
