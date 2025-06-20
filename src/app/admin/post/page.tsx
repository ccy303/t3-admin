import Link from "next/link";

export default function PostPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-2xl text-white">Post Page</h1>
        <p className="text-lg text-white">This is the post page.</p>
        <Link
          href="/admin/user"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          用户
        </Link>
      </div>
    </div>
  );
}
