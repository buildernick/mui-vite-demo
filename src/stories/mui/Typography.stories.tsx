import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const meta = {
  title: 'MUI/Data Display/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'subtitle1', 'subtitle2', 
        'body1', 'body2',
        'caption', 'button', 'overline'
      ],
    },
    color: {
      control: 'select',
      options: [
        'initial', 'inherit', 'primary', 'secondary', 
        'error', 'warning', 'info', 'success',
        'text.primary', 'text.secondary', 'text.disabled'
      ],
    },
    align: {
      control: 'select',
      options: ['inherit', 'left', 'center', 'right', 'justify'],
    },
    gutterBottom: {
      control: 'boolean',
    },
    noWrap: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    variant: 'body1',
    children: 'This is a Typography component',
  },
};

export const Variants: Story = {
  render: () => (
    <Box sx={{ width: '600px' }}>
      <Typography variant="h1" gutterBottom>h1. Heading</Typography>
      <Typography variant="h2" gutterBottom>h2. Heading</Typography>
      <Typography variant="h3" gutterBottom>h3. Heading</Typography>
      <Typography variant="h4" gutterBottom>h4. Heading</Typography>
      <Typography variant="h5" gutterBottom>h5. Heading</Typography>
      <Typography variant="h6" gutterBottom>h6. Heading</Typography>
      <Typography variant="subtitle1" gutterBottom>subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
      <Typography variant="subtitle2" gutterBottom>subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
      <Typography variant="body1" gutterBottom>body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur.</Typography>
      <Typography variant="body2" gutterBottom>body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur.</Typography>
      <Typography variant="button" display="block" gutterBottom>button text</Typography>
      <Typography variant="caption" display="block" gutterBottom>caption text</Typography>
      <Typography variant="overline" display="block" gutterBottom>overline text</Typography>
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box sx={{ width: '500px' }}>
      <Typography variant="h6" color="primary" gutterBottom>Primary Color</Typography>
      <Typography variant="h6" color="secondary" gutterBottom>Secondary Color</Typography>
      <Typography variant="h6" color="error" gutterBottom>Error Color</Typography>
      <Typography variant="h6" color="warning" gutterBottom>Warning Color</Typography>
      <Typography variant="h6" color="info" gutterBottom>Info Color</Typography>
      <Typography variant="h6" color="success" gutterBottom>Success Color</Typography>
      <Typography variant="h6" color="text.primary" gutterBottom>Text Primary</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>Text Secondary</Typography>
      <Typography variant="h6" color="text.disabled" gutterBottom>Text Disabled</Typography>
    </Box>
  ),
};
