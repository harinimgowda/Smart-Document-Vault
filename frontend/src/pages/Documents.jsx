import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFilePowerpoint,
} from "react-icons/fa";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Documents() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState(null);

  // ✅ FIXED BASE URL (NO TRAILING SLASH)
  const BASE = "http://localhost:5000";

  const getPreviewUrl = (doc) => `${BASE}/${doc.filePath}`;

  const renderPreviewContent = (doc) => {
    if (!doc) return null;
    const url = getPreviewUrl(doc);
    const fileName = doc.originalName?.toLowerCase();
    const isPdf = doc.fileType?.includes("pdf") || fileName?.endsWith(".pdf");
    const isImage =
      doc.fileType?.includes("image") || /(jpg|jpeg|png|gif)$/.test(fileName);
    const isWord =
      doc.fileType?.includes("word") ||
      fileName?.endsWith(".doc") ||
      fileName?.endsWith(".docx");

    if (isPdf) {
      return (
        <iframe
          src={url}
          width="100%"
          height="600"
          title="PDF Preview"
          style={{ border: "1px solid #ddd", borderRadius: 8 }}
        />
      );
    }

    if (isImage) {
      return (
        <img
          src={url}
          alt={doc.title}
          style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
        />
      );
    }

    if (isWord) {
      return (
        <div style={{ maxHeight: 600, overflowY: "auto", padding: 16 }}>
          <h5>Word Document Preview</h5>
          <p className="text-muted">{doc.originalName}</p>
          {doc.fullText ? (
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                background: "#f8f9fa",
                padding: 16,
                borderRadius: 8,
              }}
            >
              {doc.fullText}
            </div>
          ) : (
            <div className="alert alert-info">
              Text preview is not available for this Word file. Please download
              it to view the formatted document.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center p-4">
        <p>Preview format is not supported for this file type.</p>
        <p>Please download the document to view it outside the app.</p>
      </div>
    );
  };

  const limit = 6;
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await API.get("/documents");
    setDocs(res.data);
  };

  // ❌ DELETE FUNCTION
  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await API.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const downloadDoc = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = `${BASE}/${filePath}`;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📁 FILE ICON
  const getFileIcon = (type, fileName = "") => {
    const lowerType = (type || "").toLowerCase();
    const lowerName = (fileName || "").toLowerCase();

    const isPdf = lowerType.includes("pdf") || lowerName.endsWith(".pdf");
    const isWord =
      lowerType.includes("word") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".docx");
    const isExcel =
      lowerType.includes("excel") ||
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".xlsx");
    const isImage =
      lowerType.includes("image") ||
      /(jpg|jpeg|png|gif|bmp|svg)$/.test(lowerName);
    const isPpt =
      lowerType.includes("powerpoint") ||
      lowerName.endsWith(".ppt") ||
      lowerName.endsWith(".pptx");

    if (isPdf) return <FaFilePdf className="file-icon" />;
    if (isWord) return <FaFileWord className="file-icon" />;
    if (isExcel) return <FaFileExcel className="file-icon" />;
    if (isPpt) return <FaFilePowerpoint className="file-icon" />;
    if (isImage) return <FaFileImage className="file-icon" />;

    return <FaFileAlt className="file-icon" />;
  };

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (text, query) => {
    if (!query || !text) return text || "";
    const escaped = escapeRegExp(query);
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const getSearchSnippet = (doc, query) => {
    if (!query) return "";

    const searchFields = [
      doc.fullText,
      doc.summary,
      doc.originalName,
      doc.category,
      doc.title,
    ].filter(Boolean);
    const normalizedQuery = query.toLowerCase();

    for (const field of searchFields) {
      const sourceText = field.toString();
      const index = sourceText.toLowerCase().indexOf(normalizedQuery);
      if (index !== -1) {
        const start = Math.max(0, index - 40);
        const end = Math.min(
          sourceText.length,
          index + normalizedQuery.length + 40,
        );
        const snippet = sourceText.substring(start, end).trim();
        return highlightText(snippet, query);
      }
    }

    return "";
  };

  // 🔍 FILTER
  let filteredDocs = docs.filter((doc) => {
    const normalizedSearch = search.toLowerCase().trim();
    if (!normalizedSearch) {
      return category === "all" || doc.category === category;
    }

    const searchFields = [
      doc.title,
      doc.category,
      doc.summary,
      doc.originalName,
      doc.fullText,
    ]
      .filter(Boolean)
      .map((field) => field.toLowerCase());

    const matchesSearch = searchFields.some((field) =>
      field.includes(normalizedSearch),
    );
    const matchesCategory = category === "all" || doc.category === category;

    return matchesSearch && matchesCategory;
  });

  // ↕️ SORT
  filteredDocs.sort((a, b) =>
    sort === "latest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt),
  );

  // 📄 PAGINATION
  const start = (page - 1) * limit;
  const paginatedDocs = filteredDocs.slice(start, start + limit);

  // 📦 FILE SIZE
  const formatSize = (size) => {
    if (!size) return "";
    return (size / 1024).toFixed(1) + " KB";
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">Documents</h2>
            <p className="page-subtitle">
              Browse all uploaded files, filter by category, and preview
              documents right from the library.
            </p>
          </div>
          <span className="hero-badge">{filteredDocs.length} files</span>
        </div>

        <div className="panel-card">
          <div className="page-actions">
            <input
              className="form-control"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {[...new Set(docs.map((d) => d.category))].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="form-select"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              className="btn btn-outline-dark"
              onClick={() => setView(view === "grid" ? "list" : "grid")}
            >
              {view === "grid" ? "List View" : "Grid View"}
            </button>
          </div>
        </div>

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className="doc-grid">
            {paginatedDocs.map((doc) => (
              <div className="doc-card" key={doc._id}>
                <div className="doc-meta">
                  <div>
                    <h5>
                      {getFileIcon(doc.fileType, doc.originalName)}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(doc.title, search),
                        }}
                      />
                    </h5>
                    <small className="text-muted">
                      {new Date(doc.createdAt).toLocaleDateString()} ·{" "}
                      {formatSize(doc.fileSize)}
                    </small>
                  </div>
                  <span className="doc-badge">
                    {doc.category || "Uncategorized"}
                  </span>
                </div>

                {search.trim() && (
                  <p
                    className="search-snippet"
                    dangerouslySetInnerHTML={{
                      __html: getSearchSnippet(doc, search),
                    }}
                  />
                )}

                <div className="doc-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    Preview
                  </button>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => downloadDoc(doc.filePath, doc.originalName)}
                  >
                    Download
                  </button>

                  {role === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteDoc(doc._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {view === "list" && (
          <div>
            {paginatedDocs.map((doc) => (
              <div key={doc._id} className="doc-card mb-3">
                <div className="doc-meta">
                  <div>
                    <h5>
                      {getFileIcon(doc.fileType, doc.originalName)}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(doc.title, search),
                        }}
                      />
                    </h5>
                    <p
                      className="mb-1"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(doc.category, search),
                      }}
                    />
                    <small className="text-muted">
                      {new Date(doc.createdAt).toLocaleDateString()} ·{" "}
                      {formatSize(doc.fileSize)}
                    </small>
                  </div>

                  <div className="doc-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      Preview
                    </button>

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        downloadDoc(doc.filePath, doc.originalName)
                      }
                    >
                      Download
                    </button>

                    {role === "admin" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteDoc(doc._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {search.trim() && (
                  <p
                    className="search-snippet"
                    dangerouslySetInnerHTML={{
                      __html: getSearchSnippet(doc, search),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="d-flex justify-content-center mt-3 gap-3">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            className="btn btn-outline-primary"
            disabled={start + limit >= filteredDocs.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div
          className="modal d-block"
          onClick={() => setPreviewDoc(null)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">{previewDoc.title}</h5>
                  <small className="text-muted">
                    {previewDoc.originalName}
                  </small>
                </div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close
                </button>
              </div>
              {renderPreviewContent(previewDoc)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Documents;
