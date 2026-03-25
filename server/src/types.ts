import type { Task } from '@runeboard/schemas';

export { ColumnId, BOARD_COLUMNS } from '@runeboard/schemas';
export type { Column } from '@runeboard/schemas';

export type NewTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

