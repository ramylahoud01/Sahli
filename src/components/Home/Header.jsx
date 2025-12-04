// src/components/layout/Header.jsx
import React, { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useNavigate } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import { getAccessToken, logout as apiLogout } from "../../api/auth";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const isAuthenticated = !!getAccessToken();

  const navigationItems = useMemo(() => {
    const base = [{ id: "shops", label: "My Shops", path: "/shops" }];

    if (isAuthenticated) {
      base.push({ id: "logout", label: "Logout" });
    } else {
      base.push({ id: "login", label: "Login", path: "/login" });
    }

    return base;
  }, [isAuthenticated]);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const handleLogout = () => {
    apiLogout();
    navigate("/login");
  };

  const primaryColor = theme.palette.text.primary;
  const accentColor = theme.palette.secondary.main;
  const darkAccent = theme.palette.primary.main;
  const lightBg = theme.palette.gray?.[50];
  const borderColor = theme.palette.gray?.[100];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "67px !important",
          px: { xs: 2.5, sm: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/logo.png"
            alt="Sahli Logo"
            sx={{
              height: 60,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
            onClick={() => navigate("/")}
          />

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {navigationItems.map((item) => {
              const isLogin = item.id === "login";
              const isLogout = item.id === "logout";

              // Logout button (no NavLink)
              if (isLogout) {
                return (
                  <Button
                    key={item.id}
                    onClick={handleLogout}
                    sx={{
                      ml: 1.5,
                      textTransform: "none",
                      fontSize: 15.5,
                      borderRadius: "10px",
                      py: 0.5,
                      border: `1px solid ${alpha(accentColor, 0.6)}`,
                      color: accentColor,
                      backgroundColor: "#FFFFFF",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: alpha(accentColor, 0.4),
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              }

              // Normal nav buttons (My Shops, Login)
              return (
                <Button
                  key={item.id}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    position: "relative",
                    textTransform: "none",
                    fontSize: 15.5,
                    mx: 0.5,
                    borderRadius: "10px",
                    color: primaryColor,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    ...(isLogin
                      ? {
                          ml: 1.5,
                          py: 0.5,
                          border: `1px solid ${alpha(accentColor, 0.6)}`,
                          color: accentColor,
                          backgroundColor: "#FFFFFF",
                          "&:hover": {
                            backgroundColor: alpha(accentColor, 0.4),
                            color: "#FFFFFF",
                          },
                          "&.active": {},
                        }
                      : {
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: lightBg,
                            color: darkAccent,
                          },
                          "&.active": {
                            color: accentColor,
                          },
                        }),
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{
              display: { xs: "flex", md: "none" },
              color: primaryColor,
              bgcolor: lightBg,
              borderRadius: "10px",
              p: 1.2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: accentColor,
                color: "#FFFFFF",
                transform: "scale(1.05)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 290,
            borderRadius: { xs: "16px 0 0 16px" },
          },
        }}
      >
        <Box sx={{ pt: 1.5, pb: 2 }}>
          {/* Drawer header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
              px: 2.5,
              pb: 1.5,
            }}
          >
            <IconButton
              onClick={toggleDrawer}
              size="small"
              sx={{
                bgcolor: lightBg,
                "&:hover": { bgcolor: borderColor },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Navigation list */}
          <List sx={{ mt: 1 }}>
            {navigationItems.map((item) => {
              const isLogout = item.id === "logout";

              if (isLogout) {
                return (
                  <ListItemButton
                    key={item.id}
                    onClick={() => {
                      handleLogout();
                      toggleDrawer();
                    }}
                    sx={{
                      px: 3,
                      py: 1.4,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: 15.5,
                          fontWeight: 500,
                          color: primaryColor,
                        },
                      }}
                    />
                  </ListItemButton>
                );
              }

              return (
                <ListItemButton
                  key={item.id}
                  component={NavLink}
                  to={item.path}
                  onClick={toggleDrawer}
                  sx={{
                    px: 3,
                    py: 1.4,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&.active": {
                      backgroundColor: "#F0FDF4",
                      borderLeft: `4px solid ${accentColor}`,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 15.5,
                        fontWeight: 500,
                        color: primaryColor,
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
