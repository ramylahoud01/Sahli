import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FULL_TEXT = "Welcome to Sahli Web";

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
    <Box
      sx={{
        minHeight: "60vh", // tighter vertical space
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        mt: -4, // pull upward slightly
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
          fontSize: { xs: "1.8rem", sm: "2.3rem", md: "2.8rem" }, // smaller
          letterSpacing: "0.4px",
        }}
      >
        {text}
        <Box
          component="span"
          sx={{
            width: "4px",
            height: "1.2em",
            ml: 0.4,
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
          mt: 1.5, // much tighter space
          maxWidth: 440,
          color: theme.palette.text.secondary,
          fontSize: { xs: 13.5, sm: 14.5 },
          letterSpacing: 0.2,
        }}
      >
        Manage your shops and products directly from the web with a smooth,
        app-like experience.
      </Typography>
    </Box>
  );
}
