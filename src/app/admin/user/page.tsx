import Link from "next/link";

export default function UserPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-2xl text-white">User Page</h1>
        <p className="text-lg text-white">This is the user page.</p>
        <Link
          href="/admin/post"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          岗位
        </Link>
      </div>
    </div>
  );
}
