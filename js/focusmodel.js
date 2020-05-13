/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function setup(graphtype){
 var okay = false;

 // make sure the control displays are the same as the controls' values:
 thevalencyOutput.value = thevalency.value;
 thelevelsOutput.value = thelevels.value;
 if (graphtype=="newaxis") thewidthOutput.value = thewidth.value;
 thescalingOutput.value = thescaling.value;
 thelengthOutput.value = thelength.value;
 thespreadOutput.value = thespread.value;
 offsetXOutput.value = theoffsetX.value;
 offsetYOutput.value = theoffsetY.value;
 thetextangleOutput.value = thetextangle.value;
 fontsizeOutput.value = thefontsize.value;
 nodesizeOutput.value = thenodesize.value;
 linewidthOutput.value = thelinewidth.value;

 // change the canvas cursor to "alias" when pressing control (for picking automorphism nodes)
 $(document).on('keydown', function (event) {
  if (event.key=="Control") {
   $('#thecanvas').css('cursor', 'alias');
   $('#ctrlnote').addClass("redbg");
  }
 });
 // otherwise, use the array (for selecting nodes whose custom label to change)
 $(document).on('keyup', function (event) {
  $('#thecanvas').css('cursor', 'pointer');
   $('#ctrlnote').removeClass("redbg");
 });

 switch (graphtype){
  case "vertex":
   if (vertexmodel(V0)) okay = true;
   break;
  case "edge":
   if (edgemodel(V0)) okay = true;
   break;
  case "axis":
   if (axismodel(V0)) okay = true;
   break;
  case "newaxis":
   if (newaxismodel(V0)) okay = true;
   break;
  default:
   alert("Set-up must be called with a focus type");
   okay = false;
   return 0;
 }


 if (okay){
  if (typeof nodeLabel == 'object'){ // check if the custom label array exists
   // yes? then do nothing
  } else {
   // no? create it *once*
   createNodeLabel();
  }
  drawgraph();
 } else {
  alert("Graph set-up failed");
 }


 return 1;
}


/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function createNodeLabel(){
 // make enough blank node labels for every node
 nodeLabel = new Array(nodeIndex.length);
 nodeLabel.fill("");
}


/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function reverseString(str){
 var newstr = [];
 for (var i=str.length;i>0;i--){
  newstr += str[i-1];
 }
 return newstr;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function checkValidAddress(el){
// var addr = el.value;
 var addr = $(el).attr("value");
 var valency = $("#thevalency").val();
 var labels = "";
 for (var i=0;i<valency;i++) labels += colournames[i]; // get available node label "alphabet"
 var re = new RegExp("^[" + labels + "]*$|^0$");
 var isValid = re.test(addr);
// console.log("Checking "+addr+ ": "+(isValid?"valid":"invalid"));
 if (isValid){
  $(el).removeClass("invalid");
  $("#automorphismbutton").prop("disabled",false);
 } else {
  $(el).addClass("invalid");
  $("#automorphismbutton").prop("disabled",true);
 }
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function saveDot(){
 var dot = "";
 var lastsource = "";
 var lasttarget = "";
 // loop through the nodes and define their colours
//  nodes.forEach(function(d) {
//   dot += d.myindex+"{color:"+document.getElementById("picker"+d.group).value+", label:Node "+d.myindex+"}\n";
//  });
//  dot += "\n";

 // instead: loop through the groups and add their nodes (and colours):
 for (g=0;g<Ngroups;g++){
  dot += "{color:"+document.getElementById("picker"+g).value+"}\n";
  nodes.forEach(function(d) {
   if (d.group == g) {
    dot += " "+d.myindex+";\n"
   }
  });
 }
 dot += "\n";

 // loop through the links nodes and add them to the output
 links.forEach(function(d) {
  if (d.source.myindex == lasttarget && d.target.myindex == lastsource){
   // do nothing (do not print both links for an undirected edge)
  } else {
   dot += d.source.myindex+" -- "+d.target.myindex+"\n";
  }
  lastsource = d.source.myindex;
  lasttarget = d.target.myindex;
 });
// $("#dotcontent").html(dot.replace(/(\n)/g, "<br/>"));
 $("#dotcontent").html(dot);
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function copyDot(){
 var src = document.getElementById("dotcontent").innerHTML;
 function listener(e) {
  e.clipboardData.setData("text/html", src);
  e.clipboardData.setData("text/plain", src);
  e.preventDefault();
 }
 document.addEventListener("copy", listener);
 document.execCommand("copy");
 document.removeEventListener("copy", listener);
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function calcEdgeLength(level,valency,baselength=1,edgescaling=1){
 return baselength*Math.pow(edgescaling,level-1);
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function wipeCanvas(){
 $("#thecanvas").empty();
 return 1;
}
function wipeInfo(){
 $('#info').html('');
 return 1;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function nodeDistance(a,b){
 a=collapseAddress(a);
 b=collapseAddress(b);

 // remove common prefix
 if (a.length>0 & b.length>0){
  while (a[0]==b[0]){
   a=a.substr(1,a.length-1);
   b=b.substr(1,b.length-1);
   if (a.length==0 | b.length==0){
    break;
   }
  }
 }
 // the count what path length is left
 var dist = a.length+b.length;
 return dist;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function edgeDistance(a,b,c,d){
 // a,b,c,d are vertices
 // distance between the edge (a,b) and the edge (c,d)
 // will return -1 if either (a,b) or (c,d) are not valid edges
 var L = new Array(4);
 L[0]=nodeDistance(a,c);
 L[1]=nodeDistance(a,d);
 L[2]=nodeDistance(b,c);
 L[3]=nodeDistance(b,d);

 // we need to check if the two edges are actually the same edge:
 var Nzeros=0;
 for (el in L){if (el==0) Nzeros++;} // count the number of zeros in L
 if (Nzeros>=2){
  dist = 0;
 } else {
  var minL = Math.min.apply(Math, L);
  dist=minL+1;
 }
 return dist;

}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function edgeLengthVF(level,valency,baselength=2){
// return = baselength./s.^2; % good for valency = 5
// return = baselength./s; % good for valency = 3
 return baselength/Math.pow(level,valency/2.5);
// return = baselength./s.^(valency/2);
// return = baselength./s.^(valency/valency);
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function edgeLengthEF(level,valency,baselength=2){
// return baselength/Math.pow(level,valency);
 return baselength*Math.pow(1/3,level); // "rule of thirds"
// return baselength/level; // good for valency = 3
// return baselength*Math.pow(6/7,level);
// return baselength;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function edgeLengthAF(level,valency,baselength=2){
// return baselength/Math.pow(level,valency);
// var s = edgeDistance(thisEdge[0],thisEdge[1],focusEdge[0],focusEdge[1]);
 return baselength*Math.pow(2/3,level); // "rule of thirds"
// return baselength/level; // good for valency = 3
// return baselength*Math.pow(6/7,level);
// return baselength;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function circshift(input,shiftsize){
 var output=new Array(input.length);
 var n = 0;
 var firstelement = input.length - shiftsize;
 while (firstelement>input.length) firstelement-=input.length;
 // first we copy the end of the input, with the requested offset:
 for (var i=firstelement;i<input.length;i++){
  output[n] = input[i];
  n++;
 }
 // and then finish by using the start of the input, up to the requested offset:
 for (i=0;i<firstelement;i++){
  output[n] = input[i];
  n++;
 }
 return output;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function collapseAddress(str=""){
 var changeflag = true;
 var oldstr = str;

 str = str.replace(/0/g,""); // remove the empty label throughout

 while (changeflag){
  str = str.replace(/(.)\1/,""); // replace consecutive chars, once
  if (oldstr==str) changeflag = false; // nothing changed? then stop
  oldstr = str; // save the current string
 }
 return str;
}


/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function drawgraph(){
 var debug = false;
 var pi = Math.PI;
 var textAngle = 0;
 showlabels = 0; // off by default

 wipeCanvas();
 if (debug) $('#info').append('Drawing the graph....');

 // make sure the custom node labels are up to date with the number of nodes:
 if (nodeLabel.length != nodeIndex.length) createNodeLabel();

// var showlabels = $("#labelbutton").prop('checked');
 var showaxes = $("#axesbutton").prop('checked');
 var plainedges = $("#plainedgesbutton").prop('checked');

 var tmpshowlabels = eval($("#whichlabel").val());
 if (isFinite(tmpshowlabels)){
  showlabels = tmpshowlabels;
 }

 var tmptextangle = eval($("#thetextangle").val());
 if (isFinite(tmptextangle)){
  textAngle = tmptextangle;
 }

 // default colours:
 var axesColour = '#555';
 var nodeColour = '#000';
 var edgeColour = '#000';
 var labelColour = '#f00';
 var ignoreNodeColour = ''; // set empty to not draw ignored nodes; was '#0f0'
 var ignoreEdgeColour = '#888'; // set empty to not draw edges for ignored nodes; was '#0f0'
 var ignoreLabelColour = ''; // set empty to not label ignored nodes; was '#0f0'
 var ignoreDash = '6'; // SVG dash pattern for edges between ignored nodes and their parents

 // user-selected colours:
 axesColour = document.getElementById("axespicker").value;
 labelColour = document.getElementById("labelpicker").value;
 edgeColour = document.getElementById("edgepicker").value;
 nodeColour = document.getElementById("nodepicker").value;

 fontSize = 10; // default value; need this variable for savePDF and savePNG
 var tmpfontsize = eval($("#thefontsize").val());
 if (isFinite(tmpfontsize)){
  fontSize = tmpfontsize;
 }

 nodeRadius = 5; // default value; need this variable for savePDF and savePNG
 var tmpnodesize = eval($("#thenodesize").val());
 if (isFinite(tmpnodesize)){
  nodeRadius = tmpnodesize;
 }

 var lineWidth = 0.2; // default value
 var tmplinewidth = eval($("#thelinewidth").val());
 if (isFinite(tmplinewidth)){
  lineWidth = tmplinewidth;
 }


 /* get the canvas element and size it properly (transfer the CSS size to the proper canvas attributes) */
// var canvas = document.getElementById("thecanvas");
// canvas.width = $('#thecanvas').width();
// canvas.height = $('#thecanvas').height();
 $('#thecanvas').attr('width',$('#thecanvas').width());
 $('#thecanvas').attr('height',$('#thecanvas').height());

 canvaswidth = $('#thecanvas').width();
 canvasheight = $('#thecanvas').height();
 centreX = Math.round(canvaswidth/2) + offsetX;
// var centreY = canvasheight - 100; // axis-focused
 centreY = Math.round(canvasheight/2) + offsetY; // vertex- or edge-focused

 // draw the origin and some axes:
 if (showaxes){
  $(document.createElementNS("http://www.w3.org/2000/svg","line")).attr({
   "stroke": axesColour,
   "stroke-width": 1,
   "x1": centreX - canvaswidth/2 - offsetX,
   "y1": canvasheight - centreY,
   "x2": centreX + canvaswidth/2 - offsetX,
   "y2": canvasheight - centreY
  }).appendTo("#thecanvas");

  $(document.createElementNS("http://www.w3.org/2000/svg","line")).attr({
   "stroke": axesColour,
   "stroke-width": 1,
   "x1": centreX,
   "y1": 0,
   "x2": centreX,
   "y2": canvasheight
  }).appendTo("#thecanvas");
 } // end if showaxes

/*
  .drawArc({ // a circle at the origin
   strokeStyle: "#444",
   fillStyle: "#fff",
   x: centreX,
   y: canvasheight - centreY,
   radius: 8
  })
*/

 // edge-colouring way: pick a colour (https://medialab.github.io/iwanthue/) from the list
 colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
// var someColours = ["#5238cb", "#67b53c", "#a63dd8", "#57b27a", "#da48ce", "#4c702a", "#9264e0", "#b09b3a", "#4a2891", "#d78232", "#6071de", "#da4528", "#32b8d3", "#d23d56", "#5592dd", "#863920", "#43519a", "#d87c61", "#4a2362", "#df3f92", "#ad8cd2", "#8e2a53", "#d97cd3", "#db7297", "#99308e", "#8b539a"];
// var someColours = ["#80752d", "#456dd3", "#7db93a", "#dd4a59", "#50c068", "#db5831", "#6e9bdb", "#de9735", "#335989", "#bbb13b", "#661e2a", "#60c3a4", "#9d3a22", "#5ab1c7", "#6d1f18", "#9fb878", "#ab414f", "#537e2d", "#e49185", "#314b22", "#b46e35", "#498362", "#52291f", "#cfa572", "#734d24", "#a1655c"];
 var someColours = ["#ff4444", "#44dd44", "#6677ff", "#ffaa55", "#aabbff", "#cccccc", "#888888", "#111111"];
 // moreColours taken from the work of Paul Green-Armytage quoted at https://graphicdesign.stackexchange.com/questions/3682/
 var moreColours = ["#F0A3FF", "#0075DC", "#993F00", "#4C005C", "#191919", "#005C31", "#2BCE48", "#FFCC99", "#808080", "#94FFB5", "#8F7C00", "#9DCC00", "#C20088", "#003380", "#FFA455", "#FFA8BB", "#426600", "#FF0010", "#5EF1F2", "#00998F", "#E0FF66", "#74AAFF", "#990000", "#FFFF80", "#FFFF00", "#FF5055"];
 someColours = someColours.concat(moreColours);

 // overall scaling for the whole graph:
 useScale = 100;
 for (var vv=0;vv<nodePosition.length;vv++){
  xx = centreX + useScale*nodePosition[vv][0];
  yy = canvasheight - (centreY + useScale*nodePosition[vv][1]);
  // store the "screen" coordinates to make node selection easier (for automorphisms)
  nodeScreenPosition[vv]=new Array(2); // (re-)initialise
  nodeScreenPosition[vv][0] = xx;
  nodeScreenPosition[vv][1] = yy;

  if (nodeParent[vv]>=0){ // use only non-root nodes
   xx0 = centreX + useScale*nodePosition[nodeParent[vv]][0];
   yy0 = canvasheight - (centreY + useScale*nodePosition[nodeParent[vv]][1]);
  }

//  if (debug) $("#info").append("<p class="debug">"+vv+"] "+xx.toFixed(2)+", "+yy.toFixed(2));
//  if (debug) $("#info").append("<p class="debug">"+nodeAngle[vv]/pi+"  "+nodePosition[vv][0].toFixed(3)+", "+nodePosition[vv][1].toFixed(3));

  $(document.createElementNS("http://www.w3.org/2000/svg","circle")).attr({
//   "fill": nodeColour,
   "fill": (nodeIgnore[vv]?(ignoreNodeColour.length?ignoreNodeColour:"none"):nodeColour),
   "stroke": "none",
   "r": nodeRadius,
   "cx": xx,
   "cy": yy,
  }).appendTo("#thecanvas");

  // usual way: all edges are the same (user-selected) colour
  var thisEdgeColour = edgeColour;

  if (nodeParent[vv]>=0){  // for now, connect sequential nodes (only non-root nodes)
   //  instead of the usual way: colour the edge according to the child suffix:
   if (plainedges){
    thisEdgeColour = edgeColour;
   } else {
    var edgeFlavour = nodeAddress[vv].substr(nodeAddress[vv].length-1);
    if (edgeFlavour.length==0){ // for the empty node, we need the edge flavour of its parent (this will happen after automorphisms are applied)
     edgeFlavour = nodeAddress[nodeParent[vv]].substr(nodeAddress[nodeParent[vv]].length-1);
    }
    thisEdgeColour = someColours[colournames.indexOf(edgeFlavour)];
   }


   $(document.createElementNS("http://www.w3.org/2000/svg","line")).attr({
    "stroke": (nodeIgnore[vv]?(ignoreEdgeColour.length?ignoreEdgeColour:"none"):thisEdgeColour),
    "stroke-dasharray": (nodeIgnore[vv]?ignoreDash:"none"),
    "stroke-width": lineWidth,
    "stroke-linecap": "round",
     "x1": xx0,
     "y1": yy0,
     "x2": xx,
     "y2": yy,
   }).appendTo("#thecanvas");
  }

  // label offsets from their nodes (need to use this in savePDF and savePNG)
  labelOffsetX = 10;
  labelOffsetY = 10;

  var thislabel = "";
  if (showlabels>0) {
   // figure out the label for this node:
   switch (showlabels){
    case 0: // no label
     thislabel = ""; // should not happen but define this here in case we change things in the future
     break;
    case 1: // label is the node address
     thislabel = (nodeAddress[vv]==""?"\u{d8}":nodeAddress[vv]); // address or o-slash for the empty node
     break;
    case 2: // label is the node index
     thislabel = nodeIndex[vv]+""; // cast to a string
     break;
    case 3: // label is some custom text which the user can change
     thislabel = nodeLabel[vv]+"";
     break;
    default:
     thislabel = "";
   }

   if (thislabel.length>0){ // don't create (empty) labels with blank text
    var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
    $(newText).attr({
     "fill": (nodeIgnore[vv]?(ignoreLabelColour.length?ignoreLabelColour:"none"):labelColour),
     "font-size": fontSize,
     "x": xx + labelOffsetX,
     "y": yy + labelOffsetY,
     "transform": "rotate("+textAngle+","+(xx+labelOffsetX)+","+(yy+labelOffsetY)+")",
     "style": "dominant-baseline:middle; text-anchor:"+(showlabels==3?"left":"middle")+";",
    });
    // the text node has been created, so insert the node's label
    var textNode = document.createTextNode(thislabel);
    newText.appendChild(textNode);
    document.getElementById("thecanvas").appendChild(newText);
   }
  } // end if showlabels

 }

 // finally, scroll the info div to the end, in case we appended anything
// var theend = $('#theinfo').scrollHeight;
// $('#theinfo').scrollTop(theend);
 $("#info").animate({ scrollTop: $('#info').prop("scrollHeight")}, 1000);

 // finished successfully
 return 1;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
// calculate matrix product
// Thanks Ian: https://stackoverflow.com/a/44197345
function matrixXY(m,x,y) {
 return { x: x * m.a + y * m.c + m.e, y: x * m.b + y * m.d + m.f };
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
// get transformed bounding box
// Thanks Ian: https://stackoverflow.com/a/44197345
function getTransformedBBox(obj){
 var tr = obj.getCTM();
 var bbox0 = obj.getBBox();
 var bbox1 = [];
 var corners0 = [
   matrixXY(tr,bbox0.x,bbox0.y),
   matrixXY(tr,bbox0.x+bbox0.width,bbox0.y),
   matrixXY(tr,bbox0.x+bbox0.width,bbox0.y+bbox0.height),
   matrixXY(tr,bbox0.x,bbox0.y+bbox0.height) ];
 bbox1.x = Number.POSITIVE_INFINITY;
 bbox1.y = Number.POSITIVE_INFINITY;
 bbox1.width = Number.NEGATIVE_INFINITY;
 bbox1.height = Number.NEGATIVE_INFINITY;

 // get the left,top,width,height like getBBox()
 for (var i=0;i<4;i++){
  if (corners0[i].x<bbox1.x) bbox1.x = corners0[i].x;
  if (corners0[i].y<bbox1.y) bbox1.y = corners0[i].y;
 }
 for (var i=0;i<4;i++){
  if ((corners0[i].x-bbox1.x)>bbox1.width)  bbox1.width  = corners0[i].x-bbox1.x;
  if ((corners0[i].y-bbox1.y)>bbox1.height) bbox1.height = corners0[i].y-bbox1.y;
 }

 return bbox1;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
// function to find the bounding box of the extant nodes
function bounds() {
 var minX = Number.POSITIVE_INFINITY;
 var maxX = Number.NEGATIVE_INFINITY;
 var minY = Number.POSITIVE_INFINITY;
 var maxY = Number.NEGATIVE_INFINITY;

// var showlabels = $("#labelbutton").prop('checked');

 svgchildren=document.getElementById("thecanvas").children;
 for (var i=0;i<svgchildren.length;i++){
  switch (svgchildren[i].nodeName){
   case "circle": // node
    var bbox = getTransformedBBox(svgchildren[i]);
    var circleX = parseFloat(bbox.x); // left
    var circleY = parseFloat(bbox.y); // top (on screen)
    var circleW = parseFloat(bbox.width);
    var circleH = parseFloat(bbox.height);
    if ((circleX)<minX)         minX=(circleX);
    if ((circleX+circleW)>maxX) maxX=(circleX+circleW);
    if ((circleY)<minY)         minY=(circleY);
    if ((circleY+circleH)>maxY) maxY=(circleY+circleH);

    break;
   case "text": // label
    if (showlabels>0){
     var bbox = getTransformedBBox(svgchildren[i]);
     var textX = parseFloat(bbox.x); // left
     var textY = parseFloat(bbox.y); // top (on screen)
     var textW = parseFloat(bbox.width);
     var textH = parseFloat(bbox.height);
     if ((textX)<minX)       minX=(textX);
     if ((textX+textW)>maxX) maxX=(textX+textW);
     if ((textY)<minY)       minY=(textY);
     if ((textY+textH)>maxY) maxY=(textY+textH);
    }
    break;
  }
 }

 minX=Math.floor(minX);
 maxX=Math.ceil(maxX);
 minY=Math.floor(minY);
 maxY=Math.ceil(maxY);

 return {minX, maxX, minY, maxY};
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function savePDF(){
 var saveBounds = bounds();
 var pdfwidth = Math.ceil(saveBounds.maxX-saveBounds.minX);
 var pdfheight = Math.ceil(saveBounds.maxY-saveBounds.minY);
 var xoff = -saveBounds.minX;
 var yoff = -saveBounds.minY;
 var layout = "portrait";

 if (pdfwidth>pdfheight) layout="landscape";
 var thepdf = new jsPDF(layout, "pt", [pdfheight, pdfwidth]);

 // This produces a PDF which is approx. 33% larger than on screen;
 // changing "scale" to 75% broke the offsets and/or width-height.
 svg2pdf(document.getElementById("thecanvas"), thepdf, {
       xOffset: xoff,
       yOffset: yoff,
       scale: 1,
 });
 thepdf.save("graph.pdf");
 return 0;
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function savePNG(){
 // for options see https://github.com/exupero/saveSvgAsPng
 var transparentBG = $("#transparencybutton").prop('checked');
 var saveBounds = bounds();
 saveOptions = {
  scale: 2.0, // larger, better quality
  backgroundColor: (transparentBG?"#fff0":"#fff"), // transparent or not
  left: saveBounds.minX,
  top: saveBounds.minY,
  width: saveBounds.maxX-saveBounds.minX,
  height: saveBounds.maxY-saveBounds.minY,
 };
 saveSvgAsPng(document.getElementById("thecanvas"), "graph.png", saveOptions);
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function deleteChildren(a){
 // loop over all nodes and find a's children, but before deleting them, delete their children
 for (var n=0;n<nodeIndex.length;n++){
  if (nodeParent[n]==a){
   deleteChildren(nodeIndex[n]); // call deleteChildren() on each child node recursively
   // child node's children have been deleted, so delete this child node:
   //
   // add code here:
   //  - delete the label SVG object
   //  - delete the node (circle) SVG object
   //  - delete (splice) the node's entry in various arrays
   //    -- this might not be necessary, could we just have a "don't draw this node" flag?
   //    -- that would obviate the SVG deletions too...
  }
 }
}

/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function countOnAxis(){
 return nodeOnAxis.filter(function(s) { return s; }).length;
}
