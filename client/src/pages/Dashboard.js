import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        minHeight: "80vh",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        Tower Dump Analysis System
      </h1>

      <hr />

      <h2
        style={{
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        Digital Forensics & Crime Investigation
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/cases">
          <button
            style={{
              padding: "15px 25px",
              width: "220px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📁 View Cases
          </button>
        </Link>

        <Link to="/upload">
         <button
          style={{
            padding: "15px 25px",
            width: "220px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          📤 Upload Evidence
         </button>
        </Link>


        <Link to="/suspects">
          <button
            style={{
              padding: "15px 25px",
              width: "220px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🔍 View Suspects
          </button>
        </Link>
      </div>

      <div
        style={{
          marginTop: "60px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h3>Project Workflow</h3>

        <p>
          Create Case → Upload Tower Dump →
          Analyze Suspects → Track Movement →
          Visualize Route → Generate PDF Report
        </p>
      </div>
    </div>
  );
}

export default Dashboard;