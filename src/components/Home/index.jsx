// src/pages/Home.jsx (or wherever your Home is)
import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import AnimatedBackground from "../../Background/AnimatedBackground";

// ✅ adjust the path if needed

const FULL_TEXT = "Welcome to Sahli";

const steps = [
  {
    icon: LoginOutlinedIcon,
    label: "Login or sign up",
    description: "Create your account in seconds",
    number: "01",
  },
  {
    icon: StorefrontOutlinedIcon,
    label: "Create your shop",
    description: "Set up your online storefront",
    number: "02",
  },
  {
    icon: InventoryOutlinedIcon,
    label: "Add your products",
    description: "Upload items with pricing",
    number: "03",
  },
  {
    icon: ShareOutlinedIcon,
    label: "Share your online link",
    description: "Start selling immediately",
    number: "04",
  },
];

const comingSoonFeatures = [
  {
    icon: PhoneIphoneOutlinedIcon,
    title: "Mobile Application",
    description:
      "Manage your shop on the go with our native mobile app for iOS and Android",
  },
  {
    icon: PaletteOutlinedIcon,
    title: "Customize Your Shop",
    description:
      "Full theme customization with colors, fonts, and layout options to match your brand",
  },
];

const StepCard = ({ icon: Icon, label, description, number }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: "20px",
        p: { xs: 3, sm: 3.5 },
        minWidth: { xs: "100%", sm: "100%", md: "100%", lg: 260 },
        maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: 280 },
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${theme.palette.grey[200]}`,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          bgcolor: theme.palette.secondary.main,
          color: "white",
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: { xs: 12, sm: 13 },
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {number}
      </Box>

      <Box
        sx={{
          width: { xs: 64, sm: 72 },
          height: { xs: 64, sm: 72 },
          borderRadius: "50%",
          bgcolor: "white",
          border: `2px solid ${theme.palette.primary.main}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Icon
          sx={{
            fontSize: { xs: 32, sm: 36 },
            color: theme.palette.primary.main,
          }}
        />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: 15, sm: 16 },
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 0.8,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 13, sm: 13.5 },
          color: theme.palette.text.secondary,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

const ComingSoonCard = ({ icon: Icon, title, description }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "white",
        border: `2px solid ${theme.palette.grey[200]}`,
        borderRadius: "20px",
        p: { xs: 3.5, sm: 4 },
        flex: 1,
        minWidth: { xs: "100%", sm: "calc(50% - 12px)", md: 280 },
        maxWidth: { xs: "100%", md: 450 },
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 32px ${theme.palette.grey[200]}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "150px",
          height: "150px",
          background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Chip
        label="COMING SOON"
        size="small"
        sx={{
          bgcolor: theme.palette.secondary.main,
          color: "white",
          fontWeight: 700,
          fontSize: { xs: 9, sm: 10 },
          letterSpacing: 1,
          mb: 2.5,
          height: { xs: 22, sm: 24 },
        }}
      />

      <Box
        sx={{
          width: { xs: 72, sm: 80 },
          height: { xs: 72, sm: 80 },
          borderRadius: "20px",
          bgcolor: `${theme.palette.primary.main}10`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
        }}
      >
        <Icon
          sx={{
            fontSize: { xs: 36, sm: 40 },
            color: theme.palette.primary.main,
          }}
        />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20 },
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 13.5, sm: 14.5 },
          color: theme.palette.text.secondary,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

const SVGConnector = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        alignItems: "center",
        mx: -0.5,
      }}
    >
      <svg width="70" height="50" viewBox="0 0 70 50">
        <path
          d="M 5 25 Q 35 8, 65 25"
          stroke={theme.palette.grey[300]}
          strokeWidth="2.5"
          strokeDasharray="5 5"
          fill="none"
        />
        <circle cx="65" cy="25" r="5" fill={theme.palette.secondary.main} />
      </svg>
    </Box>
  );
};

const MobileConnector = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: { xs: "flex", lg: "none" },
        justifyContent: "center",
        my: 2,
      }}
    >
      <Box
        sx={{
          width: 2.5,
          height: 40,
          bgcolor: theme.palette.grey[300],
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: theme.palette.secondary.main,
          },
        }}
      />
    </Box>
  );
};

export default function Home() {
  const theme = useTheme();
  const [text, setText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let timeout;

    const typeSpeed = isDeleting
      ? 40 + Math.random() * 40
      : 80 + Math.random() * 60;

    if (!isDeleting && index < FULL_TEXT.length) {
      timeout = setTimeout(() => {
        setText((prev) => prev + FULL_TEXT[index]);
        setIndex((i) => i + 1);
      }, typeSpeed);
    } else if (!isDeleting && index === FULL_TEXT.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && index > 0) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
        setIndex((i) => i - 1);
      }, typeSpeed);
    } else if (isDeleting && index === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  return (
    <>
      {/* 🔮 Background sits behind everything */}
      <AnimatedBackground
        primaryColor={theme.palette.primary.main}
        secondaryColor={theme.palette.secondary.main}
      />

      {/* Foreground content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "80vh",
          px: { xs: 2.5, sm: 3, md: 4, lg: 6 },
          py: { xs: 5, sm: 6, md: 8 },
          maxWidth: 1300,
          mx: "auto",
        }}
      >
        {/* PART 1 – HERO */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 8, sm: 10, md: 12 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              background: `linear-gradient(
                90deg,
                ${theme.palette.secondary.main},
                ${theme.palette.primary.main}
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
                lg: "3.5rem",
              },
              letterSpacing: "0.4px",
            }}
          >
            {text}
            <Box
              component="span"
              sx={{
                width: { xs: "4px", sm: "5px" },
                height: "1.2em",
                ml: 0.5,
                bgcolor: theme.palette.secondary.main,
                animation: "blink 0.9s step-end infinite",
                "@keyframes blink": {
                  "0%": { opacity: 0 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0 },
                },
              }}
            />
          </Typography>

          <Typography
            sx={{
              mt: { xs: 2, sm: 2.5 },
              maxWidth: { xs: "100%", sm: 580, md: 680 },
              mx: "auto",
              px: { xs: 1, sm: 0 },
              color: theme.palette.text.secondary,
              fontSize: { xs: 14, sm: 15.5, md: 17 },
              lineHeight: 1.65,
            }}
          >
            From login to a live online shop in just a few steps. Manage your
            catalog, branding and public link from one simple dashboard.
          </Typography>
        </Box>

        {/* PART 2 – ROUTE / STEPS */}
        <Box sx={{ mb: { xs: 10, sm: 12, md: 16 } }}>
          <Stack
            direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
            spacing={{ xs: 3, sm: 3, md: 3, lg: 2 }}
            alignItems="stretch"
            justifyContent="center"
            sx={{
              flexWrap: {
                xs: "nowrap",
                sm: "nowrap",
                md: "nowrap",
                lg: "nowrap",
              },
            }}
          >
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <StepCard {...step} />
                {idx < steps.length - 1 && (
                  <>
                    <SVGConnector />
                    <MobileConnector />
                  </>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Box>

        {/* PART 3 – COMING SOON */}
        <Box
          sx={{
            textAlign: "center",
            pt: { xs: 6, sm: 8, md: 10 },
            borderTop: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                width: { xs: 7, sm: 8 },
                height: { xs: 7, sm: 8 },
                borderRadius: "50%",
                bgcolor: theme.palette.secondary.main,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.5, transform: "scale(1.2)" },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 11, sm: 12, md: 13 },
                fontWeight: 700,
                color: theme.palette.secondary.main,
                textTransform: "uppercase",
                letterSpacing: { xs: 1.5, sm: 2 },
              }}
            >
              What's Next
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.6rem",
                sm: "2rem",
                md: "2.4rem",
                lg: "2.6rem",
              },
              color: theme.palette.text.primary,
              mb: { xs: 1, sm: 1.5 },
              px: { xs: 2, sm: 0 },
            }}
          >
            Exciting Features Coming Soon
          </Typography>

          <Typography
            sx={{
              maxWidth: { xs: "100%", sm: 500, md: 580 },
              mx: "auto",
              px: { xs: 2, sm: 3, md: 0 },
              color: theme.palette.text.secondary,
              fontSize: { xs: 13.5, sm: 14.5, md: 16 },
              lineHeight: 1.6,
              mb: { xs: 5, sm: 6 },
            }}
          >
            We're constantly improving Sahli to give you the best e-commerce
            experience. Here's what we're working on next.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 2.5, md: 3 }}
            alignItems="stretch"
            justifyContent="center"
            sx={{
              maxWidth: 1000,
              mx: "auto",
              flexWrap: { xs: "nowrap", sm: "wrap", md: "nowrap" },
            }}
          >
            {comingSoonFeatures.map((feature, idx) => (
              <ComingSoonCard key={idx} {...feature} />
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
