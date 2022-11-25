import React from "react"
import ReactDOM from "react-dom/client"

function Popup () {
	return (
		<div>
			<h1>Hello world 2</h1>
			<p>This is a simple popup.</p>
		</div>
	)
}

const root = ReactDOM.createRoot(document.getElementById("react-target") as HTMLElement)
root.render(<Popup />)