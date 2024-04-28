import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"]
}

window.addEventListener("load", () => {
    console.log(
        "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
  )
    console.log("你说神马")

    document.body.style.background = "pink"
})
