// src/components/Layout/AnimatedBackground.jsx
import React from "react";
import { Box, keyframes } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Smooth blob drift
const drift = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  25% { transform: translate(40px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(1.02); }
  75% { transform: translate(30px, 10px) scale(1.07); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

// Soft parallax movement for the mesh layer
const parallax = keyframes`
  0% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(-1.5%, -1%, 0); }
  100% { transform: translate3d(0,0,0); }
`;

export default function AnimatedBackground({ primaryColor, secondaryColor }) {
  const theme = useTheme();
  // Use provided props OR theme fallback
  const dark = primaryColor || theme.palette.primary.main;
  const mint = secondaryColor || theme.palette.secondary.main;
  // Build soft blended mesh layers
  const meshMint = alpha(mint, 0.32);
  const meshDark = alpha(dark, 0.18);
  const meshSoft = alpha("#c7d9d0", 0.25); // soft mint highlight

  // Orbs
  const orbLeft = alpha(mint, 0.28);
  const orbRight = alpha("#d9f2e6", 0.25); // bright glow

  const dotColor = alpha(mint, 0.35);

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: theme.palette.background.default,
      }}
    >
      {/* Mesh gradient layer */}
      <Box
        sx={{
          position: "absolute",
          inset: "-20%",
          filter: "blur(90px)",
          opacity: 0.35,
          background: `
            radial-gradient(35% 40% at 20% 30%, ${meshMint} 0%, transparent 60%),
            radial-gradient(40% 45% at 80% 70%, ${meshDark} 0%, transparent 60%),
            radial-gradient(30% 35% at 60% 20%, ${meshSoft} 0%, transparent 60%)
          `,
          animation: `${parallax} 26s ease-in-out infinite`,
        }}
      />

      {/* Dot grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          backgroundPosition: "-1px -1px",
        }}
      />

      {/* Left orb */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "12%", md: "15%" },
          left: { xs: "-10%", md: "-6%" },
          width: { xs: 260, md: 340 },
          height: { xs: 260, md: 340 },
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${orbLeft}, transparent 60%)`,
          filter: "blur(30px)",
          animation: `${drift} 18s ease-in-out infinite`,
        }}
      />

      {/* Right orb */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-8%", md: "-12%" },
          right: { xs: "-10%", md: "-6%" },
          width: { xs: 300, md: 420 },
          height: { xs: 300, md: 420 },
          borderRadius: "50%",
          background: `radial-gradient(circle at 70% 70%, ${orbRight}, transparent 60%)`,
          filter: "blur(34px)",
          animation: `${drift} 22s ease-in-out -6s infinite`,
        }}
      />
    </Box>
  );
}
