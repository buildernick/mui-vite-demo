import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";

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

export default function CustomersV3() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  });
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
        "https://user-api.builder-io.workers.dev/api/users?perPage=50"
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
    applyFilters();
  }, [searchTerm, countryFilter, ageFilter, customers]);

  const applyFilters = () => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = !countryFilter || customer.location.country === countryFilter;

      const matchesAge = !ageFilter || 
        (ageFilter === "under30" && customer.dob.age < 30) ||
        (ageFilter === "30to50" && customer.dob.age >= 30 && customer.dob.age <= 50) ||
        (ageFilter === "over50" && customer.dob.age > 50);

      return matchesSearch && matchesCountry && matchesAge;
    });

    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditableProfile({
      firstName: customer.name.first,
      lastName: customer.name.last,
      email: customer.email,
      phone: customer.phone,
      city: customer.location.city,
      state: customer.location.state,
      country: customer.location.country,
    });
    setEditMode(false);
  };

  const handleSaveProfile = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${selectedCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: {
              first: editableProfile.firstName,
              last: editableProfile.lastName,
            },
            email: editableProfile.email,
            phone: editableProfile.phone,
            location: {
              city: editableProfile.city,
              state: editableProfile.state,
              country: editableProfile.country,
            },
          }),
        }
      );

      if (response.ok) {
        setEditMode(false);
        fetchCustomers(); // Refresh data
      }
    } catch (err) {
      setError("Failed to update customer");
    }
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
        fetchCustomers();
      }
    } catch (err) {
      setError("Failed to create customer");
    }
  };

  const getInitials = (name: { first: string; last: string }) => {
    return `${name.first.charAt(0)}${name.last.charAt(0)}`.toUpperCase();
  };

  const countries = Array.from(new Set(customers.map(c => c.location.country)));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers V3 - Figma Design
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

      {/* Customer Profile Section */}
      {selectedCustomer && (
        <Card sx={{ mb: 4, p: 3, border: "9px solid hsl(220, 20%, 35%)" }}>
          <CardContent>
            <Stack direction="row" alignItems="flex-start" spacing={3}>
              <Avatar
                src={selectedCustomer.picture.large}
                sx={{ width: 120, height: 120 }}
              >
                {getInitials(selectedCustomer.name)}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                  <Typography variant="h4" component="h2">
                    {`${selectedCustomer.name.first} ${selectedCustomer.name.last}`}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => setEditMode(!editMode)} color="primary">
                      <EditIcon />
                    </IconButton>
                    {editMode && (
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                      >
                        Save
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <TextField
                        label="First Name"
                        value={editableProfile.firstName}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, firstName: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <TextField
                        label="Last Name"
                        value={editableProfile.lastName}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, lastName: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <TextField
                        label="Email"
                        value={editableProfile.email}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, email: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <FormControl fullWidth disabled={!editMode}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={editableProfile.country}
                          label="Country"
                          onChange={(e) =>
                            setEditableProfile({ ...editableProfile, country: e.target.value })
                          }
                          variant={editMode ? "outlined" : "filled"}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <TextField
                        label="Phone"
                        value={editableProfile.phone}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, phone: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <TextField
                        label="City"
                        value={editableProfile.city}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, city: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <TextField
                        label="State"
                        value={editableProfile.state}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, state: e.target.value })
                        }
                        fullWidth
                        disabled={!editMode}
                        variant={editMode ? "outlined" : "filled"}
                      />
                      <FormControl fullWidth disabled={!editMode}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value="active"
                          label="Status"
                          variant={editMode ? "outlined" : "filled"}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search for names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={countryFilter}
            label="Country"
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Age</InputLabel>
          <Select
            value={ageFilter}
            label="Age"
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="under30">Under 30</MenuItem>
            <MenuItem value="30to50">30-50</MenuItem>
            <MenuItem value="over50">Over 50</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small">
          Search
        </Button>
      </Stack>

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>
                <TableSortLabel>Name</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Email</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Phone</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Location</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.login.uuid}
                onClick={() => handleCustomerSelect(customer)}
                sx={{
                  cursor: "pointer",
                  bgcolor: selectedCustomer?.login.uuid === customer.login.uuid ? "primary.50" : "inherit",
                  "&:hover": {
                    bgcolor: "grey.50",
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={customer.picture.thumbnail} sx={{ width: 32, height: 32 }}>
                      {getInitials(customer.name)}
                    </Avatar>
                    <Typography variant="body2">
                      {`${customer.name.first} ${customer.name.last}`}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {customer.location.city}, {customer.location.country}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCustomers.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6">No customers found</Typography>
          <Typography variant="body2">
            Try adjusting your search criteria or add a new customer
          </Typography>
        </Box>
      )}

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={newCustomer.firstName}
                onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={newCustomer.lastName}
                onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Username"
              value={newCustomer.username}
              onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
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
            <TextField
              label="Country"
              value={newCustomer.country}
              onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCustomer}
            variant="contained"
            disabled={!newCustomer.email || !newCustomer.firstName || !newCustomer.lastName || !newCustomer.username}
          >
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
