export enum ColumnId {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Column = {
  id: ColumnId;
  title: 'To Do' | 'In Progress' | 'Done';
  order: 0 | 1 | 2;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type NavItem = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}
