import * as React from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Paper,
  Tabs,
  Tab,
  Checkbox,
} from "@mui/material";
import RakutenButton from "../components/RakutenButton";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

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

interface SavedView {
  id: string;
  name: string;
  filters: {
    search: string;
    country: string;
    minAge: string;
  };
}

const defaultViews: SavedView[] = [
  { id: "all", name: "All Contacts", filters: { search: "", country: "", minAge: "" } },
  { id: "us", name: "US Customers", filters: { search: "", country: "USA", minAge: "" } },
  { id: "young", name: "Under 30", filters: { search: "", country: "", minAge: "0" } },
];

export default function CustomersV2() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [countryFilter, setCountryFilter] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSaveView, setOpenSaveView] = React.useState(false);
  const [savedViews, setSavedViews] = React.useState<SavedView[]>(defaultViews);
  const [activeView, setActiveView] = React.useState<string>("all");
  const [newViewName, setNewViewName] = React.useState("");
  const [filterAnchor, setFilterAnchor] = React.useState<null | HTMLElement>(null);
  const [newCustomer, setNewCustomer] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    country: "",
  });

  const fetchCustomers = async (search = "", country = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "50",
        ...(search && { search }),
      });
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`
      );
      const data = await response.json();
      let filtered = data.data;
      if (country) {
        filtered = filtered.filter((user: User) => user.location.country === country);
      }
      setCustomers(filtered);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleApplyFilters = () => {
    fetchCustomers(searchQuery, countryFilter);
    setFilterAnchor(null);
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
        fetchCustomers(searchQuery, countryFilter);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleSaveView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: {
        search: searchQuery,
        country: countryFilter,
        minAge: "",
      },
    };
    setSavedViews([...savedViews, newView]);
    setActiveView(newView.id);
    setOpenSaveView(false);
    setNewViewName("");
  };

  const handleLoadView = (view: SavedView) => {
    setSearchQuery(view.filters.search);
    setCountryFilter(view.filters.country);
    setActiveView(view.id);
    fetchCustomers(view.filters.search, view.filters.country);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={params.row.picture.thumbnail} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.name.first} {params.row.name.last}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{params.row.login.username}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "phone",
      headerName: "PHONE NUMBER",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "location",
      headerName: "CONTACT OWNER",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          No owner
        </Typography>
      ),
    },
    {
      field: "company",
      headerName: "PRIMARY COMPANY",
      flex: 1,
      minWidth: 150,
      renderCell: () => (
        <Typography variant="body2" color="text.secondary">
          --
        </Typography>
      ),
    },
    {
      field: "lastActivity",
      headerName: "LAST ACTIVITY DATE",
      flex: 1,
      minWidth: 150,
      renderCell: () => (
        <Typography variant="body2" color="text.secondary">
          --
        </Typography>
      ),
    },
    {
      field: "leadStatus",
      headerName: "LEAD STATUS",
      flex: 1,
      minWidth: 120,
      renderCell: () => (
        <Typography variant="body2" color="text.secondary">
          --
        </Typography>
      ),
    },
  ];

  const rows = customers.map((customer) => ({
    id: customer.login.uuid,
    ...customer,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="h1">
          Customers v2
        </Typography>
        <RakutenButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add Contact
        </RakutenButton>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeView}
          onChange={(e, val) => {
            const view = savedViews.find((v) => v.id === val);
            if (view) handleLoadView(view);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {savedViews.map((view) => (
            <Tab key={view.id} label={view.name} value={view.id} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search name, phone, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          size="small"
        />
        <RakutenButton
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
        >
          Advanced Filters
        </RakutenButton>
        <RakutenButton variant="outlined" startIcon={<SaveIcon />} onClick={() => setOpenSaveView(true)}>
          Save View
        </RakutenButton>
        <RakutenButton variant="contained" onClick={handleApplyFilters}>
          Search
        </RakutenButton>
      </Box>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Filter Options
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={countryFilter}
              label="Country"
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <MenuItem value="">All Countries</MenuItem>
              <MenuItem value="USA">USA</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="Australia">Australia</MenuItem>
            </Select>
          </FormControl>
          <RakutenButton variant="contained" fullWidth onClick={handleApplyFilters}>
            Apply Filters
          </RakutenButton>
        </Box>
      </Menu>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {selectedRows.length > 0
            ? `${selectedRows.length} selected`
            : `${customers.length} contacts`}
        </Typography>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        sx={{
          minHeight: 500,
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
      />

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
          <RakutenButton onClick={() => setOpenDialog(false)}>Cancel</RakutenButton>
          <RakutenButton onClick={handleCreateCustomer} variant="contained">
            Create Customer
          </RakutenButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openSaveView} onClose={() => setOpenSaveView(false)} maxWidth="xs" fullWidth>
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
          <RakutenButton onClick={() => setOpenSaveView(false)}>Cancel</RakutenButton>
          <RakutenButton onClick={handleSaveView} variant="contained" disabled={!newViewName}>
            Save View
          </RakutenButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
