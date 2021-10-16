



export default function AreaChart(container){

	let margin = {top:50,bottom: 50, left: 50, right: 50};
    const width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleTime().range([0,width]);

    const yScale=d3.scaleLinear().range([height,0]);
    

    svg.append("g")
	.attr("class", "axis-x-axis")
    .attr("transform", `translate(0, ${height})`);

    svg.append("g")
	.attr("class", "axis-y-axis")

    svg.append("path")
   .attr("class", "area");
   
   const brush = d3
   .brushX()
   .extent([[0, 0], [width, height]])
   .on('brush',brushed)
   .on('end', function(event){
       return;
   })

   const listeners = { brushed: null };

   function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
    }
    svg.append("g").attr('class', 'brush').call(brush);


	function update(data){ 


        xScale.domain([
            d3.min(data, function(d) { return d.date; }),
            d3.max(data, function(d) { return d.date; })
       ])
        yScale.domain([0,d3.max(data,d=>d.total)])

	    const xAxis = d3.axisBottom(xScale);
        svg.select('.axis-x-axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).ticks(4);
        svg.select('.axis-y-axis').call(yAxis);

        var area = d3.area()
        .x(d=>xScale(d.date))
        .y1(height)
        .y0(d=>yScale(d.total))


        d3.select('.area')
        .datum(data)
        .attr('d',area)
        .attr('fill','blue');

        
    
		
	}
    function on(event, listener) {
		listeners[event] = listener;
    }

	return {
		update,
        on 
	};
}

