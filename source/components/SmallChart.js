import React from "react";
import * as d3 from "d3";
import _ from "lodash";

import {
	d3FillWithPattern,
	d3Wrap,
	d3Animate,
	generateData
} from "../utilities";
import * as constants from "../constants";

const WIDTH = 240;
const HEIGHT = 100;
const MARGIN = {
	top: 0,
	right: 0,
	bottom: 18,
	left: 0
};

const style = `
	width: 100%;
	padding: 1em;
	box-sizing: border-box;
	svg {
		overflow: visible;
	}
`;

class SmallChart {
	constructor(element, { sample, other, patternIds }) {
		this.x = d3.scaleLinear();
		this.y = d3.scaleLinear();
		this.line = d3
			.line()
			.x(d => this.x(d.x))
			.y(d => this.y(d.y))
			.curve(d3.curveCardinal);
		this.root = d3
			.select(element)
			.append("svg")
			.attr(
				"viewBox",
				`${-1 * MARGIN.left} ${-1 * MARGIN.top} ${WIDTH +
					MARGIN.left +
					MARGIN.right} ${HEIGHT + MARGIN.top + MARGIN.bottom}`
			);
		this.axisX = this.root
			.append("g")
			.attr("transform", `translate(0 ${HEIGHT})`)
			.attr("class", "axis");
		const defs = this.root.append("defs");
		const clipIds = {
			sample: _.uniqueId(),
			intersect: _.uniqueId()
		};
		this.path = defs
			.append("clipPath")
			.attr("id", clipIds.sample)
			.append("path");
		this.shaded = defs
			.append("clipPath")
			.attr("id", clipIds.intersect)
			.append("rect");
		d3FillWithPattern(
			this.root,
			[clipIds.sample],
			patternIds.sample,
			WIDTH,
			HEIGHT
		);
		d3FillWithPattern(
			this.root,
			[clipIds.sample, clipIds.intersect],
			patternIds.intersect,
			WIDTH,
			HEIGHT
		);
		this.update({ sample, other }, false);
	}
	positionShaded = (sample, other) => {
		const otherMean = this.x(other.mean);
		if (sample.mean > other.mean) {
			return { x: otherMean - WIDTH, y: 0, width: WIDTH, height: HEIGHT };
		}
		return {
			x: otherMean,
			y: 0,
			width: WIDTH,
			height: HEIGHT
		};
	};
	update = ({ sample, other }, animate = true) => {
		const data = generateData(sample.mean, sample.sd);
		const minX = d3.min(data, d => d.x);
		const maxX = d3.max(data, d => d.x);
		const maxY = d3.max(data, d => d.y);
		this.x.domain([minX, maxX]).range([0, WIDTH]);
		this.y.domain([0, maxY]).range([HEIGHT, 0]);
		d3Animate(this.path, animate).attr("d", this.line(data));
		d3Animate(this.axisX, animate).call(
			d3.axisBottom(this.x).ticks(3)
			//.tickSize(TICK_SIZE)
			//.tickPadding(TICK_PADDING)
		);
		const shadedPosition = this.positionShaded(sample, other);
		d3Animate(this.shaded, animate)
			.attr("x", shadedPosition.x)
			.attr("y", shadedPosition.y)
			.attr("width", shadedPosition.width)
			.attr("height", shadedPosition.height);
	};
}

export default d3Wrap(SmallChart, style);
