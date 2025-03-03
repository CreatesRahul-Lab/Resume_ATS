// src/pages/Login.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Make API call to your backend login endpoint
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/login",
        { email, password }
      );

      // Store token in localStorage for authenticated requests
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard or home page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
