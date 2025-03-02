import * as pdfjs from "pdfjs-dist/build/pdf.mjs";
import { createRequire } from "node:module";
import validator from "validator";

// Configure PDF.js worker for Node.js
const require = createRequire(import.meta.url);
pdfjs.GlobalWorkerOptions.workerSrc = require.resolve(
  "pdfjs-dist/build/pdf.worker.mjs"
);

export const parseResume = async (fileBuffer) => {
  try {
    // Load PDF document
    const doc = await pdfjs.getDocument({
      data: new Uint8Array(fileBuffer),
      cMapPacked: true,
    }).promise;

    // Extract text from all pages
    let text = "";
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    // Process extracted information
    return {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: extractSkills(text),
      education: extractEducation(text),
      experience: extractExperience(text),
    };
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    throw new Error(`Resume processing failed: ${error.message}`);
  }
};

// Keep your existing extraction functions (extractName, extractEmail, etc.)

// Extraction Helpers
const extractName = (text) => {
  const patterns = [
    /(?:Name|Full\s*Name|Candidate)[:\s-]+\s*([^\n]+)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*)+)(?=\s*\n)/m,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]*)+)$/m, // Fixed regex
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/\s+/g, " ");
  }
  return "Not Found";
};

const extractEmail = (text) => {
  const emails = text.match(/[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/g) || [];
  const validEmails = emails.filter((email) => validator.isEmail(email));
  return validEmails[0] || "Not Found";
};

const extractPhone = (text) => {
  const patterns = [
    /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/,
    /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/,
  ];

  const numbers = patterns
    .flatMap((pattern) => text.match(pattern) || [])
    .map((num) => num.replace(/[^\d+]/g, ""))
    .filter((num) => validator.isMobilePhone(num));

  return (
    numbers[0]?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") || "Not Found"
  );
};

const extractSkills = (text) => {
  const skillSection =
    text.match(
      /(?:Skills|Technical\s*Skills|Expertise|Competencies):([\s\S]*?)(?=\n\s*\n|$)/i
    )?.[1] || text;

  return skillSection
    .split(/[,;•·–—•·]|\n/)
    .map((skill) => skill.trim().replace(/\.$/, ""))
    .filter((skill) => skill.length > 2 && !validator.isEmpty(skill))
    .slice(0, 15);
};

const extractEducation = (text) => {
  const educationPattern =
    /(Education|Academic\s*Background|Qualifications)[:\s-]*([\s\S]*?)(?=(?:Experience|Work|Projects|Skills|$))/i;

  return cleanSection(educationPattern, text);
};

const extractExperience = (text) => {
  const experiencePattern =
    /(Experience|Work\s*History|Professional\s*Experience)[:\s-]*([\s\S]*?)(?=(?:Education|Skills|Projects|$))/i;

  return cleanSection(experiencePattern, text);
};

// Helper function for section cleaning
const cleanSection = (pattern, text) => {
  const content = text.match(pattern)?.[2]?.trim() || [];
  return content
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.match(/^\s*[-•·]\s*$/));
};
