/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function edgemodel(initialEdge){
 var pi = Math.PI;
 var debug = 0;
 var valency = 5; // later we can get these from the user controls
 var Nlevels = 2; // default
 var Nroots = 1;
 var edgelength = 2; // base edge length
 var edgescaling = 1; // base edge scaling (from one level to another)
 var gamma1 = pi; // branch spread angle
 var gamma2 = 0;
 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

 if (initialEdge===undefined){
  // set the default edge to focus on
  initialEdge = Array(2);
  initialEdge[0] = '';
  initialEdge[1] = colournames[0];
 }

 // GET INPUTS FROM THE WEB PAGE:
 var tmpvalency = eval($("#thevalency").val());
 var tmpNlevels = eval($("#thelevels").val());
 var tmpgamma1 = eval($("#gamma1field").val());
 var tmpedgelength = eval($("#thelength").val());
 var tmpedgescaling = eval($("#thescaling").val());
 var tmpbranchspread = eval($("#thespread").val());
 var printinfo = $("#infobutton").prop('checked'); // undefined if infobutton does not exist, which is fine
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+');
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpNlevels)) Nlevels = tmpNlevels;
console.log('Nlevels = '+Nlevels);
 if (isFinite(tmpgamma1)){
  gamma1 = tmpgamma1*pi;
 } else if (afraction.test(tmpgamma1)){
  gamma1 = eval(tmpgamma1)*pi;
 }
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
 if (isFinite(tmpbranchspread)){
  gamma1 = tmpbranchspread*pi;
 } else if (afraction.test(tmpbranchspread)){
  gamma1 = eval(tmpbranchspread)*pi;
 }
 if (valency>colournames.length){
  $('#info').append('<p class="error">Valency must be less than "+colournames.length+" (or add new colour names in the code!)</p>');
  return 0;
 }

 // angle between branches
//works alpha = 2*pi/(valency);
 alpha = gamma1/(valency);
 gamma2 = pi/2-gamma1/2;      // offset to centre the branch edges (use different values to tilt the whole tree)
 // angles affecting the overall layout:
 var branch0 = 0; // this is the index of the "second root node" (which is the first element of the colour name list, hence this is always 0)

 var longestname = '';
 var tmp = ''
 inverselongestname = '';

 for (var i=0;i<valency;i++) longestname+=colournames[i];
 for (var i=0;i<Math.ceil(Nlevels/valency);i++) tmp+=longestname;
 longestname = tmp;
 for (var i=longestname.length;i>0;i--) inverselongestname+=longestname[i-1];
//console.log(' longestname is '+longestname);

 if (valency>2){
  var Ntotal = Nroots*(valency*Math.pow(valency-1,Nlevels)-2)/(valency-2);
 } else {
  var Ntotal = Nroots*(Nlevels*valency+1); // check
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
 nodeOnAxis = new Array(Nroots);
 var nodeK = new Array(Nroots);
 var nodeLevel = new Array(Nroots);
 nodeIgnore = new Array(Nroots); // used to stop drawing particular branches (create no child nodes of ignored nodes)

 // set values for FIRST root nodes:
 for (var i=0;i<Nroots;i++){
  nodePosition[i] = [-edgelength/2 + 5*i, 0]; // positions of root nodes  0,5,10,15... offset by -0.5
  nodeIndex[i] = i;         // "labels" of root nodes
  nodeAddress[i] = collapseAddress(initialEdge[0]);
  nodeParent[i] = -1;
  nodeK[i] = 0;
  nodeLevel[i] = 0;
  nodeAngle[i] = 0;
  nodeIgnore[i] = false;
  nodeOnAxis[i] = false; // no on-axis nodes in this model
 }
 // set values for SECOND root nodes:
 for (var i=0;i<Nroots;i++){
  nodePosition[Nroots+i] = [edgelength/2 + 5*i, 0]; // positions of root nodes  0,5,10,15... offset by -0.5
  nodeIndex[Nroots+i] = Nroots+i;         // "labels" of root nodes
  nodeAddress[Nroots+i] = collapseAddress(initialEdge[1]);
  nodeParent[Nroots+i] = i; // ?? set the parent to the "first" root node
  nodeK[Nroots+i] = 0;
  nodeLevel[Nroots+i] = 0;
  nodeAngle[Nroots+i] = pi;
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
    if (k>0){ // don't add the parent again
     nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally
     var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
     // from here on, "thisnode" is the parent and "newnode" is the leaf:
     nodeParent[newnode] = nodeIndex[thisnode];
//     nodeK[newnode] = k;
     nodeK[newnode] = (k+nodeK[nodeParent[newnode]]) % valency; // need to do it this way if we persist in using the "k>0" condition above.
     nodeAddress[newnode] = collapseAddress(nodeAddress[nodeParent[newnode]] + colournames[nodeK[newnode]]);
     nodeLevel[newnode] = nodeLevel[nodeParent[newnode]]+1; // "normal" (ie. non-root) vertex
//almost     nodeAngle[newnode] = nodeAngle[nodeParent[newnode]] + pi/2 + k*alpha; // was (k-1)*alpha in the MATLAB code (1-indexed)
     if (nodeLevel[newnode]==1){
//works      nodeAngle[newnode] = nodeAngle[nodeParent[newnode]] + pi + k*(alpha); // was (k-1)*alpha in the MATLAB code (1-indexed)
      nodeAngle[newnode] = nodeAngle[nodeParent[newnode]] + pi + gamma2 + k*(alpha); // was (k-1)*alpha in the MATLAB code (1-indexed)
     } else {
//works      nodeAngle[newnode] = nodeAngle[nodeParent[newnode]] - pi/2 + k*(alpha); // was (k-1)*alpha in the MATLAB code (1-indexed)
      nodeAngle[newnode] = nodeAngle[nodeParent[newnode]] + pi/2 + pi + gamma2 + k*(alpha); // was (k-1)*alpha in the MATLAB code (1-indexed)
     }
//     nodeIgnore[newnode] = false; // default
     nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children

     nodePosition[newnode]=new Array(2); // initialise
     nodePosition[newnode][0] = nodePosition[thisnode][0] + calcEdgeLength(1+nodeLevel[newnode],valency,edgelength,edgescaling)*Math.sin(nodeAngle[newnode])
     nodePosition[newnode][1] = nodePosition[thisnode][1] + calcEdgeLength(1+nodeLevel[newnode],valency,edgelength,edgescaling)*Math.cos(nodeAngle[newnode])

//     if (debug) console.log('DEBUG: made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
//     if (debug) $('#info').append('<p class="debug">made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
//     console.log('  The position for node '+nodeAddress[newnode]+' is ('+nodePosition[newnode][0]+', '+nodePosition[newnode][1]+')')
    } else {
     if (debug) console.log('Not creating "duplicate" parent node');
    } // if k>0
   } // loop over valency (ie. k)
  } // loop over nodes at each level
//  fprintf(' Level = %g: %g nodes\n',L,length(nodeIndex));
 } // loop over Nlevels

 // do some reporting for debugging:
// for (var vv=0;vv<nodeAngle.length;vv++){
//  $('#info').append('<p class="debug">'+vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]+'</p>');
//  console.log(vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]);
// }

// return nodePosition;




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
} // end edgemodel function
