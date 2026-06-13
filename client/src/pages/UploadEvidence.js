import { useState } from "react";
import axios from "axios";

function UploadEvidence() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setMessage(
        `Upload Successful. Records Processed: ${res.data.count}`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Upload Failed"
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1>Upload Tower Dump Evidence</h1>

      <br />

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />
      <br />

      <button
        onClick={uploadFile}
        style={{
          padding: "12px",
          width: "200px",
        }}
      >
        Upload Evidence
      </button>

      <br />
      <br />

      <p>{message}</p>
    </div>
  );
}

export default UploadEvidence;