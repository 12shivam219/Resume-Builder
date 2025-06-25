import React, { useState } from "react";

interface Application {
  company: string;
  position: string;
  status: "applied" | "interview" | "offer" | "rejected";
  date: string;
}

export const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Application["status"]>("applied");

  const addApplication = () => {
    setApplications([
      ...applications,
      { company, position, status, date: new Date().toLocaleDateString() },
    ]);
    setCompany("");
    setPosition("");
    setStatus("applied");
  };

  return (
    <div>
      <h3>Application Tracker</h3>
      <div>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Application["status"])}
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={addApplication}>Add</button>
      </div>
      <ul>
        {applications.map((app, i) => (
          <li key={i}>
            {app.company} - {app.position} ({app.status}) on {app.date}
          </li>
        ))}
      </ul>
    </div>
  );
};
