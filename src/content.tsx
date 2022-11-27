import React from "react"
import { createRoot }  from "react-dom/client"

function Message () {
	return (
		<div>
			<h1>Hello world</h1>
			<p>This is a simple popup.</p>
		</div>
	)
}

const rootElement = document.createElement("div")

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement!)

root.render(<Message />)