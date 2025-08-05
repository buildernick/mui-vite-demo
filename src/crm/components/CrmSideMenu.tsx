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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CrmSelectCompany from "./CrmSelectCompany";
import CrmMenuContent from "./CrmMenuContent";
import CrmOptionsMenu from "./CrmOptionsMenu";

const drawerWidth = 240;
const collapsedWidth = 64;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ collapsed }) => ({
  width: collapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  transition: "width 0.3s ease",
  [`& .${drawerClasses.paper}`]: {
    width: collapsed ? collapsedWidth : drawerWidth,
    boxSizing: "border-box",
    transition: "width 0.3s ease",
    overflowX: "hidden",
  },
}));

export default function CrmSideMenu() {
  const [collapsed, setCollapsed] = React.useState(false);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Drawer
      variant="permanent"
      collapsed={collapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
            p: 1.5,
          }}
        >
          <CrmSelectCompany />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          p: 1,
          mt: collapsed ? "calc(var(--template-frame-height, 0px) + 4px)" : 0,
        }}
      >
        <Tooltip title={collapsed ? "Expand menu" : "Collapse menu"} placement="right">
          <IconButton onClick={handleToggleCollapse} size="small">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
        <CrmMenuContent collapsed={collapsed} />
      </Box>
      <Stack
        direction={collapsed ? "column" : "row"}
        sx={{
          p: collapsed ? 1 : 2,
          gap: collapsed ? 0.5 : 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: collapsed ? "center" : "flex-start",
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
        {!collapsed && (
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
