import http from 'http';
import { app } from './app';
import { sql } from './db/client';

const port = process.env.PORT || 8080;

const server = http.createServer(app);

let isShuttingDown = false;

const shutdown = (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`Received ${signal}. Shutting down...`);

  server.close(async (error) => {
    try {
      await sql.end({ timeout: 5 });
    } catch (dbError) {
      console.error('Failed to close database connection pool', dbError);
    }

    if (error) {
      console.error('Failed to close HTTP server cleanly', error);
      process.exit(1);
    }

    process.exit(0);
  });

  setTimeout(() => {
    console.error('Shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
