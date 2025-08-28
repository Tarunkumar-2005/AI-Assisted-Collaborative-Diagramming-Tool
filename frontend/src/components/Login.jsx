import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/auth";
      const { data } = await axios.post(url, formData);
      setMessage(data.message);
      setToken(data.data); // JWT token
      localStorage.setItem("token", data.data); // store token in localStorage
      let userid=data.userid;
      localStorage.setItem("userId", userid);
      navigate(`/dashboard/${userid}`);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong!");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4 rounded-3">
            <h3 className="text-center mb-4">Login</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>
            </form>
            {/* {token && (
              <div className="alert alert-secondary mt-3">
                <strong>JWT Token:</strong>
                <p className="small text-break">{token}</p>
              </div>
            )} */}
            <p className="text-center mt-3">
              Don’t have an account? <a href="/Signup">SignUp</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
