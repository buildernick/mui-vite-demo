import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Checkbox,
  Collapse,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
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
  registered: {
    date: string;
    age: number;
  };
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

export default function CustomersV3() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterGender, setFilterGender] = React.useState("");
  const [filterCountry, setFilterCountry] = React.useState("");
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
      const params = new URLSearchParams();
      params.append("perPage", "30");

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `${API_BASE_URL}/users?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      let filteredData = data.data || [];

      // Apply client-side filters
      if (filterGender) {
        filteredData = filteredData.filter(
          (customer: Customer) => customer.gender === filterGender,
        );
      }

      if (filterCountry) {
        filteredData = filteredData.filter((customer: Customer) =>
          customer.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase()),
        );
      }

      setCustomers(filteredData);

      // If a customer was previously selected, try to find them in the new data
      if (selectedCustomer) {
        const updatedCustomer = filteredData.find(
          (c: Customer) => c.login.uuid === selectedCustomer.login.uuid,
        );
        if (updatedCustomer) {
          setSelectedCustomer(updatedCustomer);
        } else {
          setSelectedCustomer(null);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers",
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

  // Update customer
  const updateCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${editingCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingCustomer.name,
            email: editingCustomer.email,
            location: editingCustomer.location,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSelectedCustomer(editingCustomer);
        setEditingCustomer(null);
        fetchCustomers(); // Refresh the list
      } else {
        throw new Error(result.message || "Failed to update customer");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update customer",
      );
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterGender, filterCountry]);

  const getFullName = (customer: Customer) => {
    return `${customer.name.first} ${customer.name.last}`;
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer(null);
  };

  const startEditing = () => {
    if (selectedCustomer) {
      setEditingCustomer({ ...selectedCustomer });
    }
  };

  const cancelEditing = () => {
    setEditingCustomer(null);
  };

  const currentCustomer = editingCustomer || selectedCustomer;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minHeight: "80vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Customers V3 - Figma Design
      </Typography>

      {/* Customer Profile Section - Top */}
      <Collapse in={Boolean(currentCustomer)} timeout={300}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "2px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          {currentCustomer && (
            <Grid container spacing={3} alignItems="center">
              {/* Avatar */}
              <Grid item>
                <Avatar
                  src={currentCustomer.picture.large}
                  alt={getFullName(currentCustomer)}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid white",
                    boxShadow: 2,
                  }}
                />
              </Grid>

              {/* Customer Name */}
              <Grid item xs>
                <Stack spacing={1}>
                  {editingCustomer ? (
                    <TextField
                      variant="standard"
                      value={`${editingCustomer.name.first} ${editingCustomer.name.last}`}
                      onChange={(e) => {
                        const [first, ...lastParts] = e.target.value.split(" ");
                        setEditingCustomer((prev) =>
                          prev
                            ? {
                                ...prev,
                                name: {
                                  ...prev.name,
                                  first: first || "",
                                  last: lastParts.join(" ") || "",
                                },
                              }
                            : null,
                        );
                      }}
                      sx={{
                        "& input": {
                          fontSize: "2rem",
                          fontWeight: 400,
                          color: "text.primary",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h3"
                      component="h2"
                      sx={{ fontWeight: 400 }}
                    >
                      {getFullName(currentCustomer)}
                    </Typography>
                  )}

                  <Typography variant="body1" color="text.secondary">
                    @{currentCustomer.login.username}
                  </Typography>
                </Stack>
              </Grid>

              {/* Action Buttons */}
              <Grid item>
                <Stack direction="row" spacing={1}>
                  {editingCustomer ? (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={updateCustomer}
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={startEditing}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* Customer Details Form */}
          {currentCustomer && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    value={currentCustomer.email}
                    onChange={(e) =>
                      editingCustomer &&
                      setEditingCustomer((prev) =>
                        prev
                          ? {
                              ...prev,
                              email: e.target.value,
                            }
                          : null,
                      )
                    }
                    disabled={!editingCustomer}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Phone"
                    value={currentCustomer.phone}
                    disabled
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="City"
                    value={currentCustomer.location.city}
                    onChange={(e) =>
                      editingCustomer &&
                      setEditingCustomer((prev) =>
                        prev
                          ? {
                              ...prev,
                              location: {
                                ...prev.location,
                                city: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!editingCustomer}
                    fullWidth
                    size="small"
                  />
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={!editingCustomer}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={currentCustomer.gender}
                      label="Gender"
                      onChange={(e) =>
                        editingCustomer &&
                        setEditingCustomer((prev) =>
                          prev
                            ? {
                                ...prev,
                                gender: e.target.value,
                              }
                            : null,
                        )
                      }
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Country"
                    value={currentCustomer.location.country}
                    onChange={(e) =>
                      editingCustomer &&
                      setEditingCustomer((prev) =>
                        prev
                          ? {
                              ...prev,
                              location: {
                                ...prev.location,
                                country: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!editingCustomer}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="State"
                    value={currentCustomer.location.state}
                    onChange={(e) =>
                      editingCustomer &&
                      setEditingCustomer((prev) =>
                        prev
                          ? {
                              ...prev,
                              location: {
                                ...prev.location,
                                state: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!editingCustomer}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Age"
                    value={`${currentCustomer.dob.age} years old`}
                    disabled
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Postal Code"
                    value={currentCustomer.location.postcode}
                    onChange={(e) =>
                      editingCustomer &&
                      setEditingCustomer((prev) =>
                        prev
                          ? {
                              ...prev,
                              location: {
                                ...prev.location,
                                postcode: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!editingCustomer}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Collapse>

      {/* Filters */}
      <Stack direction="row" spacing={2} alignItems="flex-end">
        <TextField
          placeholder="Search for names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
          size="small"
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Gender Filter</InputLabel>
          <Select
            value={filterGender}
            label="Gender Filter"
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Country Filter</InputLabel>
          <Select
            value={filterCountry}
            label="Country Filter"
            onChange={(e) => setFilterCountry(e.target.value)}
          >
            <MenuItem value="">All Countries</MenuItem>
            <MenuItem value="us">United States</MenuItem>
            <MenuItem value="ca">Canada</MenuItem>
            <MenuItem value="gb">United Kingdom</MenuItem>
            <MenuItem value="au">Australia</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Search
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Error Display */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Customers Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#FAFAFA",
                    fontWeight: 600,
                    borderBottom: "2px solid #AFB1B6",
                  }}
                >
                  Name
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <ArrowDownIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#FAFAFA",
                    fontWeight: 600,
                    borderBottom: "2px solid #AFB1B6",
                  }}
                >
                  Email
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <ArrowDownIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#FAFAFA",
                    fontWeight: 600,
                    borderBottom: "2px solid #AFB1B6",
                  }}
                >
                  Location
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <ArrowDownIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#FAFAFA",
                    fontWeight: 600,
                    borderBottom: "2px solid #AFB1B6",
                  }}
                >
                  Age
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <ArrowDownIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No customers found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {searchTerm || filterGender || filterCountry
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
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.login.uuid}
                    hover
                    selected={
                      selectedCustomer?.login.uuid === customer.login.uuid
                    }
                    onClick={() => handleCustomerSelect(customer)}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": {
                        backgroundColor: "primary.50",
                      },
                    }}
                  >
                    <TableCell sx={{ borderColor: "#AFB1B6" }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={customer.picture.thumbnail}
                          alt={getFullName(customer)}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {getFullName(customer)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#AFB1B6" }}>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#AFB1B6" }}>
                      <Typography variant="body2" color="text.secondary">
                        {customer.location.city}, {customer.location.country}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#AFB1B6" }}>
                      <Typography variant="body2" color="text.secondary">
                        {customer.dob.age}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
