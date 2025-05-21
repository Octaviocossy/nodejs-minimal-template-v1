import { z } from 'zod';

const properties = {
  title: z.string({ required_error: 'Title is required' }),
  completed: z.boolean({ required_error: 'Completed is required' }),
  id: z.string({ required_error: 'Id is required' }),
};

export const TASK_SCHEMA = z.object({
  body: z.object({
    title: properties.title,
  }),
});

export const UPDATE_TASK_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
  body: z.object({
    title: properties.title,
    completed: properties.completed,
  }),
});

export const DELETE_TASK_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
});

export type TASK_SCHEMA_TYPE = z.infer<typeof TASK_SCHEMA>;

export type UPDATE_TASK_SCHEMA_TYPE = z.infer<typeof UPDATE_TASK_SCHEMA>;

export type DELETE_TASK_SCHEMA_TYPE = z.infer<typeof DELETE_TASK_SCHEMA>;
