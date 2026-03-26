import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const columns = pgTable('columns', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    order: integer('order').notNull(),
});

export const tasks = pgTable(
    'tasks',
    {
        id: text('id').primaryKey(),
        title: text('title').notNull(),
        description: text('description'),
        columnId: text('column_id')
            .notNull()
            .references(() => columns.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
        order: integer('order').notNull().default(0),
        createdAt: text('created_at').notNull(),
        updatedAt: text('updated_at').notNull(),
    },
    (table) => ({
        columnIdIdx: index('tasks_column_id_idx').on(table.columnId),
    }),
);