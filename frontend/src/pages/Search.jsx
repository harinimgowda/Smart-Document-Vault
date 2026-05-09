import { useState } from "react";
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
import * as mammoth from "mammoth";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [wordHtmlCache, setWordHtmlCache] = useState({});
  const [wordLoading, setWordLoading] = useState(false);
  const [currentWordHtml, setCurrentWordHtml] = useState("");

  const BASE = "http://localhost:5000";

  const downloadDoc = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = `${BASE}/${filePath}`;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const highlightAllMatches = (text, query) => {
    if (!query || !text) return { highlighted: text || "", count: 0 };
    const escaped = escapeRegExp(query);
    const regex = new RegExp(`(${escaped})`, "gi");
    const matches = [];
    let match;
    const regexGlobal = new RegExp(escaped, "gi");
    while ((match = regexGlobal.exec(text)) !== null) {
      matches.push(match[0]);
    }
    return {
      highlighted: text.replace(regex, "<mark>$1</mark>"),
      count: matches.length,
    };
  };

  const extractTextSnippet = (
    text,
    index,
    queryLength,
    query,
    context = 60,
  ) => {
    const start = Math.max(0, index - context);
    const end = Math.min(text.length, index + queryLength + context);
    let snippet = text.substring(start, end).trim();
    if (start > 0) snippet = `...${snippet}`;
    if (end < text.length) snippet = `${snippet}...`;
    return highlightText(snippet, query);
  };

  const getSearchSnippet = (doc, query) => {
    if (!query || !doc) return "";

    const normalizedQuery = query.trim().toLowerCase();
    const searchFields = [
      { key: "summary", value: doc.summary },
      { key: "fullText", value: doc.fullText },
      { key: "originalName", value: doc.originalName },
      { key: "category", value: doc.category },
      { key: "title", value: doc.title },
    ];

    for (const field of searchFields) {
      if (!field.value) continue;
      const sourceText = field.value.toString();
      const index = sourceText.toLowerCase().indexOf(normalizedQuery);
      if (index !== -1) {
        return extractTextSnippet(
          sourceText,
          index,
          query.trim().length,
          query,
        );
      }
    }

    return "";
  };

  const getViewerMatchSnippet = (doc, query) => {
    if (!query || !doc) return "";
    return getSearchSnippet(doc, query);
  };

  const getFieldHighlights = (text, query) => {
    if (!text || !query) return "";
    return highlightText(text.toString(), query);
  };

  const getPreviewUrl = (doc, query = "") => {
    const url = `${BASE}/${doc.filePath}`;
    return query?.trim()
      ? `${url}#search=${encodeURIComponent(query.trim())}`
      : url;
  };

  const isWordDocument = (doc) => {
    const fileName = doc.originalName?.toLowerCase();
    return (
      doc.fileType?.toLowerCase().includes("word") ||
      fileName?.endsWith(".doc") ||
      fileName?.endsWith(".docx")
    );
  };

  const openWordDocument = (doc) => {
    const url = getPreviewUrl(doc);
    const officeUrl = `ms-word:ofe|u|${encodeURI(url)}`;

    const anchor = document.createElement("a");
    anchor.href = officeUrl;
    anchor.target = "_blank";
    anchor.rel = "noreferrer noopener";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      window.open(url, "_blank");
    }, 1200);
  };

  const convertWordToHtml = async (url, docId) => {
    if (wordHtmlCache[docId]) {
      return wordHtmlCache[docId];
    }

    setWordLoading(true);
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setWordHtmlCache((prev) => ({ ...prev, [docId]: result.value }));
      setWordLoading(false);
      return result.value;
    } catch (err) {
      console.log("DOCX conversion error:", err);
      setWordLoading(false);
      return null;
    }
  };

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
      const previewUrl = getPreviewUrl(doc, keyword);
      return (
        <>
          <iframe
            src={previewUrl}
            width="100%"
            height="500"
            title="PDF Preview"
            style={{ border: "1px solid #ddd", borderRadius: 8 }}
          />

          {keyword.trim() && getViewerMatchSnippet(doc, keyword) && (
            <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
              <h6
                className="mb-2"
                style={{ color: "#92400e", fontWeight: "700" }}
              >
                🔎 PDF Match Preview
              </h6>
              <p
                className="mb-0"
                style={{ lineHeight: "1.6", color: "#333" }}
                dangerouslySetInnerHTML={{
                  __html: getViewerMatchSnippet(doc, keyword),
                }}
              />
            </div>
          )}
        </>
      );
    }

    if (isImage) {
      return (
        <>
          <img
            src={url}
            alt={doc.title}
            style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
          />

          {keyword.trim() && getViewerMatchSnippet(doc, keyword) && (
            <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
              <h6
                className="mb-2"
                style={{ color: "#92400e", fontWeight: "700" }}
              >
                🔎 Match Preview
              </h6>
              <p
                className="mb-0"
                style={{ lineHeight: "1.6", color: "#333" }}
                dangerouslySetInnerHTML={{
                  __html: getViewerMatchSnippet(doc, keyword),
                }}
              />
            </div>
          )}
        </>
      );
    }

    if (isWord) {
      // Load Word document HTML when viewing doc changes
      if (
        viewingDoc &&
        viewingDoc._id &&
        !wordHtmlCache[viewingDoc._id] &&
        !wordLoading
      ) {
        setWordLoading(true);
        fetch(url)
          .then((res) => res.arrayBuffer())
          .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
          .then((result) => {
            setWordHtmlCache((prev) => ({
              ...prev,
              [viewingDoc._id]: result.value,
            }));
            setCurrentWordHtml(result.value);
            setWordLoading(false);
          })
          .catch((err) => {
            console.log("DOCX conversion error:", err);
            setWordLoading(false);
          });
      }

      const wordHtml = wordHtmlCache[viewingDoc?._id] || "";

      return (
        <div
          style={{
            maxHeight: 600,
            overflowY: "auto",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          {wordLoading ? (
            <div className="text-center py-4">
              <p className="text-muted">Loading Word document...</p>
            </div>
          ) : wordHtml ? (
            <div
              style={{
                fontFamily: "Calibri, Arial, sans-serif",
                lineHeight: 1.5,
                color: "#333",
              }}
              dangerouslySetInnerHTML={{ __html: wordHtml }}
            />
          ) : (
            <div className="alert alert-info">
              Unable to preview this Word document. You can download it to view
              the full formatted content.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center p-4">
        <p>Preview is not supported for this file type.</p>
      </div>
    );
  };

  const getAllMatches = (text, query) => {
    if (!query || !text) return [];
    const escaped = escapeRegExp(query);
    const regex = new RegExp(escaped, "gi");
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        text: match[0],
      });
    }
    return matches;
  };

  const openDocumentViewer = (doc) => {
    setViewingDoc(doc);
    setCurrentMatchIndex(0);
  };

  const closeDocumentViewer = () => {
    setViewingDoc(null);
    setCurrentMatchIndex(0);
    setCurrentWordHtml("");
  };

  const goToNextMatch = () => {
    if (!viewingDoc) return;
    const matches = getAllMatches(viewingDoc.fullText || "", keyword);
    if (matches.length > 0) {
      const nextIndex = (currentMatchIndex + 1) % matches.length;
      setCurrentMatchIndex(nextIndex);
      setTimeout(() => {
        const highlightedElements =
          document.querySelectorAll(".doc-viewer mark");
        if (highlightedElements[nextIndex]) {
          highlightedElements[nextIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  const goToPreviousMatch = () => {
    if (!viewingDoc) return;
    const matches = getAllMatches(viewingDoc.fullText || "", keyword);
    if (matches.length > 0) {
      const prevIndex =
        currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      setTimeout(() => {
        const highlightedElements =
          document.querySelectorAll(".doc-viewer mark");
        if (highlightedElements[prevIndex]) {
          highlightedElements[prevIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.get(
        `/documents/search?keyword=${encodeURIComponent(keyword)}`,
      );
      setResults(res.data);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">Search Documents</h2>
            <p className="page-subtitle">
              Search across titles, categories, summaries, and document text
              with smart highlighting.
            </p>
          </div>
          <span className="hero-badge">{results.length} results</span>
        </div>

        <div className="panel-card">
          <div className="search-bar">
            <input
              className="form-control"
              placeholder="Search keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {keyword.trim() && results.length === 0 && !loading && (
          <div className="alert alert-info">No documents found.</div>
        )}

        <div>
          {results.map((doc) => {
            const titleMatch = highlightAllMatches(doc.title, keyword);
            const categoryMatch = doc.category
              ? highlightAllMatches(doc.category, keyword).count
              : 0;
            const summaryMatches = highlightAllMatches(
              doc.summary || "",
              keyword,
            ).count;
            const fullTextMatches = highlightAllMatches(
              doc.fullText || "",
              keyword,
            ).count;
            const totalMatches =
              titleMatch.count +
              categoryMatch +
              summaryMatches +
              fullTextMatches;

            return (
              <div
                className="card p-3 mb-3 shadow-sm search-result-card"
                key={doc._id}
              >
                <div className="d-flex justify-content-between">
                  <div className="flex-grow-1">
                    <h5 style={{ color: "#333", marginBottom: "10px" }}>
                      {getFileIcon(doc.fileType, doc.originalName)}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(doc.title, keyword),
                        }}
                      />
                    </h5>
                    <div className="d-flex gap-3 mb-2 flex-wrap">
                      {doc.category && (
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.9rem" }}
                          dangerouslySetInnerHTML={{
                            __html: `<strong>Category:</strong> ${
                              highlightText(doc.category, keyword) ||
                              doc.category
                            }`,
                          }}
                        />
                      )}
                      <small className="text-secondary">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </small>
                      {totalMatches > 0 && (
                        <small
                          className="badge bg-warning text-dark"
                          style={{ height: "fit-content" }}
                        >
                          {totalMatches} match{totalMatches !== 1 ? "es" : ""}
                        </small>
                      )}
                    </div>

                    {doc.summary && (
                      <div
                        className="mt-3 p-3 bg-info bg-opacity-10 rounded border border-info border-opacity-25"
                        style={{ fontSize: "0.95rem", lineHeight: "1.7" }}
                      >
                        <small style={{ color: "#0c63e4", fontWeight: "700" }}>
                          📋 Document Summary
                        </small>
                        <p
                          className="mb-0 mt-2"
                          dangerouslySetInnerHTML={{
                            __html: keyword.trim()
                              ? highlightText(doc.summary, keyword)
                              : doc.summary,
                          }}
                        />
                      </div>
                    )}

                    {keyword.trim() && getSearchSnippet(doc, keyword) && (
                      <p
                        className="mt-3 search-snippet"
                        dangerouslySetInnerHTML={{
                          __html: getSearchSnippet(doc, keyword),
                        }}
                      />
                    )}

                    {doc.originalName && doc.originalName !== doc.title && (
                      <small className="text-muted d-block mt-2">
                        📄{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightText(doc.originalName, keyword),
                          }}
                        />
                      </small>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2 ms-3">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        downloadDoc(doc.filePath, doc.originalName)
                      }
                    >
                      Download
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => openDocumentViewer(doc)}
                    >
                      View Document
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {getFileIcon(viewingDoc.fileType, viewingDoc.originalName)}{" "}
                  {viewingDoc.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDocumentViewer}
                ></button>
              </div>

              <div className="modal-body doc-viewer">
                {/* Document Info Section */}
                <div
                  className="document-info-section mb-4 p-3 bg-gradient rounded-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <div className="row g-2">
                    <div className="col-6 col-sm-3">
                      <small>📁 Category</small>
                      <div style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                        {viewingDoc.category || "Uncategorized"}
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <small>📊 File Size</small>
                      <div style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                        {viewingDoc.fileSize
                          ? (viewingDoc.fileSize / 1024).toFixed(2) + " KB"
                          : "N/A"}
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <small>📝 Word Count</small>
                      <div style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                        {
                          (viewingDoc.fullText || "")
                            .split(/\s+/)
                            .filter((w) => w).length
                        }
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <small>📅 Uploaded</small>
                      <div style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                        {new Date(viewingDoc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Navigation */}
                {keyword.trim() && (
                  <div className="mb-3 p-3 bg-light rounded border-start border-warning border-5">
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={goToPreviousMatch}
                      >
                        ← Previous
                      </button>
                      <span className="badge bg-warning text-dark">
                        {currentMatchIndex + 1} of{" "}
                        {
                          getAllMatches(viewingDoc.fullText || "", keyword)
                            .length
                        }{" "}
                        matches
                      </span>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={goToNextMatch}
                      >
                        Next →
                      </button>
                      <small className="text-muted ms-auto">
                        🔍 Searching for: <strong>{keyword}</strong>
                      </small>
                    </div>
                  </div>
                )}

                {/* Summary Section */}
                {viewingDoc.summary && (
                  <div className="mb-4 p-3 bg-info bg-opacity-10 rounded-3 border border-info border-opacity-25">
                    <h6
                      className="mb-2"
                      style={{ color: "#0c63e4", fontWeight: "700" }}
                    >
                      📋 Document Summary
                    </h6>
                    <p
                      className="mb-0"
                      style={{ lineHeight: "1.6", color: "#333" }}
                      dangerouslySetInnerHTML={{
                        __html: highlightText(viewingDoc.summary, keyword),
                      }}
                    />
                  </div>
                )}

                {keyword.trim() &&
                  getViewerMatchSnippet(viewingDoc, keyword) && (
                    <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
                      <h6
                        className="mb-2"
                        style={{ color: "#92400e", fontWeight: "700" }}
                      >
                        🔎 Matched Text Preview
                      </h6>
                      <p
                        className="mb-0"
                        style={{ lineHeight: "1.6", color: "#333" }}
                        dangerouslySetInnerHTML={{
                          __html: getViewerMatchSnippet(viewingDoc, keyword),
                        }}
                      />
                    </div>
                  )}

                <hr />

                <div className="mb-3">{renderPreviewContent(viewingDoc)}</div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDocumentViewer}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    downloadDoc(viewingDoc.filePath, viewingDoc.originalName)
                  }
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
