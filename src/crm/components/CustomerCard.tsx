import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

interface CustomerCardProps {
  customer: {
    login: {
      uuid: string;
      username: string;
    };
    name: {
      title: string;
      first: string;
      last: string;
    };
    email: string;
    location: {
      city: string;
      country: string;
    };
    phone: string;
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
  };
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <Box sx={{ flexGrow: 1, textAlign: "center", p: 2 }}>
        <Avatar
          src={customer.picture.large}
          alt={`${customer.name.first} ${customer.name.last}`}
          sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
        />
        <Typography variant="h6" component="h2" gutterBottom>
          {customer.name.first} {customer.name.last}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {customer.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {customer.location.city}, {customer.location.country}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {customer.phone}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, pb: 2 }}>
        <Button size="small">View Details</Button>
        <Button size="small">Edit</Button>
      </Box>
    </Box>
  );
}
