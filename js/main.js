//
console.log('running 2');
var svg = d3.select('svg');

// X scale is for the "presiage score of the college" 
var xScale = d3.scaleLinear()
	.range([0,700]);


//Y scale is the cost to attend 
var yScale = d3.scaleLinear()
	.range([0,500]);

// get radius of the size of the school
var rScale = d3.scaleSqrt()
	.range([1,15]);

// color by by region. 9 regions 
// var colorScale = d3.scaleQuantize()
// 	.range(['aquamarine','beige','lightsalmon','lightseagreen'
// 		,'lightskyblue','limegreen','burlywood','crimson','darkmagenta']);

//load data into dataset 
d3.csv('./data/colleges.csv', function(error, dataset){
	
	colleges = dataset;
	//console.log(colleges);

	// find the max compute the domain for variables **********************************
	var radiusMax = d3.max(colleges, function(d){
		return +d['Undergrad Population'];
	});
	//console.log(radiusMax);
	rScale.domain([0,radiusMax]);

	var costToAttend = d3.extent(colleges, function(d){
		return +d['Average Cost'];
	});
	console.log(costToAttend);
	yScale.domain(costToAttend);

	var adminRate = d3.extent(colleges, function(d){
		return +d['Admission Rate'];
	});
	console.log(adminRate[1],adminRate[0]);
	xScale.domain(adminRate);

	///*******************************************************************

	svg.selectAll('.Name')
		.data(colleges)
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
		.attr('transform', 'translate(50,50)')
		.style('fill', function(d){
			console.log(d.Region);
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



});
