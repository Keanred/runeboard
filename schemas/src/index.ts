import * as z from 'zod';

export const LEGACY_COLUMN_IDS = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const LegacyColumnIdSchema = z.enum(LEGACY_COLUMN_IDS);
export const ColumnIdSchema = z.string().min(1);
const Order = z.number().int().nonnegative();

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  columnId: ColumnIdSchema,
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ColumnSchema = z.object({
  id: ColumnIdSchema,
  title: z.string().min(1),
  order: Order,
});

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  columnId: ColumnIdSchema.default('TODO'),
  order: z.number().default(0),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  columnId: ColumnIdSchema.optional(),
  order: z.number().optional(),
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
