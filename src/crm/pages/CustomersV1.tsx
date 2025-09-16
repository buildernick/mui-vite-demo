import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";

interface Customer {
  login: {
    uuid: string;
    username: string;
    password: string;
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

export default function CustomersV1() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    email: "",
    login: {
      username: "",
      password: "",
    },
    name: {
      first: "",
      last: "",
      title: "Mr",
    },
    gender: "male",
    location: {
      street: {
        number: 0,
        name: "",
      },
      city: "",
      state: "",
      country: "",
      postcode: "",
    },
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users?perPage=20"
      );
      const data = await response.json();
      setCustomers(data.data || []);
      setFilteredCustomers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.name.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        }
      );

      if (response.ok) {
        setCreateDialogOpen(false);
        fetchCustomers(); // Refresh the list
        // Reset form
        setNewCustomer({
          email: "",
          login: {
            username: "",
            password: "",
          },
          name: {
            first: "",
            last: "",
            title: "Mr",
          },
          gender: "male",
          location: {
            street: {
              number: 0,
              name: "",
            },
            city: "",
            state: "",
            country: "",
            postcode: "",
          },
        });
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchCustomers(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Loading customers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Customers v1 - Card Grid
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Customer
        </Button>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search customers by name, email, or city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid item xs={12} sm={6} md={4} key={customer.login.uuid}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar 
                    src={customer.picture.medium} 
                    alt={`${customer.name.first} ${customer.name.last}`}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6" component="h2">
                      {customer.name.first} {customer.name.last}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.email}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {customer.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {customer.location.city}, {customer.location.country}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Age:</strong> {customer.dob.age}
                  </Typography>
                  <Chip 
                    label={customer.gender} 
                    size="small" 
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  />
                </Stack>
              </CardContent>

              <CardActions>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDeleteCustomer(customer.login.uuid)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCustomers.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No customers found
          </Typography>
        </Box>
      )}

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={newCustomer.name.first}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                name: { ...newCustomer.name, first: e.target.value }
              })}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={newCustomer.name.last}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                name: { ...newCustomer.name, last: e.target.value }
              })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Username"
              value={newCustomer.login.username}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                login: { ...newCustomer.login, username: e.target.value }
              })}
              fullWidth
              required
            />
            <TextField
              label="City"
              value={newCustomer.location.city}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                location: { ...newCustomer.location, city: e.target.value }
              })}
              fullWidth
            />
            <TextField
              label="Country"
              value={newCustomer.location.country}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                location: { ...newCustomer.location, country: e.target.value }
              })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateCustomer} 
            variant="contained"
            disabled={!newCustomer.name.first || !newCustomer.name.last || !newCustomer.email || !newCustomer.login.username}
          >
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
