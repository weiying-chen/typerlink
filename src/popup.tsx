import React from "react"
import { createRoot } from "react-dom/client"

function Popup() {
	return (
		<div>
			<h1>Hello world 8</h1>
			<p>This is a simple popup.</p>
		</div>
	)
}

// The ! assures React the element exists
const rootElement = document.getElementById("react-target")!
const root = createRoot(rootElement)

root.render(<Popup />)
