import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>

      <h3 className="mb-3">Page Not Found</h3>

      <p className="text-muted">The page you are looking for does not exist.</p>

      <Link to="/dashboard" className="btn btn-primary mt-3">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
