#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
MODE="${1:-run}"

cleanup() {
  echo "Resetting test database data..."
  docker compose -f "$COMPOSE_FILE" exec -T postgres \
    psql -U postgres -d runeboard -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" \
    >/dev/null 2>&1 || true

  echo "Cleaning up test database container..."
  docker compose -f "$COMPOSE_FILE" down --remove-orphans >/dev/null 2>&1 || true
}

trap cleanup EXIT

echo "Starting test database..."
docker compose -f "$COMPOSE_FILE" up -d postgres

echo "Waiting for Postgres to become ready..."
for _ in {1..30}; do
  if docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U postgres -d runeboard >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U postgres -d runeboard >/dev/null 2>&1; then
  echo "Postgres did not become ready in time."
  exit 1
fi

cd "$SERVER_DIR"
npm run db:migrate:test
docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres -d runeboard -f /dev/stdin < "$SERVER_DIR/drizzle/seed.sql"

if [[ "$MODE" == "watch" ]]; then
  node --env-file=.env.test ../node_modules/vitest/vitest.mjs
else
  node --env-file=.env.test ../node_modules/vitest/vitest.mjs run
fi
