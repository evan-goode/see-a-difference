import React from "react";
import gaussian from "gaussian";

import * as constants from "../constants";
import { riemann } from "../utilities";

const describeCohen = d => {
	if (d < 0.2) return "trivial";
	if (d < 0.5) return "small";
	if (d < 0.8) return "medium";
	return "large";
};

export default props => {
	const { a, b } = props.samples;
	const cohen = Math.abs(
		(a.mean - b.mean) / Math.sqrt((a.sd * a.sd + b.sd * b.sd) / 2)
	);
	const minimum = Math.min(
		constants.Z_MIN * a.sd + a.mean,
		constants.Z_MIN * b.sd + b.mean
	);
	const maximum = Math.max(
		constants.Z_MAX * a.sd + a.mean,
		constants.Z_MAX * b.sd + b.mean
	);
	const distributions = {
		a: gaussian(a.mean, a.sd * a.sd),
		b: gaussian(b.mean, b.sd * b.sd)
	};
	const overlap = riemann(
		x => Math.min(distributions.a.pdf(x), distributions.b.pdf(x)),
		minimum,
		maximum
	);
	const percentage = `${Math.round(100 * overlap)}%`;
	return (
		<>
			<p>
				<em>d</em> = {cohen.toFixed(constants.DECIMAL_PRECISION)} (
				{describeCohen(cohen)})
			</p>
			<p>overlap = {percentage}</p>
		</>
	);
};
