import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Users } from "../pages/Users";
import { Doors } from "../pages/Doors";
import { Permissions } from "../pages/Permissions";
import { ProtectedRoute } from "./ProtectedRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Doors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/permissions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Permissions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}