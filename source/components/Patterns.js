import React from "react";
import styled from "styled-components";

import * as constants from "../constants";

const HiddenSvg = styled.svg`
	width: 0;
	height: 0;
	position: absolute;
`;

const Pattern = props => {
	return (
		<pattern {...props} id={props.id} patternUnits="userSpaceOnUse">
			{props.children}
		</pattern>
	);
};

export default props => {
	return (
		<HiddenSvg>
			<defs>
				<Pattern id={props.patternIds.a} width="1" height="1">
					<rect x="0" y="0" width="1" height="1" fill={constants.COLORS.a} />
				</Pattern>
				<Pattern id={props.patternIds.b} width="1" height="1">
					<rect x="0" y="0" width="1" height="1" fill={constants.COLORS.b} />
				</Pattern>
				<Pattern id={props.patternIds.intersect} width="1" height="1">
					<rect x="0" y="0" width="1" height="1" fill={constants.COLORS.intersect} />
				</Pattern>
			</defs>
		</HiddenSvg>
	);
};
