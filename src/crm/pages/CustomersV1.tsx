import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InputAdornment from "@mui/material/InputAdornment";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

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
  registered: {
    date: string;
  };
}

export default function CustomersV1() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    country: "",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users?perPage=20"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.data || []);
      setFilteredCustomers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

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
            location: {
              city: newCustomer.city,
              state: newCustomer.state,
              country: newCustomer.country,
              street: {
                number: 123,
                name: "Main St",
              },
              postcode: "10001",
            },
          }),
        }
      );

      if (response.ok) {
        setCreateDialogOpen(false);
        setNewCustomer({
          email: "",
          firstName: "",
          lastName: "",
          username: "",
          city: "",
          state: "",
          country: "",
        });
        fetchCustomers(); // Refresh the list
      }
    } catch (err) {
      setError("Failed to create customer");
    }
  };

  const getInitials = (name: { first: string; last: string }) => {
    return `${name.first.charAt(0)}${name.last.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Customers V1 - Card Grid
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Customer
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={customer.login.uuid}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Avatar
                    src={customer.picture.large}
                    sx={{ width: 80, height: 80 }}
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                  <Box textAlign="center">
                    <Typography variant="h6" component="h2">
                      {`${customer.name.first} ${customer.name.last}`}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      @{customer.login.username}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {customer.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {customer.location.city}, {customer.location.country}
                    </Typography>
                  </Stack>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Age: ${customer.dob.age}`}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" color="secondary">
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCustomers.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6">No customers found</Typography>
          <Typography variant="body2">
            Try adjusting your search criteria
          </Typography>
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
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={newCustomer.firstName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstName: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={newCustomer.lastName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, lastName: e.target.value })
                }
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Username"
              value={newCustomer.username}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, username: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              fullWidth
              required
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={newCustomer.city}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, city: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="State"
                value={newCustomer.state}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, state: e.target.value })
                }
                fullWidth
              />
            </Stack>
            <TextField
              label="Country"
              value={newCustomer.country}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, country: e.target.value })
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCustomer}
            variant="contained"
            disabled={
              !newCustomer.email ||
              !newCustomer.firstName ||
              !newCustomer.lastName ||
              !newCustomer.username
            }
          >
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
