export { ColumnId } from '@runeboard/schemas';
export type { Column, Task } from '@runeboard/schemas';

export type NavItem = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
};
