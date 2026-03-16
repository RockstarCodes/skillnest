export default function HomePage() {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold tracking-tight">SkillNest – Learning Platform</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Clean, structured learning. Watch lessons in order and track your progress.
      </p>

      <div className="mt-8">
        <a
          href="/subjects"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Browse subjects
        </a>
      </div>
    </div>
  );
}

