

export default function StackedAreaChart(container) {

    let margin = {top:50,bottom: 50, left: 50, right: 50};
    const width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleTime().range([0,width]);

    const yScale=d3.scaleLinear().range([height,0]);
    
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

    svg.append("g")
	.attr("class", "axis-x-axis")
    .attr("transform", `translate(0, ${height})`);

    svg.append("g")
	.attr("class", "axis-y-axis")


	

    
    let selected = null, xDomain, data;
	function update(_data){
        data=_data;

        const keys = selected? [selected] : data.columns.slice(1);

        

        var series = d3.stack()
        .keys(keys)
        .offset(d3.stackOffsetNone)
        (data)
    

        xScale.domain(xDomain? xDomain:[
            d3.min(data, function(d) { return d.date; }),
            d3.max(data, function(d) { return d.date; })
       ])

        yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);

        const xAxis = d3.axisBottom(xScale);
        svg.select('.axis-x-axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.select('.axis-y-axis').call(yAxis);

        colorScale.domain(keys)

        const area=d3.area()
        .x(d=>xScale(d.data.date))
        .y0(d=>yScale(d[0]))
        .y1(d=>yScale(d[1]));

        var tooltip=d3.select('.tooltip')
        .style('position','fixed')
        
        const areas = svg.selectAll('.area')
        .data(series,d=>d.key);

        areas.enter().append('path')
        .attr('class','area')
        .merge(areas)
        .attr('fill',d=>colorScale(d))
        .attr('d',area)
        .on('mouseenter',(event,d)=>{
            tooltip.style('display','block')
            .text(d.key)
        })
        .on('mouseleave',(event,d)=>{
            tooltip.style('display','none');
        })
        .on('click',(event,d)=>{
            if (selected === d.key){
                selected=null;
            }
            else{
                selected=d.key;
            }
            update(data);
        });
        areas.exit().remove();



	}
    function filterByDate(range){
		xDomain = range;  // -- (3)
		update(data); // -- (4)
	}
	return {
		update,
        filterByDate
	}
}