export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}
