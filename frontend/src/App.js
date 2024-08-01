import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useSelector } from "react-redux";

function App() {
  const { darkTheme, user } = useSelector((state) => ({ ...state }));

  return (
    <div className={darkTheme ? "dark" : ""}>
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/admin"
            element={
              user?.username === "Admin" ? <Admin /> : <Navigate to="/" />
            }
            exact
          />
          <Route
            path="/"
            element={
              user?.username === "Admin" ? <Navigate to="/admin" /> : <Home />
            }
            exact
          />
        </Route>

        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
