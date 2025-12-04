// src/pages/Shop/PublicShopHeader.jsx
import React from "react";
import { Box, Button, InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function PublicShopHeader({
  shop,
  logoUrl,
  locationText,
  searchQuery,
  setSearchQuery,
  focused,
  setFocused,
  handleSearchClear,
  theme,
  shopThemeColor,
}) {
  const primaryColor = theme.palette.text.primary;
  const secondaryColor = theme.palette.text.secondary;
  // ✅ Use shopThemeColor as the main accent color
  const accentColor = shopThemeColor || theme.palette.secondary.main;
  const lightBg = theme.palette.gray?.[50];
  const borderColor = theme.palette.gray?.[200];

  return (
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
        {/* LEFT: Logo */}
        <Box
          sx={{
            flexShrink: 0,
            minWidth: 140,
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            component="img"
            src={logoUrl}
            alt={shop.name}
            sx={{
              width: "auto",
              height: 60,
              maxWidth: 180,
              objectFit: "contain",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        </Box>

        {/* MIDDLE: Search bar (desktop) */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 500,
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              border: `1.5px solid ${focused ? accentColor : borderColor}`,
              borderRadius: "24px",
              px: 2.5,
              height: 44,
              transition: "all 0.2s ease",
            }}
          >
            <SearchIcon
              sx={{
                color: focused ? accentColor : secondaryColor,
                mr: 1.5,
                fontSize: 20,
                transition: "color 0.2s ease",
              }}
            />
            <InputBase
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              sx={{
                flex: 1,
                fontFamily: theme.typography.fontFamily,
                fontSize: 14,
                color: primaryColor,
                pr: searchQuery ? 4 : 0,
                "& input::placeholder": {
                  color: secondaryColor,
                  opacity: 0.7,
                },
              }}
            />
            {searchQuery && (
              <Box
                onClick={handleSearchClear}
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  color: secondaryColor,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: primaryColor,
                    backgroundColor: lightBg,
                  },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* RIGHT: Location button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {locationText && (
            <Button
              variant="outlined"
              sx={{
                height: 48,
                px: 1.5,
                borderRadius: "12px",
                border: `1.5px solid ${borderColor}`,
                backgroundColor: "#FFFFFF",
                color: primaryColor,
                fontFamily: theme.typography.fontFamily,
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                textTransform: "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                maxWidth: 180,
                minWidth: 120,
                justifyContent: "flex-start",
                "&:hover": {
                  border: `1.5px solid ${theme.palette.gray?.[300]}`,
                  backgroundColor: lightBg,
                },
                "& .MuiButton-startIcon": {
                  margin: 0,
                  marginRight: 0.5,
                },
              }}
              startIcon={
                <LocationOnOutlinedIcon
                  sx={{
                    color: accentColor,
                    fontSize: 18,
                  }}
                />
              }
            >
              <Box
                component="span"
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                  flex: 1,
                  color: theme.palette.gray[700],
                }}
              >
                {locationText}
              </Box>
            </Button>
          )}
        </Box>
      </Box>

      {/* Mobile Search bar */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          px: { xs: 2.5, sm: 3.5 },
          mt: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${focused ? accentColor : borderColor}`,
            borderRadius: "12px",
            px: 2.5,
            height: 48,
            transition: "all 0.2s ease",
          }}
        >
          <SearchIcon
            sx={{
              color: focused ? accentColor : secondaryColor,
              mr: 1.5,
              fontSize: 20,
              transition: "color 0.2s ease",
            }}
          />
          <InputBase
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{
              flex: 1,
              fontFamily: theme.typography.fontFamily,
              fontSize: 14,
              color: primaryColor,
              pr: searchQuery ? 4 : 0,
              "& input::placeholder": {
                color: secondaryColor,
                opacity: 0.7,
              },
            }}
          />
          {searchQuery && (
            <Box
              onClick={handleSearchClear}
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                color: secondaryColor,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: primaryColor,
                  backgroundColor: lightBg,
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
