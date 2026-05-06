import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Upload() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [warning, setWarning] = useState("");

  // 📂 FILE SELECT
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // 🖱️ DRAG OVER
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 📥 DROP FILES
  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };

  // ❌ REMOVE FILE
  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // 🚀 UPLOAD
  const handleUpload = async () => {
    const missingFields = [];

    if (files.length === 0) missingFields.push("files");
    if (!title.trim()) missingFields.push("title");
    if (!category.trim()) missingFields.push("category");

    if (missingFields.length > 0) {
      setWarning(
        `Required: ${missingFields
          .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
          .join(", ")}`,
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setWarning("Invalid token: please login again before uploading.");
      return;
    }

    setWarning("");
    const formData = new FormData();

    // 🔥 IMPORTANT: "files"
    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("title", title);
    formData.append("category", category);

    try {
      await API.post("/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Upload successful");

      setFiles([]);
      setTitle("");
      setCategory("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.message || "Upload failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">Upload Files</h2>
            <p className="page-subtitle">
              Drag and drop documents, assign a title and category, then upload
              them in one easy step.
            </p>
          </div>
          <span className="hero-badge">{files.length} selected</span>
        </div>

        <div className="upload-card">
          <p className="field-help">
            Fields marked with <span className="required-star">*</span> are
            required.
          </p>

          {warning && <div className="warning-note">{warning}</div>}

          <div className="form-group">
            <label className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              className="form-control mb-3"
              placeholder="Document title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <input
              className="form-control mb-4"
              placeholder="Category"
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div
            className="file-dropzone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="mb-1">Drag & drop files here</p>
            <p className="mb-3">or</p>
            <input type="file" multiple required onChange={handleFileChange} />
            <p className="dropzone-note">
              Required: Select at least one document file before uploading.
            </p>
          </div>

          {files.length > 0 && (
            <div className="mb-3">
              {files.map((file, index) => (
                <div key={index} className="file-chip">
                  <span>{file.name}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFile(index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </>
  );
}

export default Upload;
