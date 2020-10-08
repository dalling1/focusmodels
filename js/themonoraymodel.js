/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function monoraymodel(initialVertex){
 var pi = Math.PI;
 var debug = false;
 var edgelength = 2; // base edge length ("overall scale" on the web page)
 var printinfo = 1;
 var leftToRight = false;
 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = ''; // was colournames[0];
 }

 // validate the initial vertex:
 var initialexp = RegExp('[a-z]*');
 if (!initialexp.test(initialVertex)){
  initialVertex[0] = '';
 }

 // GET INPUTS FROM THE WEB PAGE:
 var valency = parseInt($("#thevalency").val());
 var depth = parseInt($("#thelevels").val());
 var width = parseInt($("#thewidth").val());
 var edgelength = parseFloat($("#theoverallscale").val()); // "overall scale" on the web page
 var raylength = parseFloat($("#theedgescaling").val());
 var rayspread = parseFloat($("#thespread").val())*pi;
 var skipstart = parseInt($("#theskipstart").val());
 var skipnodes = parseInt($("#theskipnodes").val());
 printinfo = $("#infobutton").prop('checked');
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+'); // allows use of fractions in the input; not currently implemented in HTML since sliders are used instead of text fields
 if (valency>colournames.length){
  $('#info').append('<p class="error">Valency must be less than '+colournames.length+' (or add new colour names in the code!)</p>');
  alert("Valency must be less than "+colournames.length+" (or add new colour names in the code!)");
  return 0;
 }

 // set up a list which we will permute
 var Klist = new Array(valency);
 for (var i=0;i<valency;i++) Klist[i] = i;

 // get the longest node address [do we need this in this (new) model?]
 var longestname = '';
 var inverselongestname = '';
 for (var i=0;i<(width+depth-2);i++){
  longestname+=colournames[i%valency];
 }
 // and its reverse:
 for (var i=longestname.length;i>0;i--) inverselongestname+=longestname[i-1];

 // initialise positioning variables:
 var groupNodeCount = 0;
 var nodeSpacing = 0;
 var groupOrigin = 0;

 // initialise arrays:
 nodePosition = new Array(width);
 nodeScreenPosition = new Array(width);
 nodeAddress = new Array(width);
 nodeParent = new Array(width);
 nodeAngle = new Array(width);
 nodeIndex = new Array(width);
 nodeDepth = new Array(width);
 nodeOnAxis = new Array(width);
 nodeK = new Array(width);
 var nodeKK = new Array(width);
 nodeIgnore = new Array(width); // used to stop drawing particular branches (create no child nodes of ignored nodes)
 ellipsisCentre = new Array(width);
 ellipsisStart = new Array(width);
 ellipsisEnd = new Array(width);
 // set values for root (on-axis) nodes:
 var rootSpacing = edgelength;
 var rootOrigin = -(width-1)*rootSpacing/2;
 for (var i=0;i<width;i++){
  // positions of root (on-axis) nodes:
  if (leftToRight){
   nodePosition[i] = [rootOrigin + rootSpacing*i, 0]; // node with address '' is on the left (causes issues with arrow directions...)
  } else {
   nodePosition[i] = [-rootOrigin + -rootSpacing*i, 0]; // node with address '' is on the right
  }
  nodeIndex[i] = i;         // "labels" of root (on-axis) nodes
  if (i==0) nodeAddress[i] = collapseAddress(initialVertex[0]);
  else      nodeAddress[i] = collapseAddress(nodeAddress[i-1]+longestname[i-1]);
  nodeParent[i] = i-1;
  nodeDepth[i] = 1; // depth ("level" in the other focus models) of this node [nb. in this model there is no depth 0]
  nodeAngle[i] = 0;
  nodeOnAxis[i] = true;
  nodeK[i] = i;
  nodeKK[i] = i;
  nodeIgnore[i] = false;
 }

 // Make a list of the root nodes:
 var rootList = new Array(0);
 for (var n=0;n<nodeIndex.length;n++){
  if (nodeDepth[n]==1){
   rootList[rootList.length] = nodeIndex[n];
  }
 }

 // Calculate the ray angles
 var Nrays = valency;
 var angle0 = pi-rayspread*0.5;
 var baseangle = angle0 + pi*0.5;
 var deltaangle = rayspread/(Nrays-1);

 // Add Nrays nodes entering into each root node
 for (var r=0;r<rootList.length;r++){
  var parentnode = rootList[r]; // this root (on-axis) node is the parent of each ray
  groupKlist = circshift(Klist,-nodeK[parentnode]-1); // clockwise order for this group (ie. start with the "next" colour after the parent's one)
  for (var kk=0;kk<Nrays;kk++){ // start loop over valency (kk is a dummy variable, indexing into the circshifted list)
   if (skipnodes>0 & kk>=skipstart & kk<(skipstart+skipnodes)){
    if (debug) console.log("monoraymodel: Skipping node "+kk);
    // skip this node, but record some coordinates for putting in an ellipsis
    if (kk==skipstart){ // first

     var x0 = nodePosition[parentnode][0];
     var y0 = nodePosition[parentnode][1];
     var thisangle = kk*deltaangle; // not kk-1 because kk is zero-indexed
     var x = x0 + edgelength*raylength*Math.sin(baseangle+thisangle); // set the angles so that the default is "fanned out to the left"
     var y = y0 + edgelength*raylength*Math.cos(baseangle+thisangle);
     ellipsisCentre[r] = [x0, y0]
     ellipsisStart[r] = [x, y];

    }
    if (kk==(skipstart+skipnodes-1) | kk==(Nrays-1) ){ // last

     var x0 = nodePosition[parentnode][0];
     var y0 = nodePosition[parentnode][1];
     var thisangle = kk*deltaangle; // not kk-1 because kk is zero-indexed
     var x = x0 + edgelength*raylength*Math.sin(baseangle+thisangle); // set the angles so that the default is "fanned out to the left"
     var y = y0 + edgelength*raylength*Math.cos(baseangle+thisangle);
     ellipsisEnd[r] = [x, y];

    }
   } else {
    k = groupKlist[kk]; // "colour" of the new node

    // create a new node:
    nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally
    var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
    // thus, now "parentnode" is the parent and "newnode" is the leaf

    var x0 = nodePosition[parentnode][0];
    var y0 = nodePosition[parentnode][1];
    var thisangle = kk*deltaangle; // not kk-1 because kk is zero-indexed
    if (debug) if (Math.abs((baseangle+thisangle)/pi)==1.5) console.log("There is an on-axis ray attached to node "+parentnode);
    var x = x0 + edgelength*raylength*Math.sin(baseangle+thisangle); // set the angles so that the default is "fanned out to the left"
    var y = y0 + edgelength*raylength*Math.cos(baseangle+thisangle);
    nodePosition[newnode] = [x, y];

    nodeAddress[newnode] = collapseAddress(nodeAddress[parentnode]+colournames[k]);
    nodeParent[newnode] = nodeIndex[parentnode];
    nodeDepth[newnode] = 2; // not needed?
    nodeAngle[newnode] = 0; // not needed?
    nodeOnAxis[newnode] = false;
    nodeK[newnode] = k;
    nodeKK[newnode] = k; // not needed?
    nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children

   } // end skip test

  } // end loop over valency (ie. kk), ie. loop over this group (children of one parent node in the level above)
 } // end loop over root (on-axis) nodes



 // Finally, add faded/dashed extensions of the axis, to show that it continues:
 // the axis end nodes are the root node and the node with address=longestname.substring(0,width-1)
 var leftEndNode = nodeAddress.indexOf('');
 var rightEndNode = nodeAddress.indexOf(longestname.substring(0,width-1));
 // add these phantoms to the node list so that they can be drawn by drawgraph()
 // (but do it here at the end so that the index numbering doesn't interrupt the regular nodes)
 // LEFT:
 nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally, like the others
 var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
 if (leftToRight){ // which extension should be longer?
  nodePosition[newnode] = [nodePosition[leftEndNode][0]-(rootSpacing/2+edgelength*raylength), nodePosition[leftEndNode][1]];
 } else {
  nodePosition[newnode] = [nodePosition[leftEndNode][0]+(rootSpacing/2), nodePosition[leftEndNode][1]];
 }
 nodeAddress[newnode] = 'LL';
 nodeParent[newnode] = nodeIndex[leftEndNode];
 nodeDepth[newnode] = -2;
 nodeAngle[newnode] = 0;
 nodeOnAxis[newnode] = true;
 nodeK[newnode] = -1;
 nodeKK[newnode] = -1; // not needed?
 nodeIgnore[newnode] = true; // use this to indicate a fade or whatever to drawgraph()

 // RIGHT:
 nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally, like the others
 var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
 if (leftToRight){ // which extension should be longer?
  nodePosition[newnode] = [nodePosition[rightEndNode][0]+(rootSpacing/2), nodePosition[rightEndNode][1]];
 } else {
  nodePosition[newnode] = [nodePosition[rightEndNode][0]-(rootSpacing/2+edgelength*raylength), nodePosition[rightEndNode][1]];
 }
 nodeAddress[newnode] = 'RR';
 nodeParent[newnode] = nodeIndex[rightEndNode];
 nodeDepth[newnode] = -2;
 nodeAngle[newnode] = 0;
 nodeOnAxis[newnode] = true;
 nodeK[newnode] = -1;
 nodeKK[newnode] = -1; // not needed?
 nodeIgnore[newnode] = true; // use this to indicate a fade or whatever to drawgraph()

 /* calculate the midpoints of all edges (these are used for edge labelling) */
 // (this code was copied from the showarrows() function, and these midpoints could be re-used there with a little editing)
 // Note: the edge from each node *to its parent* is drawn, so there are one more nodes than edges (the root node has no parent)
 //       Thus, edgeMidpointPosition array has more elements than there are edges, but this is okay
 edgeMidpointPosition = Array(nodeIndex.length); // initialise global variable
 for (var i=0;i<nodeIndex.length;i++){
  var fromNode = nodeParent[i];
  var toNode = nodeIndex[i];
  if (nodeAddress[i]=="LL" | nodeAddress[nodeParent[i]]=="LL"){ // axis extensions are handled slightly differently (if extant)
   fromNode = nodeIndex[i];
   toNode = nodeParent[i];
  }
  if (fromNode>=0 & toNode>=0){ // skip it if this node has no parent; faded edges can be labelled
   edgeMidpointPosition[i] = canvasScale(lineMidPoint(nodePosition[fromNode],nodePosition[toNode],0.5));
  } else {
   edgeMidpointPosition[i] = [NaN, NaN];
  }
 } // end loop over edges


 // lastly, we will remove (ignore) some edges (and nodes) and put in an ellipsis to indicate infinitely many edges
// nodeIgnore[6] = false;


 return 1; // success
} // end monoraymodel function
