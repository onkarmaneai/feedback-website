import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white header-shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">AnonPulse</p>
            <h1 className="text-lg font-semibold">Anonymous feedback board</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#composer"
            className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-black"
          >
            Submit Feedback
          </Link>
          <Link
            href="#composer"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            Ask Question
          </Link>
        </div>
      </div>
    </header>
  );
}
