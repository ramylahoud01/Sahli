// src/pages/Auth/VerifySignupPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, TextField, Typography, Container, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppButton from "../../components/UI/AppButton";
import AnimatedBackground from "../../Background/AnimatedBackground";
import { verifySignup } from "../../api/auth";

export default function VerifySignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const { pendingId, email, phone, name } = location.state || {};

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!pendingId) {
      navigate("/register");
    }
  }, [pendingId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pendingId) return;

    setError("");
    setInfo("");

    try {
      setLoading(true);
      await verifySignup({ pendingId, code });
      setInfo("Your account has been verified. You can now sign in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      if (err?.data && Array.isArray(err.data)) {
        const msg = err.data[0]?.message || err.message;
        setError(msg || "Invalid code");
      } else {
        setError(err?.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray[100],
      borderRadius: 1.5,
      "& fieldset": {
        borderColor: theme.palette.gray[300],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.gray[400],
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: { xs: 14, sm: 15 },
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: { xs: 14, sm: 15 },
      py: { xs: 1.5, sm: 1.75 },
      letterSpacing: "0.35em",
      textAlign: "center",
    },
  };

  const targetText =
    email || phone
      ? email
        ? `We sent a 6-digit code to ${email}.`
        : `We sent a 6-digit code to WhatsApp ${phone}.`
      : "We sent you a 6-digit verification code.";

  return (
    <>
      <AnimatedBackground
        primaryColor={theme.palette.primary.main}
        secondaryColor={theme.palette.secondary.main}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              width: "100%",
              maxWidth: 480,
              mx: "auto",
            }}
          >
            <Box sx={{ mb: { xs: 2.5, sm: 3 }, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                Verify your account
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {targetText}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: { xs: 1.5 },
                border: `1px solid ${theme.palette.gray[200]}`,
                p: { xs: 2.5, sm: 3.5, md: 4 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: 1.5,
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  {error}
                </Alert>
              )}

              {info && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: 1.5,
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  {info}
                </Alert>
              )}

              <form onSubmit={onSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2 },
                  }}
                >
                  <TextField
                    label="Verification code"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyles}
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 6,
                    }}
                  />

                  <AppButton
                    type="submit"
                    disabled={loading || code.length < 6}
                    fullWidth
                    sx={{
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: 15, sm: 15.5 },
                      fontWeight: 500,
                    }}
                  >
                    {loading ? "Verifying..." : "Confirm"}
                  </AppButton>
                </Box>
              </form>
            </Box>

            <Box sx={{ mt: { xs: 2.5, sm: 3 }, textAlign: "center" }}>
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: theme.palette.text.secondary,
                }}
              >
                Entered the wrong email or phone?{" "}
              </Typography>
              <Typography
                component={Link}
                to="/register"
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  fontWeight: 600,
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Go back to signup
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
