import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Protected, { UnProtectedRoute, ProtectedAdmin } from "Protected";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserManagment from "./Pages/UserManagment/UserManagment";
import Layout from "./Components/Includes/Layout";
import ParkingInfo from "Pages/Dashboard/ParkingInfo";
import Password from "Pages/Auth/Password";

const MyRoutes = () => {

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            // <Protected>
            <Layout>
              <Dashboard />
            </Layout>
            // </Protected>
          }
        />
        <Route
          exact
          path="/"
          element={
            <UnProtectedRoute>
              <Login />
            </UnProtectedRoute>
          }
        />
        <Route
          exact
          path="/users"
          element={
            <ProtectedAdmin>
              <Layout>
                <UserManagment />
              </Layout>
            </ProtectedAdmin>
          }
        />
        <Route
          exact
          path="/parkinginfo"
          element={
            <Protected>
              <Layout>
                <ParkingInfo />
              </Layout>
            </Protected>
          }
        />
        <Route
          exact
          path="/password"
          element={
            <Protected>
              <Layout>
                <Password />
              </Layout>
            </Protected>
          }
        />
      </Routes>
    </Router>
  );
};

export default MyRoutes;
