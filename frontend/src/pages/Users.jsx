import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Users() {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchDocuments();
  }, []);

  const totalUsers = users.length;
  const totalDocuments = documents.length;

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 UPDATE ROLE
  const updateRole = async (id, newRole) => {
    try {
      await API.put(`/auth/users/${id}/role`, {
        role: newRole,
      });

      fetchUsers();
    } catch (err) {
      alert("Role update failed");
    }
  };

  // ❌ DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ❌ DELETE DOCUMENT
  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await API.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">User Management</h2>
            <p className="page-subtitle">
              Manage accounts and document uploads with a cleaner admin
              experience.
            </p>
          </div>
          <span className="hero-badge">{totalUsers} users</span>
        </div>

        <div className="table-card">
          <h3>Users</h3>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className="badge bg-info text-dark">
                        {user.role}
                      </span>
                    </td>

                    {/* ROLE DROPDOWN */}
                    <td>
                      <select
                        className="form-select"
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="reviewer">Reviewer</option>
                      </select>
                    </td>

                    {/* DELETE */}
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="page-header" style={{ marginBottom: "18px" }}>
            <div>
              <h3 className="page-title">Document Management</h3>
              <p className="page-subtitle">
                Review and remove uploaded files as needed.
              </p>
            </div>
            <span className="hero-badge">{totalDocuments} docs</span>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Uploaded By</th>
                  <th>Upload Date</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.title}</td>
                    <td>{doc.category}</td>
                    <td>
                      {doc.uploadedBy?.name} ({doc.uploadedBy?.email})
                    </td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteDocument(doc._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {documents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
