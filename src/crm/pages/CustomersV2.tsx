import * as React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Toolbar,
  TableSortLabel,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import ViewListIcon from "@mui/icons-material/ViewList";

interface User {
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
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  dob: {
    age: number;
  };
  gender: string;
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

interface CreateUserData {
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

const defaultSavedViews: SavedView[] = [
  {
    id: "all",
    name: "All Contacts",
    filters: { search: "", gender: "", country: "", ageRange: "" },
  },
  {
    id: "prospects",
    name: "Prospects",
    filters: { search: "", gender: "", country: "US", ageRange: "25-45" },
  },
  {
    id: "customers",
    name: "Active Customers",
    filters: { search: "", gender: "", country: "", ageRange: "30-60" },
  },
];

export default function CustomersV2() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [currentView, setCurrentView] = React.useState(0);
  const [savedViews, setSavedViews] = React.useState<SavedView[]>(defaultSavedViews);
  const [filters, setFilters] = React.useState({
    gender: "",
    country: "",
    ageRange: "",
  });
  const [sortBy, setSortBy] = React.useState("name.first");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [saveViewDialogOpen, setSaveViewDialogOpen] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Menu states
  const [filtersMenuAnchor, setFiltersMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [actionsMenuAnchor, setActionsMenuAnchor] = React.useState<null | HTMLElement>(null);

  const [newUser, setNewUser] = React.useState<CreateUserData>({
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

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("perPage", "10");
      params.set("page", page.toString());
      
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      if (sortBy) {
        params.set("sortBy", sortBy);
      }
      
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.data || []);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, page]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map((u) => u.login.uuid)
    );
  };

  const handleViewChange = (newValue: number) => {
    setCurrentView(newValue);
    const view = savedViews[newValue];
    setSearchTerm(view.filters.search);
    setFilters({
      gender: view.filters.gender,
      country: view.filters.country,
      ageRange: view.filters.ageRange,
    });
  };

  const handleSaveView = () => {
    if (newViewName.trim()) {
      const newView: SavedView = {
        id: Date.now().toString(),
        name: newViewName.trim(),
        filters: {
          search: searchTerm,
          gender: filters.gender,
          country: filters.country,
          ageRange: filters.ageRange,
        },
      };
      setSavedViews([...savedViews, newView]);
      setNewViewName("");
      setSaveViewDialogOpen(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setCreating(true);
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      setCreateDialogOpen(false);
      setNewUser({
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
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Customers v2
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Customer
        </Button>
      </Stack>

      {/* Saved Views Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={currentView} onChange={(_, newValue) => handleViewChange(newValue)}>
          {savedViews.map((view, index) => (
            <Tab key={view.id} label={view.name} />
          ))}
          <Tab
            icon={<SaveIcon />}
            onClick={() => setSaveViewDialogOpen(true)}
            sx={{ minWidth: "auto" }}
          />
        </Tabs>
      </Box>

      {/* Search and Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search contacts, phone, or email..."
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
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFiltersMenuAnchor(e.currentTarget)}
        >
          Filters
        </Button>
        <Button
          variant="outlined"
          startIcon={<ViewListIcon />}
          disabled={selectedUsers.length === 0}
          onClick={(e) => setActionsMenuAnchor(e.currentTarget)}
        >
          Actions ({selectedUsers.length})
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name.first"}
                  direction={sortBy === "name.first" ? sortOrder : "asc"}
                  onClick={() => handleSort("name.first")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "email"}
                  direction={sortBy === "email" ? sortOrder : "asc"}
                  onClick={() => handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "location.country"}
                  direction={sortBy === "location.country" ? sortOrder : "asc"}
                  onClick={() => handleSort("location.country")}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "dob.age"}
                  direction={sortBy === "dob.age" ? sortOrder : "asc"}
                  onClick={() => handleSort("dob.age")}
                >
                  Age
                </TableSortLabel>
              </TableCell>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? "No customers found matching your search." : "No customers available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.login.uuid}
                  hover
                  selected={selectedUsers.includes(user.login.uuid)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.login.uuid)}
                      onChange={() => handleSelectUser(user.login.uuid)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={user.picture.medium}
                        alt={`${user.name.first} ${user.name.last}`}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {user.name.first} {user.name.last}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.login.username}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.location.city}, {user.location.country}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${user.dob.age} years`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      2 days ago
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Filters Menu */}
      <Menu
        anchorEl={filtersMenuAnchor}
        open={Boolean(filtersMenuAnchor)}
        onClose={() => setFiltersMenuAnchor(null)}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Filter Customers
          </Typography>
          <Stack spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                label="Gender"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                label="Country"
              >
                <MenuItem value="">All Countries</MenuItem>
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="CA">Canada</MenuItem>
                <MenuItem value="UK">United Kingdom</MenuItem>
                <MenuItem value="DE">Germany</MenuItem>
                <MenuItem value="FR">France</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Age Range</InputLabel>
              <Select
                value={filters.ageRange}
                onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                label="Age Range"
              >
                <MenuItem value="">All Ages</MenuItem>
                <MenuItem value="18-25">18-25</MenuItem>
                <MenuItem value="25-35">25-35</MenuItem>
                <MenuItem value="35-45">35-45</MenuItem>
                <MenuItem value="45-55">45-55</MenuItem>
                <MenuItem value="55+">55+</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setFiltersMenuAnchor(null)}>
                Apply Filters
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSaveViewDialogOpen(true)}
                startIcon={<SaveIcon />}
              >
                Save View
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Menu>

      {/* Actions Menu */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={() => setActionsMenuAnchor(null)}
      >
        <MenuItem onClick={() => setActionsMenuAnchor(null)}>
          Export Selected ({selectedUsers.length})
        </MenuItem>
        <MenuItem onClick={() => setActionsMenuAnchor(null)}>
          Assign Owner
        </MenuItem>
        <MenuItem onClick={() => setActionsMenuAnchor(null)}>
          Add to List
        </MenuItem>
        <MenuItem onClick={() => setActionsMenuAnchor(null)} sx={{ color: "error.main" }}>
          Delete Selected
        </MenuItem>
      </Menu>

      {/* Save View Dialog */}
      <Dialog open={saveViewDialogOpen} onClose={() => setSaveViewDialogOpen(false)}>
        <DialogTitle>Save Current View</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            fullWidth
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveViewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveView} variant="contained">
            Save View
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={newUser.name.first}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    name: { ...prev.name, first: e.target.value },
                  }))
                }
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={newUser.name.last}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    name: { ...prev.name, last: e.target.value },
                  }))
                }
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              fullWidth
            />
            <TextField
              label="Username"
              value={newUser.login.username}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  login: { ...prev.login, username: e.target.value },
                }))
              }
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={newUser.location.city}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))
                }
                fullWidth
              />
              <TextField
                label="State"
                value={newUser.location.state}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    location: { ...prev.location, state: e.target.value },
                  }))
                }
                fullWidth
              />
              <TextField
                label="Country"
                value={newUser.location.country}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }))
                }
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={creating || !newUser.name.first || !newUser.name.last || !newUser.email}
          >
            {creating ? <CircularProgress size={20} /> : "Create Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
