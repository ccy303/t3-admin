import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ pageSize: z.number(), pageNum: z.number() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.sysUser.findMany({
        take: input.pageSize,
        skip: (input.pageNum - 1) * input.pageSize,
      });
      return {
        rows,
        total: await ctx.db.sysUser.count(),
        pageSize: input.pageSize,
        pageNum: input.pageNum,
      };
    }),
  query: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.sysUser.findFirst({
      where: { id: input.id },
    });
  }),
});
