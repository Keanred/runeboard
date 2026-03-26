insert into columns (id, title, "order") values
  ('TODO', 'To Do', 0),
  ('IN_PROGRESS', 'In Progress', 1),
  ('DONE', 'Done', 2)
on conflict (id) do update set
  title = excluded.title,
  "order" = excluded."order";

insert into tasks (id, title, description, column_id, "order", created_at, updated_at) values
  (
    'seed-task-001',
    'Design database schema',
    'Define tables and relationships for the production DB.',
    'TODO',
    0,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
  ),
  (
    'seed-task-002',
    'Write API integration tests',
    'Cover all task CRUD endpoints with integration tests.',
    'TODO',
    1,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
  ),
  (
    'seed-task-003',
    'Implement drag-and-drop',
    'Allow tasks to be reordered and moved between columns.',
    'IN_PROGRESS',
    0,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
  ),
  (
    'seed-task-004',
    'Set up CI pipeline',
    'Configure GitHub Actions to run lint, typecheck, and tests on every PR.',
    'IN_PROGRESS',
    1,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
  ),
  (
    'seed-task-005',
    'Initialise monorepo',
    'Create client and server workspaces with shared root package.json.',
    'DONE',
    0,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  column_id = excluded.column_id,
  "order" = excluded."order",
  updated_at = excluded.updated_at;
