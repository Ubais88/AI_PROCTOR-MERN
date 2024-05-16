import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as facelandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { Box, Card } from '@mui/material';
import { drawMesh } from './meshutitlity';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function Home({
  setWarningCount,
  warningCount,
  handleTestSubmission,
  setCheatingLog,
}) {
  const [headMovedStartTime, setHeadMovedStartTime] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // const [volumeLevel, setVolumeLevel] = useState(0); 
  // const threshold = 0.5; 
  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then((stream) => {
  //       const audioContext = new AudioContext();
  //       const source = audioContext.createMediaStreamSource(stream);
  //       const analyser = audioContext.createAnalyser();
  //       source.connect(analyser);
  //       analyser.fftSize = 32; // Adjust FFT size for accuracy

  //       const dataArray = new Uint8Array(analyser.frequencyBinCount);

  //       const updateVolume = () => {
  //         analyser.getByteFrequencyData(dataArray);
  //         let sum = 0;
  //         for (let i = 0; i < dataArray.length; i++) {
  //           sum += dataArray[i];
  //         }
  //         const average = sum / dataArray.length;
  //         setVolumeLevel(average / 255); // Normalize volume level to range [0, 1]
  //       };

  //       const interval = setInterval(updateVolume, 100); // Update volume level every 100ms

  //       return () => {
  //         clearInterval(interval);
  //         audioContext.close();
  //       };
  //     })
  //     .catch((error) => {
  //       console.error('Error accessing microphone:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   console.log("Volume level : ", volumeLevel)
  //   if (volumeLevel >= threshold) {
  //     toast.warning('Voice reached the specific point!');
  //   }
  // }, [volumeLevel, threshold]);


  const runModels = async () => {
    const net = await cocossd.load();
    console.log('Ai models loaded.');

    const faceMesh = await facelandmarksDetection.load(
      facelandmarksDetection.SupportedPackages.mediapipeFacemesh,
    );
    console.log('Face landmarks detection model loaded.');

    intervalRef.current = setInterval(() => {
      detect(net, faceMesh);
    }, 1500);
  };

  useEffect(() => {
    runModels();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  console.log('Total Warning in WebCam :', warningCount);

  // if (warningCount >= 5) {
  //   handleTestSubmission();
  //   setWarningCount(0);
  //   clearInterval(intervalRef.current);
  //   console.log('Interval cleared :', intervalRef);
  //   navigate(`/Success`);
  // }

  const updateHeadMovedStartTime = () => {
    setHeadMovedStartTime((prevTime) => {
      if (prevTime === null) {
        return new Date();
      } else {
        const currentTime = new Date();
        const elapsedTime = currentTime - prevTime;
        console.log('Gap: ', elapsedTime);
        if (elapsedTime >= 5000) {
          console.log('Alert');
          setCheatingLog((prevLog) => ({
            ...prevLog,
            headMovementCount: prevLog.headMovementCount + 1,
          }));
          setWarningCount((prevCount) => prevCount + 1);
          // swal('Head Movement Detected:', 'Action has been Recorded', 'error');
          toast.error('Head Movement Detected');
          return null;
        }
        return prevTime;
      }
    });
  };

  const detect = async (objNet, facemeshModel) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await objNet.detect(video);
      let person_count = 0;
      if (obj.length < 1) {
        toast.dismiss();
        setCheatingLog((prevLog) => ({
          ...prevLog,
          noFaceCount: prevLog.noFaceCount + 1,
        }));
        setWarningCount((prevCount) => prevCount + 1);
        // swal('Face Not Visible', 'Action has been Recorded', 'error');
        toast.error('Face Not Visible');
      }

      obj.forEach((element) => {
        if (element.class === 'cell phone') {
          setCheatingLog((prevLog) => ({
            ...prevLog,
            cellPhoneCount: prevLog.cellPhoneCount + 1,
          }));
          setWarningCount((prevCount) => prevCount + 1);
          // swal('Cell Phone Detected', 'Action has been Recorded', 'error');
          toast.error('Cell Phone Detected');
        }
        if (element.class === 'book') {
          setCheatingLog((prevLog) => ({
            ...prevLog,
            ProhibitedObjectCount: prevLog.ProhibitedObjectCount + 1,
          }));
          setWarningCount((prevCount) => prevCount + 1);
          // swal('Prohibited Object Detected', 'Action has been Recorded', 'error');
          toast.error('Prohibited Object Detected');
        }
        if (!element.class === 'person') {
          setWarningCount((prevCount) => prevCount + 1);
          // swal('Face Not Visible', 'Action has been Recorded', 'error');
          toast.error('Face Not Visible');
        }
        if (element.class === 'person') {
          person_count++;
          if (person_count > 1) {
            setCheatingLog((prevLog) => ({
              ...prevLog,
              multipleFaceCount: prevLog.multipleFaceCount + 1,
            }));
            setWarningCount((prevCount) => prevCount + 1);
            // swal('Multiple Faces Detected', 'Action has been Recorded', 'error');
            toast.error('Multiple Faces Detected');
            person_count = 0;
          }
        }
      });

      const faces = await facemeshModel.estimateFaces({ input: video });

      if (faces.length > 0) {
        const face = faces[0];
        const leftEye = face.annotations?.leftEyeIris || [];
        const rightEye = face.annotations?.rightEyeIris || [];
        const nose = face.annotations.noseTip || [];

        const horizontalGaze = leftEye[0][0] - rightEye[3][0];
        const verticalGaze = nose[0][1] - (leftEye[3][1] + rightEye[3][1]) / 2;
        console.log(`Horizontal 70: ${horizontalGaze}`);
        if (horizontalGaze < 70 || horizontalGaze > 90 || verticalGaze < 25 || verticalGaze > 60) {
          console.log('Head Moved');
          updateHeadMovedStartTime();
        } else {
          setHeadMovedStartTime(null);
        }
        const ctx = canvasRef.current.getContext('2d');
        requestAnimationFrame(() => {
          drawMesh(faces, ctx);
        });
      }
    }
  };

  return (
    <Box>
      <Card variant="outlined">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: '100%',
            height: '100%',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 8,
            width: 240,
            height: 240,
          }}
        />
      </Card>
    </Box>
  );
}
