export const matchJobsToResume = (resumeData, jobs) => {
  const matchedJobs = jobs.filter((job) => {
    const jobKeywords = job.skillsRequired.map((skill) => skill.toLowerCase());
    return resumeData.optimizedSkills.some((skill) =>
      jobKeywords.includes(skill.toLowerCase())
    );
  });

  return matchedJobs;
};
