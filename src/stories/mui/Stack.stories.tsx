import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const meta = {
  title: 'MUI/Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    spacing: {
      control: 'number',
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    },
    justifyContent: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalStack: Story = {
  args: {
    direction: 'column',
    spacing: 2,
    sx: { width: 300 },
    children: (
      <>
        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography>Item 1</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
          <Typography>Item 2</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography>Item 3</Typography>
        </Box>
      </>
    ),
  },
};

export const HorizontalStack: Story = {
  args: {
    direction: 'row',
    spacing: 2,
    children: (
      <>
        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography>Item 1</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
          <Typography>Item 2</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography>Item 3</Typography>
        </Box>
      </>
    ),
  },
};

export const WithDifferentAlignments: Story = {
  args: {
    direction: 'row',
    spacing: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    sx: { width: 400, height: 100, bgcolor: 'background.paper', p: 2, borderRadius: 1 },
    children: (
      <>
        <Box sx={{ p: 1, bgcolor: 'primary.main', height: '30px' }}>
          <Typography color="white">Item 1</Typography>
        </Box>
        <Box sx={{ p: 1, bgcolor: 'secondary.main', height: '50px' }}>
          <Typography color="white">Item 2</Typography>
        </Box>
        <Box sx={{ p: 1, bgcolor: 'error.main', height: '70px' }}>
          <Typography color="white">Item 3</Typography>
        </Box>
      </>
    ),
  },
};
