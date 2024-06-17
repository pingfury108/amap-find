use regex::Regex;
use scraper::{Html, Selector};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn find_by_css(html_text: &str, select: &str) -> String {
    if html_text.is_empty() {
        return "".to_string();
    }
    let document = Html::parse_fragment(html_text);
    let selector = Selector::parse(select).unwrap();

    if let Some(d) = document.select(&selector).next() {
        return d.inner_html();
    }

    return "".to_string();
}

#[wasm_bindgen]
pub fn find_class_by_regex(html_text: &str, name: &str) -> Vec<String> {
    let mut ss = vec![];
    if html_text.is_empty() {
        return ss;
    }
    let document = Html::parse_document(html_text);
    let selector = Selector::parse("[class]").unwrap();
    let re = Regex::new(&format!("^{}.*", name)).unwrap();

    for element in document.select(&selector) {
        if let Some(class_attr) = element.value().attr("class") {
            if re.is_match(class_attr) {
                ss.push(element.inner_html());
            }
        }
    }

    ss
}

#[wasm_bindgen]
pub fn find_class_by_regex_first(html_text: &str, name: &str) -> String {
    if html_text.is_empty() {
        return "".to_string();
    }
    let mut ss = vec![];
    let document = Html::parse_document(html_text);
    let selector = Selector::parse("[class]").unwrap();
    let re = Regex::new(&format!("^{}.*", name)).unwrap();

    for element in document.select(&selector) {
        if let Some(class_attr) = element.value().attr("class") {
            if re.is_match(class_attr) {
                ss.push(element.inner_html());
            }
        }
    }
    if ss.len() > 0 {
        ss[0].to_string()
    } else {
        "".into()
    }
}

#[wasm_bindgen]
pub fn find_class_by_regex_last(html_text: &str, name: &str) -> String {
    if html_text.is_empty() {
        return "".to_string();
    }
    let mut ss = vec![];
    let document = Html::parse_document(html_text);
    let selector = Selector::parse("[class]").unwrap();
    let re = Regex::new(&format!("^{}.*", name)).unwrap();

    for element in document.select(&selector) {
        if let Some(class_attr) = element.value().attr("class") {
            if re.is_match(class_attr) {
                ss.push(element.inner_html());
            }
        }
    }
    if ss.len() > 0 {
        ss[ss.len() - 1].to_string()
    } else {
        "".into()
    }
}

#[wasm_bindgen]
pub fn html_to_text(html_text: &str) -> String {
    if html_text.is_empty() {
        return "".to_string();
    }
    let text = html2text::from_read(html_text.as_bytes(), 1000);
    text.replace("\n", "").replace("*", "")
}
