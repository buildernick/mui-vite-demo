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
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ViewListIcon from "@mui/icons-material/ViewList";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TablePagination from "@mui/material/TablePagination";

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

interface SavedView {
  id: string;
  name: string;
  filters: {
    search: string;
    gender: string;
    country: string;
    ageRange: string;
  };
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

export default function CustomersV2() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [ageRangeFilter, setAgeRangeFilter] = useState("");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  
  // Saved views
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: "all",
      name: "All contacts",
      filters: { search: "", gender: "", country: "", ageRange: "" }
    }
  ]);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
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
        "https://user-api.builder-io.workers.dev/api/users?perPage=50"
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
    applyFilters();
  }, [searchQuery, genderFilter, countryFilter, ageRangeFilter, customers]);

  const applyFilters = () => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.name.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genderFilter) {
      filtered = filtered.filter(customer => customer.gender === genderFilter);
    }

    if (countryFilter) {
      filtered = filtered.filter(customer => customer.location.country === countryFilter);
    }

    if (ageRangeFilter) {
      const [min, max] = ageRangeFilter.split("-").map(Number);
      filtered = filtered.filter(customer => {
        const age = customer.dob.age;
        return age >= min && (max ? age <= max : true);
      });
    }

    setFilteredCustomers(filtered);
    setPage(0); // Reset to first page when filters change
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
          body: JSON.stringify(newCustomer),
        }
      );

      if (response.ok) {
        setCreateDialogOpen(false);
        fetchCustomers();
        resetNewCustomer();
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const resetNewCustomer = () => {
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
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${customerId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
    setAnchorEl(null);
  };

  const handleSaveView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: {
        search: searchQuery,
        gender: genderFilter,
        country: countryFilter,
        ageRange: ageRangeFilter,
      },
    };
    setSavedViews([...savedViews, newView]);
    setSaveViewDialogOpen(false);
    setNewViewName("");
  };

  const loadView = (view: SavedView) => {
    setSearchQuery(view.filters.search);
    setGenderFilter(view.filters.gender);
    setCountryFilter(view.filters.country);
    setAgeRangeFilter(view.filters.ageRange);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setGenderFilter("");
    setCountryFilter("");
    setAgeRangeFilter("");
  };

  const getUniqueCountries = () => {
    return [...new Set(customers.map(c => c.location.country))].sort();
  };

  const hasActiveFilters = searchQuery || genderFilter || countryFilter || ageRangeFilter;
  const activeFilterCount = [searchQuery, genderFilter, countryFilter, ageRangeFilter].filter(Boolean).length;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1">
          Customers v2 - HubSpot Style
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ViewListIcon />}
            onClick={() => setSaveViewDialogOpen(true)}
            disabled={!hasActiveFilters}
          >
            Save view
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add contact
          </Button>
        </Stack>
      </Stack>

      {/* Saved Views Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue);
          if (newValue < savedViews.length) {
            loadView(savedViews[newValue]);
          }
        }}
        sx={{ mb: 2 }}
      >
        {savedViews.map((view, index) => (
          <Tab
            key={view.id}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>{view.name}</span>
                {index === 0 && <Badge badgeContent={customers.length} color="primary" />}
              </Stack>
            }
          />
        ))}
      </Tabs>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search name, company, email, and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Badge badgeContent={activeFilterCount > 0 ? activeFilterCount : null} color="primary">
              <FilterListIcon color={hasActiveFilters ? "primary" : "action"} />
            </Badge>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                label="Gender"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                label="Country"
              >
                <MenuItem value="">All</MenuItem>
                {getUniqueCountries().map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Age Range</InputLabel>
              <Select
                value={ageRangeFilter}
                onChange={(e) => setAgeRangeFilter(e.target.value)}
                label="Age Range"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="18-30">18-30</MenuItem>
                <MenuItem value="31-50">31-50</MenuItem>
                <MenuItem value="51-65">51-65</MenuItem>
                <MenuItem value="66-100">66+</MenuItem>
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <Button size="small" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Results Summary */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filteredCustomers.length} contacts
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Contact Owner</TableCell>
              <TableCell>Last Activity Date</TableCell>
              <TableCell>Lead Status</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.login.uuid} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={customer.picture.thumbnail} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2">
                        {customer.name.first} {customer.name.last}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    {new Date(customer.registered.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Customer"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
      />

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedCustomer && handleDeleteCustomer(selectedCustomer.login.uuid)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Contact</DialogTitle>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateCustomer} 
            variant="contained"
            disabled={!newCustomer.name.first || !newCustomer.name.last || !newCustomer.email}
          >
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save View Dialog */}
      <Dialog open={saveViewDialogOpen} onClose={() => setSaveViewDialogOpen(false)}>
        <DialogTitle>Save current view</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="View name"
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveViewDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveView}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newViewName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
