import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Route, Routes, MemoryRouter, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Create some demo pages for the router
const HomePage = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>Home Page</Typography>
    <Typography variant="body1">This is the home page of the application.</Typography>
  </Box>
);

const AboutPage = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>About Page</Typography>
    <Typography variant="body1">This is the about page of the application.</Typography>
  </Box>
);

const ContactPage = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>Contact Page</Typography>
    <Typography variant="body1">This is the contact page of the application.</Typography>
  </Box>
);

const AppDemo = ({ initialRoute = '/' }) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <Box sx={{ width: '500px' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Link to="/" style={{ color: 'blue', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ color: 'blue', textDecoration: 'none' }}>About</Link>
        <Link to="/contact" style={{ color: 'blue', textDecoration: 'none' }}>Contact</Link>
      </Box>
      <Box sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Box>
    </Box>
  </MemoryRouter>
);

// This is a meta-component since Route is not used directly
const meta = {
  title: 'MUI/Routing/Route',
  // Using a wrapper component since Route must be used within a Routes component
  component: AppDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialRoute: {
      control: 'select',
      options: ['/', '/about', '/contact'],
    },
  },
} satisfies Meta<typeof AppDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    initialRoute: '/',
  },
};

export const About: Story = {
  args: {
    initialRoute: '/about',
  },
};

export const Contact: Story = {
  args: {
    initialRoute: '/contact',
  },
};
