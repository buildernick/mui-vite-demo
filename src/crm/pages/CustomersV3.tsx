import * as React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Add as AddIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

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
    city: string;
    state: string;
    country: string;
    street: {
      number: number;
      name: string;
    };
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
  gender: string;
}

interface NewCustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  gender: string;
}

export default function CustomersV3() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [profileExpanded, setProfileExpanded] = React.useState(false);
  const [activeCustomer, setActiveCustomer] = React.useState<Customer | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [editData, setEditData] = React.useState<Partial<Customer>>({});
  const [filterDropdown1, setFilterDropdown1] = React.useState("");
  const [filterDropdown2, setFilterDropdown2] = React.useState("");
  const [newCustomer, setNewCustomer] = React.useState<NewCustomerData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    gender: "",
  });

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?perPage=30&search=${searchTerm}`
      );
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = React.useMemo(
    () => {
      const timeoutId = setTimeout(() => {
        fetchCustomers();
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [searchTerm]
  );

  React.useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSelectCustomer = (customer: Customer) => {
    const customerId = customer.login.uuid;
    const isAlreadySelected = selectedCustomers.includes(customerId);
    
    if (isAlreadySelected) {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
      if (activeCustomer?.login.uuid === customerId) {
        setActiveCustomer(null);
        setProfileExpanded(false);
        setEditMode(false);
      }
    } else {
      setSelectedCustomers((prev) => [...prev, customerId]);
      setActiveCustomer(customer);
      setProfileExpanded(true);
      setEditMode(false);
      setEditData(customer);
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setEditData(activeCustomer || {});
  };

  const handleSaveProfile = async () => {
    if (!activeCustomer || !editData) return;

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${activeCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editData.name,
            email: editData.email,
            phone: editData.phone,
            location: editData.location,
          }),
        }
      );

      if (response.ok) {
        setEditMode(false);
        fetchCustomers();
        // Update active customer
        setActiveCustomer({ ...activeCustomer, ...editData } as Customer);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(activeCustomer || {});
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
              username: newCustomer.email.split("@")[0],
              password: "temppassword",
            },
            name: {
              first: newCustomer.firstName,
              last: newCustomer.lastName,
              title: "Mr",
            },
            phone: newCustomer.phone,
            gender: newCustomer.gender,
            location: {
              city: newCustomer.city,
              state: newCustomer.state,
              country: newCustomer.country,
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
          phone: "",
          city: "",
          state: "",
          country: "",
          gender: "",
        });
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      !searchTerm ||
      customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers v3
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Customer
        </Button>
      </Box>

      {/* Customer Profile Panel */}
      <Collapse in={profileExpanded && activeCustomer !== null}>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: "#fafafa" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={activeCustomer?.picture?.large}
                sx={{ width: 120, height: 120 }}
              >
                {activeCustomer && getInitials(activeCustomer.name.first, activeCustomer.name.last)}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {editMode ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        size="small"
                        value={editData.name?.first || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: { ...editData.name!, first: e.target.value },
                          })
                        }
                        placeholder="First Name"
                      />
                      <TextField
                        size="small"
                        value={editData.name?.last || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: { ...editData.name!, last: e.target.value },
                          })
                        }
                        placeholder="Last Name"
                      />
                    </Box>
                  ) : (
                    `${activeCustomer?.name.first} ${activeCustomer?.name.last}`
                  )}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {editMode ? (
                <>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={handleEditProfile}
                >
                  Edit
                </Button>
              )}
              <IconButton
                onClick={() => {
                  setProfileExpanded(false);
                  setSelectedCustomers([]);
                  setActiveCustomer(null);
                  setEditMode(false);
                }}
              >
                <ExpandLessIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email"
                  fullWidth
                  value={editMode ? editData.email || "" : activeCustomer?.email || ""}
                  onChange={(e) => editMode && setEditData({ ...editData, email: e.target.value })}
                  disabled={!editMode}
                  size="small"
                />
                <TextField
                  label="Phone"
                  fullWidth
                  value={editMode ? editData.phone || "" : activeCustomer?.phone || ""}
                  onChange={(e) => editMode && setEditData({ ...editData, phone: e.target.value })}
                  disabled={!editMode}
                  size="small"
                />
                <TextField
                  label="City"
                  fullWidth
                  value={editMode ? editData.location?.city || "" : activeCustomer?.location.city || ""}
                  onChange={(e) =>
                    editMode &&
                    setEditData({
                      ...editData,
                      location: { ...editData.location!, city: e.target.value },
                    })
                  }
                  disabled={!editMode}
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>State</InputLabel>
                  <Select
                    value={editMode ? editData.location?.state || "" : activeCustomer?.location.state || ""}
                    label="State"
                    onChange={(e) =>
                      editMode &&
                      setEditData({
                        ...editData,
                        location: { ...editData.location!, state: e.target.value },
                      })
                    }
                    disabled={!editMode}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    <MenuItem value="CA">California</MenuItem>
                    <MenuItem value="NY">New York</MenuItem>
                    <MenuItem value="TX">Texas</MenuItem>
                    <MenuItem value="FL">Florida</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Country"
                  fullWidth
                  value={editMode ? editData.location?.country || "" : activeCustomer?.location.country || ""}
                  onChange={(e) =>
                    editMode &&
                    setEditData({
                      ...editData,
                      location: { ...editData.location!, country: e.target.value },
                    })
                  }
                  disabled={!editMode}
                  size="small"
                />
                <TextField
                  label="Cell Phone"
                  fullWidth
                  value={editMode ? editData.cell || "" : activeCustomer?.cell || ""}
                  onChange={(e) => editMode && setEditData({ ...editData, cell: e.target.value })}
                  disabled={!editMode}
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={editMode ? editData.gender || "" : activeCustomer?.gender || ""}
                    label="Gender"
                    onChange={(e) => editMode && setEditData({ ...editData, gender: e.target.value })}
                    disabled={!editMode}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Age Range</InputLabel>
                  <Select
                    value={
                      activeCustomer?.dob.age
                        ? activeCustomer.dob.age < 30
                          ? "18-30"
                          : activeCustomer.dob.age < 50
                          ? "31-50"
                          : "50+"
                        : ""
                    }
                    label="Age Range"
                    disabled
                  >
                    <MenuItem value="18-30">18-30</MenuItem>
                    <MenuItem value="31-50">31-50</MenuItem>
                    <MenuItem value="50+">50+</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search for names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Dropdown</InputLabel>
          <Select
            value={filterDropdown1}
            label="Dropdown"
            onChange={(e) => setFilterDropdown1(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Dropdown</InputLabel>
          <Select
            value={filterDropdown2}
            label="Dropdown"
            onChange={(e) => setFilterDropdown2(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small">
          Search
        </Button>
      </Box>

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#61646B" }}>
                Header
                <ExpandMoreIcon sx={{ fontSize: 16, ml: 1 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#61646B" }}>
                Header
                <ExpandMoreIcon sx={{ fontSize: 16, ml: 1 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#61646B" }}>
                Header
                <ExpandMoreIcon sx={{ fontSize: 16, ml: 1 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#61646B" }}>
                Header
                <ExpandMoreIcon sx={{ fontSize: 16, ml: 1 }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  selected={selectedCustomers.includes(customer.login.uuid)}
                  hover
                  onClick={() => handleSelectCustomer(customer)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ color: "#61646B" }}>
                    {customer.name.first} {customer.name.last}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B" }}>
                    {customer.email}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B" }}>
                    {customer.location.city}, {customer.location.country}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B" }}>
                    {customer.phone}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Customer Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="First Name"
              fullWidth
              value={newCustomer.firstName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              value={newCustomer.lastName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, lastName: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <TextField
              label="Phone"
              fullWidth
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newCustomer.gender}
                label="Gender"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, gender: e.target.value })
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="City"
              fullWidth
              value={newCustomer.city}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, city: e.target.value })
              }
            />
            <TextField
              label="State"
              fullWidth
              value={newCustomer.state}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, state: e.target.value })
              }
            />
            <TextField
              label="Country"
              fullWidth
              value={newCustomer.country}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, country: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCustomer}
            variant="contained"
            disabled={!newCustomer.email || !newCustomer.firstName || !newCustomer.lastName}
          >
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
