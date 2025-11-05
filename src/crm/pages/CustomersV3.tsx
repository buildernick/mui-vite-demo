import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

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
}

export default function CustomersV3() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editedData, setEditedData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  });
  const [newCustomer, setNewCustomer] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    country: "",
  });

  const fetchCustomers = async (search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "20",
        ...(search && { search }),
      });
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`
      );
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSelectCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    setEditedData({
      firstName: customer.name.first,
      lastName: customer.name.last,
      email: customer.email,
      phone: customer.phone,
      city: customer.location.city,
      state: customer.location.state,
    });
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${selectedCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: {
              first: editedData.firstName,
              last: editedData.lastName,
            },
            email: editedData.email,
            phone: editedData.phone,
            location: {
              city: editedData.city,
              state: editedData.state,
            },
          }),
        }
      );
      fetchCustomers(searchQuery);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
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
            gender: "male",
            location: {
              city: newCustomer.city,
              state: newCustomer.state,
              country: newCustomer.country,
              street: {
                number: 0,
                name: "",
              },
              postcode: "",
            },
          }),
        }
      );

      if (response.ok) {
        setOpenDialog(false);
        setNewCustomer({
          email: "",
          firstName: "",
          lastName: "",
          username: "",
          city: "",
          state: "",
          country: "",
        });
        fetchCustomers(searchQuery);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers v3
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          New Customer
        </Button>
      </Box>

      {selectedCustomer && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: "#FAFAFA" }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            <Avatar
              src={selectedCustomer.picture.large}
              sx={{
                width: 198,
                height: 198,
                border: "2px solid #AFB1B6",
                backgroundColor: "#EFEFF0",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Work Sans, Roboto, sans-serif",
                  fontWeight: 400,
                  fontSize: "48px",
                  lineHeight: "56px",
                  mb: 2,
                }}
              >
                {selectedCustomer.name.first} {selectedCustomer.name.last}
              </Typography>

              <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.firstName}
                    onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.city}
                    onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <FormControl size="small">
                    <Select
                      value="small"
                      sx={{
                        borderRadius: "8px",
                        border: "2px solid #AFB1B6",
                        backgroundColor: "#FFF",
                        fontSize: "12px",
                      }}
                    >
                      <MenuItem value="small">Small</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.lastName}
                    onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.phone}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <TextField
                    placeholder="Empty"
                    size="small"
                    value={editedData.state}
                    onChange={(e) => setEditedData({ ...editedData, state: e.target.value })}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#FFF",
                      },
                    }}
                  />
                  <FormControl size="small">
                    <Select
                      value="small"
                      sx={{
                        borderRadius: "8px",
                        border: "2px solid #AFB1B6",
                        backgroundColor: "#FFF",
                        fontSize: "12px",
                      }}
                    >
                      <MenuItem value="small">Small</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleUpdateCustomer}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "flex-end" }}>
        <TextField
          placeholder="Search for names"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Dropdown
          </Typography>
          <Select
            size="small"
            defaultValue="small"
            sx={{
              borderRadius: "8px",
              border: "2px solid #AFB1B6",
              fontSize: "12px",
            }}
          >
            <MenuItem value="small">Small</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Dropdown
          </Typography>
          <Select
            size="small"
            defaultValue="small"
            sx={{
              borderRadius: "8px",
              border: "2px solid #AFB1B6",
              fontSize: "12px",
            }}
          >
            <MenuItem value="small">Small</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => fetchCustomers(searchQuery)}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#3A00E5",
            textTransform: "none",
            px: 3,
          }}
        >
          Search
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: "1px solid #AFB1B6" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ fontWeight: 500, color: "#61646B", fontSize: "14px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Header
                  <ArrowDropDownIcon sx={{ fontSize: 20, color: "#61646B" }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 500, color: "#61646B", fontSize: "14px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Header
                  <ArrowDropDownIcon sx={{ fontSize: 20, color: "#61646B" }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 500, color: "#61646B", fontSize: "14px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Header
                  <ArrowDropDownIcon sx={{ fontSize: 20, color: "#61646B" }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 500, color: "#61646B", fontSize: "14px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Header
                  <ArrowDropDownIcon sx={{ fontSize: 20, color: "#61646B" }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  hover
                  onClick={() => handleSelectCustomer(customer)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedCustomer?.login.uuid === customer.login.uuid
                        ? "action.selected"
                        : "inherit",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomer?.login.uuid === customer.login.uuid}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#61646B", fontSize: "14px" }}>
                    {customer.name.first} {customer.name.last}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B", fontSize: "14px" }}>
                    {customer.email}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B", fontSize: "14px" }}>
                    {customer.phone}
                  </TableCell>
                  <TableCell sx={{ color: "#61646B", fontSize: "14px" }}>
                    {customer.location.city}, {customer.location.country}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Customer
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="First Name"
              required
              value={newCustomer.firstName}
              onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              required
              value={newCustomer.lastName}
              onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
            />
            <TextField
              label="Username"
              required
              value={newCustomer.username}
              onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              required
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <TextField
              label="City"
              value={newCustomer.city}
              onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
            />
            <TextField
              label="State"
              value={newCustomer.state}
              onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
            />
            <TextField
              label="Country"
              value={newCustomer.country}
              onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCustomer} variant="contained">
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
