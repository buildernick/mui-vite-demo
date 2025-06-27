import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const TabsDemo = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          {...props}
        />
      </Box>
      <TabPanel value={value} index={0}>
        Content for Tab One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Content for Tab Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Tab Three
      </TabPanel>
    </Box>
  );
};

const meta = {
  title: 'MUI/Navigation/Tabs',
  component: TabsDemo,
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
      control: 'radio',
      options: ['standard', 'scrollable', 'fullWidth'],
    },
    centered: {
      control: 'boolean',
    },
    indicatorColor: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    textColor: {
      control: 'select',
      options: ['primary', 'secondary', 'inherit'],
    },
  },
} satisfies Meta<typeof TabsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <Tab label="Tab One" {...a11yProps(0)} />
        <Tab label="Tab Two" {...a11yProps(1)} />
        <Tab label="Tab Three" {...a11yProps(2)} />
      </>
    ),
    orientation: 'horizontal',
    variant: 'standard',
  },
};

export const WithIcons: Story = {
  args: {
    children: (
      <>
        <Tab icon={<PhoneIcon />} label="CALLS" {...a11yProps(0)} />
        <Tab icon={<FavoriteIcon />} label="FAVORITES" {...a11yProps(1)} />
        <Tab icon={<PersonPinIcon />} label="PROFILE" {...a11yProps(2)} />
      </>
    ),
    orientation: 'horizontal',
    variant: 'standard',
    centered: true,
  },
};

export const IconsOnly: Story = {
  args: {
    children: (
      <>
        <Tab icon={<PhoneIcon />} aria-label="phone" {...a11yProps(0)} />
        <Tab icon={<FavoriteIcon />} aria-label="favorite" {...a11yProps(1)} />
        <Tab icon={<PersonPinIcon />} aria-label="person" {...a11yProps(2)} />
      </>
    ),
    orientation: 'horizontal',
    variant: 'standard',
    centered: true,
  },
};
