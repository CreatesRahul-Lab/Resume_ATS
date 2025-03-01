import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div className="font-bold text-xl">
          <Link to="/">CareerCatalyst</Link>
        </div>
        <div className="space-x-4">
          <Link to="/">Dashboard</Link>
          <Link to="/resume-upload">Upload Resume</Link>
          <Link to="/job-matching">Job Matching</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
