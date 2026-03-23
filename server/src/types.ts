export enum ColumnId {
  TODO,
  IN_PROGRESS,
  DONE,
}

export type ColumnData = {
  id: ColumnId;
  title: 'To Do' | 'In Progress' | 'Done';
  order: 0 | 1 | 2;
};

export type TaskData = {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  order: number;
  createdAt: string;
  updatedAt: string;
};
