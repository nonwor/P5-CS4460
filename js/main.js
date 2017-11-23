//
console.log('running 2');
var svg = d3.select('svg');

// X scale is for the "presiage score of the college" 
var xScale = d3.scaleLinear()
	.range([0,700]);


//Y scale is the cost to attend 
var yScale = d3.scaleLinear()
	.range([0,600]);

// get radius of the size of the school
var rScale = d3.scaleSqrt()
	.range([1,15]);

// color by by region. 9 regions 
var colorScale = d3.scaleQuantize()
	.range(['aquamarine','beige','lightsalmon','lightseagreen'
		,'lightskyblue','limegreen','burlywood','crimson','darkmagenta']);

//load data into dataset 
d3.csv('./data/colleges.csv', function(error, dataset){
	
	colleges = dataset;
	//console.log(colleges);

	// find the max compute the domain
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
	xScale.domain(adminRate[1],adminRate[0]);

	var region = d3.nest()
		.key(function(d){
			return d.Region;
		})
		.entries(dataset);

	console.log(region);
	colorScale.domain(region);

})
