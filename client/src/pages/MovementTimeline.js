import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovementTimeline() {

  const { number } = useParams();

  const [records, setRecords] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    const res = await axios.get(
      `/api/analysis/movement/${number}`
    );

    setRecords(res.data);

  };

  return (
    <div style={{padding:"20px"}}>

      <h2>
        Movement Timeline
      </h2>

      <h3>{number}</h3>

      {records.map((r, index) => (

        <div
          key={index}
          style={{
            marginBottom:"15px",
            border:"1px solid #ccc",
            padding:"10px"
          }}
        >

          <p>
            Tower:
            {r.towerId}
          </p>

          <p>
            Time:
            {new Date(
              r.timestamp
            ).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  );
}

export default MovementTimeline;