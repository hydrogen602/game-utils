.PHONY: build run wasm-build

run: wasm-build
	npm start

wasm-build:
	$(MAKE) -C core-logic/ build

build: wasm-build
	npm run build
	rm -rf docs/
	mv build/ docs/