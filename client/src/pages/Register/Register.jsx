import {
  EmailOutlined,
  FileCopyOutlined,
  PasswordOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../actions/user";
import logo from "../../images/login.svg";
import profile from "../../Profile.png";
import "./Register.css";
const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState({ profile });

  const dispatch = useDispatch();
  const alert = useAlert();
  const { message, error } = useSelector((state) => state.user);
  // Register Data Change Handler
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  // Register handler function
  const { name, email, password } = user;
  const registerHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(registerUser(myForm));
  };
  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [dispatch, alert, message, error]);
  return (
    <>
      <div className="registerContainer">
        <div className="registerRight">
          <h2>Welcome back to social app 😃</h2>
          <form
            className="registerForm"
            encType="multipart/form-data"
            onSubmit={registerHandler}
          >
            <div className="registerName">
              <PeopleAltOutlined />
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                value={name}
                onChange={registerDataChange}
              />
            </div>
            <div className="registerEmail">
              <EmailOutlined />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={registerDataChange}
              />
            </div>
            <div className="registerPassword">
              <PasswordOutlined />
              <input
                placeholder="Your Password."
                type="password"
                name="password"
                value={password}
                onChange={registerDataChange}
              />
            </div>
            <div className="registerAvatar">
              <FileCopyOutlined />
              <input
                type="file"
                placeholder="Avatar"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div>
            <div className="forgotPassword">
              <p>Forgot Password ?</p>
            </div>
            <div className="registerSubmitBtn">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
        <div className="registerLeft">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </>
  );
};

export default Register;
