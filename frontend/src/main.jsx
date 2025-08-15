import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Welcome from './Pages/user/Welcome.jsx'
import Home from './Pages/user/home.jsx'
import AdminLogin from './Pages/admin/AdminLogin.jsx'
import NGOLogin from './Pages/ngo/NGOLogin.jsx'
import NGOSignup  from './Pages/ngo/NGOSignup.jsx'
import Requests from './Pages/user/Requests.jsx'
import NotAssigned from './Pages/user/NotAssigned.jsx';
import AddMembersPage from './Pages/ngo/AddMembersPage.jsx';
import NgoDashboard from './Pages/ngo/NGOdashboard.jsx'
import AdminDashboard from './Pages/admin/AdminDashboard.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: '/channel/:id/requests',
    element: <Requests />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/ngoLogin",
    element: <NGOLogin />,
  },
  {
    path: "/ngoSignup",
    element: <NGOSignup />,
  },
  {
    path: "/ngoDasboard",
    element: <NgoDashboard/>
  },
  {
    path: "/NotAssigned",
    element: <NotAssigned />,
  },
 
  {
  path: "/add-members",
  element: <AddMembersPage />,
 }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
