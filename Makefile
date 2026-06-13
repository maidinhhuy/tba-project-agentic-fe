.PHONY: test dev build lint compile

test:
	pnpm test

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

compile:
	pnpm exec tsc --noEmit
