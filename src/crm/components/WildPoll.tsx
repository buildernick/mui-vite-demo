import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { keyframes } from "@mui/material/styles";
import PollIcon from "@mui/icons-material/Poll";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import TimerIcon from "@mui/icons-material/Timer";

// Animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInAnimation = keyframes`
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const progressFillAnimation = keyframes`
  0% { width: 0%; }
  100% { width: var(--target-width); }
`;

// Styled components
const AnimatedCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  border: `2px solid ${theme.palette.primary.main}30`,
  borderRadius: 16,
  boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 40px ${theme.palette.primary.main}30`,
  },
}));

const OptionButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  justifyContent: "flex-start",
  padding: "16px 20px",
  marginBottom: 12,
  borderRadius: 12,
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 500,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? `${theme.palette.primary.main}15` : "transparent",
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}10`,
    borderColor: theme.palette.primary.main,
    animation: `${pulseAnimation} 0.6s ease-in-out`,
  },
}));

const ResultBar = styled(Box)<{ percentage: number; isWinner?: boolean; delay?: number }>(
  ({ theme, percentage, isWinner, delay = 0 }) => ({
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.palette.grey[200],
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
    border: isWinner ? `2px solid ${theme.palette.success.main}` : "none",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: `${percentage}%`,
      background: isWinner
        ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
        : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: "inherit",
      animation: `${progressFillAnimation} 2s ease-out ${delay}s both`,
      "--target-width": `${percentage}%`,
    },
  })
);

const ResultLabel = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: 16,
  transform: "translateY(-50%)",
  zIndex: 1,
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: "0.9rem",
  animation: `${slideInAnimation} 0.8s ease-out 1s both`,
}));

interface PollOption {
  id: string;
  text: string;
  votes: number;
  emoji?: string;
  description?: string;
}

interface WildPollProps {
  question: string;
  options: PollOption[];
  totalParticipants?: number;
  timeRemaining?: string;
  onVote?: (optionId: string) => void;
}

export default function WildPoll({
  question,
  options,
  totalParticipants = 0,
  timeRemaining,
  onVote
}: WildPollProps) {
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  const [hasVoted, setHasVoted] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const winningOption = options.reduce((prev, current) => 
    current.votes > prev.votes ? current : prev
  );

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      setHasVoted(true);
      // Delayed animation for results
      setTimeout(() => setShowResults(true), 500);
      onVote?.(selectedOption);
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  return (
    <AnimatedCard sx={{ maxWidth: 700, mx: "auto", mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Badge badgeContent={<PollIcon sx={{ fontSize: 16 }} />} color="primary">
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <PollIcon />
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {question}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                icon={<GroupIcon />} 
                label={`${totalParticipants} participants`} 
                size="small" 
                variant="outlined"
              />
              {timeRemaining && (
                <Chip 
                  icon={<TimerIcon />} 
                  label={timeRemaining} 
                  size="small" 
                  color="warning"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderWidth: 2, borderColor: "primary.main" }} />
        
        {!hasVoted ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: "text.secondary" }}>
              Choose your answer:
            </Typography>
            
            <Stack spacing={1}>
              {options.map((option, index) => (
                <OptionButton
                  key={option.id}
                  fullWidth
                  selected={selectedOption === option.id}
                  onClick={() => setSelectedOption(option.id)}
                  sx={{
                    animationDelay: `${index * 0.1}s`,
                    animation: `${slideInAnimation} 0.6s ease-out both`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    {option.emoji && (
                      <Typography sx={{ fontSize: "1.5rem", mr: 2 }}>
                        {option.emoji}
                      </Typography>
                    )}
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {option.text}
                      </Typography>
                      {option.description && (
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {selectedOption === option.id && (
                    <CheckCircleIcon sx={{ color: "primary.main", ml: 2 }} />
                  )}
                </OptionButton>
              ))}
            </Stack>
            
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={handleVote}
                disabled={!selectedOption}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: "none",
                  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 25px rgba(33, 150, 243, 0.4)",
                  },
                }}
              >
                Cast Your Vote 🗳️
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TrendingUpIcon sx={{ color: "success.main", mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: "success.main" }}>
                Live Results
              </Typography>
            </Box>
            
            {showResults && (
              <Stack spacing={2}>
                {options.map((option, index) => {
                  const percentage = getPercentage(option.votes);
                  const isSelected = option.id === selectedOption;
                  const isWinner = option.id === winningOption.id && totalVotes > 0;
                  
                  return (
                    <Box key={option.id} sx={{ position: "relative" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {option.emoji && (
                            <Typography sx={{ fontSize: "1.2rem", mr: 1 }}>
                              {option.emoji}
                            </Typography>
                          )}
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: isSelected || isWinner ? 700 : 500,
                              color: isWinner ? "success.main" : isSelected ? "primary.main" : "text.primary"
                            }}
                          >
                            {option.text}
                            {isSelected && " ✓"}
                            {isWinner && totalVotes > 0 && " 🏆"}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${option.votes} votes • ${percentage.toFixed(1)}%`}
                          size="small"
                          color={isWinner ? "success" : isSelected ? "primary" : "default"}
                          variant={isWinner || isSelected ? "filled" : "outlined"}
                        />
                      </Box>
                      <ResultBar 
                        percentage={percentage} 
                        isWinner={isWinner}
                        delay={index * 0.2}
                      >
                        <ResultLabel>
                          {percentage > 15 && `${percentage.toFixed(1)}%`}
                        </ResultLabel>
                      </ResultBar>
                    </Box>
                  );
                })}
              </Stack>
            )}
            
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: "background.paper", 
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider"
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Total Votes: {totalVotes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thank you for participating! 🎉
                </Typography>
              </Stack>
            </Box>
          </Box>
        )}
      </CardContent>
    </AnimatedCard>
  );
}
