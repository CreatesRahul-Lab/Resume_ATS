import axios from "axios";

const LINKEDIN_API_BASE = process.env.LINKEDIN_API_BASE;
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

// Fetch jobs from LinkedIn
export const fetchLinkedInJobs = async (keywords) => {
  try {
    const response = await axios.get(`${LINKEDIN_API_BASE}/jobSearch`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {
        keywords,
        location: "India",
        count: 10, // Number of jobs to fetch
      },
    });

    return response.data.elements || [];
  } catch (error) {
    console.error("LinkedIn API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch jobs from LinkedIn");
  }
};
