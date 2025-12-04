// src/components/UI/AppButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AppButton({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  sx = {},
  ...rest
}) {
  const theme = useTheme();

  const variants = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark || "#000000",
      },
      "&:disabled": {
        backgroundColor: theme.palette.gray[300],
        color: theme.palette.gray[500],
      },
    },
    outline: {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: theme.palette.gray[50],
        borderColor: theme.palette.primary.dark || "#000000",
      },
      "&:disabled": {
        borderColor: theme.palette.gray[300],
        color: theme.palette.gray[400],
      },
    },
  };

  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        borderRadius: "22px",
        fontSize: { xs: 14, sm: 15 },
        fontWeight: 600,
        letterSpacing: 0.4,
        py: 0,
        px: 2,
        textTransform: "none",
        fontFamily: "Poppins, sans-serif",
        boxShadow: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "none",
        },
        ...variants[variant],
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
