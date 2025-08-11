import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Avatar,
  Checkbox,
  Tabs,
  Tab,
  Badge,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ViewList as ViewListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
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

interface SavedView {
  id: string;
  name: string;
  filters: {
    search: string;
    country: string;
    gender: string;
    ageRange: string;
  };
  isDefault: boolean;
  isStarred: boolean;
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

const defaultViews: SavedView[] = [
  { id: "all", name: "All contacts", filters: { search: "", country: "", gender: "", ageRange: "" }, isDefault: true, isStarred: false },
  { id: "us", name: "US contacts", filters: { search: "", country: "US", gender: "", ageRange: "" }, isDefault: false, isStarred: true },
  { id: "young", name: "Young professionals", filters: { search: "", country: "", gender: "", ageRange: "20-35" }, isDefault: false, isStarred: false },
];

export default function CustomersV2() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  
  // Filter states
  const [countryFilter, setCountryFilter] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("");
  const [ageRangeFilter, setAgeRangeFilter] = React.useState("");
  
  // View management
  const [savedViews, setSavedViews] = React.useState<SavedView[]>(defaultViews);
  const [currentView, setCurrentView] = React.useState("all");
  const [saveViewDialog, setSaveViewDialog] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");
  
  // Dialog states
  const [openDialog, setOpenDialog] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Menu states
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCustomerId, setMenuCustomerId] = React.useState<string | null>(null);
  
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
      const response = await fetch(`${API_BASE_URL}/users?perPage=100`);
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
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (countryFilter) {
      filtered = filtered.filter(customer => customer.nat === countryFilter);
    }

    if (genderFilter) {
      filtered = filtered.filter(customer => customer.gender === genderFilter);
    }

    if (ageRangeFilter) {
      const [min, max] = ageRangeFilter.split("-").map(Number);
      filtered = filtered.filter(customer => customer.dob.age >= min && customer.dob.age <= max);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, countryFilter, genderFilter, ageRangeFilter, customers]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(customer => customer.login.uuid);
      setSelectedCustomers(newSelected);
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    const selectedIndex = selectedCustomers.indexOf(customerId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCustomers, customerId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCustomers.slice(1));
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelected = newSelected.concat(selectedCustomers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1),
      );
    }

    setSelectedCustomers(newSelected);
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

  const handleSaveView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: {
        search: searchTerm,
        country: countryFilter,
        gender: genderFilter,
        ageRange: ageRangeFilter,
      },
      isDefault: false,
      isStarred: false,
    };
    setSavedViews([...savedViews, newView]);
    setSaveViewDialog(false);
    setNewViewName("");
    setSnackbar({ open: true, message: "View saved successfully!", severity: "success" });
  };

  const handleLoadView = (view: SavedView) => {
    setCurrentView(view.id);
    setSearchTerm(view.filters.search);
    setCountryFilter(view.filters.country);
    setGenderFilter(view.filters.gender);
    setAgeRangeFilter(view.filters.ageRange);
  };

  const handleStarView = (viewId: string) => {
    setSavedViews(savedViews.map(view => 
      view.id === viewId ? { ...view, isStarred: !view.isStarred } : view
    ));
  };

  const getCustomerInitials = (customer: User) => {
    return `${customer.name.first.charAt(0)}${customer.name.last.charAt(0)}`.toUpperCase();
  };

  const uniqueCountries = Array.from(new Set(customers.map(customer => customer.nat)));
  const currentPageCustomers = filteredCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const isSelected = (id: string) => selectedCustomers.indexOf(id) !== -1;

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
        Customers v2 - HubSpot Style
      </Typography>

      {/* Views Section */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Views</Typography>
            <Button
              size="small"
              startIcon={<SaveIcon />}
              onClick={() => setSaveViewDialog(true)}
            >
              Save current filters as view
            </Button>
          </Stack>
          
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {savedViews.map((view) => (
              <Chip
                key={view.id}
                label={view.name}
                variant={currentView === view.id ? "filled" : "outlined"}
                color={currentView === view.id ? "primary" : "default"}
                onClick={() => handleLoadView(view)}
                onDelete={view.isDefault ? undefined : () => {
                  setSavedViews(savedViews.filter(v => v.id !== view.id));
                }}
                icon={view.isStarred ? (
                  <StarIcon 
                    sx={{ fontSize: 16 }} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarView(view.id);
                    }}
                  />
                ) : (
                  <StarBorderIcon 
                    sx={{ fontSize: 16 }} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarView(view.id);
                    }}
                  />
                )}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              placeholder="Search contacts..."
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
              Add Contact
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={countryFilter}
                label="Country"
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <MenuItem value="">All Countries</MenuItem>
                {uniqueCountries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={genderFilter}
                label="Gender"
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <MenuItem value="">All Genders</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Age Range</InputLabel>
              <Select
                value={ageRangeFilter}
                label="Age Range"
                onChange={(e) => setAgeRangeFilter(e.target.value)}
              >
                <MenuItem value="">All Ages</MenuItem>
                <MenuItem value="18-25">18-25</MenuItem>
                <MenuItem value="26-35">26-35</MenuItem>
                <MenuItem value="36-45">36-45</MenuItem>
                <MenuItem value="46-60">46-60</MenuItem>
                <MenuItem value="60-100">60+</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || countryFilter || genderFilter || ageRangeFilter) && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setCountryFilter("");
                  setGenderFilter("");
                  setAgeRangeFilter("");
                  setCurrentView("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Actions Bar */}
      {selectedCustomers.length > 0 && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              {selectedCustomers.length} contact{selectedCustomers.length !== 1 ? 's' : ''} selected
            </Typography>
            <Button size="small" startIcon={<EmailIcon />}>
              Send Email
            </Button>
            <Button size="small" startIcon={<DeleteIcon />} color="error">
              Delete
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Customer Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < currentPageCustomers.length}
                    checked={currentPageCustomers.length > 0 && selectedCustomers.length === currentPageCustomers.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageCustomers.map((customer) => {
                const isItemSelected = isSelected(customer.login.uuid);
                
                return (
                  <TableRow
                    key={customer.login.uuid}
                    hover
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleSelectCustomer(customer.login.uuid)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={customer.picture.thumbnail}
                          sx={{ width: 32, height: 32 }}
                        >
                          {getCustomerInitials(customer)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {customer.name.title} {customer.name.first} {customer.name.last}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{customer.login.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.location.city}, {customer.location.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.location.country}
                      </Typography>
                    </TableCell>
                    <TableCell>{customer.dob.age}</TableCell>
                    <TableCell>
                      {new Date(customer.registered.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                          setMenuCustomerId(customer.login.uuid);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredCustomers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {/* Customer Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Contact
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EmailIcon sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Contact
        </MenuItem>
      </Menu>

      {/* Save View Dialog */}
      <Dialog open={saveViewDialog} onClose={() => setSaveViewDialog(false)}>
        <DialogTitle>Save Current View</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            fullWidth
            variant="outlined"
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveViewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveView}
            variant="contained"
            disabled={!newViewName.trim()}
          >
            Save View
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Customer Dialog - Same as V1 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Contact</DialogTitle>
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
            {creating ? <CircularProgress size={20} /> : "Create Contact"}
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
