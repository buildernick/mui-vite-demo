import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";

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

export default function CustomersV1() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
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

  const fetchUsers = React.useCallback(async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("perPage", "20");
      if (search) {
        params.set("search", search);
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
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      
      // Debounce search
      const timeoutId = setTimeout(() => {
        fetchUsers(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    },
    [fetchUsers]
  );

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
      fetchUsers(searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    searchTerm
      ? `${user.name.first} ${user.name.last} ${user.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Customers v1
        </Typography>
        <Fab
          color="primary"
          aria-label="add customer"
          onClick={() => setCreateDialogOpen(true)}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search customers..."
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.login.uuid}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar
                      src={user.picture.large}
                      alt={`${user.name.first} ${user.name.last}`}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h6" component="h2" textAlign="center">
                      {user.name.title} {user.name.first} {user.name.last}
                    </Typography>
                    <Chip
                      label={user.gender}
                      size="small"
                      color={user.gender === "male" ? "primary" : "secondary"}
                    />
                  </Stack>
                  
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.location.city}, {user.location.state}, {user.location.country}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<EditIcon />} fullWidth>
                    Edit Customer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredUsers.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            {searchTerm ? "No customers found matching your search." : "No customers available."}
          </Typography>
        </Box>
      )}

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
