import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
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
}

interface NewCustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  state: string;
  country: string;
}

export default function CustomersV1() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState<NewCustomerData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  // Fetch customers from API
  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?perPage=20&search=${searchTerm}`
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
        });
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers v1
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Customer
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      </Box>

      {/* Customer Cards Grid */}
      {loading ? (
        <Typography>Loading customers...</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredCustomers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.login.uuid}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={customer.picture?.thumbnail}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {getInitials(customer.name.first, customer.name.last)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" noWrap>
                        {customer.name.first} {customer.name.last}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        @{customer.login.username}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, customer)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" noWrap>
                        {customer.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" noWrap>
                        {customer.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" noWrap>
                        {customer.location.city}, {customer.location.country}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`Age ${customer.dob.age}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={customer.location.state}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button size="small" startIcon={<EmailIcon />}>
                    Email
                  </Button>
                  <Button size="small" startIcon={<PhoneIcon />}>
                    Call
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Customer Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Customer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Customer</ListItemText>
        </MenuItem>
      </Menu>

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
