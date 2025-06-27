import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const meta = {
  title: 'MUI/Data Display/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
    },
    textAlign: {
      control: 'select',
      options: ['center', 'left', 'right'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  render: () => (
    <Box sx={{ width: '400px' }}>
      <Typography paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
      </Typography>
      <Divider />
      <Typography paragraph sx={{ mt: 2 }}>
        Praesent eget porttitor quam. Aliquam erat volutpat. Donec placerat nisl magna.
      </Typography>
    </Box>
  ),
};

export const WithText: Story = {
  render: () => (
    <Box sx={{ width: '400px' }}>
      <Typography paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Divider>CENTER</Divider>
      <Typography paragraph sx={{ mt: 2 }}>
        Praesent eget porttitor quam. Aliquam erat volutpat.
      </Typography>
      
      <Divider textAlign="left" sx={{ mt: 3 }}>LEFT</Divider>
      <Typography paragraph sx={{ mt: 2 }}>
        Maecenas vitae eros purus. Nullam auctor dolor ut nunc malesuada.
      </Typography>
      
      <Divider textAlign="right" sx={{ mt: 3 }}>RIGHT</Divider>
      <Typography paragraph sx={{ mt: 2 }}>
        Mauris at elit a ligula ullamcorper suscipit. 
      </Typography>
    </Box>
  ),
};

export const WithChip: Story = {
  render: () => (
    <Box sx={{ width: '400px' }}>
      <Typography paragraph>
        Above content section
      </Typography>
      <Divider>
        <Chip label="SECTION DIVIDER" />
      </Divider>
      <Typography paragraph sx={{ mt: 2 }}>
        Below content section
      </Typography>
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box sx={{ display: 'flex', width: '400px', height: '100px', alignItems: 'center' }}>
      <Typography sx={{ px: 2 }}>Left</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ px: 2 }}>Middle</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ px: 2 }}>Right</Typography>
    </Box>
  ),
};
