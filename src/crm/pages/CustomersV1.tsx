import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface User {
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
  phone: string;
  cell: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  dob: {
    age: number;
  };
}

interface ApiResponse {
  data: User[];
  total: number;
  page: number;
  perPage: number;
}

export default function CustomersV1() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    country: "",
  });

  const fetchCustomers = async (search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "20",
        ...(search && { search }),
      });
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`
      );
      const data: ApiResponse = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(searchQuery);
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newCustomer.email,
            login: {
              username: newCustomer.username,
              password: "defaultPassword123",
            },
            name: {
              first: newCustomer.firstName,
              last: newCustomer.lastName,
              title: "Mr",
            },
            gender: "male",
            location: {
              city: newCustomer.city,
              state: newCustomer.state,
              country: newCustomer.country,
              street: {
                number: 0,
                name: "",
              },
              postcode: "",
            },
          }),
        }
      );

      if (response.ok) {
        setOpenDialog(false);
        setNewCustomer({
          email: "",
          firstName: "",
          lastName: "",
          username: "",
          city: "",
          state: "",
          country: "",
        });
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Customers v1
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Customer
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search customers by name, email, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 600 }}
          InputProps={{
            endAdornment: (
              <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                Search
              </Button>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.login.uuid}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={customer.picture.large}
                      alt={`${customer.name.first} ${customer.name.last}`}
                      sx={{ width: 80, height: 80, mb: 2 }}
                    />
                    <Typography variant="h6" component="h2" textAlign="center">
                      {customer.name.first} {customer.name.last}
                    </Typography>
                    <Chip
                      label={`@${customer.login.username}`}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {customer.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {customer.location.city}, {customer.location.country}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Age: {customer.dob.age}
                  </Typography>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && customers.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No customers found
          </Typography>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Customer
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="First Name"
              required
              value={newCustomer.firstName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              required
              value={newCustomer.lastName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, lastName: e.target.value })
              }
            />
            <TextField
              label="Username"
              required
              value={newCustomer.username}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, username: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              required
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <TextField
              label="City"
              value={newCustomer.city}
              onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
            />
            <TextField
              label="State"
              value={newCustomer.state}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, state: e.target.value })
              }
            />
            <TextField
              label="Country"
              value={newCustomer.country}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, country: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCustomer} variant="contained">
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
