# API Contract

Base path: `/api`

---

## Common types

All types are defined in [`schemas/src/index.ts`](../schemas/src/index.ts) and shared between the client and server via the `@runeboard/schemas` package.

### Task

```ts
{
  id: string;
  title: string;
  description?: string;
  columnId: string;         // non-empty string; currently "TODO" | "IN_PROGRESS" | "DONE"
  order: number;
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}
```

### Column

```ts
{
  id: string;               // non-empty string
  title: string;            // min length 1
  order: number;            // non-negative integer
}
```

### Error response (all 4xx / 5xx)

```ts
{ error: string }
```

Defined as `ErrorResponseSchema` in the schemas package. Every error from every route uses this exact shape — no additional fields.

---

## Endpoints

### `GET /api/tasks`

Returns all columns and tasks.

**Response `200`**

```ts
{
  columns: Column[];
  tasks: Task[];
}
```

No error cases.

---

### `POST /api/tasks`

Creates a new task.

**Request body**

```ts
{
  title: string;            // required, non-empty
  description?: string;
  columnId?: string;        // defaults to "TODO"
  order?: number;           // defaults to 0
}
```

**Response `201`** — the created `Task` object.

**Errors**

| Status | `error` message |
|--------|----------------|
| `400` | `"Title is required"` |
| `400` | `"Invalid task data: <zod message>"` |
| `400` | `"Invalid columnId"` |
| `400` | `"Failed to create task"` |

---

### `PATCH /api/tasks/:id`

Updates one or more fields on an existing task. All fields are optional; only provided fields are changed.

**Request body**

```ts
{
  title?: string;
  description?: string;
  columnId?: string;
  order?: number;
}
```

**Response `200`** — the updated `Task` object.

**Errors**

| Status | `error` message |
|--------|----------------|
| `400` | `"Invalid columnId"` |
| `404` | `"Task not found"` |

---

### `DELETE /api/tasks/:id`

Deletes a task by ID.

**Response `204`** — no body.

**Errors**

| Status | `error` message |
|--------|----------------|
| `404` | `"Task not found"` |

---

## Validation rules

All validation schemas live in [`schemas/src/index.ts`](../schemas/src/index.ts). Routes import and use them directly — there are no inline validation rules in route handlers beyond what Zod enforces.

| Rule | Schema |
|------|--------|
| `title` is required and must be a non-empty string | `createTaskSchema` |
| `columnId` must be a non-empty string | `ColumnIdSchema` |
| `columnId` must match an existing column at runtime | route handler check against `getColumns()` |
| `order` must be a number (defaults to `0`) | `createTaskSchema` |

---

## Error response format

All errors across all routes return the same shape:

```json
{ "error": "Human-readable message" }
```

- 4xx errors always include a specific message describing what was wrong.
- 5xx errors from the global handler return the exception message, or `"Internal server error"` if no message is available.
- The `error` field is always a plain string — no nested objects, no `details` field.

---

## API versioning strategy

The current routes are **unversioned** (equivalent to v1). The policy going forward:

- **Non-breaking changes** (new optional request fields, new response fields, new endpoints) — ship without a version bump.
- **Breaking changes** (removing or renaming fields, changing types, changing status codes, removing endpoints) — introduce URL path versioning: `/api/v1/tasks`, `/api/v2/tasks`. The old version stays live until clients are migrated.
- New routes should be added under `/api/v1/` when the first version bump happens. Until then, add to `/api/tasks`.

---

## PR checklist for API contract changes

When a PR modifies any endpoint, schema, or error response, verify:

- [ ] Run the integration tests against the **current** `main` and confirm they pass before starting
- [ ] The `schemas/src/index.ts` Zod schema reflects the new shape
- [ ] Request and response tables in this file are updated
- [ ] Error table for the affected endpoint is updated
- [ ] Is this a breaking change? If yes, a new version path is required
- [ ] The client `api.ts` functions handle the updated response shape
- [ ] Existing tests in `tasks.test.ts` are updated or new ones added
- [ ] `ErrorResponseSchema` is still satisfied by all error responses
- [ ] Run the integration tests against your branch and confirm they still pass after the change
