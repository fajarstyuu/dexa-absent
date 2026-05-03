import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/layout.tsx";
import HomePage from "./pages/index.tsx";
import EmployeePage from "./pages/employee.tsx";
import { AbsentPage } from "./pages/absent.tsx";
import { LoginPage } from "./pages/login.tsx";
import RolePage from "./pages/role.tsx";
import MyAbsentPage from "./pages/my-absent.tsx";
import { AuthGuard } from "./guards/auth-guard.tsx";
import { RoleGuard } from "./guards/role-guard.tsx";
import UserAbsentPage from "./pages/user-absent.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/employee",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoleIds={[1]}>
          <Layout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <EmployeePage />,
      },
    ],
  },
  {
    path: "/absent",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoleIds={[1]}>
          <Layout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <AbsentPage />,
      },
    ],
  },
  {
    path: "/absent/my",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <MyAbsentPage />,
      },
    ],
  },
  {
    path: "/absent/user/:userId",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoleIds={[1]}>
          <Layout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <UserAbsentPage />,
      },
    ],
  },
  {
    path: "/role",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoleIds={[1]}>
          <Layout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <RolePage />,
      },
    ],
  },
  {
    path: "/login",

    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
