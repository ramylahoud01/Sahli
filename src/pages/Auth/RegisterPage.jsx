// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import AppButton from "../../components/UI/AppButton";
import { register } from "../../api/auth";
import AnimatedBackground from "../../Background/AnimatedBackground";

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      setLoading(true);
      await register(form);
      navigate("/login");
    } catch (err) {
      if (err?.data && Array.isArray(err.data)) {
        const map = {};
        err.data.forEach((error) => {
          const key = error.field || error.path;
          const msg = error.message || error.msg;
          if (key && msg && !map[key]) {
            map[key] = msg;
          }
        });
        setFieldErrors(map);
      } else {
        setError(err?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray[100],
      borderRadius: 1.5,
      transition: "all 0.2s ease",
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
    },
    "& .MuiFormHelperText-root": {
      fontSize: { xs: 12, sm: 13 },
      mt: 0.75,
      ml: 0.5,
      color: theme.palette.error.main,
    },
  };

  return (
    <>
      {/* ⭐ Animated background always behind content */}
      <AnimatedBackground
        primaryColor={theme.palette.primary.main}
        secondaryColor={theme.palette.secondary.main}
      />

      {/* ⭐ Foreground content (unchanged layout) */}
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
            {/* Header */}
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
                Create an account
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                Start selling your products with Sahli
              </Typography>
            </Box>

            {/* Card */}
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
                    mb: 3,
                    borderRadius: 1.5,
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={onSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5 },
                  }}
                >
                  {/* Name */}
                  <TextField
                    name="name"
                    label="Full name"
                    value={form.name}
                    onChange={onChange}
                    fullWidth
                    variant="outlined"
                    helperText={fieldErrors.name}
                    sx={textFieldStyles}
                  />

                  {/* Email */}
                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    value={form.email}
                    onChange={onChange}
                    fullWidth
                    variant="outlined"
                    helperText={fieldErrors.email}
                    sx={textFieldStyles}
                  />

                  {/* Password */}
                  <TextField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={form.password}
                    onChange={onChange}
                    fullWidth
                    variant="outlined"
                    helperText={fieldErrors.password}
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                            sx={{
                              color: theme.palette.text.secondary,
                              "&:hover": { color: theme.palette.text.primary },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />

                  {/* Submit */}
                  <AppButton
                    type="submit"
                    disabled={loading}
                    fullWidth
                    sx={{
                      mt: { xs: 0.5, sm: 1 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: 15, sm: 15.5 },
                      fontWeight: 500,
                    }}
                  >
                    {loading ? "Creating account..." : "Sign up"}
                  </AppButton>
                </Box>
              </form>
            </Box>

            {/* Switch to login */}
            <Box sx={{ mt: { xs: 2.5, sm: 3 }, textAlign: "center" }}>
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: theme.palette.text.secondary,
                }}
              >
                Already have an account?{" "}
              </Typography>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  fontWeight: 600,
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
