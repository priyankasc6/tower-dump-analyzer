import React, { useState, useEffect } from "react";
import axios from "axios";

function Cases() {
  const [cases, setCases] = useState([]);
  const [caseName, setCaseName] = useState("");
  const [location, setLocation] = useState("");

  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const createCase = async () => {
    await axios.post("/api/cases", {
      caseName,
      location
    });

    setCaseName("");
    setLocation("");

    fetchCases();
  };

  return (
    <div>
      <h2>Case Management</h2>

      <input
        type="text"
        placeholder="Case Name"
        value={caseName}
        onChange={(e) => setCaseName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={createCase}>Create Case</button>

      <hr />

      <h3>All Cases</h3>

      {cases.map((c) => (
        <div key={c._id}>
          <h4>{c.caseName}</h4>
          <p>{c.location}</p>
        </div>
      ))}
    </div>
  );
}

export default Cases;