import { execSync } from "child_process";
import { env } from "~/env";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
    dbs: protectedProcedure
        .input(z.object({ pageSize: z.number(), pageNum: z.number() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.$queryRaw`
              Select table_name, create_time FROM information_schema.tables WHERE table_schema = ${env.DATEBASE_NAME}
            `;

            console.log(data);
        }),

    // reloadDBClient: protectedProcedure.mutation(async ({ ctx }) => {
    reloadDBClient: protectedProcedure.mutation(async ({ ctx }) => {
        console.log(execSync);

        await execSync("prisma db pull");

        return { a: 1234 };
    }),
});
