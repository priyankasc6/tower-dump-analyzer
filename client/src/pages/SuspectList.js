import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SuspectList() {
  const [suspects, setSuspects] = useState([]);

  useEffect(() => {
    fetchSuspects();
  }, []);

  const fetchSuspects = async () => {
    try {
      const res = await axios.get("/api/analysis/suspects");
      setSuspects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Suspect Ranking Dashboard
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f4f4f4",
            }}
          >
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
              }}
            >
              Rank
            </th>

            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
              }}
            >
              Mobile Number
            </th>

            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
              }}
            >
              Appearances
            </th>

            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
              }}
            >
              Risk Level
            </th>

            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {suspects.map((item, index) => {
            let risk = "LOW";

            if (item.appearances >= 3)
              risk = "MEDIUM";

            if (item.appearances >= 5)
              risk = "HIGH";

            return (
              <tr key={item._id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  #{index + 1}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  {item._id}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {item.appearances}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {risk}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  <Link to={`/movement/${item._id}`}>
                    Timeline
                  </Link>

                  {" | "}

                  <Link to={`/map/${item._id}`}>
                    Map
                  </Link>

                  {" | "}

                  <a
                    href={`http://localhost:5000/api/report/${item._id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Report
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SuspectList;