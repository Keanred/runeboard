import * as z from 'zod';

export const LEGACY_COLUMN_IDS = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const LegacyColumnIdSchema = z.enum(LEGACY_COLUMN_IDS);
export const ColumnIdSchema = z.string().trim().min(1).max(100);
const Order = z.number().int().nonnegative();
const TimestampSchema = z.string().datetime({ offset: true });
const TaskTitleSchema = z.string().trim().min(1).max(200);
const TaskDescriptionSchema = z.string().trim().max(4000);
const TaskDescriptionInputSchema = TaskDescriptionSchema.transform((value) => (
  value.length === 0 ? undefined : value
)).optional();

export const TaskSchema = z.object({
  id: z.string(),
  title: TaskTitleSchema,
  description: TaskDescriptionSchema.optional(),
  columnId: ColumnIdSchema,
  order: Order,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const ColumnSchema = z.object({
  id: ColumnIdSchema,
  title: z.string().min(1),
  order: Order,
});

export const createTaskSchema = z.object({
  title: TaskTitleSchema,
  description: TaskDescriptionInputSchema,
  columnId: ColumnIdSchema.default('TODO'),
  order: Order.default(0),
});

export const updateTaskSchema = z.object({
  title: TaskTitleSchema.optional(),
  description: TaskDescriptionInputSchema,
  columnId: ColumnIdSchema.optional(),
  order: Order.optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type Column = z.infer<typeof ColumnSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Matches TypeScript enum usage (ColumnId.TODO, ColumnId.IN_PROGRESS, etc.)
export const ColumnId = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;
export type ColumnId = z.infer<typeof ColumnIdSchema>;
export type LegacyColumnId = z.infer<typeof LegacyColumnIdSchema>;

export const BOARD_COLUMNS: Column[] = [
  { id: ColumnId.TODO, title: 'To Do', order: 0 },
  { id: ColumnId.IN_PROGRESS, title: 'In Progress', order: 1 },
  { id: ColumnId.DONE, title: 'Done', order: 2 },
];

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
