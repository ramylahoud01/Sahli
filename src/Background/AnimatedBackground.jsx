// src/components/Layout/AnimatedBackground.jsx
import React from "react";
import { Box, keyframes } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Slow, smooth shift for gradient blobs
const drift = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  25% { transform: translate(40px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(1.02); }
  75% { transform: translate(30px, 10px) scale(1.07); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

// Gentle parallax for the mesh layer
const parallax = keyframes`
  0% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(-1.5%, -1%, 0); }
  100% { transform: translate3d(0,0,0); }
`;

const AnimatedBackground = ({ accentColor }) => {
  const theme = useTheme();

  // Shop color or fallback: Sahli secondary (mint green)
  const baseAccent = accentColor || theme.palette.secondary.main;

  // Extra theme colors for blending
  const secondary = theme.palette.secondary.main;
  const tertiary = theme.palette.tertiary?.main || "#6040FF";

  // Build meshes
  const meshPrimary = alpha(baseAccent, 0.35);
  const meshSecondary = alpha(secondary, 0.32);
  const meshAccent = alpha(tertiary, 0.25);

  const orbLeft = alpha(baseAccent, 0.28);
  const orbRight = alpha(secondary, 0.28);

  const dotColor = alpha(baseAccent, 0.38);

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
      {/* Mesh gradient layer (MAIN BACKGROUND) */}
      <Box
        sx={{
          position: "absolute",
          inset: "-20%",
          filter: "blur(90px)",
          opacity: 0.35,
          background: `
            radial-gradient(35% 40% at 20% 30%, ${meshPrimary} 0%, transparent 60%),
            radial-gradient(40% 45% at 80% 70%, ${meshSecondary} 0%, transparent 60%),
            radial-gradient(30% 35% at 60% 20%, ${meshAccent} 0%, transparent 60%)
          `,
          animation: `${parallax} 26s ease-in-out infinite`,
        }}
      />

      {/* Dot grid overlay */}
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

      {/* Floating orb left */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "10%", md: "12%" },
          left: { xs: "-10%", md: "-6%" },
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${orbLeft}, transparent 60%)`,
          filter: "blur(30px)",
          animation: `${drift} 18s ease-in-out infinite`,
        }}
      />

      {/* Floating orb right */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-6%", md: "-10%" },
          right: { xs: "-12%", md: "-6%" },
          width: { xs: 260, md: 380 },
          height: { xs: 260, md: 380 },
          borderRadius: "50%",
          background: `radial-gradient(circle at 70% 70%, ${orbRight}, transparent 60%)`,
          filter: "blur(34px)",
          animation: `${drift} 22s ease-in-out -6s infinite`,
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
