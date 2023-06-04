.PHONY: build

build:
	npm run build
	rm -rf docs/
	mv build/ docs/