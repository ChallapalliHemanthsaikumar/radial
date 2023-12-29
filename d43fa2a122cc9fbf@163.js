// https://observablehq.com/@d3/radial-stacked-bar-chart@163
function _1(md){return(
  md`# VAST MC2 2018 VA Spring 2023 Team's Final Progress (D3 Work)
  Radial Stacked Bar Chart representing the given 10 locations, our final toxic chemicals and their values corresponding to the years ranging from 1998 to 2016.`
  )}

function _2(md){return(
  md
  `List of Toxic Chemicals
  
  1. AGOC-3A
  2. Anionic active surfactants (An)
  3. AOX
  4. Arsenic (As)
  5. Atrazine (At)
  6. Cadmium (Cd)
  7. Chlorodinine (Ch)
  8. Chromium (Cr)
  9. Lead (Pb)
  10. Methylosmoline (Me)
  11. Nickel (Ni)
  12. Petroleum hydrocarbons (Ph)` ) }
  
  function _3(md){return( md`

  List of all the Locations
  
  1. Achara (Ac)
  2. Boonsri (Bo)
  3. Busarakhan (Bu)
  4. Chai (Ch)
  5. Decha (De)
  6. Kannika (Ka)
  7. Kohsoom (Ko)
  8. Sakda (Sa)
  9. Somchair (So)
  10. Tansanee (Ta)`
  )}

function _chart(d3,DOM,width,height,data,z,arc,xAxis,yAxis,legend)
{
  // const svg = d3.select(DOM.svg(width, height))
  //     .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
  //     .style("width", "100%")
  //     .style("height", "auto")
  //     .style("font", "5px arial")
  //   ;

  const svg = d3.select(DOM.svg(width, height))
  .attr("class", "rotate")
  .attr("style", `
    width: 100%;
    height: auto;
    font: 5px arial;
    animation: rotate 150s ease-in-out infinite;
  `)
  .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
  svg.append("g")
    .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .join("g")
      .attr("fill", d => z(d.key))
    .selectAll("path")
    .data(d => d)
    .join("path")
      .attr("d", arc)
      .on("mouseover", function() {
          d3.select(this)
            .attr("fill", "#4682b4")
            .attr("data-prev-color", function(d) { return color(d.data); })
            .attr("stroke", "black")
            .attr("stroke-width", 4);
        })
        .on("mouseout", function() {
          // d3.select(this)
          var prevColor = d3.select(this).attr("data-prev-color");
          d3.select(this).attr("fill", prevColor);
            // .attr("fill", d = z(d.key))
            // .attr("stroke", "black");
        });

  //     svg.append("path")
  // .attr("d", arc)
  // .attr("fill", "steelblue")
  // .on("mouseover", function() {
  //   d3.select(this)
  //     .attr("fill", "orange")
  //     .attr("stroke", "white")
  //     .attr("stroke-width", 2);
  // })
  // .on("mouseout", function() {
  //   d3.select(this)
  //     .attr("fill", "steelblue")
  //     .attr("stroke", "none");
  // });

  

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
  
      .call(legend)
     ;

     function downloadSVG() {
      const svgString = new XMLSerializer().serializeToString(svg.node());
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.svg';
      a.click();
  
      URL.revokeObjectURL(url);
    }
  
    // Adding a button to trigger SVG download
    downloadSVG()
    

  return svg.node();
}


async function _data(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data-2.csv").text(), (d, _, columns) => {
  let total = 0;
  for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
  d.total = total;
 
  return d;
})
)}

function _arc(d3,y,x,innerRadius){return(
d3.arc()
    .innerRadius(d => y(d[0]))
    .outerRadius(d => y(d[1]))
    .startAngle(d => x(d.data.State))
    .endAngle(d => x(d.data.State) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
)}

function _x(d3,data){return(
d3.scaleBand()
    .domain(data.map(d => d.State))
    .range([0, 2 * Math.PI])
    .align(0)
)}

function _y(d3,data,innerRadius,outerRadius){return(
d3.scaleRadial()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerRadius, outerRadius])
)}

function _z(d3,data){return(
d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range([
      "#795548", "#8D6E63", "#A1887F", "#BF360C", "#DD2C00", "#FF3D00", "#E65100", "#FF5722", "#FF6F00", "#FF8F00", "#FFA000", "#FFB300", "#FFC107", "#FFCA28", "#FFD54F", "#FFE082", "#FFECB3", "#FFF8E7", "#FFF8E1"])
)}

function _xAxis(data,x,outerRadius){return(
g => g
    .attr("text-anchor", "middle")
    .call(g => g.selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `
          rotate(${((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${outerRadius},0)
        `)
        // .call(g => g.append("line")
        //     .attr("x2", -5)
        //     .attr("stroke", "#000"))
        .call(g => g.append("text")
            .attr("transform", d => (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                ? "rotate(90)translate(0,16)"
                : "rotate(-90)translate(0,-9)")
                
            .text(d => d.State)
            .attr("font-size","5px")))
)}

function _yAxis(y){return(
g => g
    .attr("text-anchor", "middle")
    .call(g => g.append("text")
        .attr("y", d => -y(y.ticks(5).pop()))
        .attr("dy", "-1em")
        .text("Values"))
    .call(g => g.selectAll("g")
      .data(y.ticks(5).slice(1))
      .join("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.15em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
         .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))
)}

function _legend(data,z){return(
g => g.append("g")
  .selectAll("g")
  .data(data.columns.slice(1).reverse())
  .join("g")
  
    .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
    
    
    .call(g => g.append("rect")
        .attr("width", 5)
        .attr("height", 5)
        .attr("fill", z))
    .call(g => g.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.15em")
        .text(d => d)
        )
)}

function _width(){return(
975
)}

function _height(width){return(
width
)}

function _innerRadius(){return(
200
)}

function _outerRadius(width,height){return(
Math.min(width, height) / 2
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data-2.csv", {url: new URL("./files/33954e9770a615014df5bcb8be3e257700ec99c4eb9a3206db60577f0e63bf1f217621ab5d7eefa3b187ecb5418db4609bef452ae939370a9d89a709f803b31f.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height","data","z","arc","xAxis","yAxis","legend"], _chart);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("arc")).define("arc", ["d3","y","x","innerRadius"], _arc);
  main.variable(observer("x")).define("x", ["d3","data"], _x);
  main.variable(observer("y")).define("y", ["d3","data","innerRadius","outerRadius"], _y);
  main.variable(observer("z")).define("z", ["d3","data"], _z);
  main.variable(observer("xAxis")).define("xAxis", ["data","x","outerRadius"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["y"], _yAxis);
  main.variable(observer("legend")).define("legend", ["data","z"], _legend);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", ["width"], _height);
  main.variable(observer("innerRadius")).define("innerRadius", _innerRadius);
  main.variable(observer("outerRadius")).define("outerRadius", ["width","height"], _outerRadius);
 
  return main;
}
