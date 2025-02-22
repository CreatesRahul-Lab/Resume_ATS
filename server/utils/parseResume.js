import { parse } from "pdf-parse";

export const parseResume = async (fileBuffer) => {
  try {
    const data = await parse(fileBuffer);
    const parsedData = extractDetails(data.text);
    return parsedData;
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    throw error;
  }
};

const extractDetails = (text) => {
  const name = text.match(/Name: (.*)/)?.[1] || "Unknown";
  const email =
    text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ||
    "Not Found";
  const skills = text.match(/Skills: (.*)/)?.[1]?.split(",") || [];
  return { name, email, skills };
};
