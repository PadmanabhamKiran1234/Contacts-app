import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BLOCK_DURATION = 15 * 60 * 1000; 
const MAX_FAILED_ATTEMPTS = 5;

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  useEffect(() => {
    // Check if the IP is already blocked or not 
    const blockTimestamp = localStorage.getItem("blockTimestamp");
    if (blockTimestamp && Date.now() - blockTimestamp < BLOCK_DURATION) {
      navigate("/ip-blocked");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("blockTimestamp");
        localStorage.setItem("token", json.authToken);
        navigate("/home");
      } else {
        // Increment the failed attempts after every failure login
        let failedAttempts = parseInt(localStorage.getItem("failedAttempts")) || 0;
        failedAttempts += 1;
        localStorage.setItem("failedAttempts", failedAttempts);

        // Check if the IP should be blocked 
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
          localStorage.setItem("blockTimestamp", Date.now());
          navigate("/ip-blocked");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login Form</h2>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            value={credentials.email}
            id="email"
            name="email"
            placeholder="Enter email"
            onChange={onChange}
            required
            autoComplete="username"
          />
          <small id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={credentials.password}
            id="password"
            name="password"
            placeholder="Password"
            onChange={onChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
