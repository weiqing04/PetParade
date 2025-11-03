import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

    const handleSignup = async (e) => {
      e.preventDefault(); // Prevent default form submission
      try {
          // Send POST request to server
          const response = await fetch("/api/user", {
              method: "POST",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `action=register&username=${username}&password=${password}&email=${email}`,
          });

          const data = await response.json();

          // Handle response
          if (data.message === "User registered successfully") {
              alert("Account created successfully! Please log in.");
              navigate("/login"); // Redirect to login page
          } else {
              alert(data.message); // Show error message from server
          }
      } catch (error) {
          console.error("Error:", error);
      }
  };


  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-logo">
          <img src="/nav_logo.png" alt="Logo" /> {/* Replace with your logo */}
        </div>
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-field">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-field">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
          <div className="login-links">
            <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;