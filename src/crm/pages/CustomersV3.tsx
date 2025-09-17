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
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";

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

export default function CustomersV3() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editedUser, setEditedUser] = React.useState<User | null>(null);
  const [filters, setFilters] = React.useState({
    gender: "",
    country: "",
    ageRange: "",
  });
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      params.set("perPage", "20");
      
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (!editedUser) return;
    
    try {
      setSaving(true);
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${editedUser.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update the users list with the edited user
      setUsers((prev) =>
        prev.map((user) =>
          user.login.uuid === editedUser.login.uuid ? editedUser : user
        )
      );
      setSelectedUser(editedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
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
          Customers v3
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Customer
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Customer Profile Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {selectedUser && editedUser ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={selectedUser.picture.large}
                  alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
                  sx={{ width: 160, height: 160 }}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h4" component="h2">
                    {selectedUser.name.first} {selectedUser.name.last}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveUser}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={20} /> : "Save Changes"}
                  </Button>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      value={editedUser.name.first}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, name: { ...prev.name, first: e.target.value } } : null
                        )
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      value={editedUser.name.last}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, name: { ...prev.name, last: e.target.value } } : null
                        )
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      value={editedUser.phone}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={editedUser.location.city}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? {
                            ...prev,
                            location: { ...prev.location, city: e.target.value }
                          } : null
                        )
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={editedUser.gender}
                        onChange={(e) =>
                          setEditedUser((prev) =>
                            prev ? { ...prev, gender: e.target.value } : null
                          )
                        }
                        label="Gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                Select a customer from the table below to view and edit their profile
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Search and Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              placeholder="Search for names"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={2} alignItems="end">
              <FormControl size="small" sx={{ minWidth: 120 }}>
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Country</InputLabel>
                <Select
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  label="Country"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="US">United States</MenuItem>
                  <MenuItem value="CA">Canada</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                  <MenuItem value="DE">Germany</MenuItem>
                  <MenuItem value="FR">France</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" size="small">
                Search
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
              <TableCell>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                    Name
                  </Typography>
                  <SearchIcon fontSize="small" color="action" />
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                    Email
                  </Typography>
                  <SearchIcon fontSize="small" color="action" />
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                    Phone
                  </Typography>
                  <SearchIcon fontSize="small" color="action" />
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                    Location
                  </Typography>
                  <SearchIcon fontSize="small" color="action" />
                </Stack>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? "No customers found matching your search." : "No customers available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users
                .filter((user) => {
                  const matchesSearch = searchTerm
                    ? `${user.name.first} ${user.name.last} ${user.email}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true;
                  
                  const matchesGender = filters.gender ? user.gender === filters.gender : true;
                  const matchesCountry = filters.country ? user.location.country === filters.country : true;
                  
                  return matchesSearch && matchesGender && matchesCountry;
                })
                .map((user) => (
                  <TableRow
                    key={user.login.uuid}
                    hover
                    selected={selectedUser?.login.uuid === user.login.uuid}
                    onClick={() => handleUserSelect(user)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.picture.thumbnail}
                          alt={`${user.name.first} ${user.name.last}`}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {user.name.first} {user.name.last}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.location.city}, {user.location.country}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && users.length === 0 && !searchTerm && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No customers available. Create your first customer to get started.
          </Typography>
        </Box>
      )}

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small">
                <InputLabel>Title</InputLabel>
                <Select
                  value={newUser.name.title}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      name: { ...prev.name, title: e.target.value },
                    }))
                  }
                  label="Title"
                  sx={{ minWidth: 80 }}
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
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
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newUser.gender}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
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
