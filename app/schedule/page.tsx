export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const base = "/Bell%20Schedule%20Graphic/schedule-fit.html";
  const src = params.week
    ? `${base}?week=${encodeURIComponent(params.week)}`
    : base;

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <iframe
        src={src}
        title="Bell schedule"
        className="w-full flex-1 min-h-0 border-0"
      />
    </main>
  );
}
