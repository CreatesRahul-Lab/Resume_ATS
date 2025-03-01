import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to CareerCatalyst</h1>
      <p className="mb-4">
        Your one-stop solution for ATS-friendly resumes and job matching.
      </p>
      <div className="space-x-4">
        <Link to="/resume-upload" className="btn btn-primary">
          Upload Resume
        </Link>
        <Link to="/job-matching" className="btn btn-secondary">
          Find Jobs
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
