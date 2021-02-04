/**
 * @Created Jan 25, 2018
 * @LastUpdate Jan 31, 2020
 * @author Kahin Akram
 */

function PC(data) {
  //Set width and height of the chart
  let div = "#pc-chart";
  let parentWidth = $(div).parent().width();
  let margin = { top: 40, right: 10, bottom: 10, left: 30 },
    width = parentWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  //Set the axes scales, we pre-define the xScale but not yScale
  //because we will fill it with each dimension(column)
  let xScale = d3.scaleBand().range([0, width]);
  let yScale = {};

  //Selecting colors for the paths (each line)
  let colors = colorbrewer.Set2[6];
  //Use scaleLinear for yScale.
  let scale = d3.scaleLinear().range([height, 0]);

  //For each line, foreground is the colored lines we se
  //background are the gray lines we see when we filter.
  //dimension are the y-axes (columns)
  let line = d3.line(),
    foreground,
    background,
    dimensions;

  //Select the div and append our svg tag.
  let svg = d3
    .select(div)
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Extract the list of dimensions and create a scale for each.
  //keys are the the axes names gathered from the dataset, we want to
  //create as many axes as there are keys in the dataset
  //Scale,domain and range for each axes.
  xScale.domain(
    (dimensions = d3.keys(data[0]).filter(function (d) {
      return (yScale[d] = d3
        .scaleLinear()
        .domain(
          d3.extent(data, function (p) {
            return +p[d];
          })
        )
        .range([height, 0]));
    }))
  );

  //------------------------------------------------------------------------------------->

  /**
   * Call the kmeans algorithm
   */
  let nr_clusters = 4;
  let kmeansResults = kmeans(data, nr_clusters);

  //Plot the results from kmeans
  plot(kmeansResults);

  //------------------------------------------------------------------------------------->
  function plot(results) {
    // Add grey background lines for context.
    background = svg
      .append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg
      .append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      //.style("stroke", function(d) { return "hsl(" + Math.random() * 360 + ",100%,50%)"; });
      .style("stroke", function (d, i) {
        return colors[results.assignments[i]];
      });

    // Add a group element for each dimension.
    let g = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + xScale(d) + ")";
      });

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(yScale[d]));
      })
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .style("fill", "black")
      .text(String);

    // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(
          (d.brush = d3
            .brushY()
            .extent([
              [-10, 0],
              [10, height],
            ])
            .on("start", brushstart)
            .on("brush", brush)
            .on("end", brush))
        );
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 10);
  }
  //------------------------------------------------------------------------------------->

  // Returns the path for a given data point.
  function path(d) {
    return line(
      dimensions.map(function (p) {
        return [xScale(p), yScale[p](d[p])];
      })
    );
  } //end of path

  //------------------------------------------------------------------------------------->
  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    let actives = [];
    svg
      .selectAll(".dimension .brush")
      .filter(function (d) {
        return d3.brushSelection(this);
      })
      .each(function (d) {
        actives.push({
          dim: d,
          extent: d3.brushSelection(this),
        });
      });
    let a = [];
    foreground.style("display", function (d) {
      return actives.every(function (active) {
        let dim = active.dim;
        let ext = active.extent;
        return within(d, ext, dim, a);
      })
        ? null
        : "none";
    });

    function within(d, extent, dim, a) {
      return scale(d[dim]) > extent[0] && scale(d[dim]) < extent[1];
    }
  } //end of brush
  //------------------------------------------------------------------------------------->
} // end of pc
