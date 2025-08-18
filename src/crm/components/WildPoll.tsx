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
  background: `linear-gradient(135deg, #FFD700 15%, #32CD32 85%)`,
  border: `3px solid #FFD700`,
  borderRadius: 20,
  boxShadow: `0 12px 40px rgba(255, 215, 0, 0.4)`,
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 50%, #FFFF00 0%, transparent 50%), radial-gradient(circle at 80% 50%, #00FF00 0%, transparent 50%)`,
    opacity: 0.1,
    pointerEvents: "none",
  },
  "&:hover": {
    transform: "translateY(-8px) rotateX(2deg)",
    boxShadow: `0 20px 60px rgba(255, 215, 0, 0.6), 0 8px 32px rgba(50, 205, 50, 0.4)`,
    filter: "brightness(1.1)",
  },
}));

const OptionButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  justifyContent: "flex-start",
  padding: "20px 24px",
  marginBottom: 16,
  borderRadius: 20,
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: 600,
  border: selected
    ? `3px solid #FFD700`
    : `3px solid #32CD32`,
  background: selected
    ? `linear-gradient(135deg, #FFFF00 0%, #FFD700 50%, #FFA500 100%)`
    : `linear-gradient(135deg, #90EE90 0%, #32CD32 50%, #228B22 100%)`,
  color: selected ? "#2E7D32" : "#1B5E20",
  boxShadow: selected
    ? `0 8px 25px rgba(255, 215, 0, 0.5)`
    : `0 6px 20px rgba(50, 205, 50, 0.4)`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
    transition: "left 0.6s",
  },
  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    background: selected
      ? `linear-gradient(135deg, #FFFF33 0%, #FFD700 50%, #FF8C00 100%)`
      : `linear-gradient(135deg, #98FB98 0%, #00FF00 50%, #00FF7F 100%)`,
    boxShadow: selected
      ? `0 12px 35px rgba(255, 215, 0, 0.7)`
      : `0 10px 30px rgba(50, 205, 50, 0.6)`,
    animation: `${pulseAnimation} 0.8s ease-in-out infinite`,
    "&:before": {
      left: "100%",
    },
  },
}));

const ResultBar = styled(Box)<{ percentage: number; isWinner?: boolean; delay?: number }>(
  ({ theme, percentage, isWinner, delay = 0 }) => ({
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E8",
    position: "relative",
    overflow: "hidden",
    marginBottom: 12,
    border: isWinner ? `4px solid #FFD700` : `2px solid #90EE90`,
    boxShadow: isWinner
      ? `0 6px 20px rgba(255, 215, 0, 0.4)`
      : `0 4px 15px rgba(50, 205, 50, 0.3)`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
      zIndex: 2,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: `${percentage}%`,
      background: isWinner
        ? `linear-gradient(90deg, #FFFF00 0%, #FFD700 30%, #FFA500 60%, #FF6347 100%)`
        : `linear-gradient(90deg, #ADFF2F 0%, #32CD32 30%, #00FF00 60%, #00FA9A 100%)`,
      borderRadius: "inherit",
      animation: `${progressFillAnimation} 2.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
      "--target-width": `${percentage}%`,
      zIndex: 1,
      boxShadow: isWinner
        ? `inset 0 2px 10px rgba(255, 215, 0, 0.6)`
        : `inset 0 2px 10px rgba(50, 205, 50, 0.5)`,
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
