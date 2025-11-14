import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CustomerCard from "../components/CustomerCard";

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
  location: {
    city: string;
    country: string;
  };
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  data: User[];
}

export default function CustomersV1() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    title: "Mr",
    city: "",
    country: "",
  });
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `https://user-api.builder-io.workers.dev/api/users?search=${encodeURIComponent(searchTerm)}&perPage=20`
        : "https://user-api.builder-io.workers.dev/api/users?perPage=20";
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      setCustomers(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load customers");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      setCreating(true);
      const response = await fetch("https://user-api.builder-io.workers.dev/api/users", {
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
            title: newCustomer.title,
          },
          location: {
            city: newCustomer.city,
            country: newCustomer.country,
            street: {
              number: 123,
              name: "Main St",
            },
            state: "",
            postcode: "00000",
          },
        }),
      });

      if (response.ok) {
        setOpenDialog(false);
        setNewCustomer({
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          title: "Mr",
          city: "",
          country: "",
        });
        fetchCustomers();
      } else {
        setError("Failed to create customer");
      }
    } catch (err) {
      setError("Failed to create customer");
      console.error("Error creating customer:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Customers v1
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Customer
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search customers..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.login.uuid}>
              <CustomerCard customer={customer} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <TextField
              label="Username"
              fullWidth
              required
              value={newCustomer.username}
              onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={newCustomer.firstName}
                onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                required
                value={newCustomer.lastName}
                onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                fullWidth
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
              />
              <TextField
                label="Country"
                fullWidth
                value={newCustomer.country}
                onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCustomer}
            variant="contained"
            disabled={creating || !newCustomer.email || !newCustomer.username || !newCustomer.firstName || !newCustomer.lastName}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
