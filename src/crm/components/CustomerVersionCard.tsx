import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

interface CustomerVersion {
  version: string;
  title: string;
  description: string;
  features: string[];
  path: string;
  icon: React.ReactElement;
  color: string;
}

interface CustomerVersionCardProps {
  version: CustomerVersion;
}

export default function CustomerVersionCard({
  version,
}: CustomerVersionCardProps) {
  const navigate = useNavigate();

  return (
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
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {version.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Features */}
        <Typography variant="subtitle2" gutterBottom color="text.primary">
          Key Features:
        </Typography>
        <Stack spacing={1}>
          {version.features.map((feature, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={1}>
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
  );
}
