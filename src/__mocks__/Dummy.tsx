import React from 'react';

function Dummy () {
	return (
		<div id="dummy">
			{/* Tests will fail without `href` */}
			<a href="">Link text</a>
			<a href="">Link text two</a>
			<a href="">Link text three</a>
		</div>
	);
};

export default Dummy