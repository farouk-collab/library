import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
