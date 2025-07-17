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
            <CustomerVersionCard version={version} />
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
