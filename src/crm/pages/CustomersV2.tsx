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
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Toolbar,
  Tooltip,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as ExportIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
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

interface SavedView {
  id: string;
  name: string;
  filters: {
    search: string;
    country: string;
    ageRange: string;
    gender: string;
  };
  isDefault: boolean;
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

const defaultViews: SavedView[] = [
  {
    id: "all",
    name: "All contacts",
    filters: { search: "", country: "", ageRange: "", gender: "" },
    isDefault: true,
  },
  {
    id: "my-contacts",
    name: "My contacts",
    filters: { search: "", country: "", ageRange: "", gender: "" },
    isDefault: false,
  },
  {
    id: "unassigned",
    name: "Unassigned contacts",
    filters: { search: "", country: "", ageRange: "", gender: "" },
    isDefault: false,
  },
];

export default function CustomersV2() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [currentView, setCurrentView] = React.useState("all");
  const [savedViews, setSavedViews] = React.useState<SavedView[]>(defaultViews);
  const [filters, setFilters] = React.useState({
    country: "",
    ageRange: "",
    gender: "",
  });
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
        `https://user-api.builder-io.workers.dev/api/users?perPage=50&search=${searchTerm}`
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

  const handleSelectAllCustomers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomers(filteredCustomers.map((customer) => customer.login.uuid));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
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

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSaveView = () => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name: `Custom View ${savedViews.length}`,
      filters: { search: searchTerm, ...filters },
      isDefault: false,
    };
    setSavedViews((prev) => [...prev, newView]);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      !searchTerm ||
      customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      !filters.country || customer.location.country === filters.country;

    const matchesGender =
      !filters.gender || customer.gender === filters.gender;

    const matchesAge = () => {
      if (!filters.ageRange) return true;
      const age = customer.dob.age;
      switch (filters.ageRange) {
        case "18-30":
          return age >= 18 && age <= 30;
        case "31-50":
          return age >= 31 && age <= 50;
        case "50+":
          return age > 50;
        default:
          return true;
      }
    };

    return matchesSearch && matchesCountry && matchesGender && matchesAge();
  });

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const uniqueCountries = [...new Set(customers.map((c) => c.location.country))];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers v2
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Customer
        </Button>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFiltersOpen(true)}
            sx={{ minWidth: 120 }}
          >
            Filters
          </Button>
          <Button variant="outlined" startIcon={<ExportIcon />}>
            Export
          </Button>
        </Box>

        {/* Active Filters */}
        {(filters.country || filters.ageRange || filters.gender) && (
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {filters.country && (
              <Chip
                label={`Country: ${filters.country}`}
                onDelete={() => handleFilterChange("country", "")}
                size="small"
              />
            )}
            {filters.ageRange && (
              <Chip
                label={`Age: ${filters.ageRange}`}
                onDelete={() => handleFilterChange("ageRange", "")}
                size="small"
              />
            )}
            {filters.gender && (
              <Chip
                label={`Gender: ${filters.gender}`}
                onDelete={() => handleFilterChange("gender", "")}
                size="small"
              />
            )}
          </Box>
        )}
      </Box>

      {/* Saved Views Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={currentView}
          onChange={(_, newValue) => setCurrentView(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {savedViews.map((view) => (
            <Tab
              key={view.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {view.name}
                  {view.isDefault && <Badge color="primary" variant="dot" />}
                </Box>
              }
              value={view.id}
            />
          ))}
          <Tab
            icon={<BookmarkIcon />}
            onClick={handleSaveView}
            sx={{ minWidth: 48 }}
          />
        </Tabs>
      </Box>

      {/* Bulk Actions Toolbar */}
      {selectedCustomers.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            mb: 2,
            borderRadius: 1,
          }}
        >
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selectedCustomers.length} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedCustomers.length > 0 &&
                    selectedCustomers.length < filteredCustomers.length
                  }
                  checked={
                    filteredCustomers.length > 0 &&
                    selectedCustomers.length === filteredCustomers.length
                  }
                  onChange={handleSelectAllCustomers}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Numbers</TableCell>
              <TableCell>Contact Owner</TableCell>
              <TableCell>Primary Company</TableCell>
              <TableCell>Last Activity Date</TableCell>
              <TableCell>Lead Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  selected={selectedCustomers.includes(customer.login.uuid)}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.login.uuid)}
                      onChange={() => handleSelectCustomer(customer.login.uuid)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={customer.picture?.thumbnail}
                        sx={{ width: 40, height: 40 }}
                      >
                        {getInitials(customer.name.first, customer.name.last)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {customer.name.first} {customer.name.last}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{customer.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.cell}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography variant="body2">Unassigned</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        No company
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(customer.registered.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="New"
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedCustomer(customer);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ViewIcon sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Advanced Filters
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              label="Country"
              onChange={(e) => handleFilterChange("country", e.target.value)}
            >
              <MenuItem value="">All Countries</MenuItem>
              {uniqueCountries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Age Range</InputLabel>
            <Select
              value={filters.ageRange}
              label="Age Range"
              onChange={(e) => handleFilterChange("ageRange", e.target.value)}
            >
              <MenuItem value="">All Ages</MenuItem>
              <MenuItem value="18-30">18-30</MenuItem>
              <MenuItem value="31-50">31-50</MenuItem>
              <MenuItem value="50+">50+</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender}
              label="Gender"
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setFilters({ country: "", ageRange: "", gender: "" });
                setFiltersOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setFiltersOpen(false)}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

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
