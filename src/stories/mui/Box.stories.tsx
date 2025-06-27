import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const meta = {
  title: 'MUI/Layout/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sx: { control: 'object' },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sx: { 
      width: 300, 
      height: 200, 
      bgcolor: 'primary.light', 
      p: 2, 
      borderRadius: 2 
    },
    children: <Typography color="white">This is a Box component</Typography>,
  },
};

export const WithShadow: Story = {
  args: {
    sx: { 
      width: 300, 
      height: 200, 
      bgcolor: 'background.paper', 
      p: 2, 
      borderRadius: 2,
      boxShadow: 3
    },
    children: <Typography>Box with shadow</Typography>,
  },
};

export const FlexContainer: Story = {
  args: {
    sx: { 
      display: 'flex', 
      width: 400, 
      height: 100, 
      bgcolor: 'background.paper', 
      p: 1, 
      gap: 2,
      borderRadius: 1,
      boxShadow: 1
    },
    children: (
      <>
        <Box sx={{ width: 100, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ width: 100, height: '100%', bgcolor: 'secondary.main', borderRadius: 1 }} />
        <Box sx={{ width: 100, height: '100%', bgcolor: 'error.main', borderRadius: 1 }} />
      </>
    ),
  },
};
