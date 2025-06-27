import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const meta = {
  title: 'MUI/Layout/CssBaseline',
  component: CssBaseline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CssBaseline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCssBaseline: Story = {
  render: () => (
    <Box sx={{ width: '500px', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <CssBaseline />
      <Typography variant="h3" gutterBottom>
        With CssBaseline
      </Typography>
      <Typography variant="body1" gutterBottom>
        CssBaseline applies normalized styles across the page, setting consistent margin, padding, 
        font-family, and more. It establishes a consistent baseline across browsers.
      </Typography>
      <Typography variant="body1">
        This component is mostly used at the top level of your app, usually once per app.
      </Typography>
    </Box>
  ),
};
