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
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";

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

interface SavedView {
  id: string;
  name: string;
  filters: {
    country?: string;
    ageRange?: string;
    search?: string;
  };
}

const defaultViews: SavedView[] = [
  { id: "all", name: "All contacts", filters: {} },
  { id: "recent", name: "Recently added", filters: {} },
  { id: "us", name: "US contacts", filters: { country: "US" } },
  { id: "young", name: "Under 30", filters: { ageRange: "under30" } },
];

export default function CustomersV2() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("all");
  const [savedViews, setSavedViews] = useState<SavedView[]>(defaultViews);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((customer) => customer.login.uuid);
      setSelectedCustomers(newSelected);
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (uuid: string) => {
    const selectedIndex = selectedCustomers.indexOf(uuid);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCustomers, uuid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCustomers.slice(1));
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelected = newSelected.concat(selectedCustomers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomers(newSelected);
  };

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    const view = savedViews.find(v => v.id === viewId);
    if (view) {
      setCountryFilter(view.filters.country || "");
      setAgeFilter(view.filters.ageRange || "");
      setSearchTerm(view.filters.search || "");
    }
  };

  const saveCurrentView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: {
        country: countryFilter,
        ageRange: ageFilter,
        search: searchTerm,
      },
    };
    setSavedViews([...savedViews, newView]);
    setSaveViewDialogOpen(false);
    setNewViewName("");
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

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          Customers V2 - HubSpot Style
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => setSaveViewDialogOpen(true)}
          >
            Save View
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Saved Views Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentView} onChange={(_, value) => handleViewChange(value)}>
          {savedViews.map((view) => (
            <Tab key={view.id} label={view.name} value={view.id} />
          ))}
        </Tabs>
      </Box>

      {/* Search and Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search contacts..."
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
            <MenuItem value="">All Countries</MenuItem>
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
            <MenuItem value="">All Ages</MenuItem>
            <MenuItem value="under30">Under 30</MenuItem>
            <MenuItem value="30to50">30-50</MenuItem>
            <MenuItem value="over50">Over 50</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
          <FilterListIcon />
        </IconButton>
      </Stack>

      {/* Selection Summary */}
      {selectedCustomers.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
          <Typography variant="body2" color="primary.contrastText">
            {selectedCustomers.length} customer(s) selected
          </Typography>
        </Box>
      )}

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < paginatedCustomers.length}
                  checked={paginatedCustomers.length > 0 && selectedCustomers.length === paginatedCustomers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer) => {
              const isSelected = selectedCustomers.indexOf(customer.login.uuid) !== -1;
              return (
                <TableRow
                  key={customer.login.uuid}
                  selected={isSelected}
                  onClick={() => handleSelectCustomer(customer.login.uuid)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={customer.picture.thumbnail}>
                        {getInitials(customer.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {`${customer.name.first} ${customer.name.last}`}
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
                    {customer.location.city}, {customer.location.country}
                  </TableCell>
                  <TableCell>{customer.dob.age}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

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

      {/* Save View Dialog */}
      <Dialog open={saveViewDialogOpen} onClose={() => setSaveViewDialogOpen(false)}>
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
          <Button onClick={saveCurrentView} variant="contained" disabled={!newViewName}>
            Save View
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
