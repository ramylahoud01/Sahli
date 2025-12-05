// src/pages/Shop/CreateShopPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  StoreOutlined as StoreIcon,
  LocationOnOutlined as LocationIcon,
  DescriptionOutlined as DescriptionIcon,
  ImageOutlined as ImageIcon,
  PaletteOutlined as PaletteIcon,
  CloseOutlined as CloseIcon,
  ChevronRightOutlined as ChevronRightIcon,
  SearchOutlined as SearchIcon,
} from "@mui/icons-material";

import AppButton from "../../components/UI/AppButton";
import { createShop, uploadShopImage } from "../../api/shops";
import { getAccessToken } from "../../api/auth";
import AnimatedBackground from "../../Background/AnimatedBackground";

// Lebanon location data
const LEBANON_DISTRICTS = [
  "Akkar",
  "Aley",
  "Baabda",
  "Baalbeck",
  "Batroun",
  "Becharre",
  "Beirut",
  "Bint Jbeil",
  "Chouf",
  "Hasbaya",
  "Hermel",
  "Jezzine",
  "Jbeil",
  "Koura",
  "Marjayoun",
  "Metn",
  "Minieh-Dennieh",
  "Nabatieh",
  "Rachaya",
  "Saida (Sidon)",
  "Tripoli",
  "Tyre",
  "West Bekaa",
  "Zahle",
  "Zgharta",
].sort();

const TOWNS_BY_DISTRICT = {
  Beirut: [
    "Achrafieh",
    "Hamra",
    "Verdun",
    "Mar Mikhael",
    "Badaro",
    "Gemmayzeh",
    "Ras Beirut",
    "Corniche",
    "Ain El Mreisseh",
    "Other in Beirut",
  ],

  Metn: [
    "Jdeideh",
    "Zalka",
    "Dora",
    "Dekwaneh",
    "Sin El Fil",
    "Fanar",
    "Antelias",
    "Jal El Dib",
    "Dbayeh",
    "Ain Saadeh",
    "Roumieh",
    "Mansourieh",
    "Beit Mery",
    "Broummana",
    "Baabdat",
    "Cornet Chahwan",
    "Rabieh",
    "Other in Metn",
  ],

  Baabda: [
    "Hazmieh",
    "Hadath",
    "Furn El Chebbak",
    "Baabda",
    "Louaizeh",
    "Araya",
    "Jamhour",
    "Qornayel",
    "Other in Baabda",
  ],

  Aley: [
    "Aley",
    "Bhamdoun",
    "Ain Dara",
    "Ain El Qabou",
    "Souk El Gharb",
    "Bsous",
    "Aramoun",
    "Other in Aley",
  ],

  Chouf: [
    "Beiteddine",
    "Deir El Qamar",
    "Barouk",
    "Maaser El Chouf",
    "Baakline",
    "Kfarhim",
    "Other in Chouf",
  ],

  Jbeil: [
    "Jbeil (Byblos)",
    "Amchit",
    "Hboub",
    "Ghazir",
    "Ehmej",
    "Laklouk",
    "Other in Jbeil",
  ],

  Batroun: [
    "Batroun",
    "Kfifane",
    "Ijdabra",
    "Hamat",
    "Chekka",
    "Other in Batroun",
  ],

  Becharre: [
    "Becharre",
    "Bcharre Cedars",
    "Hadchit",
    "Hasroun",
    "Other in Becharre",
  ],

  Koura: ["Amioun", "Anfeh", "Kousba", "Deddeh", "Other in Koura"],

  Zgharta: ["Zgharta", "Ehden", "Miziara", "Ardeh", "Other in Zgharta"],

  Tripoli: ["Tripoli", "Mina", "Qobbeh", "Beddawi", "Other in Tripoli"],

  "Minieh-Dennieh": ["Minieh", "Dennieh", "Bakhoun", "Other in Minieh-Dennieh"],

  Akkar: ["Halba", "Kobayat", "Mekhayel", "Beino", "Other in Akkar"],

  Baalbeck: [
    "Baalbeck",
    "Britel",
    "Chlifa",
    "Deir El Ahmar",
    "Other in Baalbeck",
  ],

  Hermel: ["Hermel", "Qasr", "Ainata", "Other in Hermel"],

  Zahle: ["Zahle", "Ferzol", "Kefraya", "Taanayel", "Niha", "Other in Zahle"],

  "West Bekaa": [
    "Joub Jannine",
    "Saghbine",
    "Khiara",
    "Aitanit",
    "Other in West Bekaa",
  ],

  Rachaya: ["Rachaya", "Kawkaba", "Ain Ata", "Other in Rachaya"],

  "Saida (Sidon)": [
    "Saida",
    "Haret Saida",
    "Abra",
    "Majdelyoun",
    "Other in Saida",
  ],

  Tyre: ["Tyre", "Abbassiyeh", "Qana", "Other in Tyre"],

  Nabatieh: ["Nabatieh", "Kfar Remmen", "Zefta", "Other in Nabatieh"],

  "Bint Jbeil": ["Bint Jbeil", "Ainata", "Rmeich", "Other in Bint Jbeil"],

  Marjayoun: ["Marjayoun", "Khiam", "Deir Mimas", "Other in Marjayoun"],

  Hasbaya: ["Hasbaya", "Kawkaba", "Habbariyeh", "Other in Hasbaya"],

  Jezzine: ["Jezzine", "Roum", "Kfar Falous", "Other in Jezzine"],
};

// Aliases & helpers to make reverse geocoding match our districts
const DISTRICT_ALIASES = {
  Metn: ["Matn", "El Metn", "Maten", "Al Matn"],
  Beirut: ["Beyrouth", "Beirut District"],
  Baabda: ["Baabda District"],
  Aley: ["Aley District"],
  Chouf: ["Shouf", "Chouf District"],
  Tripoli: ["Trablous", "Tripoli District"],
  Tyre: ["Sour", "Tyre District"],
  Zahle: ["Zahlé", "Zahle District"],
  Akkar: ["Akkar District"],
  "Minieh-Dennieh": ["Miniyeh-Danniyeh", "Minieh el Donniyeh"],
  Baalbeck: ["Baalbek", "Baalbeck District"],
  "West Bekaa": ["West Bekaa District"],
  Rachaya: ["Rashaya", "Rachaya District"],
  Hermel: ["Hermel District"],
  Nabatieh: ["Nabatiyeh", "Nabatieh District"],
  "Bint Jbeil": ["Bint Jbail"],
  Marjayoun: ["Marjeyoun", "Marjaayoun"],
  Hasbaya: ["Hasbaya District"],
  "Saida (Sidon)": ["Saida", "Sidon"],
};

const titleCase = (s = "") =>
  s
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

function normalizeDistrictName(raw) {
  if (!raw) return null;
  const val = raw.trim();
  if (TOWNS_BY_DISTRICT[val]) return val;

  for (const [canon, aliases] of Object.entries(DISTRICT_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === val.toLowerCase())) {
      return canon;
    }
  }
  return null;
}

export default function CreateShopPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Form state
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [brandColor, setBrandColor] = React.useState(
    theme.palette.secondary.main
  );
  const [tempColor, setTempColor] = React.useState(
    theme.palette.secondary.main
  );

  // UI state
  const [loading, setLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");

  // Modals
  const [locationModalOpen, setLocationModalOpen] = React.useState(false);
  const [colorModalOpen, setColorModalOpen] = React.useState(false);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);

  // Location modal state
  const [level, setLevel] = React.useState("districts");
  const [currentDistrict, setCurrentDistrict] = React.useState(null);
  const [locationSearch, setLocationSearch] = React.useState("");
  const [locationLoading, setLocationLoading] = React.useState(false);

  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          image: "Image must be less than 5MB",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage({
          uri: event.target.result,
          file,
          name: file.name,
        });
        setFieldErrors((prev) => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
      setImageModalOpen(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Use current location (web)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFieldErrors((prev) => ({
        ...prev,
        address: "Geolocation is not supported in this browser",
      }));
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addr = data.address || {};

          const rawDistrict =
            addr.county ||
            addr.state_district ||
            addr.region ||
            addr.city ||
            addr.state;

          const district = normalizeDistrictName(rawDistrict) || "Metn";

          let town = titleCase(
            addr.suburb ||
              addr.neighbourhood ||
              addr.village ||
              addr.town ||
              addr.city ||
              addr.road ||
              ""
          );

          const towns = TOWNS_BY_DISTRICT[district] || [];
          const hasExactTown = towns.some(
            (t) => t.toLowerCase() === town.toLowerCase()
          );

          if (!hasExactTown) {
            town = `Other in ${district}`;
          }

          setAddress(`${town}, ${district}, Lebanon`);
          setFieldErrors((prev) => ({ ...prev, address: undefined }));
          setLocationModalOpen(false);
          setLevel("districts");
          setCurrentDistrict(null);
          setLocationSearch("");
        } catch (err) {
          console.error("Reverse geocode error", err);
          setFieldErrors((prev) => ({
            ...prev,
            address:
              "Could not detect address from location. Please select it manually.",
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setFieldErrors((prev) => ({
          ...prev,
          address:
            "Unable to get your current location. Please select it manually.",
        }));
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleLocationSelect = (item) => {
    if (level === "districts") {
      setCurrentDistrict(item);
      setLevel("towns");
      setLocationSearch("");
    } else {
      setAddress(`${item}, ${currentDistrict}, Lebanon`);
      setFieldErrors((prev) => ({ ...prev, address: undefined }));
      setLocationModalOpen(false);
      setLevel("districts");
      setCurrentDistrict(null);
      setLocationSearch("");
    }
  };

  const filteredLocations = React.useMemo(() => {
    if (level === "districts") {
      return LEBANON_DISTRICTS.filter((d) =>
        d.toLowerCase().includes(locationSearch.toLowerCase())
      );
    } else {
      const towns = TOWNS_BY_DISTRICT[currentDistrict];
      if (!towns || towns.length === 0) {
        return [`Other in ${currentDistrict}`];
      }
      return towns.filter((t) =>
        t.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }
  }, [level, currentDistrict, locationSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    try {
      setLoading(true);

      // 1) Upload image if exists
      let imageData = null;
      if (image?.file) {
        try {
          const uploadResult = await uploadShopImage(image.file);
          imageData = uploadResult.path || uploadResult.url || uploadResult;
        } catch (uploadErr) {
          setFieldErrors((prev) => ({
            ...prev,
            image: uploadErr.message || "Failed to upload image",
          }));
          setLoading(false);
          return;
        }
      }

      // 2) Create shop
      await createShop({
        name,
        address,
        description,
        themeColor: brandColor,
        image: imageData,
      });

      navigate("/shops");
    } catch (err) {
      if (err?.data && Array.isArray(err.data)) {
        const errors = {};
        err.data.forEach((error) => {
          const key = error.field || error.path;
          const msg = error.message || error.msg;
          if (key && msg) errors[key] = msg;
        });
        setFieldErrors(errors);
      } else {
        const errMsg = err?.message || "Failed to create shop";
        if (/name/i.test(errMsg)) {
          setFieldErrors((prev) => ({ ...prev, name: errMsg }));
        } else if (/address|location/i.test(errMsg)) {
          setFieldErrors((prev) => ({ ...prev, address: errMsg }));
        } else if (/image|logo/i.test(errMsg)) {
          setFieldErrors((prev) => ({ ...prev, image: errMsg }));
        } else {
          setGeneralError(errMsg);
        }
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
          backgroundColor: "transparent",
          minHeight: "100vh",
          py: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            px: { xs: 2.5, sm: 3.5 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.7rem", md: "2.3rem" },
                color: theme.palette.text.primary,
                mb: 0.75,
              }}
            >
              Create New{" "}
              <Box
                component="span"
                sx={{ color: theme.palette.secondary.main }}
              >
                Shop
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                color: theme.palette.text.secondary,
                opacity: 0.9,
              }}
            >
              Set up your shop profile
            </Typography>
          </Box>

          {/* Form Card */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px solid ${theme.palette.gray[200]}`,
              p: { xs: 2.5, sm: 3.5 },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* General Error */}
            {generalError && (
              <Box
                sx={{
                  mb: 2.5,
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

            {/* Shop Name */}
            <TextField
              {...textFieldProps}
              label="Shop name *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StoreIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Location Selector */}
            <Box
              onClick={() => setLocationModalOpen(true)}
              sx={{
                mb: 1.5,
                p: 1.75,
                borderRadius: 1.75,
                backgroundColor: theme.palette.gray[50],
                border: `0.5px solid ${theme.palette.gray[200]}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  borderColor: theme.palette.gray[300],
                },
              }}
            >
              <LocationIcon
                sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Location *
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    color: address
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    mt: 0.25,
                  }}
                >
                  {address || "Use current location or select manually"}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ color: theme.palette.text.secondary }} />
            </Box>
            {fieldErrors.address && (
              <Typography
                sx={{
                  fontSize: 13,
                  color: theme.palette.error.main,
                  mt: 0.5,
                  mb: 1.5,
                  ml: 0.5,
                }}
              >
                {fieldErrors.address}
              </Typography>
            )}

            {/* Description */}
            <TextField
              {...textFieldProps}
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

            {/* Brand Color */}
            <Box
              onClick={() => {
                setTempColor(brandColor);
                setColorModalOpen(true);
              }}
              sx={{
                mb: 1.5,
                p: 1.75,
                borderRadius: 1.75,
                backgroundColor: theme.palette.gray[50],
                border: `0.5px solid ${theme.palette.gray[200]}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  borderColor: theme.palette.gray[300],
                },
              }}
            >
              <PaletteIcon
                sx={{ color: theme.palette.text.secondary, mr: 1.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Brand color
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    color: theme.palette.text.primary,
                    mt: 0.25,
                  }}
                >
                  {brandColor}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: brandColor,
                  border: `1px solid ${theme.palette.gray[200]}`,
                  mr: 1,
                }}
              />
              <ChevronRightIcon sx={{ color: theme.palette.text.secondary }} />
            </Box>

            {/* Logo Upload */}
            <Box
              sx={{
                mb: 1.5,
                p: 2.5,
                borderRadius: 1.75,
                backgroundColor: theme.palette.gray[50],
                border: `0.5px solid ${theme.palette.gray[200]}`,
                textAlign: "center",
              }}
            >
              {image ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Box
                    component="img"
                    src={image.uri}
                    alt="Shop logo"
                    sx={{
                      width: 140,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 1.25,
                      border: `1px solid ${theme.palette.gray[200]}`,
                    }}
                  />
                  <IconButton
                    onClick={removeImage}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 24,
                      height: 24,
                      backgroundColor: theme.palette.text.primary,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: theme.palette.text.primary,
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ) : (
                <ImageIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.text.secondary,
                    mb: 1,
                  }}
                />
              )}
              <Typography
                sx={{
                  fontSize: 13,
                  color: theme.palette.text.secondary,
                  mb: 1,
                  mt: image ? 1 : 0,
                }}
              >
                Upload a shop logo (JPG, PNG, GIF, WEBP – max 5MB)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  onClick={() => setImageModalOpen(true)}
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {image ? "Update logo" : "Add logo"}
                </Typography>
                {image && (
                  <>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      •
                    </Typography>
                    <Typography
                      onClick={removeImage}
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: theme.palette.error.main,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Remove
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            {fieldErrors.image && (
              <Typography
                sx={{
                  fontSize: 13,
                  color: theme.palette.error.main,
                  mt: 0.5,
                  mb: 1.5,
                  ml: 0.5,
                }}
              >
                {fieldErrors.image}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ mt: 2, display: "flex", gap: 1.5 }}>
              <AppButton
                type="button"
                onClick={() => navigate("/shops")}
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
                {loading ? "Creating..." : "Create Shop"}
              </AppButton>
            </Box>
          </Box>
        </Box>

        {/* Location Modal */}
        <Dialog
          open={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2.25,
              minHeight: 500,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                {level === "districts" ? "Locations" : currentDistrict}
              </Typography>
              <IconButton
                onClick={() => {
                  if (level === "towns") {
                    setLevel("districts");
                    setLocationSearch("");
                  } else {
                    setLocationModalOpen(false);
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={
                  level === "districts"
                    ? "Search district"
                    : `Search in ${currentDistrict}`
                }
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.75,
                    backgroundColor: theme.palette.gray[50],
                  },
                }}
              />
            </Box>

            {/* Use current location row (only at districts level) */}
            {level === "districts" && (
              <Box sx={{ px: 2, pb: 1 }}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderBottom: `1px solid ${theme.palette.gray[100]}`,
                  }}
                >
                  <ListItemButton
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                  >
                    <LocationIcon
                      sx={{
                        mr: 1.5,
                        color: theme.palette.secondary.main,
                      }}
                    />
                    <ListItemText
                      primary={
                        locationLoading
                          ? "Getting your current location..."
                          : "Use my current location"
                      }
                      secondary="Auto-detect your town & district"
                    />
                    {locationLoading ? (
                      <CircularProgress
                        size={18}
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    ) : (
                      <ChevronRightIcon
                        sx={{ color: theme.palette.text.secondary }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Box>
            )}

            <List sx={{ py: 0 }}>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((item) => (
                  <ListItem key={item} disablePadding>
                    <ListItemButton onClick={() => handleLocationSelect(item)}>
                      <ListItemText
                        primary={
                          level === "districts"
                            ? `${item}, Lebanon`
                            : `${item}, ${currentDistrict}`
                        }
                      />
                      <ChevronRightIcon
                        sx={{ color: theme.palette.text.secondary }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                    px: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      mb: 0.5,
                    }}
                  >
                    No locations found
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.text.secondary,
                      textAlign: "center",
                    }}
                  >
                    Try a different search term
                  </Typography>
                </Box>
              )}
            </List>
          </DialogContent>
        </Dialog>

        {/* Image Upload Modal */}
        <Dialog
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2.25,
              p: 2.5,
              minHeight: 240,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 0.5, pt: 0 }}>
            Add shop logo
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", pb: 0.5, pt: 1 }}>
            <Typography
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            >
              Choose a logo from your files
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ flexDirection: "column", gap: 1, p: 0, pt: 1.5 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                py: 1.25,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: 15,
              }}
            >
              Choose from files
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setImageModalOpen(false)}
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Color Picker Modal */}
        <Dialog
          open={colorModalOpen}
          onClose={() => setColorModalOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2.25,
              p: 2,
              minHeight: 420,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            Choose brand color
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              sx={{
                fontSize: 14,
                color: theme.palette.text.secondary,
                mb: 2,
              }}
            >
              This color can be used in your future shop page & website.
            </Typography>
            <input
              type="color"
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              style={{
                width: "100%",
                height: 200,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: tempColor,
                  border: `1px solid ${theme.palette.gray[200]}`,
                }}
              />
              <Typography
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              >
                {tempColor}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setBrandColor(tempColor);
                setColorModalOpen(false);
              }}
              sx={{
                py: 1.25,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: 15,
              }}
            >
              Use this color
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setColorModalOpen(false)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
