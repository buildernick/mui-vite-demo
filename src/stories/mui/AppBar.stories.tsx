import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

const meta = {
  title: 'MUI/Navigation/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['fixed', 'absolute', 'sticky', 'static', 'relative'],
    },
    color: {
      control: 'select',
      options: ['default', 'inherit', 'primary', 'secondary', 'transparent'],
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 'static',
    color: 'primary',
    children: (
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          App Bar
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    ),
  },
};

export const Dashboard: Story = {
  args: {
    position: 'static',
    color: 'default',
    elevation: 0,
    children: (
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    ),
  },
};

export const Transparent: Story = {
  args: {
    position: 'absolute',
    color: 'transparent',
    elevation: 0,
    sx: { backdropFilter: 'blur(8px)' },
    children: (
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Transparent AppBar
        </Typography>
        <Button color="inherit">Action</Button>
      </Toolbar>
    ),
  },
};
