import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SaveIcon from "@mui/icons-material/Save";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

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

interface SavedView {
  id: string;
  name: string;
  filters: {
    search: string;
    sortBy: string;
  };
}

export default function CustomersV2() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name.first");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = React.useState(false);
  const [openSaveViewDialog, setOpenSaveViewDialog] = React.useState(false);
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [newCustomer, setNewCustomer] = React.useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    title: "Mr",
    city: "",
    country: "",
  });
  const [savedViews, setSavedViews] = React.useState<SavedView[]>([
    { id: "1", name: "All Customers", filters: { search: "", sortBy: "name.first" } },
    { id: "2", name: "Recent Contacts", filters: { search: "", sortBy: "registered.date" } },
    { id: "3", name: "By Location", filters: { search: "", sortBy: "location.city" } },
  ]);
  const [activeView, setActiveView] = React.useState<string>("1");
  const [newViewName, setNewViewName] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCustomers();
  }, [searchTerm, sortBy]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let url = `https://user-api.builder-io.workers.dev/api/users?perPage=50&sortBy=${sortBy}`;
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomers(customers.map((c) => c.login.uuid));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectOne = (uuid: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleLoadView = (view: SavedView) => {
    setActiveView(view.id);
    setSearchTerm(view.filters.search);
    setSortBy(view.filters.sortBy);
  };

  const handleSaveView = () => {
    if (newViewName.trim()) {
      const newView: SavedView = {
        id: Date.now().toString(),
        name: newViewName,
        filters: {
          search: searchTerm,
          sortBy,
        },
      };
      setSavedViews([...savedViews, newView]);
      setActiveView(newView.id);
      setNewViewName("");
      setOpenSaveViewDialog(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "48px", mb: 2, border: "2px solid hsl(45, 94%, 80%)", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", lineHeight: "20px" }}>
          Active View:
        </Box>
        {savedViews.map((view) => (
          <Box
            key={view.id}
            role="button"
            tabIndex={0}
            onClick={() => handleLoadView(view)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLoadView(view);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: activeView === view.id ? "rgb(2, 122, 242)" : "rgb(235, 238, 244)",
              borderColor: activeView === view.id ? "rgb(230, 242, 255)" : "rgb(218, 222, 231)",
              borderRadius: "999px",
              borderWidth: "1px",
              borderStyle: "solid",
              color: activeView === view.id ? "rgb(230, 242, 255)" : "rgb(86, 100, 129)",
              fontSize: "13px",
              height: "24px",
              justifyContent: "center",
              lineHeight: "19.5px",
              maxHeight: "20px",
              maxWidth: "100%",
              position: "relative",
              textWrap: "nowrap",
              userSelect: "none",
              cursor: "pointer",
              transition: "background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              px: 1,
              "&:hover": {
                backgroundColor: activeView === view.id ? "rgb(1, 102, 200)" : "rgb(220, 225, 235)",
              },
              "& > div": {
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "18px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          >
            <div>{view.name}</div>
          </Box>
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Customers v2
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilterDrawer(true)}
          >
            Views
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => setOpenSaveViewDialog(true)}
          >
            Save View
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Customer
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name.first">First Name</MenuItem>
              <MenuItem value="name.last">Last Name</MenuItem>
              <MenuItem value="location.city">City</MenuItem>
              <MenuItem value="location.country">Country</MenuItem>
              <MenuItem value="registered.date">Registration Date</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {selectedCustomers.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip
              label={`${selectedCustomers.length} selected`}
              onDelete={() => setSelectedCustomers([])}
            />
          </Stack>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedCustomers.length > 0 && selectedCustomers.length < customers.length
                    }
                    checked={customers.length > 0 && selectedCustomers.length === customers.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  hover
                  selected={selectedCustomers.includes(customer.login.uuid)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.login.uuid)}
                      onChange={() => handleSelectOne(customer.login.uuid)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={customer.picture.thumbnail} />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {customer.name.first} {customer.name.last}
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
                  <TableCell>
                    <Button size="small">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Drawer
        anchor="left"
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Saved Views
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {savedViews.map((view) => (
              <ListItem key={view.id} disablePadding>
                <ListItemButton
                  selected={activeView === view.id}
                  onClick={() => {
                    handleLoadView(view);
                    setOpenFilterDrawer(false);
                  }}
                >
                  <ListItemText primary={view.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

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

      <Dialog open={openSaveViewDialog} onClose={() => setOpenSaveViewDialog(false)}>
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
          <Button onClick={() => setOpenSaveViewDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveView} variant="contained" disabled={!newViewName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
