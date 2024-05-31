import React from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import BlankLayout from '../layouts/blank/BlankLayout';
import FullLayout from '../layouts/full/FullLayout';
import ExamLayout from '../layouts/full/ExamLayout';
import SamplePage from '../views/sample-page/SamplePage';
import Success from '../views/Success';
import TestPage from './../views/student/TestPage';
import ExamPage from './../views/student/ExamPage';
import ExamDetails from './../views/student/ExamDetails';
import ResultPage from './../views/student/ResultPage';
import Error from '../views/authentication/Error';
import Register from '../views/authentication/Register';
import Login from '../views/authentication/Login';
import UserAccount from '../views/authentication/UserAccount';
import CreateExamPage from './../views/teacher/CreateExamPage';
import ExamLogPage from './../views/teacher/ExamLogPage';
import AddQuestions from './../views/teacher/AddQuestions';
import PrivateRoute from 'src/views/authentication/PrivateRoute';
import TeacherRoute from 'src/views/authentication/TeacherRoute';
import Profile from 'src/layouts/full/header/Profile';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        {/* Main layout */}
        <Route path="/" element={<FullLayout />}>
          <Route index={true} path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" exact={true} element={<ExamPage />} />
          <Route path="/sample-page" exact={true} element={<SamplePage />} />
          <Route path="/Success" exact={true} element={<Success />} />
          <Route path="/exam" exact={true} element={<ExamPage />} />
          <Route path="/result" exact={true} element={<ResultPage />} />
          <Route path="" element={<TeacherRoute />}>
            <Route path="/create-exam" exact={true} element={<CreateExamPage />} />
            <Route path="/add-questions" exact={true} element={<AddQuestions />} />
            <Route path="/exam-log" exact={true} element={<ExamLogPage />} />
          </Route>
        </Route>
        <Route path="/" element={<ExamLayout />}>
          <Route path="exam/:examId" exact={true} element={<ExamDetails />} />
          <Route path="exam/:examId/:testId" exact={true} element={<TestPage />} />
        </Route>
      </Route> 
      {/* User layout */}
      <Route path="/user" element={<FullLayout />}>
        <Route path="account" exact={true} element={<UserAccount />} />
        {/* <Route path="profile" exact={true} element={<Profile />} /> */}
      </Route>

      {/* Authentication layout */}
      <Route path="/auth" element={<BlankLayout />}>
        <Route path="404" element={<Error />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>
    </>,
  ),
);

export default Router;
