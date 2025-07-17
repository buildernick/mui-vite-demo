import * as React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CrmSelectCompany from "./CrmSelectCompany";
import CrmMenuContent from "./CrmMenuContent";
import CrmOptionsMenu from "./CrmOptionsMenu";

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedDrawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: open ? drawerWidth : collapsedDrawerWidth,
    boxSizing: "border-box",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  },
}));

export default function CrmSideMenu() {
  const [open, setOpen] = React.useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        {open && <CrmSelectCompany />}
        <Tooltip
          title={open ? "Collapse sidebar" : "Expand sidebar"}
          placement="right"
        >
          <IconButton onClick={handleToggle} size="small">
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CrmMenuContent collapsed={!open} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: open ? 2 : 1,
          gap: open ? 1 : 0,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: open ? "flex-start" : "center",
        }}
      >
        <Avatar
          sizes="small"
          alt="Alex Thompson"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
        >
          AT
        </Avatar>
        {open && (
          <>
            <Box sx={{ mr: "auto" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, lineHeight: "16px" }}
              >
                Alex Thompson
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                alex@acmecrm.com
              </Typography>
            </Box>
            <CrmOptionsMenu />
          </>
        )}
      </Stack>
    </Drawer>
  );
}
