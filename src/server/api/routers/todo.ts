import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * ZOD OBJECTS
 * addTodoInput - ensures we get the userId, titles, details, done data
 * setDoneInput - ensures we get the todo's id, and done properties
 */
const addTodoInput = z.object({
  userId: z.string(),
  title: z.string(),
  details: z.string(),
  done: z.boolean(),
});

const setDoneInput = z.object({
  id: z.string(),
  done: z.boolean(),
});

export const todoRouter = createTRPCRouter({
  /**
   * NEW TRPC FUNCTIONS
   * We changed the getAll function to get getTodosByUser
   * Then we added the ability to create a todo,
   * delete a todo, and change the done state of a todo
   */
  getTodosByUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const todos = await ctx.db.todo.findMany({
        where: {
          userId: input,
        },
      });
      return todos;
    }),

  createTodo: publicProcedure
    .input(addTodoInput)
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.create({
        data: {
          userId: input.userId,
          title: input.title,
          details: input.details,
          done: input.done,
        },
      });
      return todo;
    }),

  deleteTodo: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  setDone: publicProcedure
    .input(setDoneInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),
});
