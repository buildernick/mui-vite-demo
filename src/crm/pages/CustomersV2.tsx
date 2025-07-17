import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
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

interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  count: number;
}

interface FilterState {
  search: string;
  gender: string;
  ageRange: string;
  country: string;
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

const defaultViews: SavedView[] = [
  {
    id: "all",
    name: "All contacts",
    filters: { search: "", gender: "", ageRange: "", country: "" },
    count: 0,
  },
  {
    id: "recent",
    name: "Recently added",
    filters: { search: "", gender: "", ageRange: "", country: "" },
    count: 0,
  },
  {
    id: "males",
    name: "Male contacts",
    filters: { search: "", gender: "male", ageRange: "", country: "" },
    count: 0,
  },
  {
    id: "females",
    name: "Female contacts",
    filters: { search: "", gender: "female", ageRange: "", country: "" },
    count: 0,
  },
];

export default function CustomersV2() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>(
    [],
  );
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    gender: "",
    ageRange: "",
    country: "",
  });
  const [activeView, setActiveView] = React.useState("all");
  const [savedViews, setSavedViews] = React.useState<SavedView[]>(defaultViews);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [saveViewDialogOpen, setSaveViewDialogOpen] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);

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
  const fetchCustomers = async (
    currentFilters: FilterState = filters,
    currentPage: number = page,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("perPage", "20");

      if (currentFilters.search) {
        params.append("search", currentFilters.search);
      }
      if (currentFilters.gender) {
        params.append("sortBy", "gender");
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
      if (currentFilters.gender) {
        filteredData = filteredData.filter(
          (customer: Customer) => customer.gender === currentFilters.gender,
        );
      }

      if (currentFilters.ageRange) {
        const [minAge, maxAge] = currentFilters.ageRange.split("-").map(Number);
        filteredData = filteredData.filter((customer: Customer) => {
          const age = customer.dob.age;
          return age >= minAge && age <= maxAge;
        });
      }

      if (currentFilters.country) {
        filteredData = filteredData.filter((customer: Customer) =>
          customer.location.country
            .toLowerCase()
            .includes(currentFilters.country.toLowerCase()),
        );
      }

      setCustomers(filteredData);
      setTotalResults(data.total || filteredData.length);

      // Update saved views counts
      setSavedViews((prev) =>
        prev.map((view) => ({
          ...view,
          count: view.id === activeView ? filteredData.length : view.count,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers",
      );
    } finally {
      setLoading(false);
    }
  };

  // Apply saved view
  const applyView = (view: SavedView) => {
    setActiveView(view.id);
    setFilters(view.filters);
    setPage(1);
    fetchCustomers(view.filters, 1);
  };

  // Save current view
  const saveCurrentView = () => {
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: { ...filters },
      count: customers.length,
    };

    setSavedViews((prev) => [...prev, newView]);
    setSaveViewDialogOpen(false);
    setNewViewName("");
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
      fetchCustomers(filters, 1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const getFullName = (customer: Customer) => {
    return `${customer.name.first} ${customer.name.last}`;
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomers(customers.map((customer) => customer.login.uuid));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const isSelected = (customerId: string) =>
    selectedCustomers.includes(customerId);
  const isIndeterminate =
    selectedCustomers.length > 0 && selectedCustomers.length < customers.length;

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customers V2 - HubSpot Style
      </Typography>

      <Stack direction="row" spacing={3}>
        {/* Left Sidebar - Views */}
        <Paper sx={{ width: 280, p: 2, height: "fit-content" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Views</Typography>
            <IconButton
              size="small"
              onClick={() => setSaveViewDialogOpen(true)}
            >
              <SaveIcon />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            {savedViews.map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? "contained" : "text"}
                onClick={() => applyView(view)}
                sx={{
                  justifyContent: "space-between",
                  textAlign: "left",
                  px: 2,
                  py: 1,
                  minHeight: 40,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                fullWidth
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <ViewListIcon fontSize="small" sx={{ flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {view.name}
                  </Typography>
                </Box>
                <Badge
                  badgeContent={view.count}
                  color="primary"
                  sx={{ flexShrink: 0 }}
                />
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Top Actions Bar */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ flexGrow: 1 }}
              size="small"
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={filters.gender}
                label="Gender"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Age Range</InputLabel>
              <Select
                value={filters.ageRange}
                label="Age Range"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, ageRange: e.target.value }))
                }
              >
                <MenuItem value="">All Ages</MenuItem>
                <MenuItem value="18-30">18-30</MenuItem>
                <MenuItem value="31-45">31-45</MenuItem>
                <MenuItem value="46-60">46-60</MenuItem>
                <MenuItem value="61-100">60+</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add Contact
            </Button>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Stack>

          {/* Selection Toolbar */}
          {selectedCustomers.length > 0 && (
            <Toolbar sx={{ bgcolor: "primary.50", mb: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ flex: "1 1 100%" }}>
                {selectedCustomers.length} selected
              </Typography>
              <Button startIcon={<EmailIcon />} sx={{ mr: 1 }}>
                Email
              </Button>
              <Button startIcon={<ExportIcon />} sx={{ mr: 1 }}>
                Export
              </Button>
              <Button startIcon={<DeleteIcon />} color="error">
                Delete
              </Button>
            </Toolbar>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Customers Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={
                        customers.length > 0 &&
                        selectedCustomers.length === customers.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No contacts found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {filters.search ||
                        filters.gender ||
                        filters.ageRange ||
                        filters.country
                          ? "Try adjusting your filters"
                          : "Get started by adding your first contact"}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        Add Contact
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow
                      key={customer.login.uuid}
                      hover
                      selected={isSelected(customer.login.uuid)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(customer.login.uuid)}
                          onChange={() =>
                            handleSelectCustomer(customer.login.uuid)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={customer.picture.thumbnail}
                            alt={getFullName(customer)}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {getFullName(customer)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              @{customer.login.username}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {customer.location.city}, {customer.location.country}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${customer.dob.age}y`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(
                            customer.registered.date,
                          ).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && customers.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {customers.length} of {totalResults} contacts
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  disabled={page === 1}
                  onClick={() => {
                    const newPage = page - 1;
                    setPage(newPage);
                    fetchCustomers(filters, newPage);
                  }}
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  disabled={customers.length < 20}
                  onClick={() => {
                    const newPage = page + 1;
                    setPage(newPage);
                    fetchCustomers(filters, newPage);
                  }}
                >
                  Next
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            fetchCustomers();
          }}
        >
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <ExportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export All</ListItemText>
        </MenuItem>
      </Menu>

      {/* Save View Dialog */}
      <Dialog
        open={saveViewDialogOpen}
        onClose={() => setSaveViewDialogOpen(false)}
      >
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveViewDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveCurrentView} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Customer Dialog - Same as V1 */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Contact</DialogTitle>
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

            {/* Address Information */}
            <Typography variant="subtitle2" color="primary">
              Address Information
            </Typography>
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
            {creating ? <CircularProgress size={20} /> : "Create Contact"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
