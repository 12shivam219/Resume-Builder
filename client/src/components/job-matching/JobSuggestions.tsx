import React, { useEffect, useState } from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
}

interface JobSuggestionsProps {
  keywords: string[];
}

export const JobSuggestions: React.FC<JobSuggestionsProps> = ({ keywords }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Simulate local job matching (replace with real API or local DB as needed)
    if (keywords.length) {
      setJobs([
        {
          title: "Frontend Developer",
          company: "Tech Corp",
          location: "Remote",
          url: "#",
        },
        {
          title: "React Engineer",
          company: "InnovateX",
          location: "NYC",
          url: "#",
        },
      ]);
    } else {
      setJobs([]);
    }
  }, [keywords]);

  return (
    <div>
      <h3>Job Suggestions</h3>
      {jobs.length === 0 ? (
        <div>No suggestions yet.</div>
      ) : (
        <ul>
          {jobs.map((job, i) => (
            <li key={i}>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                {job.title} at {job.company} ({job.location})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
