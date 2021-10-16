import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv',d3.autoType).then(data=>{
    
    for(let i =0;i<data.length;i++){
        data[i]['total']=d3.sum([data[i]['Agriculture'],data[i]['Business services'],data[i]['Construction'],data[i]['Education and Health'],data[i]['Finance'],data[i]['Government'],data[i]['Information'],data[i]['Leisure and hospitality'],data[i]['Manufacturing'],data[i]['Mining and Extraction'],data[i]['Other'],data[i]['Self-employed'],data[i]['Transportation and Utilities'],data[i]['Wholesale and Retail Trade']]);
    }
    
    const areaChart = AreaChart('.AChart');
    const stackedAreaChart =  StackedAreaChart('.SAChart');

    areaChart.update(data);
    stackedAreaChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
    
})