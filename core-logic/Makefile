.PHONY: build fix

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
mkfile_dir := $(dir $(mkfile_path))

build:
	wasm-pack build --target web --out-dir "$(mkfile_dir)../node_modules/core-logic"

fix:
	__CARGO_FIX_YOLO=1 cargo clippy --fix



