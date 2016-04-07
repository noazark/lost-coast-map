(function tides() {
  const tides = [
    {time: new Date('2016-04-12 03:10:00'), height:  6.06, direction: 'high'},
    {time: new Date('2016-04-12 10:20:00'), height: -0.58, direction: 'low'},
    {time: new Date('2016-04-12 17:10:00'), height:  4.53, direction: 'high'},
    {time: new Date('2016-04-12 22:13:00'), height:  2.49, direction: 'low'},
    {time: new Date('2016-04-13 04:11:00'), height:  5.62, direction: 'high'},
    {time: new Date('2016-04-13 11:26:00'), height: -0.32, direction: 'low'},
    {time: new Date('2016-04-13 18:24:00'), height:  4.53, direction: 'high'},
    {time: new Date('2016-04-13 23:33:00'), height:  2.61, direction: 'low'},
    {time: new Date('2016-04-14 05:21:00'), height:  5.23, direction: 'high'},
    {time: new Date('2016-04-14 12:32:00'), height: -0.08, direction: 'low'},
    {time: new Date('2016-04-14 19:31:00'), height:  4.66, direction: 'high'},
    {time: new Date('2016-04-15 00:55:00'), height:  2.48, direction: 'low'},
    {time: new Date('2016-04-15 06:36:00'), height:  4.95, direction: 'high'},
    {time: new Date('2016-04-15 13:34:00'), height:  0.11, direction: 'low'},
    {time: new Date('2016-04-15 20:26:00'), height:  4.84, direction: 'high'},
    {time: new Date('2016-04-16 02:07:00'), height:  2.15, direction: 'low'},
    {time: new Date('2016-04-16 07:48:00'), height:  4.82, direction: 'high'},
    {time: new Date('2016-04-16 14:28:00'), height:  0.28, direction: 'low'},
    {time: new Date('2016-04-16 21:10:00'), height:  5.03, direction: 'high'},
    {time: new Date('2016-04-17 03:04:00'), height:  1.74, direction: 'low'},
    {time: new Date('2016-04-17 08:51:00'), height:  4.78, direction: 'high'},
    {time: new Date('2016-04-17 15:14:00'), height:  0.47, direction: 'low'},
    {time: new Date('2016-04-17 21:46:00'), height:  5.19, direction: 'high'},
    {time: new Date('2016-04-18 03:51:00'), height:  1.31, direction: 'low'},
    {time: new Date('2016-04-18 09:45:00'), height:  4.77, direction: 'high'},
    {time: new Date('2016-04-18 15:54:00'), height:  0.68, direction: 'low'},
    {time: new Date('2016-04-18 22:18:00'), height:  5.33, direction: 'high'},
  ]

  const dangerZones = tides.reduce(function (memo, point) {
    if (point.direction === 'high') {
      let threshold = point.height / 2
      let begin = moment(point.time).subtract(threshold, 'hours').toDate()
      let end = moment(point.time).add(threshold, 'hours').toDate()
      memo.push({begin: begin, end: end})
    }
    return memo
  }, [])

  const dangerZoneTicks = dangerZones.reduce(function (memo, zone) {
    memo.push(zone.begin)
    memo.push(zone.end)
    return memo
  }, []).slice(1, -1)

  let formatDate = d3.time.format("%m-%d %H:%M")
  let margin = {top: 30, right: 20, bottom: 20, left: 20}
  let width = 300 - margin.left - margin.right
  let height = 900 - margin.top - margin.bottom

  let xVal = function (d) { return d.height }
  let yVal = function (d) { return d.time }

  let x = d3.scale.linear()
      .range([0, width])

  let y = d3.time.scale()
      .clamp(true)
      .range([0, height])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('top')

  var yAxis = d3.svg.axis()
      .tickValues(dangerZoneTicks)
      .tickFormat(formatDate)
      .scale(y)
      .orient('right')

  var tideLine = d3.svg.line()
      .interpolate('cardinal')
      .tension(.6)
      .x(function(d) { return x(d.height) })
      .y(function(d) { return y(d.time) })

  var svg = d3.select('#tides').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(d3.extent(tides, xVal)).nice()
  y.domain(d3.extent(tides, yVal))

  // diagonal hatch pattern
  svg.append('defs')
    .append('pattern')
      .attr('id', 'diagonal-hatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#333')
      .attr('stroke-width', 1)

  // tide danger zones
  svg.selectAll('.danger-zone')
      .data(dangerZones)
    .enter().append('g')
      .append('rect')
        .attr('x', 0)
        .attr('y', function (d) { return y(d.begin) })
        .attr('width', width)
        .attr('height', function (d) { return y(d.end) - y(d.begin) })
        .attr('fill', 'url(#diagonal-hatch)')

  // tide background stroke
  svg.append('path')
    .datum(tides)
    .attr('class', 'line')
    .attr('d', tideLine)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 6)

  // tide
  svg.append('path')
    .datum(tides)
    .attr('class', 'line')
    .attr('d', tideLine)
    .attr('fill', 'none')
    .attr('stroke', '#333')
    .attr('stroke-width', 2)

  // x-axis
  svg.append('g')
    .attr('class', 'x-axis')
    .style({'shape-rendering': 'crispEdges'})
    .call(xAxis)

  // y-axis
  svg.append('g')
    .attr('class', 'y-axis')
    .style({'shape-rendering': 'crispEdges'})
    .call(yAxis)

  // y-axis tick backgrounds
  d3.select('.y-axis').selectAll('g.tick')
    .insert('rect', ':first-child')
    .attr('y', -7)
    .attr('height', 14).style('fill', 'white')
    .attr('width', 68)
})()
