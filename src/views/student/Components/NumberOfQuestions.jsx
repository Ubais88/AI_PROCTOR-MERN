import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Box, Button, Stack, Typography } from '@mui/material';

const NumberOfQuestions = ({ questionLength, submitTest, cQuestions }) => {
  const totalQuestions = questionLength; 
  const questionNumbers = Array.from({ length: totalQuestions }, (_, index) => index + 1);

  const rows = [];
  for (let i = 0; i < questionNumbers.length; i += 5) {
    rows.push(questionNumbers.slice(i, i + 5));
  }

  const [timer, setTimer] = useState(600); 

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown); 
          console.log("Submit");
          submitTest(); 
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown); 
    };
  }, [submitTest]);

  return (
    <>
      <Box
        position="sticky"
        top="0"
        zIndex={1}
        bgcolor="white" 
        paddingY="10px" 
        width="100%"
        px={3}
        mb={5}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Questions: {cQuestions ? cQuestions+1 : 1}/{totalQuestions}</Typography>
          <Typography variant="h6">
            Time Left: {Math.floor(timer / 60)}:{timer % 60}
          </Typography>
          <Button variant="contained" onClick={submitTest} color="error">
            Finish Test
          </Button>
        </Stack>
      </Box>

      <Box p={3} mt={5} maxHeight="270px">
        <Grid container spacing={1}>
          {rows.map((row, rowIndex) => (
            <Grid key={rowIndex} item xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="start">
                {row.map((questionNumber) => {
                  let backgroundColor = '#ccc'; 

                  if (questionNumber < cQuestions+1) {
                    backgroundColor = 'green';
                  } else if (questionNumber === cQuestions+1) {
                    backgroundColor = 'red'; 
                  } else {
                    backgroundColor = '#ccc'; 
                  }
                  return (
                    <Avatar
                      key={questionNumber}
                      variant="rounded"
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        margin: '3px',
                        background: backgroundColor,
                      }}
                    >
                      {questionNumber}
                    </Avatar>
                  );
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default NumberOfQuestions;
