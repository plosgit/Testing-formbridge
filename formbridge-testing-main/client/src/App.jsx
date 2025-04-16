import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import StartPage from "./pages/StartPage.jsx";
import Login from "./pages/Login.jsx";
import CustomerDemo from "./pages/CustomerDemo.jsx";
import Form from "./components/Form.jsx";
import Chat from "./pages/Chat.jsx";
import Admin from "./pages/Admin.jsx";
import Support from "./pages/Support.jsx";
import SetPassword from "./components/SetPassword.jsx";
import "./index.css";

function App() {
  const { user } = useContext(GlobalContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setpassword" element={<SetPassword />} />

        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerDemo />} />
        <Route path="/form/:company_id" element={<Form />} />
        <Route path="/chat/:ticket_id" element={<Chat />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute
              requiredRole={user?.role == "ADMIN" ? "ADMIN" : "SUPPORT"}
            >
              <Support />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
