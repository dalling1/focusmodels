/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function vertexmodel(initialVertex){
 var pi = Math.PI;
 var debug = false;
 var valency = 5; // later we can get these from the user controls
 var Nlevels = 2; // default
 var Nroots = 1;
 var edgelength = 2; // base edge length
 var edgescaling = 1; // base edge scaling (from one level to another)
// var gamma1 = 2*pi; // branch spread angle
 var printinfo = 1;

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = ''; // was colournames[0];
 }

 // validate the initial vertex:
 var initialexp = RegExp('[a-z]*');
 if (!initialexp.test(initialVertex[0])){
  initialVertex[0] = '';
 }

 // GET INPUTS FROM THE WEB PAGE:
 var tmpvalency = eval($("#thevalency").val());
 var tmpNlevels = eval($("#thelevels").val());
 var tmpedgelength = eval($("#theoverallscale").val());
 var tmpedgescaling = eval($("#theedgescaling").val());
 printinfo = $("#infobutton").prop("checked");
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+');
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpNlevels)) Nlevels = tmpNlevels;
 if (isFinite(tmpedgelength)){
  edgelength = tmpedgelength;
 } else if (afraction.test(tmpedgelength)){
  edgelength = eval(tmpedgelength);
 }
 if (isFinite(tmpedgescaling)){
  edgescaling = tmpedgescaling;
 } else if (afraction.test(tmpedgescaling)){
  edgescaling = eval(tmpedgescaling);
 }
 if (valency>colournames.length){
  $('#info').append('<p class="error">Valency must be less than '+colournames.length+' (or add new colour names in the code!)</p>');
  return 0;
 }

 // angles affecting the overall layout: (ie. rotation of the whole graph)
 var delta1 = pi;
 // angle between branches
 alpha = 2*pi/valency;

 var longestname = '';
 var tmp = ''
 inverselongestname = '';

 for (var i=0;i<valency;i++) longestname+=colournames[i];
 for (var i=0;i<Math.ceil(Nlevels/valency);i++) tmp+=longestname;
 longestname = tmp;
 for (var i=longestname.length;i>0;i--) inverselongestname+=longestname[i-1];


 if (valency>2){
  Ntotal = Nroots*(valency*Math.pow(valency-1,Nlevels)-2)/(valency-2);
 } else {
  Ntotal = Nroots*(Nlevels*valency+1); // check
 }
 if (debug) console.log('Number of nodes is be '+Ntotal);
 if (printinfo & $('#info').html().length>0) $('#info').append('<hr width="88%"/>'); // after the first RUN, separate output with a line
 if (printinfo) $('#info').append('<p>Number of nodes is '+Ntotal+'</p>');

 // initialise arrays:
 nodePosition = new Array(Nroots);
 nodeScreenPosition = new Array(Nroots);
 nodeAddress = new Array(Nroots);
 nodeParent = new Array(Nroots);
 nodeAngle = new Array(Nroots);
 nodeIndex = new Array(Nroots);
 var nodeLevel = new Array(Nroots);
 nodeOnAxis = new Array(Nroots);
 var nodeK = new Array(Nroots);
 nodeIgnore = new Array(Nroots); // used to stop drawing particular branches (create no child nodes of ignored nodes)
 ellipsisCentre = new Array(Nroots);
 ellipsisStart = new Array(Nroots);
 ellipsisEnd = new Array(Nroots);

 // set values for root nodes:
 for (var i=0;i<Nroots;i++){
  nodePosition[i] = [5*i, 0]; // positions of root nodes
  nodeIndex[i] = i;         // "labels" of root nodes
  nodeAddress[i] = collapseAddress(initialVertex[0]);
  nodeParent[i] = -1;
  nodeLevel[i] = 0;
  nodeAngle[i] = delta1;
  nodeOnAxis[i] = false; // no on-axis nodes in this model
  nodeK[i] = 0;
  nodeIgnore[i] = false; // false by default for root nodes
 }

 //
 // Iteratively add nodes outward from the "root node" above:
 //
 for (var L=0;L<Nlevels;L++){
  if (debug) console.log('Running level '+L);
  if (printinfo) $('#info').append('<p style="text-indent:10px;">Making level '+L+' children</p>');
  // nodes to attach edges to:
  nodeList = new Array(0);
  for (var n=0;n<nodeLevel.length;n++){
   if (nodeLevel[n]==L){
    nodeList[nodeList.length] = n;
   }
  }

  for (var ii=0;ii<nodeList.length;ii++){
//   if (debug) console.log('DEBUG: Making children of node '+nodeList[ii]);
   var thisnode = nodeList[ii]; // get the label for convenience
   if (fadeleaves){ // if we are fading the leaves, thisnode is no longer a leaf
    nodeIgnore[thisnode] = false;
   }
   for (var k=0;k<valency;k++){ // loop through valency
    if (L==0 | k>0){ // loop through all valencies // THIS ISN'T RIGHT: WE *DO* NEED SOME K=0 AT HIGHER LEVELS...
     nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally
     newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
     // from here on, "thisnode" is the parent and "newnode" is the leaf:
     nodeParent[newnode] = nodeIndex[thisnode];
     nodeK[newnode] = (k+nodeK[nodeParent[newnode]]) % valency; // need to do it this way if we persist in using the "k>0" condition above.
     nodeLevel[newnode] = nodeLevel[nodeParent[newnode]]+1;
     nodeAddress[newnode] = collapseAddress(nodeAddress[nodeParent[newnode]] + colournames[nodeK[newnode]]);
     nodeAngle[newnode] = nodeAngle[nodeParent[newnode]]+pi + k*alpha; // not k-1 in javascript
     nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children

     nodePosition[newnode]=new Array(2); // initialise
     nodePosition[newnode][0] = nodePosition[thisnode][0] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.sin(nodeAngle[newnode])
     nodePosition[newnode][1] = nodePosition[thisnode][1] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.cos(nodeAngle[newnode])

     if (debug) console.log('DEBUG: made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
     if (debug) $('#info').append('<p class="debug">made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
     if (debug) console.log('  The position for node '+nodeAddress[newnode]+' is ('+nodePosition[newnode][0]+', '+nodePosition[newnode][1]+')')
    } else {
     if (debug) console.log('Not creating "duplicate" parent node');
    } // if k>1 or L==1
   } // loop over valency (ie. k)
  } // loop over nodes at each level
  if (debug) fprintf(' Level = %g: %g nodes\n',L,length(nodeIndex));
 } // loop over Nlevels


 /* calculate the midpoints of all edges (these are used for edge labelling) */
 // (this code was copied from the showarrows() function, and these midpoints could be re-used there with a little editing)
 // Note: the edge from each node *to its parent* is drawn, so there are one more nodes than edges (the root node has no parent)
 //       Thus, edgeMidpointPosition array has more elements than there are edges, but this is okay
 edgeMidpointPosition = Array(nodeIndex.length); // initialise global variable
 for (var i=0;i<nodeIndex.length;i++){
  var fromNode = nodeParent[i];
  var toNode = nodeIndex[i];
  if (nodeAddress[i]=="LL"|nodeAddress[nodeParent[i]]=="LL"){ // axis extensions are handled slightly differently (if extant) [don't collapseAddress these nodes]
   fromNode = nodeIndex[i];
   toNode = nodeParent[i];
  }
  if (fromNode>=0 & toNode>=0){ // skip it if this node has no parent; faded edges can be labelled
   edgeMidpointPosition[i] = canvasScale(lineMidPoint(nodePosition[fromNode],nodePosition[toNode],0.5));
  } else {
   edgeMidpointPosition[i] = [NaN, NaN];
  }
 } // end loop over edges


  return 1; // success
 } // end axismodel function
