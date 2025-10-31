import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TableSortLabel from "@mui/material/TableSortLabel";

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
    street: {
      number: number;
      name: string;
    };
    state: string;
    postcode: string;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  dob?: {
    age: number;
  };
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  data: User[];
}

export default function CustomersV3() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editedCustomer, setEditedCustomer] = React.useState<User | null>(null);
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
  const [sortField, setSortField] = React.useState("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  React.useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let url = `https://user-api.builder-io.workers.dev/api/users?perPage=50`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
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

  const handleRowClick = (customer: User) => {
    setSelectedCustomer(customer);
    setEditedCustomer({ ...customer });
  };

  const handleUpdateField = (field: string, value: string) => {
    if (!editedCustomer) return;
    
    const fields = field.split(".");
    const updated = { ...editedCustomer };
    
    if (fields.length === 2) {
      (updated as any)[fields[0]][fields[1]] = value;
    } else {
      (updated as any)[field] = value;
    }
    
    setEditedCustomer(updated);
  };

  const handleSaveCustomer = async () => {
    if (!editedCustomer) return;
    
    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${editedCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCustomer),
        }
      );

      if (response.ok) {
        setSelectedCustomer(editedCustomer);
        fetchCustomers();
      } else {
        setError("Failed to update customer");
      }
    } catch (err) {
      setError("Failed to update customer");
      console.error("Error updating customer:", err);
    }
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
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

      {selectedCustomer && editedCustomer && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={3} alignItems="flex-start">
            <Avatar
              src={selectedCustomer.picture.large}
              alt={`${selectedCustomer.name.first} ${selectedCustomer.name.last}`}
              sx={{ width: 120, height: 120 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {selectedCustomer.name.first} {selectedCustomer.name.last}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField
                    label="First Name"
                    size="small"
                    value={editedCustomer.name.first}
                    onChange={(e) => handleUpdateField("name.first", e.target.value)}
                  />
                  <TextField
                    label="Last Name"
                    size="small"
                    value={editedCustomer.name.last}
                    onChange={(e) => handleUpdateField("name.last", e.target.value)}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    value={editedCustomer.email}
                    onChange={(e) => handleUpdateField("email", e.target.value)}
                  />
                  <FormControl size="small">
                    <InputLabel>Title</InputLabel>
                    <Select
                      value={editedCustomer.name.title}
                      label="Title"
                      onChange={(e) => handleUpdateField("name.title", e.target.value)}
                    >
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Ms">Ms</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                      <MenuItem value="Dr">Dr</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField
                    label="Phone"
                    size="small"
                    value={editedCustomer.phone}
                    onChange={(e) => handleUpdateField("phone", e.target.value)}
                  />
                  <TextField
                    label="City"
                    size="small"
                    value={editedCustomer.location.city}
                    onChange={(e) => handleUpdateField("location.city", e.target.value)}
                  />
                  <TextField
                    label="Country"
                    size="small"
                    value={editedCustomer.location.country}
                    onChange={(e) => handleUpdateField("location.country", e.target.value)}
                  />
                  <FormControl size="small">
                    <InputLabel>Status</InputLabel>
                    <Select defaultValue="active" label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <Button variant="contained" onClick={handleSaveCustomer}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          placeholder="Search for names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select defaultValue="all" label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select defaultValue="all" label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="recent">Recent</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained">Search</Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name"}
                    direction={sortField === "name" ? sortDirection : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "email"}
                    direction={sortField === "email" ? sortDirection : "asc"}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "location"}
                    direction={sortField === "location" ? sortDirection : "asc"}
                    onClick={() => handleSort("location")}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "phone"}
                    direction={sortField === "phone" ? sortDirection : "asc"}
                    onClick={() => handleSort("phone")}
                  >
                    Phone
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  hover
                  onClick={() => handleRowClick(customer)}
                  sx={{ cursor: "pointer" }}
                  selected={selectedCustomer?.login.uuid === customer.login.uuid}
                >
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    {customer.name.first} {customer.name.last}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.location.city}, {customer.location.country}
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
