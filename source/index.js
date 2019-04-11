import React from "react";
import ReactDOM from "react-dom";

import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";

import Main from "./views/Main";

const GlobalStyle = createGlobalStyle`
	em {
		font-style: italic;
	}
`;

ReactDOM.render(
	<>
		<Reset />
		<GlobalStyle />
		<Main />
	</>,
	document.querySelector("#root")
);
