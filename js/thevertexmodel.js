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

 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = colournames[0];
 }

// var initialVertex = Array(1);
// var initialVertex = [];
// initialVertex[0] = '';

 // GET INPUTS FROM THE WEB PAGE:
// var tmpvalency = eval($("#valencyfield").val());
// var tmpNlevels = eval($("#depthfield").val());
 var tmpvalency = eval($("#thevalency").val());
 var tmpNlevels = eval($("#thelevels").val());
// var tmpgamma1 = eval($("#gamma1field").val());
 var tmpedgelength = eval($("#thelength").val());
 var tmpedgescaling = eval($("#thescaling").val());
// var tmpbranchspread = eval($("#thespread").val());
 printinfo = $("#infobutton").prop("checked");
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+');
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpNlevels)) Nlevels = tmpNlevels;
// if (isFinite(tmpgamma1)){
//  gamma1 = tmpgamma1*pi;
// } else if (afraction.test(tmpgamma1)){
//  gamma1 = eval(tmpgamma1)*pi;
// }
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
// if (isFinite(tmpbranchspread)){
//  gamma1 = tmpbranchspread*pi;
// } else if (afraction.test(tmpbranchspread)){
//  gamma1 = eval(tmpbranchspread)*pi;
// }
 if (valency>colournames.length){
  $('#info').append('<p class="error">Valency must be less than 27 (or add new colour names in the code!)</p>');
  return 0;
 }

 // angles affecting the overall layout: (ie. rotation of the whole graph)
 var delta1 = pi;
 // angle between branches
 alpha = 2*pi/valency;
// alpha = gamma1/valency;

 var longestname = '';
 var tmp = ''
 inverselongestname = '';

 for (var i=0;i<valency;i++) longestname+=colournames[i];
 for (var i=0;i<Math.ceil(Nlevels/valency);i++) tmp+=longestname;
 longestname = tmp;
 for (var i=longestname.length;i>0;i--) inverselongestname+=longestname[i-1];
//console.log(' longestname is '+longestname);

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
 var nodeOnAxis = new Array(Nroots);
 var nodeK = new Array(Nroots);
 nodeIgnore = new Array(Nroots); // used to stop drawing particular branches (create no child nodes of ignored nodes)
//xxx var nodeKK = new Array(Nroots);
 // set values for root nodes:
 for (var i=0;i<Nroots;i++){
  nodePosition[i] = [5*i, 0]; // positions of root nodes
  nodeIndex[i] = i;         // "labels" of root nodes
  nodeAddress[i] = collapseAddress(initialVertex[0]);
  nodeParent[i] = -1;
  nodeLevel[i] = 0;
  nodeAngle[i] = delta1;
  nodeOnAxis[i] = true; // initial nodes are on-axis, by definition
  nodeK[i] = 0;
//xxx  nodeKK[i] = 0;
  nodeIgnore[i] = false; // false by default for root nodes
 }
 // set up a list which we will permute
//xxx var Klist = new Array(valency);
//xxx for (var i=0;i<valency;i++) Klist[i] = i;

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
//wrong     nodeK[newnode] = k; // wrong if we use the "k>0" condition
     nodeK[newnode] = (k+nodeK[nodeParent[newnode]]) % valency; // need to do it this way if we persist in using the "k>0" condition above.
     nodeLevel[newnode] = nodeLevel[nodeParent[newnode]]+1;
     nodeAddress[newnode] = collapseAddress(nodeAddress[nodeParent[newnode]] + colournames[nodeK[newnode]]);
     nodeAngle[newnode] = nodeAngle[nodeParent[newnode]]+pi + k*alpha; // not k-1 in javascript
//     nodeAngle[newnode] = nodeAngle[newnode] % (2.0*pi); // clean up a little
//     nodeIgnore[newnode] = false; // default
     nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children

// TESTING
//nodeAddress[newnode]=nodeK[newnode]; // testing
//nodeAddress[newnode] = Math.round(nodeAngle[newnode] / pi * 100) / 100 + "/" + nodeK[newnode];
//nodeAddress[newnode] = nodeAddress[newnode] + "/" + nodeK[newnode];


     nodePosition[newnode]=new Array(2); // initialise
//     nodePosition[newnode][0] = nodePosition[thisnode][0] + edgeLengthVF(nodeLevel[newnode],valency,edgelength)*Math.sin(nodeAngle[newnode])
//     nodePosition[newnode][1] = nodePosition[thisnode][1] + edgeLengthVF(nodeLevel[newnode],valency,edgelength)*Math.cos(nodeAngle[newnode])
     nodePosition[newnode][0] = nodePosition[thisnode][0] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.sin(nodeAngle[newnode])
     nodePosition[newnode][1] = nodePosition[thisnode][1] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.cos(nodeAngle[newnode])

     if (debug) console.log('DEBUG: made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
     if (debug) $('#info').append('<p class="debug">made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
//     console.log('  The position for node '+nodeAddress[newnode]+' is ('+nodePosition[newnode][0]+', '+nodePosition[newnode][1]+')')
    } else {
     if (debug) console.log('Not creating "duplicate" parent node');
    } // if k>1 or L==1
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

  return 1; // success
 } // end axismodel function
