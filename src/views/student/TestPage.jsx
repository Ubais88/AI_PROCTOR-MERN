import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
import NumberOfQuestions from './Components/NumberOfQuestions';
import WebCam from './Components/WebCam';
// import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TestPage = () => {
  const { examId } = useParams();
  const [warningCount, setWarningCount] = useState(0);

  const [questions, setQuestions] = useState([]);
  const { data, isLoading } = useGetQuestionsQuery(examId);
  const [cQuestions, setCQuestions] = useState();
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    ProhibitedObjectCount: 0,
    headMovementCount: 0,
    examId: examId,
    username: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
  });
  
  useEffect(() => {
    if (data) {
      setQuestions(data);
    }
  }, [data]);

  const handleTestSubmission = async () => {
    try {
      setCheatingLog((prevLog) => ({
        ...prevLog,
        username: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
      }));
      console.log("Cheating log : ", cheatingLog)
      await saveCheatingLog(cheatingLog);

      await saveCheatingLogMutation(cheatingLog).unwrap();

      toast.success('User Logs Saved!!');

      navigate(`/Success`);
    } catch (error) {
      console.log('cheatlog: ', error);
    }
  };

  // console.log('Total Warning in Test :', warningCount);

  const saveUserTestScore = () => {
    setScore(score + 1);
  };

  const saveCheatingLog = async (cheatingLog) => {
    console.log(cheatingLog);
  };

  return (
    <PageContainer title="TestPage" description="This is TestPage">
      <Box pt="3rem">
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <BlankCard>
              <Box
                width="100%"
                minHeight="400px"
                boxShadow={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <MultipleChoiceQuestion
                    questions={data}
                    setCQuestions={setCQuestions}
                    saveUserTestScore={saveUserTestScore}
                  />
                )}
              </Box>
            </BlankCard>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    maxHeight="300px"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      justifyContent: 'center',
                      overflowY: 'auto',
                      height: '100%',
                    }}
                  >
                    <NumberOfQuestions
                      cQuestions={cQuestions}
                      questionLength={questions.length}
                      submitTest={handleTestSubmission}
                      // examDurationInSeconds={examDurationInSeconds}
                    />
                  </Box>
                </BlankCard>
              </Grid>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    width="300px"
                    maxHeight="180px"
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                  >
                    <WebCam
                      // cheatingLog={cheatingLog}
                      setCheatingLog={setCheatingLog}
                      handleTestSubmission={handleTestSubmission}
                      warningCount={warningCount}
                      setWarningCount={setWarningCount}
                    />
                  </Box>
                </BlankCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default TestPage;
