import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Create a component to demonstrate alpha usage
const AlphaDemo = ({ color = 'primary.main', alphaValue = 0.5 }) => {
  const theme = createTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Alpha Transparency Demo</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: color 
          }} />
          <Typography>Original Color</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: (theme) => alpha(theme.palette[color.split('.')[0]][color.split('.')[1]], alphaValue)
          }} />
          <Typography>With Alpha: {alphaValue}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const meta = {
  title: 'MUI/Styles/alpha',
  component: AlphaDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary.main', 'secondary.main', 
        'error.main', 'warning.main', 
        'info.main', 'success.main'
      ],
    },
    alphaValue: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
  },
} satisfies Meta<typeof AlphaDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: 'primary.main',
    alphaValue: 0.5,
  },
};

export const WithSecondary: Story = {
  args: {
    color: 'secondary.main',
    alphaValue: 0.7,
  },
};

export const WithError: Story = {
  args: {
    color: 'error.main',
    alphaValue: 0.3,
  },
};
