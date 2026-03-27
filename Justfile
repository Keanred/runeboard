set shell := ["bash", "-cu"]

# Full local dev flow with interrupt-safe cleanup.
dev:
  @bash -c 'cleanup(){ just dev-clean >/dev/null 2>&1 || true; just dev-down >/dev/null 2>&1 || true; }; trap cleanup INT TERM EXIT; just dev-stack'

# Bring up DB, wait until ready, run migrations + seed, then run client+server in parallel.
dev-stack:
  @just dev-db-up
  @just dev-db-wait
  @just dev-db-init
  @bash -c 'just dev-client & just dev-server & wait'

# Install all workspace dependencies.
install:
  npm ci

# One-time local setup for Docker-backed development.
setup:
  @just install
  @just dev-db-up
  @just dev-db-wait
  @just dev-db-init

dev-db-up:
  docker compose up -d postgres

dev-db-wait:
  @bash -c 'until docker compose exec -T postgres pg_isready -U postgres -d runeboard >/dev/null 2>&1; do echo Waiting for Postgres to become ready...; sleep 1; done'

dev-db-init:
  @bash -c 'npm --workspace server run db:migrate:dev && npm --workspace server run db:seed'

dev-server:
  npm --workspace server run dev

dev-client:
  npm --workspace client run dev

dev-clean:
  @bash -c "pkill -f '[t]sx watch --env-file .env.dev src/main.ts' || true; pkill -f '[v]ite' || true"

dev-down:
  docker compose stop postgres

build:
  npm run build --workspaces --if-present

test:
  npm run test --workspaces --if-present

test-watch:
  npm run test:watch --workspaces --if-present

lint:
  npm run lint --workspaces --if-present

typecheck:
  npm --workspace server run typecheck
