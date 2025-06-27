import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const meta = {
  title: 'MUI/Surfaces/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
    },
    raised: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    sx: { width: 300 },
    children: (
      <>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Card Title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a basic card with just some text content. Cards can contain
            various components to create rich interfaces.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </>
    ),
  },
};

export const WithMedia: Story = {
  args: {
    sx: { width: 345 },
    children: (
      <>
        <CardMedia
          component="img"
          height="140"
          image="https://source.unsplash.com/random/600x400/?nature"
          alt="green landscape"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Nature Scene
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A beautiful landscape showcasing the wonders of nature. This image was selected 
            randomly from Unsplash's collection.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </>
    ),
  },
};

export const Complex: Story = {
  args: {
    sx: { width: 345 },
    children: (
      <>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'red' }} aria-label="card">
              C
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Complex Card Example"
          subheader="September 14, 2023"
        />
        <CardMedia
          component="img"
          height="194"
          image="https://source.unsplash.com/random/600x400/?technology"
          alt="Technology image"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This card demonstrates a more complex layout with avatar, header, 
            media, and interactive action buttons.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Button size="small" sx={{ marginLeft: 'auto' }}>Learn More</Button>
        </CardActions>
      </>
    ),
  },
};
