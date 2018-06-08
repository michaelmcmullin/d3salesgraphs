$(document).ready(function () {
    YearOnYearGraph(jobData, '#monthlyJobSales');

    $('[data-tooltip="true"]').tooltip({
        trigger: 'hover',
        container: 'body'
    });

    $('[data-popover="true"]').popover();

});

var jobData = [
    { "month": "Jun", "monthindex": 06, "year": "2017", "price": 2497264, qty: 7924, "lastyearprice": 2267264, "lastyearqty": 7248 },
    { "month": "Jul", "monthindex": 07, "year": "2017", "price": 1986247, qty: 7725, "lastyearprice": 2524759, "lastyearqty": 7621 },
    { "month": "Aug", "monthindex": 08, "year": "2017", "price": 1634530, qty: 5255, "lastyearprice": 1480160, "lastyearqty": 4764 },
    { "month": "Sep", "monthindex": 09, "year": "2017", "price": 3080390, qty: 9499, "lastyearprice": 2815219, "lastyearqty": 9967 },
    { "month": "Oct", "monthindex": 10, "year": "2017", "price": 3495237, qty: 9607, "lastyearprice": 3193144, "lastyearqty": 8424 },
    { "month": "Nov", "monthindex": 11, "year": "2017", "price": 3548959, qty: 10430, "lastyearprice": 3121454, "lastyearqty": 10178 },
    { "month": "Dec", "monthindex": 12, "year": "2017", "price": 3074566, qty: 9287, "lastyearprice": 3187077, "lastyearqty": 9349 },
    { "month": "Jan", "monthindex": 01, "year": "2018", "price": 2601840, qty: 9285, "lastyearprice": 2584211, "lastyearqty": 8177 },
    { "month": "Feb", "monthindex": 02, "year": "2018", "price": 3370323, qty: 10050, "lastyearprice": 3473086, "lastyearqty": 9639 },
    { "month": "Mar", "monthindex": 03, "year": "2018", "price": 3467521, qty: 11387, "lastyearprice": 3524106, "lastyearqty": 11593 },
    { "month": "Apr", "monthindex": 04, "year": "2018", "price": 3035105, qty: 8967, "lastyearprice": 2144438, "lastyearqty": 7956 },
    { "month": "May", "monthindex": 05, "year": "2018", "price": 2285932, qty: 7547, "lastyearprice": 2221543, "lastyearqty": 8136 }];


function YearOnYearGraph(graphData, svgElementID) {

    var minBarChartPrice = Math.min.apply(Math, graphData.map(function (o) { return o.price; }))
    var maxBarChartPrice = Math.max.apply(Math, graphData.map(function (o) { return o.price; }));
    var maxLineChartPrice = Math.max.apply(Math, graphData.map(function (o) { return o.lastyearprice; }));

    var barMaxHeight = 400;
    var barWidth = 40;

    var axisXWidth = 100;
    var axisYHeight = 50;

    var lineStartPointX = axisXWidth + (barWidth / 2);
    var maxRangeDomain = Math.max(maxBarChartPrice, maxLineChartPrice);

    var itemCount = graphData.length;
    var today = new Date();
    var todayMonth = today.getMonth() + 1;
    var todayYear = today.getFullYear();

    // ----------------------------------------------------

    var y = d3.scaleLinear()
        .domain([0, maxRangeDomain])
        .range([barMaxHeight, 0])

    var yLastYear = d3.scaleLinear()
        .domain([0, maxRangeDomain])
        .range([barMaxHeight, 0])

    var chart = d3.select(svgElementID)
        .attr("width", "750px")
        .attr("height", barMaxHeight + axisYHeight);

    var bar = chart.selectAll("g")
        .data(graphData)
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(" + ((i * barWidth) + axisXWidth) + ",0)"; });

    var yAxis = d3.axisLeft()
        .scale(y);

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (axisXWidth - 16) + ", 0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 16)
        .attr("dy", ".71em")
        .text("Value (€)");

    // --------------------------------------------------------------------------

    bar.append("rect")
        .attr("y", function (d) { return y(d.price); })
        .attr("height", function (d) { return barMaxHeight - y(d.price); })
        .attr("width", barWidth - 1)
        .attr("class", function (d, i) {
            if (d.monthindex == todayMonth && d.year == todayYear)
                return "svg-bg-gray-light";
            if (d.price === maxBarChartPrice)
                return "svg-bg-success";
            if (d.price === minBarChartPrice)
                return "svg-bg-danger";
            return "svg-bg-primary";
        })
        .attr("data-popover", "true")
        .attr("data-html", "true")
        .attr("data-placement", "top")
        .attr("data-trigger", "hover")
        .attr("data-container", "body")
        .attr("data-title", function (d) {
            return "€" + Number(d.price).toLocaleString("en");
        })
        .attr("data-content", function (d) {
            var yearDiff = d.price - d.lastyearprice;
            var diffMessage = yearDiff < 0 ?
                "<span class=text-danger>▼€" + (Math.abs(yearDiff)).toLocaleString("en") + "</span>" :
                "<span class=text-success>▲€" + Number(yearDiff).toLocaleString("en") + "</span>";

            return "<small><strong>Previous Year:</strong><br>€"
                + Number(d.lastyearprice).toLocaleString("en") + "<br>"
                + diffMessage
                + "</small>";
        });

    // --------------------------------------------------------------------------
    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", barMaxHeight)
        .attr("dy", "12px")
        .style("text-anchor", "middle")
        .text(function (d) { return d.month; });

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", barMaxHeight)
        .attr("dy", "22px")
        .style("text-anchor", "middle")
        .text(function (d) { return d.year; });

    // --------------------------------------------------------------------------

    var lineGraph = d3.line()
        .x(function (d, i) {
            return lineStartPointX + (barWidth * i);
        })
        .y(function (d) {
            return yLastYear(d.lastyearprice);
        });

    chart.append("svg:path")
        .attr("d", lineGraph(graphData))
        .attr("class", "line-info");
}
