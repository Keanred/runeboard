export enum ColumnId {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type ColumnData = {
  id: ColumnId;
  title: 'To Do' | 'In Progress' | 'Done';
  order: 0 | 1 | 2;
};

export const BOARD_COLUMNS: ColumnData[] = [
  {
    id: ColumnId.TODO,
    title: 'To Do',
    order: 0,
  },
  {
    id: ColumnId.IN_PROGRESS,
    title: 'In Progress',
    order: 1,
  },
  {
    id: ColumnId.DONE,
    title: 'Done',
    order: 2,
  },
];

export type NewTaskData = Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>;

export type TaskData = {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  order: number;
  createdAt: string;
  updatedAt: string;
};
