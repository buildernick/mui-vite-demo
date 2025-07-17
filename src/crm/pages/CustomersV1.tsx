import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
  Grid,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

// Types
interface Customer {
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
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  dob: {
    date: string;
    age: number;
  };
  gender: string;
}

interface CreateCustomerData {
  email: string;
  login: {
    username: string;
    password: string;
  };
  name: {
    first: string;
    last: string;
    title: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function CustomersV1() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  // Create customer form state
  const [newCustomer, setNewCustomer] = React.useState<CreateCustomerData>({
    email: "",
    login: { username: "", password: "" },
    name: { first: "", last: "", title: "Mr" },
    gender: "male",
    location: {
      street: { number: 0, name: "" },
      city: "",
      state: "",
      country: "",
      postcode: "",
    },
  });

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users?perPage=20`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers",
      );
    } finally {
      setLoading(false);
    }
  };

  // Search customers
  const searchCustomers = async (term: string) => {
    if (!term.trim()) {
      fetchCustomers();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/users?search=${encodeURIComponent(term)}&perPage=20`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search customers",
      );
    } finally {
      setLoading(false);
    }
  };

  // Create new customer
  const createCustomer = async () => {
    setCreating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setCreateDialogOpen(false);
        setNewCustomer({
          email: "",
          login: { username: "", password: "" },
          name: { first: "", last: "", title: "Mr" },
          gender: "male",
          location: {
            street: { number: 0, name: "" },
            city: "",
            state: "",
            country: "",
            postcode: "",
          },
        });
        fetchCustomers(); // Refresh the list
      } else {
        throw new Error(result.message || "Failed to create customer");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create customer",
      );
    } finally {
      setCreating(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getFullName = (customer: Customer) => {
    return `${customer.name.title} ${customer.name.first} ${customer.name.last}`;
  };

  const getFullAddress = (customer: Customer) => {
    const { street, city, state, country } = customer.location;
    return `${street.number} ${street.name}, ${city}, ${state}, ${country}`;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customers V1 - Card Grid
      </Typography>

      {/* Search and Create Section */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search customers by name, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ minWidth: 140 }}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Customers Grid */}
      {!loading && (
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
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Avatar and Name */}
                  <Stack
                    direction="column"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Avatar
                      src={customer.picture.large}
                      alt={getFullName(customer)}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Typography
                      variant="h6"
                      component="h2"
                      textAlign="center"
                      noWrap
                    >
                      {getFullName(customer)}
                    </Typography>
                    <Chip
                      label={customer.gender}
                      size="small"
                      color={
                        customer.gender === "male" ? "primary" : "secondary"
                      }
                      variant="outlined"
                    />
                  </Stack>

                  {/* Contact Information */}
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                        {customer.email}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" noWrap>
                        {customer.phone}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <LocationIcon
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                        {getFullAddress(customer)}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Age: {customer.dob.age} • Username:{" "}
                      {customer.login.username}
                    </Typography>
                  </Stack>

                  {/* Action Buttons */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No customers found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by adding your first customer"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Customer
          </Button>
        </Box>
      )}

      {/* Create Customer Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Typography variant="subtitle2" color="primary">
              Personal Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>Title</InputLabel>
                <Select
                  value={newCustomer.name.title}
                  label="Title"
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      name: { ...prev.name, title: e.target.value },
                    }))
                  }
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="First Name"
                value={newCustomer.name.first}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    name: { ...prev.name, first: e.target.value },
                  }))
                }
                required
                fullWidth
                size="small"
              />
              <TextField
                label="Last Name"
                value={newCustomer.name.last}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    name: { ...prev.name, last: e.target.value },
                  }))
                }
                required
                fullWidth
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                fullWidth
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newCustomer.gender}
                  label="Gender"
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Login Information */}
            <Typography variant="subtitle2" color="primary">
              Login Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Username"
                value={newCustomer.login.username}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    login: { ...prev.login, username: e.target.value },
                  }))
                }
                required
                fullWidth
                size="small"
              />
              <TextField
                label="Password"
                type="password"
                value={newCustomer.login.password}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    login: { ...prev.login, password: e.target.value },
                  }))
                }
                fullWidth
                size="small"
              />
            </Stack>

            {/* Address Information */}
            <Typography variant="subtitle2" color="primary">
              Address Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Street Number"
                type="number"
                value={newCustomer.location.street.number || ""}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      street: {
                        ...prev.location.street,
                        number: parseInt(e.target.value) || 0,
                      },
                    },
                  }))
                }
                size="small"
                sx={{ width: 120 }}
              />
              <TextField
                label="Street Name"
                value={newCustomer.location.street.name}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      street: { ...prev.location.street, name: e.target.value },
                    },
                  }))
                }
                fullWidth
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={newCustomer.location.city}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))
                }
                fullWidth
                size="small"
              />
              <TextField
                label="State"
                value={newCustomer.location.state}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: { ...prev.location, state: e.target.value },
                  }))
                }
                fullWidth
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Country"
                value={newCustomer.location.country}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }))
                }
                fullWidth
                size="small"
              />
              <TextField
                label="Postal Code"
                value={newCustomer.location.postcode}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    location: { ...prev.location, postcode: e.target.value },
                  }))
                }
                fullWidth
                size="small"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={createCustomer}
            variant="contained"
            disabled={
              creating ||
              !newCustomer.email ||
              !newCustomer.name.first ||
              !newCustomer.name.last
            }
          >
            {creating ? <CircularProgress size={20} /> : "Create Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
