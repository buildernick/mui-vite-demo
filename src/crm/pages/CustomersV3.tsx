import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
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

export default function CustomersV3() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Editable customer fields
  const [editableCustomer, setEditableCustomer] = React.useState<User | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);
  
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

  const handleCustomerSelect = (customer: User) => {
    setSelectedCustomer(customer);
    setEditableCustomer({ ...customer });
    setHasChanges(false);
  };

  const handleEditableChange = (field: string, value: any) => {
    if (editableCustomer) {
      const keys = field.split('.');
      const newCustomer = { ...editableCustomer };
      
      if (keys.length === 1) {
        (newCustomer as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        (newCustomer as any)[keys[0]][keys[1]] = value;
      } else if (keys.length === 3) {
        (newCustomer as any)[keys[0]][keys[1]][keys[2]] = value;
      }
      
      setEditableCustomer(newCustomer);
      setHasChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editableCustomer || !selectedCustomer) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedCustomer.login.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableCustomer),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: "Customer updated successfully!", severity: "success" });
        setHasChanges(false);
        fetchCustomers(); // Refresh the list
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setSnackbar({ open: true, message: "Failed to update customer", severity: "error" });
    }
  };

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
        fetchCustomers();
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
        Customers v3 - Figma Design
      </Typography>

      <Stack spacing={3}>
        {/* Customer Profile Section - Only show when customer is selected */}
        {selectedCustomer && editableCustomer && (
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              {/* Large Avatar */}
              <Avatar
                src={selectedCustomer.picture.large}
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: "2px solid #AFB1B6"
                }}
              >
                {getCustomerInitials(selectedCustomer)}
              </Avatar>

              {/* Customer Details Form */}
              <Box sx={{ flexGrow: 1 }}>
                {/* Name Header */}
                <Typography variant="h3" sx={{ mb: 3, fontFamily: "Work Sans", fontWeight: 400 }}>
                  {editableCustomer.name.first} {editableCustomer.name.last}
                </Typography>

                {/* Two Column Layout */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack spacing={2}>
                      <TextField
                        placeholder="First Name"
                        value={editableCustomer.name.first}
                        onChange={(e) => handleEditableChange('name.first', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <TextField
                        placeholder="Last Name"
                        value={editableCustomer.name.last}
                        onChange={(e) => handleEditableChange('name.last', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <TextField
                        placeholder="Email"
                        value={editableCustomer.email}
                        onChange={(e) => handleEditableChange('email', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <FormControl size="small">
                        <Select
                          value={editableCustomer.gender}
                          onChange={(e) => handleEditableChange('gender', e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: '8px',
                            border: '2px solid #AFB1B6',
                            backgroundColor: '#fff',
                            fontSize: '12px',
                            fontFamily: 'Work Sans',
                            '& .MuiSelect-select': {
                              padding: '10px 12px',
                            }
                          }}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Stack spacing={2}>
                      <TextField
                        placeholder="Phone"
                        value={editableCustomer.phone}
                        onChange={(e) => handleEditableChange('phone', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <TextField
                        placeholder="City"
                        value={editableCustomer.location.city}
                        onChange={(e) => handleEditableChange('location.city', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <TextField
                        placeholder="State"
                        value={editableCustomer.location.state}
                        onChange={(e) => handleEditableChange('location.state', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                          }
                        }}
                      />
                      <FormControl size="small">
                        <Select
                          value={editableCustomer.location.country}
                          onChange={(e) => handleEditableChange('location.country', e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: '8px',
                            border: '2px solid #AFB1B6',
                            backgroundColor: '#fff',
                            fontSize: '12px',
                            fontFamily: 'Work Sans',
                            '& .MuiSelect-select': {
                              padding: '10px 12px',
                            }
                          }}
                        >
                          <MenuItem value="US">United States</MenuItem>
                          <MenuItem value="CA">Canada</MenuItem>
                          <MenuItem value="UK">United Kingdom</MenuItem>
                          <MenuItem value="DE">Germany</MenuItem>
                          <MenuItem value="FR">France</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Save Button */}
                {hasChanges && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveChanges}
                      sx={{ 
                        backgroundColor: '#3A00E5',
                        '&:hover': { backgroundColor: '#2900CC' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Filters Section */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-end">
            <TextField
              placeholder="Search for names"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                width: 309,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                }
              }}
            />
            
            <Box>
              <Typography variant="caption" sx={{ color: '#61646B', fontSize: '12px', mb: 1, display: 'block' }}>
                Dropdown
              </Typography>
              <FormControl size="small" sx={{ width: 222 }}>
                <Select
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    border: '2px solid #AFB1B6',
                    backgroundColor: '#fff',
                    fontSize: '12px',
                    fontFamily: 'Work Sans',
                    '& .MuiSelect-select': {
                      padding: '10px 12px',
                    }
                  }}
                >
                  <MenuItem value="">Small</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#61646B', fontSize: '12px', mb: 1, display: 'block' }}>
                Dropdown
              </Typography>
              <FormControl size="small" sx={{ width: 240 }}>
                <Select
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    border: '2px solid #AFB1B6',
                    backgroundColor: '#fff',
                    fontSize: '12px',
                    fontFamily: 'Work Sans',
                    '& .MuiSelect-select': {
                      padding: '10px 12px',
                    }
                  }}
                >
                  <MenuItem value="">Small</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3A00E5',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontFamily: 'Work Sans',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#2900CC' }
              }}
              onClick={() => setOpenDialog(true)}
            >
              Search
            </Button>
          </Stack>
        </Paper>

        {/* Customer Table */}
        <Paper sx={{ backgroundColor: '#FAFAFA' }}>
          <TableContainer>
            <Table sx={{ border: '1px solid #AFB1B6' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#FAFAFA' }}>
                  <TableCell 
                    sx={{ 
                      border: '1px solid #AFB1B6',
                      color: '#61646B',
                      fontSize: '14px',
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      padding: '10px',
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      Name
                      <ArrowDownIcon sx={{ color: '#61646B' }} />
                    </Stack>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      border: '1px solid #AFB1B6',
                      color: '#61646B',
                      fontSize: '14px',
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      padding: '10px',
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      Email
                      <ArrowDownIcon sx={{ color: '#61646B' }} />
                    </Stack>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      border: '1px solid #AFB1B6',
                      color: '#61646B',
                      fontSize: '14px',
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      padding: '10px',
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      Location
                      <ArrowDownIcon sx={{ color: '#61646B' }} />
                    </Stack>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      border: '1px solid #AFB1B6',
                      color: '#61646B',
                      fontSize: '14px',
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      padding: '10px',
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      Age
                      <ArrowDownIcon sx={{ color: '#61646B' }} />
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <TableRow 
                    key={customer.login.uuid}
                    hover
                    sx={{ 
                      cursor: "pointer",
                      backgroundColor: selectedCustomer?.login.uuid === customer.login.uuid ? '#e3f2fd' : 'transparent',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <TableCell 
                      sx={{ 
                        border: '1px solid #AFB1B6',
                        color: '#61646B',
                        fontSize: '14px',
                        fontFamily: 'Work Sans',
                        padding: '10px',
                      }}
                    >
                      {customer.name.first} {customer.name.last}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        border: '1px solid #AFB1B6',
                        color: '#61646B',
                        fontSize: '14px',
                        fontFamily: 'Work Sans',
                        padding: '10px',
                      }}
                    >
                      {customer.email}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        border: '1px solid #AFB1B6',
                        color: '#61646B',
                        fontSize: '14px',
                        fontFamily: 'Work Sans',
                        padding: '10px',
                      }}
                    >
                      {customer.location.city}, {customer.location.country}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        border: '1px solid #AFB1B6',
                        color: '#61646B',
                        fontSize: '14px',
                        fontFamily: 'Work Sans',
                        padding: '10px',
                      }}
                    >
                      {customer.dob.age}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Empty rows to match the design */}
                {Array.from({ length: Math.max(0, 3 - filteredCustomers.length) }).map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell sx={{ border: '1px solid #AFB1B6', color: '#61646B', fontSize: '14px', fontFamily: 'Work Sans', padding: '10px' }}>----</TableCell>
                    <TableCell sx={{ border: '1px solid #AFB1B6', color: '#61646B', fontSize: '14px', fontFamily: 'Work Sans', padding: '10px' }}>----</TableCell>
                    <TableCell sx={{ border: '1px solid #AFB1B6', color: '#61646B', fontSize: '14px', fontFamily: 'Work Sans', padding: '10px' }}>----</TableCell>
                    <TableCell sx={{ border: '1px solid #AFB1B6', color: '#61646B', fontSize: '14px', fontFamily: 'Work Sans', padding: '10px' }}>----</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

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
              <TextField
                label="Country"
                value={newCustomer.country}
                onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
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
