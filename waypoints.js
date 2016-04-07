(function waypoints() {
  const waypoints = [
    {distance: 0.0, label: 'Mattole'},
    {distance: 3.2, label: 'Punta Gotda'},
    {distance: [5.1, 7.2], fill: 'striped'},
    {distance: 8.4, label: 'Spanish Flat'},
    {distance: [9.6, 12.65], fill: 'striped'},
    {distance: 15.9, label: 'Big Flat'},
    {distance: 19.2, label: 'Buck Creek'},
    {distance: 24.4, label: 'Black Sands'},
    {distance: [24.4, 28.4], fill: 'solid'},
    {distance: 28.4, label: 'Hidden Valley'},
    {distance: 34.8, label: 'Whale Gulch'},
    {distance: 37.0, label: 'Needle Rock'},
    {distance: 39.7, label: 'Orchard Creek'},
    {distance: 40.1, label: 'Bear Harbor'},
    {distance: 44.4, label: 'Wheeler'},
    {distance: 48.9, label: 'Little Jackass'},
    {distance: 51.4, label: 'Anderson Gulch'},
    {distance: 56.4, label: 'Usal'},
  ]

  const markers = waypoints.filter(function (d) { return !d.fill })
  const regions = waypoints.filter(function (d) { return !!d.fill })

  let formatDate = d3.time.format('%m-%d %H:%M')
  let margin = {top: 30, right: 20, bottom: 20, left: 40}
  let width = 300 - margin.left - margin.right
  let height = 900 - margin.top - margin.bottom
  let markerWidth = 20

  let y = d3.scale.linear()
    .clamp(true)
    .range([0, height])

  let yVal = function (d) { return d.distance }

  y.domain(d3.extent(markers, yVal))

  let yScale = d3.scale.ordinal()
    .range(markers.map(function (d) { return y(d.distance) }))

  var distances = d3.svg.axis()
    .orient('left')
    .scale(
      yScale.copy()
        .domain(markers.map(yVal))
    )

  var labels = d3.svg.axis()
    .orient('right')
    .scale(
      yScale.copy()
        .domain(markers.map(function (d) { return d.label }))
    )


  var svg = d3.select('#tides').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var marker = svg.append('g')

  marker.append('rect')
    .attr('height', height)
    .attr('width', markerWidth)
    .attr('fill', 'white')
    .attr('stroke', '#333')

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

  // mile markers
  marker.selectAll('.marker')
    .data(markers)
  .enter().append('line')
    .attr('id', function (d) { return 'marker-' + yVal(d) })
    .attr('class', 'marker')
    .attr('x1', 0)
    .attr('x2', markerWidth)
    .attr('y1', function (d) { return y(yVal(d)) })
    .attr('y2', function (d) { return y(yVal(d)) })
    .attr('stroke', 'black')
    .attr('stroke-dasharray', '2,2')

  // regions
  marker.selectAll('.region')
      .data(regions)
    .enter().append('rect')
      .attr('class', 'region')
      .attr('y', function (d) { return y(yVal(d)[0]) })
      .attr('width', markerWidth)
      .attr('height', function (d) { return y(yVal(d)[1]) - y(yVal(d)[0]) })
      .attr('fill', function (d) {
        switch (d.fill) {
          case 'striped':
            return 'url(#diagonal-hatch)'
            break
          case 'solid':
            return '#333'
            break;
        }
      })

  marker.append('g')
    .attr('class', 'y-axis')
      .style({'shape-rendering': 'crispEdges'})
      .attr("transform", "translate(" + markerWidth + " ,0)")
      .call(labels)

  marker.append('g')
    .attr('class', 'y-axis')
      .style({'shape-rendering': 'crispEdges'})
      .call(distances)
})()
