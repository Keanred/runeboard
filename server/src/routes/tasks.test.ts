import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('tasks routes', () => {
  it('GET /api/tasks returns columns and tasks', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.columns)).toBe(true);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Vitest task', description: 'Created from test' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Vitest task');
    expect(res.body.id).toBeTypeOf('string');
  });

  it('POST /api/tasks rejects missing title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  it('PATCH /api/tasks/:id updates a task title', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Original title' });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ title: 'Updated title' });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.title).toBe('Updated title');
  });

  it('PATCH /api/tasks/:id rejects an invalid columnId', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Column validation task' });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ columnId: 'NOT_A_COLUMN' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid columnId');
  });

  it('PATCH /api/tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app).patch('/api/tasks/nonexistent-task').send({ title: 'Nope' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });

  it('DELETE /api/tasks/:id deletes an existing task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });

    const res = await request(app).delete(`/api/tasks/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it('DELETE /api/tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/tasks/nonexistent-task');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});
