import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { loadUser } from "./actions/user";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  const { isAuthenticate } = useSelector((state) => state.user);
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticate ? <Home /> : <Login />} />
        <Route path="/login" element={!isAuthenticate ? <Login /> : <Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
