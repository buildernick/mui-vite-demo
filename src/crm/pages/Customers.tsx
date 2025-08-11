import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import TableChartIcon from "@mui/icons-material/TableChart";

export default function Customers() {
  const navigate = useNavigate();

  const customerVersions = [
    {
      id: "v1",
      title: "Customers v1 - Cards View",
      description: "Grid-based card layout displaying customers with search functionality and the ability to create new customers. Each customer is shown in an individual card with key information.",
      icon: <GridViewIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/customers-v1",
      features: ["Grid of cards layout", "Customer search", "Add new customers", "Customer avatars", "Quick view details"]
    },
    {
      id: "v2",
      title: "Customers v2 - HubSpot Style",
      description: "Professional contact management interface modeled after HubSpot with advanced filtering, saved views, and bulk operations. Perfect for CRM workflows.",
      icon: <ViewListIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/customers-v2",
      features: ["Advanced filters", "Saved views", "Bulk operations", "Table view with pagination", "Contact management"]
    },
    {
      id: "v3",
      title: "Customers v3 - Figma Design",
      description: "Custom interface following the provided Figma wireframe where selecting customers in the table displays their editable profile information above.",
      icon: <TableChartIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/customers-v3",
      features: ["Table selection", "Editable customer profiles", "Figma wireframe design", "Inline editing", "Profile display"]
    }
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Customer Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose from three different customer management interfaces, each designed for different use cases and workflows.
      </Typography>

      <Grid container spacing={3}>
        {customerVersions.map((version) => (
          <Grid item xs={12} md={6} lg={4} key={version.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  {version.icon}
                  <Typography variant="h6" component="h2" textAlign="center">
                    {version.title}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {version.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Key Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {version.features.map((feature, index) => (
                    <Typography
                      key={index}
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(version.path)}
                >
                  Launch {version.id.toUpperCase()}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2, border: 1, borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          About the Implementations
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          All three versions connect to the same Users API ({`https://user-api.builder-io.workers.dev/api`}) and provide full CRUD functionality including search, create, and edit capabilities. Each version demonstrates different UI patterns and interaction models suitable for various business requirements.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The interfaces use Material-UI components following the existing design system patterns found in the CRM dashboard.
        </Typography>
      </Box>
    </Box>
  );
}
