COMPOSE ?= docker compose

.PHONY: build up down logs ps env

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

env:
	@cp -n .env.example .env 2>/dev/null || true
	@echo "Ensured .env exists (existing values preserved)."
