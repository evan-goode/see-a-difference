import React from "react";
import * as constants from "../constants";
import { Link } from "./common";
import { generateData } from "../utilities";

const formatLine = (sample, { x, y }) => [sample, x, y].join(",");

export default props => {
	const lines = {
		a: generateData(props.samples.a.mean, props.samples.a.sd).map(point =>
			formatLine("Sample 1", point)
		),
		b: generateData(props.samples.b.mean, props.samples.b.sd).map(point =>
			formatLine("Sample 2", point)
		)
	};
	const csv = ["Distribution,x value,y value"]
		.concat(lines.a)
		.concat(lines.b)
		.join("\n");
	const href = `data:application/octet-stream,${encodeURIComponent(csv)}`;
	return (
		<p>
			<Link href={href} download={constants.CSV_FILENAME}>
				Export CSV
			</Link>
		</p>
	);
};
