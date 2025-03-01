import React, { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    // Assume userId is available from context or localStorage
    formData.append("userId", "YOUR_USER_ID");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/cloud/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadUrl(response.data.url);
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Upload
        </button>
      </form>
      {uploadUrl && (
        <div className="mt-4">
          <p>Uploaded File URL:</p>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {uploadUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
