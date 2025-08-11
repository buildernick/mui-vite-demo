import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Grid,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface User {
  login: {
    uuid: string;
    username: string;
    password?: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
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
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface NewCustomer {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  streetNumber: string;
  streetName: string;
  postcode: string;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function CustomersV1() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  const [newCustomer, setNewCustomer] = React.useState<NewCustomer>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    title: "Mr",
    gender: "male",
    city: "",
    state: "",
    country: "",
    streetNumber: "",
    streetName: "",
    postcode: "",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users?perPage=50`);
      const data = await response.json();
      setCustomers(data.data || []);
      setFilteredCustomers(data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setSnackbar({ open: true, message: "Failed to fetch customers", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleCreateCustomer = async () => {
    try {
      setCreating(true);
      const customerData = {
        email: newCustomer.email,
        login: {
          username: newCustomer.username,
          password: "defaultpassword123"
        },
        name: {
          first: newCustomer.firstName,
          last: newCustomer.lastName,
          title: newCustomer.title
        },
        gender: newCustomer.gender,
        location: {
          street: {
            number: parseInt(newCustomer.streetNumber) || 123,
            name: newCustomer.streetName || "Main St"
          },
          city: newCustomer.city,
          state: newCustomer.state,
          country: newCustomer.country,
          postcode: newCustomer.postcode
        }
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: "Customer created successfully!", severity: "success" });
        setOpenDialog(false);
        setNewCustomer({
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          title: "Mr",
          gender: "male",
          city: "",
          state: "",
          country: "",
          streetNumber: "",
          streetName: "",
          postcode: "",
        });
        fetchCustomers(); // Refresh the list
      } else {
        throw new Error("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      setSnackbar({ open: true, message: "Failed to create customer", severity: "error" });
    } finally {
      setCreating(false);
    }
  };

  const getCustomerInitials = (customer: User) => {
    return `${customer.name.first.charAt(0)}${customer.name.last.charAt(0)}`.toUpperCase();
  };

  const formatAddress = (location: User['location']) => {
    return `${location.street.number} ${location.street.name}, ${location.city}, ${location.state}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customers v1 - Cards View
      </Typography>

      {/* Search and Actions Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Customer Cards Grid */}
      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={customer.login.uuid}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={customer.picture.thumbnail}
                      sx={{ width: 48, height: 48 }}
                    >
                      {getCustomerInitials(customer)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {customer.name.title} {customer.name.first} {customer.name.last}
                      </Typography>
                      <Chip 
                        label={customer.gender} 
                        size="small" 
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                  </Box>
                  
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {customer.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {customer.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {customer.location.city}, {customer.location.country}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Typography variant="caption" color="text.secondary">
                    Age: {customer.dob.age} • Registered: {new Date(customer.registered.date).getFullYear()}
                  </Typography>
                </Stack>
              </CardContent>
              
              <CardActions>
                <Button size="small" variant="outlined" fullWidth>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCustomers.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? "No customers found" : "No customers yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? "Try adjusting your search criteria" : "Add your first customer to get started"}
          </Typography>
        </Box>
      )}

      {/* Create Customer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Title</InputLabel>
                <Select
                  value={newCustomer.title}
                  label="Title"
                  onChange={(e) => setNewCustomer({ ...newCustomer, title: e.target.value })}
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="First Name"
                value={newCustomer.firstName}
                onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={newCustomer.lastName}
                onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                required
                fullWidth
              />
            </Stack>
            
            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Username"
                value={newCustomer.username}
                onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                required
                fullWidth
              />
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newCustomer.gender}
                label="Gender"
                onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Street Number"
                value={newCustomer.streetNumber}
                onChange={(e) => setNewCustomer({ ...newCustomer, streetNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Street Name"
                value={newCustomer.streetName}
                onChange={(e) => setNewCustomer({ ...newCustomer, streetName: e.target.value })}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                fullWidth
              />
              <TextField
                label="State"
                value={newCustomer.state}
                onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Country"
                value={newCustomer.country}
                onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                fullWidth
              />
              <TextField
                label="Postcode"
                value={newCustomer.postcode}
                onChange={(e) => setNewCustomer({ ...newCustomer, postcode: e.target.value })}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateCustomer} 
            variant="contained"
            disabled={creating || !newCustomer.email || !newCustomer.firstName || !newCustomer.lastName}
          >
            {creating ? <CircularProgress size={20} /> : "Create Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
