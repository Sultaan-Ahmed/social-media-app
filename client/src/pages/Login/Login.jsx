import { EmailOutlined, PasswordOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../actions/user";
import logo from "../../images/login.svg";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Handler Function
  const dispatch = useDispatch();
  const alert = useAlert();
  const loginSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };

  const { message } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.user);
  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [alert, dispatch, message, error]);
  return (
    <>
      <div className="loginContainer">
        <div className="loginLeft">
          <img src={logo} alt="" />
        </div>
        <div className="loginRight">
          <h2>Welcome back to social app 😃</h2>
          <form className="loginForm" onSubmit={loginSubmitHandler}>
            <div className="loginEmail">
              <EmailOutlined />
              <input
                required
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="LoginPassword">
              <PasswordOutlined />
              <input
                required
                placeholder="Your Password."
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="forgotPassword">
              <p>Forgot Password ?</p>
            </div>
            <div className="submitBtn">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
