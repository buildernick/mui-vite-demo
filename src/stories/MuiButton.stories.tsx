import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const meta = {
  title: 'MUI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: { onClick: () => console.log('Button clicked') },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// For complex rendering cases, we use the render function
export const ButtonSizes: Story = {
  render: () => (
    <Stack spacing={2} direction="row" alignItems="center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Stack>
  ),
};

export const ButtonColors: Story = {
  render: () => (
    <Stack spacing={2} direction="column" alignItems="flex-start">
      <Stack spacing={2} direction="row">
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" color="error">Error</Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" color="primary">Primary</Button>
        <Button variant="outlined" color="secondary">Secondary</Button>
        <Button variant="outlined" color="error">Error</Button>
      </Stack>
    </Stack>
  ),
};
