import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
    // const hello = await api.post.hello({ text: "from tRPC" });
    const session = await auth();
    
    // if (session?.user) {
    //   void api.post.getLatest.prefetch();
    // }

    return (
        <HydrateClient>
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-2xl text-white"></p>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-center text-2xl text-white">{session && <span>Logged in as {session.user?.name}</span>}</p>
                            <Link
                                href={session ? "/api/auth/signout" : "/auth/signin?callbackUrl=/"}
                                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                            >
                                {session ? "Sign out" : "Sign in"}
                            </Link>
                            <Link
                                href="/admin/user"
                                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                            >
                                用户中心
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </HydrateClient>
    );
}
