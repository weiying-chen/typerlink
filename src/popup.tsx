import React from "react"
import { createRoot }  from "react-dom/client"

function Popup () {
	return (
		<div>
			<h1>Hello world 4</h1>
			<p>This is a simple popup.</p>
		</div>
	)
}

const root = createRoot(document.getElementById("react-target")!)
root.render(<Popup />)