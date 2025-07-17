import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box"; // Added the missing import
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/" },
  { text: "Customers", icon: <PeopleRoundedIcon />, path: "/customers" },
  { text: "Customers V1", icon: <PeopleRoundedIcon />, path: "/customers-v1" },
  { text: "Customers V2", icon: <PeopleRoundedIcon />, path: "/customers-v2" },
  { text: "Customers V3", icon: <PeopleRoundedIcon />, path: "/customers-v3" },
  { text: "Deals", icon: <BusinessCenterRoundedIcon />, path: "/deals" },
  { text: "Contacts", icon: <ContactsRoundedIcon />, path: "/contacts" },
  { text: "Tasks", icon: <AssignmentRoundedIcon />, path: "/tasks" },
  { text: "Reports", icon: <AssessmentRoundedIcon />, path: "/reports" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "Help & Support", icon: <HelpOutlineRoundedIcon />, path: "/help" },
];

import Tooltip from "@mui/material/Tooltip";

interface CrmMenuContentProps {
  collapsed?: boolean;
}

export default function CrmMenuContent({
  collapsed = false,
}: CrmMenuContentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderMenuItem = (item: any, index: number) => {
    const isSelected = location.pathname === item.path;

    if (collapsed) {
      return (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <Tooltip title={item.text} placement="right">
            <ListItemButton
              selected={isSelected}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      );
    }

    return (
      <ListItem key={index} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          selected={isSelected}
          onClick={() => handleNavigation(item.path)}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 3,
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{ opacity: collapsed ? 0 : 1 }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => renderMenuItem(item, index))}
      </List>
      <Box>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {secondaryListItems.map((item, index) => renderMenuItem(item, index))}
        </List>
      </Box>
    </Stack>
  );
}
