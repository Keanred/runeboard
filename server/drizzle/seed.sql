insert into columns (id, title, "order") values
  ('TODO', 'To Do', 0),
  ('IN_PROGRESS', 'In Progress', 1),
  ('DONE', 'Done', 2)
on conflict (id) do update set
  title = excluded.title,
  "order" = excluded."order";
