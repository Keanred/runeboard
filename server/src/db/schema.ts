import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
        createdAt: text('created_at')
            .notNull()
            .$defaultFn(() => new Date().toISOString()),
        updatedAt: text('updated_at')
            .notNull()
            .$defaultFn(() => new Date().toISOString())
            .$onUpdateFn(() => new Date().toISOString()),
    },
    (table) => ({
        columnIdIdx: index('tasks_column_id_idx').on(table.columnId),
    }),
);

export type InsertColumn = typeof columns.$inferInsert;
export type SelectColumn = typeof columns.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;