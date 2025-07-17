import * as React from "react";
import { Typography, Box, Grid, Stack } from "@mui/material";
import {
  GridView as GridIcon,
  TableView as TableIcon,
  TouchApp as TouchIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import CustomerVersionCard from "../components/CustomerVersionCard";

const customerVersions = [
  {
    version: "V1",
    title: "Card Grid Layout",
    description:
      "Modern card-based interface showing customers in a responsive grid layout with avatars, contact information, and quick actions.",
    features: [
      "Responsive card grid",
      "Customer avatars",
      "Hover animations",
      "Search functionality",
      "Create new customers",
      "Contact information display",
    ],
    path: "/customers-v1",
    icon: <GridIcon sx={{ fontSize: 40 }} />,
    color: "primary",
  },
  {
    version: "V2",
    title: "HubSpot-Style Interface",
    description:
      "Professional CRM interface inspired by HubSpot with advanced filtering, saved views, bulk operations, and table management.",
    features: [
      "Saved views & filters",
      "Bulk operations",
      "Advanced search",
      "Selection management",
      "Export functionality",
      "Professional table layout",
    ],
    path: "/customers-v2",
    icon: <TableIcon sx={{ fontSize: 40 }} />,
    color: "secondary",
  },
  {
    version: "V3",
    title: "Figma Design Implementation",
    description:
      "Clean interface following the provided Figma design with table selection and an expandable editable customer profile panel.",
    features: [
      "Figma design fidelity",
      "Editable customer profiles",
      "Table row selection",
      "Inline editing",
      "Collapsible profile view",
      "Clean modern aesthetic",
    ],
    path: "/customers-v3",
    icon: <TouchIcon sx={{ fontSize: 40 }} />,
    color: "success",
  },
];

export default function Customers() {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Management Prototypes
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 800 }}
      >
        Three different approaches to customer management interfaces, each
        demonstrating different design patterns and user experience concepts.
        All versions integrate with the Users API and include search, filtering,
        and customer creation functionality.
      </Typography>

      <Grid container spacing={4}>
        {customerVersions.map((version) => (
          <Grid item xs={12} md={4} key={version.version}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${version.color}.100`,
                      color: `${version.color}.600`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {version.icon}
                  </Box>
                  <Box>
                    <Chip
                      label={`Customers ${version.version}`}
                      color={version.color as any}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" component="h2">
                      {version.title}
                    </Typography>
                  </Box>
                </Stack>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {version.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Features */}
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color="text.primary"
                >
                  Key Features:
                </Typography>
                <Stack spacing={1}>
                  {version.features.map((feature, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: `${version.color}.500`,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  color={version.color as any}
                  fullWidth
                  onClick={() => navigate(version.path)}
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  View {version.version} Prototype
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Common Features Section */}
      <Box sx={{ mt: 6, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Shared Functionality Across All Versions
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SearchIcon color="primary" />
              <Typography variant="body2">Real-time search</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AddIcon color="primary" />
              <Typography variant="body2">Create customers</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterIcon color="primary" />
              <Typography variant="body2">Advanced filtering</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EditIcon color="primary" />
              <Typography variant="body2">Customer management</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
