// config
zMin = -4;
zMax = 4;
sampleCount = 40;
margin = 64;
largeWidth = 640 - (2 * margin);
largeHeight = 400 - (2 * margin);
smallWidth = 480 - (2 * margin);
smallHeight = 260 - (2 * margin);
speed = 512;
aColor = "dodgerblue"
bColor = "deeppink"
aColorLight = "rgb(148, 201, 253)"
bColorLight = "rgb(254, 145, 201)"
mixedColorLight = "rgb(147, 146, 226)";
// end config

var aMean = 175;
var bMean = 162;
var aSd = 7.1;
var bSd = 6.5;

update(aMean, bMean, aSd, bSd, false);

function update(aMean, bMean, aSd, bSd, animate) {
	aData = [];
	bData = [];

	counter = (zMax - zMin) / sampleCount;

	function populate(data, mean, sd, zMin, zMax) {
		for (var i = zMin; i <= zMax; i += counter) {
			data.push({
				x: (i * sd) + mean,
				y: (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp((-1 / 2) * Math.pow(i, 2))
			});
		}
	}
	populate(aData, aMean, aSd, zMin, zMax);
	populate(bData, bMean, bSd, zMin, zMax);

	aMinX = (zMin * aSd) + aMean;
	bMinX = (zMin * bSd) + bMean;
	aMaxX = (zMax * aSd) + aMean;
	bMaxX = (zMax * bSd) + bMean;
	mainMinX = Math.min(aMinX, bMinX);
	mainMaxX = Math.max(aMaxX, bMaxX);

	aMaxY = d3.max(aData, function(d) {return d.y});
	bMaxY = d3.max(bData, function(d) {return d.y});
	mainMaxY = Math.max(aMaxY, bMaxY);

	cohen = {};
	cohen.value = Math.abs((aMean - bMean) / Math.sqrt((Math.pow(aSd, 2) + Math.pow(bSd, 2)) / 2));
	cohen.value = Math.round(cohen.value * 100) / 100;
	if (cohen.value < 0.2) cohen.description = "trivial";
	else if (cohen.value < 0.5) cohen.description = "small";
	else if (cohen.value < 0.8) cohen.description = "medium";
	else cohen.description = "large";

	area = 0;
	for (i = mainMinX; i < mainMaxX; i += (mainMaxX - mainMinX) / sampleCount) {
		area += ((mainMaxX - mainMinX) / sampleCount) * Math.min((1 / (aSd * Math.sqrt(2 * Math.PI))) * Math.exp(-1 * Math.pow(i - aMean, 2) / (2 * Math.pow(aSd, 2))), (1 / (bSd * Math.sqrt(2 * Math.PI))) * Math.exp(-1 * Math.pow(i - bMean, 2) / (2 * Math.pow(bSd, 2))));
	}
	area = Math.round(area * 100);

	$("#stats").html("d = " + cohen.value + " (" + cohen.description + ")<br>overlap = " + area + "%");

	var aGauss = gaussian(aMean, Math.pow(aSd, 2));
	var bGauss = gaussian(bMean, Math.pow(bSd, 2));
	aPercent = aGauss.cdf(bMean);
	if (aPercent > 0.5) aPercent = 1 - aPercent;
	aPercent = Math.round(aPercent * 100);
	bPercent = bGauss.cdf(aMean);
	if (bPercent > 0.5) bPercent = 1 - bPercent;
	bPercent = Math.round(bPercent * 100);
	$("#aPercent").html(aPercent + "% of the males are more female-like than the average female.");
	$("#bPercent").html(bPercent + "% of the females are more male-like than the average male.");

	if (animate) {
		mainX.domain([mainMinX, mainMaxX]);
	  mainY.domain([0, mainMaxY]);
		aX.domain([aMinX, aMaxX]);
		aY.domain([0, mainMaxY]);
		bX.domain([bMinX, bMaxX]);
		bY.domain([0, bMaxY]);

		var mainSvg = d3.select("#main").transition();
		mainSvg.select("#main .line.a")
			.duration(speed)
			.attr("d", mainLine(aData));
		mainSvg.select("#main .line.b")
			.duration(speed)
			.attr("d", mainLine(bData));
		mainSvg.select("#main .axis.x")
			.duration(speed)
			.call(mainAxisX);
		mainSvg.select("#main .axis.y")
			.duration(speed)
			.call(mainAxisY);

		var aSvg = d3.select("#a").transition();
		aSvg.select("#a .line.a")
			.duration(speed)
			.attr("d", aLine(aData));
		aSvg.select("#a .axis.x")
			.duration(speed)
			.call(aAxisX);
		aSvg.select("#a .axis.y")
			.duration(speed)
			.call(aAxisY);

		var bSvg = d3.select("#b").transition();
		bSvg.select("#b .line.b")
			.duration(speed)
			.attr("d", bLine(bData));
		bSvg.select("#b .axis.x")
			.duration(speed)
			.call(bAxisX);
		bSvg.select("#a .axis.y")
			.duration(speed)
			.call(bAxisY);

		leftColor = aColorLight;
		lineColor = aColor;
		rightColor = mixedColorLight;
		if (aMean > bMean) {
			leftColor = mixedColorLight;
			rightColor = aColorLight;
		}

		aGradient.select("stop:nth-of-type(1)")
      .transition()
			.attr("stop-color", leftColor);
		aGradient.select("stop:nth-of-type(2)")
      .transition()
			.attr("stop-color", leftColor)
      .attr("offset", ((bMean - aMinX) / (aMaxX - aMinX)));
		aGradient.select("stop:nth-of-type(3)")
			.transition()
			.attr("stop-color", rightColor)
			.attr("offset", ((bMean - aMinX) / (aMaxX - aMinX)));
		aGradient.select("stop:nth-of-type(4)")
			.transition()
			.attr("stop-color", rightColor);

		leftColor = bColorLight;
		lineColor = bColor;
		rightColor = mixedColorLight;
		if (bMean > aMean) {
			leftColor = mixedColorLight;
			rightColor = bColorLight;
		}

		bGradient.select("stop:nth-of-type(1)")
			.transition()
			.attr("stop-color", leftColor);
		bGradient.select("stop:nth-of-type(2)")
      .transition()
			.attr("stop-color", leftColor)
      .attr("offset", ((aMean - bMinX) / (bMaxX - bMinX)));
		bGradient.select("stop:nth-of-type(3)")
			.transition()
			.attr("stop-color", rightColor)
			.attr("offset", ((aMean - bMinX) / (bMaxX - bMinX)));
		bGradient.select("stop:nth-of-type(4)")
			.transition()
			.attr("stop-color", rightColor);
	}
}

var mainX = d3.scale.linear()
	.domain([mainMinX, mainMaxX])
	.range([0, largeWidth]);
var mainY = d3.scale.linear()
	.domain([0, mainMaxY])
	.range([largeHeight, 0]);
var aX = d3.scale.linear()
	.domain([aMinX, aMaxX])
	.range([0, smallWidth]);
var aY = d3.scale.linear()
	.domain([0, aMaxY])
	.range([smallHeight, 0]);
var bX = d3.scale.linear()
	.domain([bMinX, bMaxX])
	.range([0, smallWidth]);
var bY = d3.scale.linear()
	.domain([0, bMaxY])
	.range([smallHeight, 0]);

var mainLine = d3.svg.line()
	.x(function(d) {return mainX(d.x)})
	.y(function(d) {return mainY(d.y)})
	.interpolate("cardinal");
var aLine = d3.svg.line()
	.x(function(d) {return aX(d.x)})
	.y(function(d) {return aY(d.y)})
	.interpolate("cardinal");
var bLine = d3.svg.line()
	.x(function(d) {return bX(d.x)})
	.y(function(d) {return bY(d.y)})
	.interpolate("cardinal");

var main = d3.select(".graph#main")
	.append("svg")
		.attr("width", largeWidth + (2 * margin))
		.attr("height", largeHeight + (2 * margin))
		.append("g")
			.attr("transform", "translate(" + margin + "," + margin + ")");

var mainAxisX = d3.svg.axis()
	.scale(mainX)
	.ticks(3);
var mainAxisY = d3.svg.axis()
	.scale(mainY);

main.append("path")
	.attr("class", "line b")
	.attr("stroke-linecap", "round")
	.attr("d", mainLine(bData));
main.append("path")
	.attr("class", "line a")
	.attr("stroke-linecap", "round")
	.attr("d", mainLine(aData));

main.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + largeHeight + ")")
	.call(mainAxisX);

var a = d3.select(".graph#a")
	.append("svg")
		.attr("width", smallWidth + (2 * margin))
		.attr("height", smallHeight + (2 * margin))
		.append("g")
			.attr("transform", "translate(" + margin + "," + margin + ")");

var aAxisX = d3.svg.axis()
	.scale(aX)
	.ticks(3)
var aAxisY = d3.svg.axis()
	.scale(aY);

a.append("path")
	.attr("class", "line")
	.attr("stroke-linecap", "round")
	.attr("d", aLine(aData));
a.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + smallHeight + ")")
	.call(aAxisX);

leftColor = aColorLight;
lineColor = aColor;
rightColor = mixedColorLight;
if (aMean > bMean) {
	leftColor = mixedColorLight;
	rightColor = aColorLight;
}

aGradient = a.append("defs")
	.append("linearGradient")
		.attr("id", "aGradient")
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", smallWidth).attr("y2", 0);
aGradient.append("stop")
	.attr("offset", 0)
	.attr("stop-color", leftColor)
aGradient.append("stop")
	.attr("offset", ((bMean - aMinX) / (aMaxX - aMinX)))
	.attr("stop-color", leftColor)
aGradient.append("stop")
	.attr("offset", ((bMean - aMinX) / (aMaxX - aMinX)))
	.attr("stop-color", rightColor)
aGradient.append("stop")
	.attr("offset", 1)
	.attr("stop-color", rightColor)

var b = d3.select(".graph#b")
	.append("svg")
		.attr("width", smallWidth + (2 * margin))
		.attr("height", smallHeight + (2 * margin))
		.append("g")
			.attr("transform", "translate(" + margin + "," + margin + ")");

var bAxisX = d3.svg.axis()
	.scale(bX)
	.ticks(3)
var bAxisY = d3.svg.axis()
	.scale(bY);

b.append("path")
	.attr("class", "line")
	.attr("stroke-linecap", "round")
	.attr("d", bLine(bData));
b.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + smallHeight + ")")
	.call(bAxisX);

leftColor = bColorLight;
lineColor = bColor;
rightColor = mixedColorLight;
if (bMean > aMean) {
	leftColor = mixedColorLight;
	rightColor = bColorLight;
}

var bGradient = b.append("defs")
	.append("linearGradient")
		.attr("id", "bGradient")
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", smallWidth).attr("y2", 0);
bGradient.append("stop")
	.attr("offset", 0)
	.attr("stop-color", leftColor)
bGradient.append("stop")
	.attr("offset", ((aMean - bMinX) / (bMaxX - bMinX)))
	.attr("stop-color", leftColor)
bGradient.append("stop")
	.attr("offset", ((aMean - bMinX) / (bMaxX - bMinX)))
	.attr("stop-color", rightColor)
bGradient.append("stop")
	.attr("offset", 1)
	.attr("stop-color", rightColor)

$("#se").change(function(){
	if (this.checked) {
		$(".se-row").show();
		$(".sd-row").hide();
	}
	else {
		$(".sd-row").show();
		$(".se-row").hide();
	}
});

$(".update").keyup(function() {
	aMean = parseFloat($("#aMean").val());
	if (isNaN(aMean)) aMean = 0;
	bMean = parseFloat($("#bMean").val());
	if (isNaN(bMean)) bMean = 0;

	if ($("#se").prop('checked')) {
		$("#aSd").val($("#aSe").val() * Math.sqrt($("#aN").val()));
		$("#bSd").val($("#bSe").val() * Math.sqrt($("#bN").val()));
	}
	else {
		$(".se, .n").val("");
	}
	aSd = parseFloat($("#aSd").val());
	if (isNaN(aSd) || aSd <= 0) aSd = 1;
	bSd = parseFloat($("#bSd").val());
	if (isNaN(bSd) || bSd <= 0) bSd = 1;

	update(aMean, bMean, aSd, bSd, true);
});

function generateCsv() {
	csv = "Distribution,X,Y\n";
	for (i = 0; i < aData.length; i++) {
		csv += "Male," + aData[i].x + "," + aData[i].y +"\n";
	}
	for (i = 0; i < bData.length; i++) {
		csv += "Female," + bData[i].x + "," + bData[i].y + "\n";
	}
	return csv;
}

$("#csv").click(function() {
	$(this).attr("href", "data:application/octet-stream," + encodeURIComponent(generateCsv())).attr("download", "see-a-difference.csv");
});
