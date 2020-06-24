/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function newaxismodel(initialVertex){
 var pi = Math.PI;
 var debug = false;
 var valency = 5; // default
 var depth = 2; // default [number of levels of the axis-focused model]
 var width = 3; // default [number of on-axis nodes in the axis-focused model]
 var depthscaling = 1; // base edge scaling (from one depth to another)
 var edgelength = 2; // base edge length
 var groupspread = 1;
 var printinfo = 1;

 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = colournames[0];
 }

 // GET INPUTS FROM THE WEB PAGE:
 var tmpvalency = eval($("#thevalency").val());
 var tmpdepth = eval($("#thelevels").val()); // we won't change the underlying control element ID in the HTML file, just its label
 var tmpWidth = eval($("#thewidth").val());
 var tmpdepthscaling = eval($("#theedgescaling").val());
 var tmpedgelength = eval($("#theoverallscale").val()); // "overall scale" on the web page
 var tmpgroupspread = eval($("#thespread").val());
 printinfo = $("#infobutton").prop('checked');
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+'); // allows use of fractions in the input; not currently implemented in HTML since sliders are used instead of text fields
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpdepth)) depth = tmpdepth;
 if (Number.isInteger(tmpWidth)) width = tmpWidth;
 if (debug) console.log('depth = '+depth); // report
 if (debug) console.log('width = '+width); // report
 if (isFinite(tmpdepthscaling)){
  depthscaling = tmpdepthscaling;
 } else if (afraction.test(tmpdepthscaling)){
  depthscaling = eval(tmpdepthscaling);
 }
 if (isFinite(tmpedgelength)){
  edgelength = tmpedgelength;
 } else if (afraction.test(tmpedgelength)){
  edgelength = eval(tmpedgelength);
 }
 if (isFinite(tmpgroupspread)){
  groupspread = tmpgroupspread*pi;
 } else if (afraction.test(tmpgroupspread)){
  groupspread = eval(tmpgroupspread)*pi;
 }
 if (valency>colournames.length){
  $('#info').append('<p class="error">Valency must be less than '+colournames.length+' (or add new colour names in the code!)</p>');
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
 // set values for root (on-axis) nodes:
 var rootSpacing = edgelength;
 var rootOrigin = -(width-1)*rootSpacing/2;
 for (var i=0;i<width;i++){
  nodePosition[i] = [rootOrigin + rootSpacing*i, 0]; // positions of root (on-axis) nodes
  nodeIndex[i] = i;         // "labels" of root (on-axis) nodes
  if (i==0) nodeAddress[i] = collapseAddress(initialVertex[0]);
  else      nodeAddress[i] = nodeAddress[i-1]+longestname[i-1];
  nodeParent[i] = i-1;
  nodeDepth[i] = 1; // depth ("level" in the other focus models) of this node [nb. in this model there is no depth 0]
  nodeAngle[i] = 0;
  nodeOnAxis[i] = true;
  nodeK[i] = i;
  nodeKK[i] = i;
  nodeIgnore[i] = false;
 }

/* [not right for this new model]
 if (valency>2){
  var Ntotal = width*(valency*Math.pow(valency-1,depth)-2)/(valency-2);
 } else {
  var Ntotal = width*(depth*valency+1);
 }
 console.log('Number of nodes will be '+Ntotal); // report
 if (printinfo & $('#info').html().length>0) $('#info').append('<hr width="88%"/>'); // after the first RUN, separate output with a line
 if (printinfo) $('#info').append('<p>Number of nodes is '+Ntotal+'</p>');
*/

 // set up the spacing of nodes in the lower levels:
// var groupSpacing = edgelength*groupspread*0.9; // say
// var groupWidth = edgelength-2*groupSpacing; // edgelength minus the group spacing buffer
 var groupWidth = edgelength*groupspread*0.5;
 var depthSpacing = depthscaling*edgelength; // vertical distance between levels...

 // Iteratively add nodes downward from the "axis nodes" above (which are depth 1):
 for (var L=2;L<=depth;L++){
  if (debug) console.log('Running depth '+L);
  if (printinfo) $('#info').append('<p style="text-indent:10px;">Making depth='+L+' children</p>');

  // find nodes at the previous depth:
  var nodeList = new Array(0);
  for (var n=0;n<nodeDepth.length;n++){
   if (nodeDepth[n]==(L-1)){
    nodeList[nodeList.length] = n;
   }
  }

  // how many nodes at this depth? use this to determine spacing/spread
  var depthNodeCount = width*Math.pow(valency-1,L-2); // valid for depth >= 2
  if (debug) console.log("   "+depthNodeCount+" nodes at depth "+L);

  // add the children (together, the "group") to each parent node in the level above
  for (var ii=0;ii<nodeList.length;ii++){
   var parentnode = nodeList[ii]; // use the parent node's index for convenience
   if (fadeleaves){ // if we are fading the leaves, parentnode is no longer a leaf ("thisnode" in the other models)
    nodeIgnore[parentnode] = false;
   }
   // how many children for each node above?:
   if (L==2){
    groupNodeCount = valency - 2; // at L=2, the parents (which lie on the axis) each have two neighbours already
   } else {
    groupNodeCount = valency - 1; // but below that, nodes are only connected to their parent (one neighbour)
   }
   // so how far apart do they lie?:
   if (groupNodeCount==1){
    nodeSpacing=0;
    groupOrigin = nodePosition[parentnode][0];
   } else {
//    var thisGroupWidth = 0.45*groupWidth*((depth-L+1)/(depth+1)); // scale the group width according to depth (to prevent overlap)
    var thisGroupWidth = Math.pow(0.95,L+1)*groupWidth*((depth-L+1)/(depth+1)); // scale the group width according to depth (to prevent overlap)
    nodeSpacing = thisGroupWidth/(groupNodeCount-1);
    groupOrigin = nodePosition[parentnode][0] - thisGroupWidth/2; // left-hand edge of this group (based on parent's x-coordinate)
   }

   groupKlist = circshift(Klist,-nodeK[parentnode]-1); // clockwise order for this group (ie. start with the "next" colour after the parent's one)
   for (var kk=0;kk<groupNodeCount;kk++){ // loop over valency (kk is a dummy variable, indexing into the circshifted list)
    k = groupKlist[kk]; // "colour" of the new node

    // create a new node:
    nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally
    var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
    // thus, now "parentnode" is the parent and "newnode" is the leaf

    nodePosition[newnode] = [groupOrigin + nodeSpacing*kk, -(L-1)*depthSpacing];
//    nodeAddress[newnode] = nodeAddress[parentnode]+k;
    nodeAddress[newnode] = nodeAddress[parentnode]+colournames[k];
    nodeParent[newnode] = nodeIndex[parentnode];
    nodeDepth[newnode] = L; // depth ("level" in the other focus models) of this node
    nodeAngle[newnode] = 0; // not needed?
    nodeOnAxis[newnode] = false;
    nodeK[newnode] = k;
    nodeKK[newnode] = k; // not needed?
    nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children

   } // loop over valency (ie. kk), ie. loop over this group (children of one parent node in the level above)
  } // loop over this depth's parent nodes
 } // loop over depth


 // Finally, add faded/dashed extensions of the axis, to show that it continues:
 // the axis end nodes are the root node and the node with address=longestname.substring(0,width-1)
 var leftEndNode = 0; // use index instead of address, in case an automorphism has moved the root node off the drawn region of the graph
 var rightEndNode = width-1;
 // add these phantoms to the node list so that they can be drawn by drawgraph()
 // (but do it here at the end so that the index numbering doesn't interrupt the regular nodes)
 // LEFT:
 nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally, like the others
 var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
 nodePosition[newnode] = [nodePosition[leftEndNode][0]-rootSpacing/2, nodePosition[leftEndNode][1]];
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
 nodePosition[newnode] = [nodePosition[rightEndNode][0]+rootSpacing/2, nodePosition[rightEndNode][1]];
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
 midpointPosition = Array(nodeIndex.length); // initialise global variable
 for (var i=0;i<nodeIndex.length;i++){
  var fromNode = nodeParent[i];
  var toNode = nodeIndex[i];
  if (nodeAddress[i]=="LL"|nodeAddress[nodeParent[i]]=="LL"){ // axis extensions are handled slightly differently (if extant)
   fromNode = nodeIndex[i];
   toNode = nodeParent[i];
  }
  if (fromNode>=0 & toNode>=0){ // skip it if this node has no parent; faded edges can be labelled
   midpointPosition[i] = canvasScale(lineMidPoint(nodePosition[fromNode],nodePosition[toNode],0.5));
  } else {
   midpointPosition[i] = [NaN, NaN];
  }
 } // end loop over edges


 return 1; // success
} // end newaxismodel function
