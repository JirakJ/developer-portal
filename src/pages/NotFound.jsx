import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="not-found">
        <div className="not-found-code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/catalog" className="btn-secondary">Browse Catalog</Link>
        </div>
      </div>
    </div>
  );
}
