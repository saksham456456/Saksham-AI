export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface p-6 text-text">
      <section className="max-w-md rounded-2xl border bg-card/60 p-6 text-center backdrop-blur">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          This route does not exist in this deployment. Check the URL path or open the app root.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-lg border border-accent/40 bg-accent/15 px-4 py-2 text-sm font-medium"
        >
          Go to BriefX home
        </a>
      </section>
    </main>
  );
}
