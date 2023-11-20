import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const fetchApi = async () => {
    const response = await fetch("http://localhost:5000/");
    const jsonResponse = await response.json();
    setMessage(jsonResponse);

    console.log(jsonResponse, typeof jsonResponse);
  };

  async function handleFileUpload(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) {
      console.error("Please select a file to upload");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/presigned?file-name=${encodeURIComponent(
          file.name
        )}`
      );
      const { url, fields } = await response.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        console.log("File uploaded successfully.");
        setMessage("File uploaded successfully.");
      } else {
        console.error("File upload failed.");
        setMessage("File upload failed.");
      }
    } catch (error) {
      console.error("Error getting presigned URL", error);
      setMessage("Error getting presigned URL");
    }
  }
  return (
    <div className="App">
      <p>test</p>
      <input type="file" onChange={handleFileUpload} />
      <p>{message}</p>
    </div>
  );
}

export default App;
