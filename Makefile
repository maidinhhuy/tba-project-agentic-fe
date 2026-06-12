.PHONY: test dev build lint compile

test:
	npm test

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

compile:
	npx tsc --noEmit
