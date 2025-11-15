import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface BasicPollProps {
  question: string;
  options: PollOption[];
  onVote?: (optionId: string) => void;
}

export default function BasicPoll({
  question,
  options,
  onVote
}: BasicPollProps) {
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  const [hasVoted, setHasVoted] = React.useState(false);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      setHasVoted(true);
      onVote?.(selectedOption);
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {question}
        </Typography>
        
        {!hasVoted ? (
          <Box>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                value={selectedOption}
                onChange={handleSelectionChange}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.text}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleVote}
                disabled={!selectedOption}
                size="large"
              >
                Submit Vote
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Poll Results
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              {options.map((option) => {
                const percentage = getPercentage(option.votes);
                const isSelected = option.id === selectedOption;
                
                return (
                  <Box key={option.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? "primary.main" : "text.primary"
                        }}
                      >
                        {option.text} {isSelected && "✓"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: isSelected ? "primary.main" : "secondary.main",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Total votes: {totalVotes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
