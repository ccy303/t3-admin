import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUsers: protectedProcedure.input(z.object({ pageSize: z.number(), pageNum: z.number() })).query(async ({ ctx, input }) => {
        console.log(input);
        return { a: 123 };
    }),
});
