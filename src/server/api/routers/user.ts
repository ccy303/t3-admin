import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { formatQueryWhere } from "../../utils";

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number(),
        user_name: z.object({ value: z.string(), operator: z.string().nullable() }).optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageSize, pageNum, ...rest } = input;

      const rows = await ctx.db.sysUser.findMany({
        take: input.pageSize,
        skip: (input.pageNum - 1) * input.pageSize,
        where: { ...formatQueryWhere(rest) },
      });

      return {
        rows,
        total: await ctx.db.sysUser.count({ where: { ...formatQueryWhere(rest) } }),
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
