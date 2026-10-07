import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

const NotFoundPage = () => (
  <div className="container-x flex flex-col items-center py-28 text-center">
    <span className="flex size-16 items-center justify-center rounded-3xl bg-brand-soft text-brand-text">
      <Compass className="size-8" />
    </span>
    <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-brand-text">Error 404</p>
    <h1 className="mt-2 text-4xl font-extrabold text-ink sm:text-5xl">This page wandered off</h1>
    <p className="mt-4 max-w-md text-lg text-ink-2">
      The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/" className="btn btn-primary btn-lg"><Home className="size-4" /> Back to home</Link>
      <Link to="/jobs" className="btn btn-secondary btn-lg">Browse jobs</Link>
    </div>
  </div>
);

export default NotFoundPage;
