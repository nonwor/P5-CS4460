//
console.log('running 1');

var svg = d3.select('svg'),
	width = +svg.attr("width"),
    height = +svg.attr("height");

var transform = d3.zoomIdentity;

// X scale is for the "presiage score of the college" 
var xScale = d3.scaleLinear()
	.range([0,700]);


//Y scale is the cost to attend 
var yScale = d3.scaleLinear()
	.range([0,500]);

// get radius of the size of the school
var rScale = d3.scaleSqrt()
	.range([1,15]);

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['Name']+"</h5><table><thead><tr><td colspan='2'>Mean Earnings 8 Years After Entry</td><td>Median Debt</td></tr></thead>"
             + "<tbody><tr><td colspan='2'>"+d['Mean Earnings 8 years After Entry']+"</td><td>"+d['Median Debt']+"</td></tr></tbody>"
             + "<thead><tr><td colspan='2'>Undergrad Population</td><td colspan='2'>Locale</td></tr></thead>"
             + "<tbody><tr><td colspan='2'>"+d['Undergrad Population']+"</td><td colspan='2'>"+d['Locale']+"</td></tr></tbody></table>"
    });

svg.call(toolTip); 

// color by by region. 9 regions 
// var colorScale = d3.scaleQuantize()
// 	.range(['aquamarine','beige','lightsalmon','lightseagreen'
// 		,'lightskyblue','limegreen','burlywood','crimson','darkmagenta']);

//Set var for Zoom**************************************************************************

// var xLine = svg /////////// x-label
// 	    	.attr('class', 'x axis')
// 	    	.attr('transform', 'translate(100,560)')
// 	    	.call(d3.axisBottom(xScale));

// var yLine = svg //////// y-label
// 		.attr('class', 'y axis')
// 		.attr('transform', 'translate(100,60)')
// 		.call(d3.axisLeft(yScale));

// var zoom2 = d3.zoom()
//     .scaleExtent([1, 40])
//     .translateExtent([[-100, -100], [width + 90, height + 100]])
//     .on("zoom", zoomed2);

// var x = d3.scaleLinear()
//     .domain([0, 1])
//     .range([0, 700]);

// var y = d3.scaleLinear()
//     .domain([0, 70000])
//     .range([0, 500]);

// var xAxis = d3.axisBottom(x)
//     .ticks((width + 2) / (height + 2) * 10)
//     .tickSize(height)
//     .tickPadding(8 - height);

// var yAxis = d3.axisRight(y)
//     .ticks(10)
//     .tickSize(width)
//     .tickPadding(8 - width);

// var view = svg.append("rect")
//     .attr("class", "view")
//     .attr("x", 0.5)
//     .attr("y", 0.5)
//     .attr("width", width - 1)
//     .attr("height", height - 1);

// var gX = svg.append("g")
//     .attr('class', 'x axis')
// 	.attr('transform', 'translate(100,560)')
// 	.call(d3.axisBottom(x));

// var gY = svg.append("g")
//     .attr('class', 'y axis')
//     .attr('transform', 'translate(100,60)')
// 	.call(d3.axisLeft(y));

// svg.call(zoom2);

// function zoomed2() {
//   gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
//   gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
// }


//end of zoom*********************************************************************************


//load data into dataset 
d3.csv('./data/colleges.csv', function(error, dataset){
	
	colleges = dataset;
	console.log(colleges);

	var filterCollege = d3.nest()
	  .key(function(d) { 
	  	//console.log(d.Control);
	  	if (d.Control == "Private"){
	  		return d;
	  		}; 
	  	})
	  .entries(dataset);

	//console.log(filterCollege[0]); ///I dont know why this is the way the key the value of private

	var privateCollege = filterCollege[0].values;
	var publicCollege = filterCollege[1].values;

	console.log(filterCollege[0].values);
	console.log(filterCollege[1].values);

	// find the max compute the domain for variables **********************************
	var radiusMax = d3.max(colleges, function(d){
		return +d['Undergrad Population'];
	});
	//console.log(radiusMax);
	rScale.domain([0,radiusMax]);

	var costToAttend = d3.extent(colleges, function(d){
		return +d['Average Cost'];
	});
	//console.log(costToAttend);
	yScale.domain(costToAttend);

	var adminRate = d3.extent(colleges, function(d){
		return +d['Admission Rate'];
	});
	//console.log(adminRate[1],adminRate[0]);
	xScale.domain(adminRate);

	///*******************************************************************

	var publicObj = svg.selectAll('.Name')   //////////////creating public plot
		.data(publicCollege)
		.enter()
		.append('circle')
		.attr('class', 'college')
		.attr('r', function(d){
			return rScale(d['Undergrad Population']);
		})
		.attr('cx', function(d){
			return xScale(d['Admission Rate']);
		})
		.attr('cy', function(d){
			return yScale(d['Average Cost'])
		})
		.attr('transform', 'translate(100, 60)')
		.style('fill', function(d){
			//console.log(d.Region);
			if (d.Region == "Far West") return 'aquamarine' ;
			if (d.Region == "Great Lakes") return 'darkmagenta';
			if (d.Region == "Great Plains") return 'lightsalmon';
			if (d.Region == "New England") return 'mediumturquoise';
			if (d.Region == "Mid-Atlantic") return 'lightseagreen';
			if (d.Region == "Outlying Areas") return 'lightskyblue';
			if (d.Region == "Rocky Mountains") return 'limegreen';
			if (d.Region == "Southeast") return 'burlywood';
			if (d.Region == "Southwest") return 'crimson';
		})
	    .attr('fill-opacity', 0.7)
	    .call(d3.drag()
        .on("drag", dragged));

	publicObj.on('mouseover', toolTip.show)
    	.on('mouseout', toolTip.hide);

	var privateObj = svg.selectAll('.Name')  ////////creating private plot
		.data(privateCollege)
		.enter()
		.append('rect')
		.attr('class', 'college')
		.attr('width', function(d){
			//console.log('test');
			//console.log(rScale(d['Undergrad Population']));
			return rScale(d['Undergrad Population']*2);
		})
		.attr('height', function(d){
			return rScale(d['Undergrad Population']*2);
		})
		.attr('x', function(d){
			return xScale(d['Admission Rate']);
		})
		.attr('y', function(d){
			return yScale(d['Average Cost'])
		})
		.attr('transform', 'translate(100,50)')
		.style('fill', function(d){
			//console.log(d.Region);
			if (d.Region == "Far West") return 'aquamarine' ;
			if (d.Region == "Great Lakes") return 'darkmagenta';
			if (d.Region == "Great Plains") return 'lightsalmon';
			if (d.Region == "New England") return 'mediumturquoise';
			if (d.Region == "Mid-Atlantic") return 'lightseagreen';
			if (d.Region == "Outlying Areas") return 'lightskyblue';
			if (d.Region == "Rocky Mountains") return 'limegreen';
			if (d.Region == "Southeast") return 'burlywood';
			if (d.Region == "Southwest") return 'crimson';
		})
	    .attr('fill-opacity', 0.7)
	    .call(d3.drag()
        .on("drag", dragged));

	privateObj.on('mouseover', toolTip.show)
    	.on('mouseout', toolTip.hide);

	var xLine = svg.append('g') /////////// x-label
	    	.attr('class', 'x axis')
	    	.attr('transform', 'translate(100,560)')
	    	.call(d3.axisBottom(xScale));

	var yLine = svg.append('g') //////// y-label
		.attr('class', 'y axis')
		.attr('transform', 'translate(100,60)')
		.call(d3.axisLeft(yScale));


    svg.call(d3.zoom()
    .scaleExtent([1 / 2, 8])
    .translateExtent([[-100, -100], [width + 90, height + 100]])
    .on("zoom", zoomed));

	function zoomed() {
		publicObj.attr("transform", d3.event.transform);
		privateObj.attr("transform", d3.event.transform);

		xLine.attr("transform", d3.event.transform);
		yLine.attr("transform", d3.event.transform);
	}

	function dragged(d) {	
	  //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
	  //d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
	}
});

var xLabelText = svg.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate(350,590)')
        .text('Prestige via acceptance rate');

var yLabelText = svg.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate(50,400) rotate(270)')
        .text('Cost to attend per semester in USD');

// var xLine = svg.append('g') /////////// x-label
// 	    	.attr('class', 'x axis')
// 	    	.attr('transform', 'translate(100,560)')
// 	    	.call(d3.axisBottom(xScale));

// var yLine = svg.append('g') //////// y-label
// 		.attr('class', 'y axis')
// 		.attr('transform', 'translate(100,60)')
// 		.call(d3.axisLeft(yScale));


