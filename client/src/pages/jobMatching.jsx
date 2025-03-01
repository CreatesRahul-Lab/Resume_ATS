import React, { useState } from "react";
import axios from "axios";

function JobMatching() {
  const [resumeId, setResumeId] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleMatchJobs = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/linkedin/search",
        { resumeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(response.data.jobs);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch job matches.");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Job Matching</h2>
      <form onSubmit={handleMatchJobs} className="mb-6">
        <input
          type="text"
          placeholder="Enter your Resume ID"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Find Jobs
        </button>
      </form>
      {jobs.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Matched Jobs:</h3>
          <ul className="space-y-3">
            {jobs.map((job, index) => (
              <li key={index} className="border p-3 rounded shadow-sm">
                <h4 className="font-bold">{job.title}</h4>
                <p>{job.company}</p>
                <p>{job.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JobMatching;
