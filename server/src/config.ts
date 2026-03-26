type Config = {
  databaseUrl: string;
  server: {
    port: number;
  };
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

export const config: Config = {
  databaseUrl,
  server: {
    port: parseInt(process.env.PORT ?? '8080', 10),
  },
};