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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

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

export default function CustomersV3() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editableCustomer, setEditableCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users?perPage=30"
      );
      const data = await response.json();
      setCustomers(data.data || []);
      setFilteredCustomers(data.data || []);
      // Select first customer by default
      if (data.data?.length > 0) {
        setSelectedCustomer(data.data[0]);
        setEditableCustomer({ ...data.data[0] });
      }
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
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditableCustomer({ ...customer });
  };

  const handleRowSelection = (customerId: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(customerId);
    } else {
      newSelection.delete(customerId);
    }
    setSelectedRows(newSelection);

    // If only one row is selected, show that customer's profile
    if (newSelection.size === 1) {
      const selectedId = Array.from(newSelection)[0];
      const customer = customers.find(c => c.login.uuid === selectedId);
      if (customer) {
        handleCustomerSelect(customer);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredCustomers.map(c => c.login.uuid)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const updateCustomerField = (field: string, value: any) => {
    if (!editableCustomer) return;

    const keys = field.split('.');
    const updatedCustomer = { ...editableCustomer };
    
    let current: any = updatedCustomer;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setEditableCustomer(updatedCustomer);
  };

  const handleSaveCustomer = async () => {
    if (!editableCustomer) return;

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${editableCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableCustomer),
        }
      );

      if (response.ok) {
        // Update local state
        setCustomers(customers.map(c => 
          c.login.uuid === editableCustomer.login.uuid ? editableCustomer : c
        ));
        setSelectedCustomer(editableCustomer);
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  const isAllSelected = filteredCustomers.length > 0 && 
    filteredCustomers.every(c => selectedRows.has(c.login.uuid));
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < filteredCustomers.length;

  if (loading) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
        <Typography variant="h4" component="h1">
          Loading customers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Customers v3 - Figma Design
      </Typography>

      {/* Customer Profile Section */}
      {editableCustomer && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={3} alignItems="flex-start">
            {/* Avatar */}
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={editableCustomer.picture.large}
                alt={`${editableCustomer.name.first} ${editableCustomer.name.last}`}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: "auto", 
                  mb: 2,
                  border: "2px solid #AFB1B6"
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </Box>

            {/* Customer Details Form */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 3, fontFamily: "Work Sans", fontWeight: 400 }}>
                {editableCustomer.name.first} {editableCustomer.name.last}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <TextField
                      placeholder="First Name"
                      value={editableCustomer.name.first}
                      onChange={(e) => updateCustomerField("name.first", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="Last Name"
                      value={editableCustomer.name.last}
                      onChange={(e) => updateCustomerField("name.last", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="Email"
                      value={editableCustomer.email}
                      onChange={(e) => updateCustomerField("email", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <FormControl size="small">
                      <Select
                        value={editableCustomer.gender}
                        onChange={(e) => updateCustomerField("gender", e.target.value)}
                        sx={{
                          backgroundColor: "#FFF",
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                            borderWidth: "2px",
                          },
                        }}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <TextField
                      placeholder="Phone"
                      value={editableCustomer.phone}
                      onChange={(e) => updateCustomerField("phone", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="City"
                      value={editableCustomer.location.city}
                      onChange={(e) => updateCustomerField("location.city", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="Country"
                      value={editableCustomer.location.country}
                      onChange={(e) => updateCustomerField("location.country", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFF",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                          },
                        },
                      }}
                    />
                    <FormControl size="small">
                      <Select
                        value={editableCustomer.location.state || ""}
                        onChange={(e) => updateCustomerField("location.state", e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: "#FFF",
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "#AFB1B6",
                            borderWidth: "2px",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select State</em>
                        </MenuItem>
                        <MenuItem value="CA">California</MenuItem>
                        <MenuItem value="NY">New York</MenuItem>
                        <MenuItem value="TX">Texas</MenuItem>
                        <MenuItem value="FL">Florida</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                onClick={handleSaveCustomer}
                sx={{ 
                  mt: 3,
                  backgroundColor: "#3A00E5",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontFamily: "Work Sans",
                  fontWeight: 500,
                  fontSize: "12px",
                  px: 3,
                  py: 1,
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Search and Filters */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          placeholder="Search for names"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: 309,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": {
                borderColor: "#AFB1B6",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#AFB1B6" }} />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ fontSize: "12px", color: "#61646B" }}>Dropdown</InputLabel>
          <Select
            label="Dropdown"
            defaultValue="small"
            sx={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#AFB1B6",
                borderWidth: "2px",
              },
            }}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ fontSize: "12px", color: "#61646B" }}>Dropdown</InputLabel>
          <Select
            label="Dropdown"
            defaultValue="small"
            sx={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#AFB1B6",
                borderWidth: "2px",
              },
            }}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3A00E5",
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "12px",
            px: 3,
            py: 1,
          }}
        >
          Search
        </Button>
      </Stack>

      {/* Customer Table */}
      <TableContainer component={Paper} sx={{ border: "1px solid #AFB1B6" }}>
        <Table sx={{ "& .MuiTableCell-root": { border: "1px solid #AFB1B6" } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
              <TableCell padding="checkbox" sx={{ backgroundColor: "#FAFAFA" }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell sx={{ 
                backgroundColor: "#FAFAFA", 
                fontFamily: "Work Sans",
                fontSize: "14px",
                fontWeight: 500,
                color: "#61646B"
              }}>
                Header
              </TableCell>
              <TableCell sx={{ 
                backgroundColor: "#FAFAFA", 
                fontFamily: "Work Sans",
                fontSize: "14px",
                fontWeight: 500,
                color: "#61646B"
              }}>
                Header
              </TableCell>
              <TableCell sx={{ 
                backgroundColor: "#FAFAFA", 
                fontFamily: "Work Sans",
                fontSize: "14px",
                fontWeight: 500,
                color: "#61646B"
              }}>
                Header
              </TableCell>
              <TableCell sx={{ 
                backgroundColor: "#FAFAFA", 
                fontFamily: "Work Sans",
                fontSize: "14px",
                fontWeight: 500,
                color: "#61646B"
              }}>
                Header
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow 
                key={customer.login.uuid}
                hover
                selected={selectedRows.has(customer.login.uuid)}
                onClick={() => handleCustomerSelect(customer)}
                sx={{ 
                  cursor: "pointer",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(58, 0, 229, 0.08)",
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.has(customer.login.uuid)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowSelection(customer.login.uuid, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontFamily: "Work Sans",
                  fontSize: "14px",
                  color: "#61646B"
                }}>
                  {customer.name.first} {customer.name.last}
                </TableCell>
                <TableCell sx={{ 
                  fontFamily: "Work Sans",
                  fontSize: "14px",
                  color: "#61646B"
                }}>
                  {customer.email}
                </TableCell>
                <TableCell sx={{ 
                  fontFamily: "Work Sans",
                  fontSize: "14px",
                  color: "#61646B"
                }}>
                  {customer.location.city}
                </TableCell>
                <TableCell sx={{ 
                  fontFamily: "Work Sans",
                  fontSize: "14px",
                  color: "#61646B"
                }}>
                  {customer.phone}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCustomers.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No customers found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
