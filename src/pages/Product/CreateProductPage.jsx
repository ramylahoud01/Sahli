// src/pages/Product/CreateProductPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
  MenuItem,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LayersOutlined as LayersIcon,
  ShoppingBagOutlined as ProductIcon,
  AttachMoneyOutlined as PriceIcon,
  Inventory2Outlined as StockIcon,
  DescriptionOutlined as DescriptionIcon,
  ChevronRightOutlined as ChevronRightIcon,
  ImageOutlined as ImageIcon,
  CloseOutlined as CloseIcon,
} from "@mui/icons-material";

import Card from "../../components/UI/Card";
import AppButton from "../../components/UI/AppButton";

import { createProduct, uploadProductImage } from "../../api/products";
import { listCategories } from "../../api/categorie";
import { getAccessToken } from "../../api/auth";

const MAX_IMAGES = 6;
const DEFAULT_IMAGE_NOTE =
  "Add product images. Max 6 images. (JPG/PNG/GIF/WEBP, ~5–8MB each)";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ---------- helper: normalize dynamic fields from backend ---------- */
function normalizeDynamicFields(rawFields = []) {
  if (!Array.isArray(rawFields)) return [];

  return rawFields.map((f, idx) => {
    const key = f.key || f.name || f.slug || f._id || `field_${idx}`;
    const label = f.label || f.name || f.title || `Field ${idx + 1}`;
    const inputType =
      f.inputType ||
      f.type ||
      (Array.isArray(f.options || f.values) ? "select" : "text");
    const options = f.options || f.values || [];
    const required = f.required === true || f.isRequired === true;
    const placeholder = f.placeholder || "";

    return {
      ...f,
      key,
      label,
      inputType,
      options,
      required,
      placeholder,
    };
  });
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const theme = useTheme();

  const shopId = query.get("shopId");

  /* ---------- basic form ---------- */
  const [form, setForm] = React.useState({
    title: "",
    price: "",
    stock: "",
    description: "",
  });

  /* ---------- steps / categories ---------- */
  const [step, setStep] = React.useState(1);
  const [categories, setCategories] = React.useState([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [categoriesError, setCategoriesError] = React.useState("");

  const [categoryId, setCategoryId] = React.useState("");
  const [subcategoryId, setSubcategoryId] = React.useState("");

  /* ---------- dynamic fields ---------- */
  const [dynamicFields, setDynamicFields] = React.useState([]);
  const [attributes, setAttributes] = React.useState({});
  const [dynamicErrors, setDynamicErrors] = React.useState({});

  /* ---------- images ---------- */
  const [images, setImages] = React.useState([]); // { file, preview, name, type }
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const fileInputRef = React.useRef(null);

  /* ---------- UI / errors ---------- */
  const [loading, setLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");

  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const [subcatModalOpen, setSubcatModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
      return;
    }
    if (!shopId) {
      navigate("/shops");
    }
  }, [shopId, navigate]);

  /* ---------- load categories once ---------- */
  React.useEffect(() => {
    async function loadCats() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");
        const cats = await listCategories();
        console.log("[CreateProductPage] fetched categories:", cats);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (e) {
        console.error("[CreateProductPage] error loading categories:", e);
        setCategoriesError(e?.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCats();
  }, []);

  const currentCategory = React.useMemo(
    () => categories.find((c) => String(c._id) === String(categoryId)) || null,
    [categories, categoryId]
  );

  const currentSubcats = React.useMemo(
    () => currentCategory?.subcategories || [],
    [currentCategory]
  );

  const currentSubcat = React.useMemo(
    () =>
      currentSubcats.find((s) => String(s._id) === String(subcategoryId)) ||
      null,
    [currentSubcats, subcategoryId]
  );

  /* ---------- when subcategory changes → set dynamic fields ---------- */
  React.useEffect(() => {
    if (!currentSubcat) {
      console.log("[CreateProductPage] no currentSubcat, clearing fields.");
      setDynamicFields([]);
      setAttributes({});
      setDynamicErrors({});
      return;
    }

    const raw =
      currentSubcat.dynamicFields ||
      currentSubcat.fields ||
      currentSubcat.attributes ||
      [];

    const normalized = normalizeDynamicFields(raw);

    console.log("[CreateProductPage] currentSubcat:", currentSubcat);
    console.log("[CreateProductPage] raw dynamic fields:", raw);
    console.log("[CreateProductPage] normalized dynamic fields:", normalized);

    setDynamicFields(normalized);
    setAttributes({});
    setDynamicErrors({});
  }, [currentSubcat]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAttributeChange = (key, value) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
    if (dynamicErrors[key]) {
      setDynamicErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  /* ---------- validation for dynamic fields ---------- */
  const validateDynamicFields = () => {
    const errs = {};
    for (const f of dynamicFields) {
      if (!f.required) continue;
      const v = attributes[f.key];
      if (
        f.inputType === "boolean"
          ? v === undefined || v === null
          : v === undefined || v === null || v === ""
      ) {
        errs[f.key] = `${f.label} is required`;
      }
    }
    if (Object.keys(errs).length) {
      console.log("[CreateProductPage] dynamic field validation errors:", errs);
    }
    return errs;
  };

  /* ---------- image handlers ---------- */
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) return;

    const validImages = files.filter((file) =>
      /image\/(jpeg|jpg|png|webp|gif)/i.test(file.type || "")
    );

    if (!validImages.length) {
      setFieldErrors((prev) => ({
        ...prev,
        images: "Only JPG, PNG, WEBP, GIF images are allowed.",
      }));
      return;
    }

    const toUse = validImages.slice(0, remainingSlots);
    const newItems = toUse.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name || "image",
      type: file.type || "image/jpeg",
    }));

    console.log("[CreateProductPage] selected images:", newItems);

    setImages((prev) => [...prev, ...newItems]);
    setFieldErrors((prev) => ({ ...prev, images: undefined }));

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return copy;
    });
  };

  const uploadAllImages = async () => {
    if (!images.length) return [];
    const urls = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const file = img.file;
      if (!file) continue;

      if (!/image\/(jpeg|jpg|png|webp|gif)/i.test(file.type || "")) {
        throw new Error(`Unsupported file type for ${file.name || "image"}`);
      }

      console.log(
        "[CreateProductPage] uploading image",
        i,
        file.name,
        file.type
      );
      const path = await uploadProductImage(file);
      urls.push(path);
      setUploadProgress((i + 1) / images.length);
    }
    return urls;
  };

  /* ---------- submit (ALL ERRORS AT ONCE) ---------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setDynamicErrors({});
    setUploadProgress(0);

    // 1) Category still blocks first (we can't even know dynamic fields without it)
    if (!categoryId || !subcategoryId) {
      setFieldErrors({
        category: "Category & subcategory are required",
      });
      setStep(1);
      return;
    }

    // 2) Build all errors together
    const newFieldErrors = {};
    const dynErrs = validateDynamicFields();

    if (!form.title.trim()) {
      newFieldErrors.title = "Product title is required";
    }

    if (!form.price || Number.isNaN(parseFloat(form.price))) {
      newFieldErrors.price = "Valid price is required";
    }

    if (images.length === 0) {
      newFieldErrors.images = "Please add at least one product image";
    }

    const hasDynamicErrors = Object.keys(dynErrs).length > 0;
    const hasFieldErrors = Object.keys(newFieldErrors).length > 0;

    if (hasDynamicErrors || hasFieldErrors) {
      setDynamicErrors(dynErrs);
      setFieldErrors(newFieldErrors);
      setStep(2); // stay on details step
      return;
    }

    // 3) No validation errors → submit
    try {
      setLoading(true);

      let uploadedUrls = [];
      try {
        uploadedUrls = await uploadAllImages();
      } catch (uploadErr) {
        console.error("[CreateProductPage] image upload error:", uploadErr);
        setFieldErrors((prev) => ({
          ...prev,
          images: uploadErr.message || "Failed to upload images",
        }));
        setLoading(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock, 10) : 0,
        description: form.description.trim(),
        category: categoryId,
        subcategoryId,
        attributes,
        images: uploadedUrls,
      };

      console.log("[CreateProductPage] submit payload:", {
        shopId,
        payload,
      });

      await createProduct(shopId, payload);

      navigate(`/products?shopId=${shopId}`);
    } catch (err) {
      console.error("[CreateProductPage] createProduct error:", err);

      if (err?.data && Array.isArray(err.data)) {
        const errors = {};
        err.data.forEach((error) => {
          const key = error.field || error.path;
          const msg = error.message || error.msg;
          if (key && msg) errors[key] = msg;
        });
        setFieldErrors(errors);
      } else {
        const msg = err?.message || "Failed to create product";
        setGeneralError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    variant: "outlined",
    sx: {
      mb: 1.5,
      "& .MuiOutlinedInput-root": {
        backgroundColor: theme.palette.gray[50],
        borderRadius: 1.75,
        "& fieldset": {
          borderColor: theme.palette.gray[200],
          borderWidth: 0.5,
        },
        "&:hover fieldset": {
          borderColor: theme.palette.gray[300],
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.secondary.main,
          borderWidth: 1.5,
        },
        "&.Mui-error fieldset": {
          // keep neutral border when error (no red frame)
          borderColor: theme.palette.gray[200],
          borderWidth: 0.5,
        },
      },
      "& .MuiInputLabel-root": {
        fontSize: 15,
        "&.Mui-focused": {
          color: theme.palette.secondary.main,
        },
        "&.Mui-error": {
          color: theme.palette.text.secondary,
        },
      },
      "& .MuiFormHelperText-root": {
        fontSize: 13,
        color: theme.palette.error.main,
        ml: 0.5,
        mt: 0.5,
      },
    },
  };

  const canContinueStep1 = !!categoryId && !!subcategoryId;

  const selectedCatName = currentCategory?.name || "";
  const selectedSubcatName = currentSubcat?.name || "";
  const displayCatText =
    selectedCatName && selectedSubcatName
      ? `${selectedCatName} · ${selectedSubcatName}`
      : "";

  if (!shopId) return null;

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          py: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: 700,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.7rem", md: "2.1rem" },
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              New Product
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                color: theme.palette.text.secondary,
                opacity: 0.9,
              }}
            >
              Add a new item to your shop
            </Typography>
          </Box>

          <Card style={{ padding: 0 }}>
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ p: { xs: 2.5, sm: 3.5 } }}
            >
              {/* General error */}
              {generalError && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: "#fee",
                    border: "1px solid #fcc",
                  }}
                >
                  <Typography
                    sx={{ color: "#c33", fontSize: 14, fontWeight: 500 }}
                  >
                    {generalError}
                  </Typography>
                </Box>
              )}

              {/* STEP 1: category selection */}
              {step === 1 && (
                <>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Step 1 · Category
                  </Typography>

                  <Box
                    sx={{
                      mb: 1.5,
                      p: 1.75,
                      borderRadius: 1.75,
                      backgroundColor: theme.palette.gray[50],
                      border: `0.5px solid ${theme.palette.gray[200]}`,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: theme.palette.gray[300],
                      },
                    }}
                    onClick={() => setCategoryModalOpen(true)}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        Category & subcategory *
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          color: displayCatText
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                          mt: 0.25,
                        }}
                      >
                        {displayCatText || "Select category and subcategory"}
                      </Typography>
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </Box>
                  {(fieldErrors.category ||
                    fieldErrors.categoryId ||
                    fieldErrors.subcategoryId) && (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.error.main,
                        mt: 0.5,
                        mb: 1.5,
                        ml: 0.5,
                      }}
                    >
                      {fieldErrors.category ||
                        fieldErrors.categoryId ||
                        fieldErrors.subcategoryId}
                    </Typography>
                  )}

                  {categoriesError && (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.error.main,
                        mt: 0.5,
                      }}
                    >
                      {categoriesError}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <AppButton
                      type="button"
                      disabled={!canContinueStep1 || categoriesLoading}
                      fullWidth
                      sx={{ py: 1.5, fontSize: 15 }}
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </AppButton>
                  </Box>
                </>
              )}

              {/* STEP 2: details + dynamic fields + images */}
              {step === 2 && (
                <>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Step 2 · Product details
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={displayCatText || "No category selected (go back)"}
                      icon={<LayersIcon />}
                      sx={{
                        maxWidth: "70%",
                        "& .MuiChip-label": { whiteSpace: "nowrap" },
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => setStep(1)}
                      sx={{ textTransform: "none" }}
                    >
                      Change
                    </Button>
                  </Box>

                  {/* Hidden file input for images */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                  />

                  {/* Title */}
                  <TextField
                    {...textFieldProps}
                    label="Product title *"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    error={!!fieldErrors.title}
                    helperText={fieldErrors.title}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ProductIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Price + stock */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <TextField
                      {...textFieldProps}
                      label="Price *"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleFormChange}
                      error={!!fieldErrors.price}
                      helperText={fieldErrors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PriceIcon
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: 13 }}>USD</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...textFieldProps.sx, flex: 1 }}
                    />
                    <TextField
                      {...textFieldProps}
                      label="Stock"
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleFormChange}
                      error={!!fieldErrors.stock}
                      helperText={fieldErrors.stock}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StockIcon
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...textFieldProps.sx, flex: 1 }}
                    />
                  </Box>

                  {/* Description */}
                  <TextField
                    {...textFieldProps}
                    label="Description (optional)"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 1.5 }}
                        >
                          <DescriptionIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Dynamic fields */}
                  {dynamicFields.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Additional details
                      </Typography>

                      {dynamicFields.map((field) => {
                        const value = attributes[field.key];
                        const error = dynamicErrors[field.key];
                        const isRequired = field.required === true;

                        if (field.inputType === "boolean") {
                          return (
                            <Box key={field.key} sx={{ mb: 1 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={!!value}
                                    onChange={(e) =>
                                      handleAttributeChange(
                                        field.key,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={field.label + (isRequired ? " *" : "")}
                              />
                              {field.placeholder && (
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: theme.palette.text.secondary,
                                    ml: 0.5,
                                    mt: -0.5,
                                  }}
                                >
                                  {field.placeholder}
                                </Typography>
                              )}
                              {error && (
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: theme.palette.error.main,
                                    ml: 0.5,
                                    mt: 0.25,
                                  }}
                                >
                                  {error}
                                </Typography>
                              )}
                            </Box>
                          );
                        }

                        if (field.inputType === "select") {
                          return (
                            <TextField
                              key={field.key}
                              {...textFieldProps}
                              select
                              label={`${field.label}${isRequired ? " *" : ""}`}
                              value={
                                value === undefined || value === null
                                  ? ""
                                  : String(value)
                              }
                              onChange={(e) =>
                                handleAttributeChange(field.key, e.target.value)
                              }
                              helperText={error}
                              error={!!error}
                            >
                              {(field.options || []).map((opt, idx) => {
                                const optVal =
                                  typeof opt === "object"
                                    ? opt.value ?? opt.label ?? idx
                                    : opt;
                                const optLabel =
                                  typeof opt === "object"
                                    ? opt.label ?? String(optVal)
                                    : String(opt);
                                return (
                                  <MenuItem key={idx} value={String(optVal)}>
                                    {optLabel}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          );
                        }

                        const keyboardType =
                          field.inputType === "number" ? "number" : "text";

                        return (
                          <TextField
                            key={field.key}
                            {...textFieldProps}
                            type={keyboardType}
                            label={`${field.label}${isRequired ? " *" : ""}`}
                            value={
                              value === undefined || value === null
                                ? ""
                                : String(value)
                            }
                            onChange={(e) =>
                              handleAttributeChange(field.key, e.target.value)
                            }
                            helperText={error}
                            error={!!error}
                          />
                        );
                      })}
                    </Box>
                  )}

                  {/* Images box (multi) */}
                  <Box
                    sx={{
                      mt: 2,
                      mb: 1.5,
                      p: 2.5,
                      borderRadius: 1.75,
                      backgroundColor: theme.palette.gray[50],
                      border: `0.5px solid ${theme.palette.gray[200]}`,
                    }}
                  >
                    {images.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        {images.map((img, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              position: "relative",
                              width: 96,
                              height: 96,
                              borderRadius: 1.25,
                              overflow: "hidden",
                              border: `1px solid ${theme.palette.gray[200]}`,
                            }}
                          >
                            <Box
                              component="img"
                              src={img.preview}
                              alt={img.name || `image-${idx}`}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              onClick={() => handleRemoveImage(idx)}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                width: 22,
                                height: 22,
                                backgroundColor: "rgba(0,0,0,0.7)",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.9)",
                                },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <ImageIcon
                          sx={{
                            fontSize: 40,
                            color: theme.palette.text.secondary,
                            mb: 1,
                          }}
                        />
                      </Box>
                    )}

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        textAlign: "center",
                        mb: 1,
                      }}
                    >
                      {DEFAULT_IMAGE_NOTE}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {images.length}/{MAX_IMAGES}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        •
                      </Typography>
                      <Typography
                        onClick={() =>
                          images.length < MAX_IMAGES &&
                          fileInputRef.current?.click()
                        }
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color:
                            images.length >= MAX_IMAGES
                              ? theme.palette.text.secondary
                              : theme.palette.primary.main,
                          cursor:
                            images.length >= MAX_IMAGES
                              ? "not-allowed"
                              : "pointer",
                          textDecoration:
                            images.length >= MAX_IMAGES ? "none" : "underline",
                        }}
                      >
                        {images.length === 0 ? "Add images" : "Add more"}
                      </Typography>
                    </Box>

                    {uploadProgress > 0 && uploadProgress < 1 && (
                      <Box sx={{ mt: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress * 100}
                        />
                      </Box>
                    )}
                  </Box>
                  {fieldErrors.images && (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.error.main,
                        mt: 0.25,
                        mb: 1,
                        ml: 0.5,
                      }}
                    >
                      {fieldErrors.images}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, display: "flex", gap: 1.5 }}>
                    <AppButton
                      type="button"
                      onClick={() => navigate(`/products?shopId=${shopId}`)}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: 15,
                        backgroundColor: "transparent",
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.gray[300]}`,
                        "&:hover": {
                          backgroundColor: theme.palette.gray[50],
                        },
                      }}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      type="submit"
                      disabled={loading}
                      fullWidth
                      sx={{ py: 1.5, fontSize: 15 }}
                    >
                      {loading ? "Publishing..." : "Publish product"}
                    </AppButton>
                  </Box>
                </>
              )}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Category modal */}
      <Dialog
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { minHeight: 400 } }}
      >
        <DialogTitle>Categories</DialogTitle>
        <DialogContent dividers sx={{ p: 0.5 }}>
          <List sx={{ padding: 0 }}>
            {categories.map((cat) => {
              const subPreview = (cat.subcategories || [])
                .slice(0, 3)
                .map((s) => s.name)
                .join(" • ");
              return (
                <ListItem key={cat._id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      console.log(
                        "[CreateProductPage] category selected:",
                        cat
                      );
                      setCategoryId(cat._id);
                      setSubcategoryId("");
                      setCategoryModalOpen(false);
                      setSubcatModalOpen(true);
                      setFieldErrors((prev) => ({
                        ...prev,
                        category: undefined,
                        categoryId: undefined,
                      }));
                    }}
                  >
                    <ListItemText
                      primary={cat.name}
                      secondary={subPreview || undefined}
                    />
                    <ChevronRightIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>

      {/* Subcategory modal */}
      <Dialog
        open={subcatModalOpen}
        onClose={() => setSubcatModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { minHeight: 300 } }}
      >
        <DialogTitle
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            onClick={() => {
              setSubcatModalOpen(false);
              setCategoryModalOpen(true);
            }}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1.25,
              backgroundColor: theme.palette.gray[100],
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: theme.palette.gray[200],
              },
            }}
          >
            <ChevronRightIcon
              sx={{
                fontSize: 18,
                color: theme.palette.text.primary,
                transform: "rotate(180deg)",
              }}
            />
          </Box>
          Subcategories
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0.5 }}>
          <List>
            {currentSubcats.map((sub) => (
              <ListItem key={sub._id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    console.log(
                      "[CreateProductPage] subcategory selected:",
                      sub
                    );
                    setSubcategoryId(sub._id);
                    setSubcatModalOpen(false);
                    setFieldErrors((prev) => ({
                      ...prev,
                      category: undefined,
                      subcategoryId: undefined,
                    }));
                  }}
                >
                  <ListItemText primary={sub.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
