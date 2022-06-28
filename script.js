

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest()

// store the response
let data
// store the array of data
let values = []

// height of the bar
let heightScale
// where the bar located
let xScale
let xAxisScale
let yAxisScale

let width = 1000
let height = 600
let padding = 40

let svg = d3.select("body")
            .append("svg")

let title = svg.append("text")
                .attr("id","title")
                .attr("x", 350)
                .attr("y", 30)
                .text("United State GDP");

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height',height)
}

let generateScale = () => {


    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values,(item) => {
                        return item[1]
                    })])
                    .range([0, height - (2*padding)])

    xScale = d3.scaleLinear()
                .domain([0, values.length-1])
                .range([padding, width - padding])

    let datesArray = values.map((item)=>{
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) =>{
                        return item[1]
                    })])
                    .range([height - padding, padding])
}

let drawBars = () => {

    let tooltip = d3.select("body")
                .append("div")
                .attr("id","tooltip")
                .style("opacity",0)

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class','bar')
        .attr('width',(width-(2*padding))/values.length)
        .attr('data-date',(item)=>{
            return item[0]
        })
        .attr('data-gdp',(item)=>{
            return item[1]
        })
        .attr('height',(item) => {
            return heightScale(item[1])
        })
        .attr('x',(item,index) =>{
            return xScale(index)
        })
        .attr('y',(item)=>{
            return height - padding - heightScale(item[1])
        })
        .on("mouseover", (event, item)=>{
            tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
            tooltip.text(item[0])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");

            document.getElementById('tooltip').setAttribute('data-date',item[0])
        })
        .on("mouseout",(event, item) =>{
            tooltip.transition()
                .duration(500)
                .style("opacity",0)
        })

}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr('transform', 'translate(0, '+ (height - padding) +')')

    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform', 'translate('+ padding +',0)')

}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScale()
    drawBars()
    generateAxes()
}
req.send()

