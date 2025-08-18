import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import PollIcon from "@mui/icons-material/Poll";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BasicPoll from "../components/BasicPoll";
import WildPoll from "../components/WildPoll";

export default function Polls() {
  // Sample data for basic poll
  const [basicPollOptions, setBasicPollOptions] = React.useState([
    { id: "option1", text: "Remote work", votes: 45 },
    { id: "option2", text: "Hybrid work", votes: 32 },
    { id: "option3", text: "Office work", votes: 18 },
    { id: "option4", text: "Flexible schedule", votes: 27 },
  ]);

  // Sample data for wild poll
  const [wildPollOptions, setWildPollOptions] = React.useState([
    { 
      id: "pizza", 
      text: "Pizza Party", 
      votes: 23, 
      emoji: "🍕", 
      description: "Classic pizza with everyone's favorite toppings" 
    },
    { 
      id: "bbq", 
      text: "BBQ Cookout", 
      votes: 18, 
      emoji: "🔥", 
      description: "Outdoor grilling with burgers and hotdogs" 
    },
    { 
      id: "potluck", 
      text: "Potluck Dinner", 
      votes: 31, 
      emoji: "🥘", 
      description: "Everyone brings their signature dish" 
    },
    { 
      id: "catering", 
      text: "Catered Meal", 
      votes: 12, 
      emoji: "🍽️", 
      description: "Professional catering from local restaurant" 
    },
  ]);

  const handleBasicPollVote = (optionId: string) => {
    setBasicPollOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
  };

  const handleWildPollVote = (optionId: string) => {
    setWildPollOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <PollIcon sx={{ fontSize: 40 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Company Polls
          </Typography>
        </Stack>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
          Voice your opinion on important company decisions. Your feedback helps us make better choices for everyone.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip 
            label="Interactive" 
            size="small" 
            sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
          <Chip 
            label="Real-time Results" 
            size="small" 
            sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
          <Chip 
            label="Anonymous" 
            size="small" 
            sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        </Stack>
      </Paper>

      {/* Basic Poll Section */}
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <PollIcon color="primary" />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Basic Poll Example
          </Typography>
          <Chip label="Simple & Clean" variant="outlined" size="small" />
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 700 }}>
          A straightforward polling interface with essential functionality. Perfect for quick decisions and simple questions.
        </Typography>
        
        <BasicPoll
          question="What's your preferred work arrangement?"
          options={basicPollOptions}
          onVote={handleBasicPollVote}
        />
      </Box>

      <Divider sx={{ my: 6, borderWidth: 2, borderColor: "primary.main" }} />

      {/* Wild Poll Section */}
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <TrendingUpIcon color="secondary" />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Enhanced Poll Example
          </Typography>
          <Chip label="Animated & Interactive" variant="outlined" size="small" color="secondary" />
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 700 }}>
          A feature-rich polling component with animations, emojis, descriptions, and real-time visual feedback. 
          Great for engaging team events and important decisions.
        </Typography>
        
        <WildPoll
          question="What should we do for the next team event?"
          options={wildPollOptions}
          totalParticipants={84}
          timeRemaining="2 days left"
          onVote={handleWildPollVote}
        />
      </Box>

      {/* Footer Info */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          backgroundColor: "grey.50", 
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Poll Features
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time voting • Anonymous responses • Visual results • Mobile-friendly
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip label="✨ Interactive" size="small" />
            <Chip label="📊 Analytics" size="small" />
            <Chip label="🎨 Customizable" size="small" />
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
