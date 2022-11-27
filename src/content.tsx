import React from "react"
import { useState } from 'react';
import { createRoot }  from "react-dom/client"

function Message () {
	const [count, setCount] = useState(0)

	function handleClick() {
		setCount(count + 1)
	}

	return (
		<button onClick={handleClick}>
      		Clicked {count} times
    	</button>
	)
}

const rootElement = document.createElement("div")

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement!)

root.render(<Message />)