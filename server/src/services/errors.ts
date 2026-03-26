export class InvalidColumnIdError extends Error {
  constructor() {
    super('Invalid columnId');
    this.name = 'InvalidColumnIdError';
  }
}

export class TaskNotFoundError extends Error {
  constructor() {
    super('Task not found');
    this.name = 'TaskNotFoundError';
  }
}