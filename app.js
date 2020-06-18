//Width and height
var w = 800;
var h = 600;

var color = d3.scaleOrdinal()
            .domain(["Люди, связанные с президентом", "Региональные чиновники", "Сомнительные компании", "Другие"])
            .range(['#BF9F99', '#BFB999', '#99372E', '#99B2BF'])

       
var legend = d3.legendColor()
        .cells(d3.scaleOrdinal().domain())
        .orient('vertical')
        .scale(color)
        .title("Кому достались контракты на вывоз мусора, млрд. руб.");   

var dataset = [ 423, 413, 122, 1099 ];
var outerRadius = w / 3;
var innerRadius = w / 5;
var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius - 10);



var pie = d3.pie()
            .sort(null);

//Create SVG element
var svg = d3.select("#viz")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .call(makeResponsive);

svg.append('g')
    .attr('class', 'legend')
    .attr("transform", `translate(${w - 350},${h - 550})`)
    .call(legend);
            
var caption = svg.append('g').append('text').attr('class', 'caption')
    .text('«Важные истории»')
    .attr("transform", "translate(" + (w - 350) + "," + (h - 100) + ")");

var source =  svg.append('g').append('text').attr('class', 'source')
    .text('Данные: torgi.gov.ru, ЕГРЮЛ')
    .attr("transform", "translate(" + (w - 350) + "," + (h - 75) + ")");

//Set up groups
var arcs = svg.selectAll("g.arc")
              .data(pie(dataset))
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius/1.5 + "," + outerRadius + ")");

//Change radius of the arc when hover over each slice 
var onArc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius + 5);

//Draw arc paths
var path = arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr('class', 'arc-path')
    .attr("d", arc)
    .each(function(d) { this._current = d; }) // store the initial angles;
    .on('mouseenter', function(d, i, n){
        mouseenter(d, n[i])
    })
    .on("mouseout", function(d, i, n){
        mouseout(d, n[i]);
    })
    

//Labels
arcs.append("text")
    .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.value;
    })
    .attr('class', 'labelArc');

function makeResponsive(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on("resize", resize);

    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth / 1.2);
        svg.attr("height", Math.round(targetWidth / aspect) / 1.5);
    }
};

function mouseenter(d, elem){
    d3.select(elem.parentNode.children[1])
                .transition()
                .duration(200)
                .attr("transform", function(d) {
                    return "translate(" + onArc.centroid(d) + ")";
                })
    d3.select(elem)
            .transition()
            .duration(200)
            .attr('d', onArc)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
};

function mouseout(d, elem){
    d3.select(elem.parentNode.children[1])
                .transition()
                .duration(200)
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
    d3.select(elem)
            .transition()
            .duration(200)
            .attr('d', arc)
            .attr('stroke', null)
};


