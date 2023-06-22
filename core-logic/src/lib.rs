mod logic;
mod utils;

use std::str::FromStr;

use logic::{Annotated, SequenceGroupType};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, core-logic!");
}

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
    greet();
}

#[wasm_bindgen(js_name = "findBestInverseOfSeq")]
pub fn find_best_inverse_of_seq(group_actions: Box<[js_sys::JsString]>) -> Result<JsValue, String> {
    let group_actions = group_actions
        .iter()
        .map(|js_str| js_str.as_string())
        .collect::<Option<Vec<String>>>()
        .ok_or("Could not convert JS string to Rust string")?;

    let parsed_group_actions = group_actions
        .into_iter()
        .map(|act| {
            SequenceGroupType::from_str(&act).map_err(|_| format!("Invalid action: {}", act))
        })
        .collect::<Result<Vec<SequenceGroupType>, _>>()?;

    let result = logic::find_best_inverse_of_seq(&parsed_group_actions[..]);

    let result_prepared_for_js = result
        .map(|Annotated { val, annotation }| {
            [
                val.into_iter().map(|e| e.to_string()).collect::<Vec<_>>(),
                annotation
                    .into_iter()
                    .map(|e| e.to_string())
                    .collect::<Vec<_>>(),
            ]
        })
        .collect::<Vec<_>>();

    serde_wasm_bindgen::to_value(&result_prepared_for_js).map_err(|e| e.to_string())
}
