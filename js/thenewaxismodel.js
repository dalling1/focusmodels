/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function newaxismodel(initialVertex){
 var pi = Math.PI;
 var debug = false;
 var valency = 5; // default
 var depth = 2; // default [number of levels of the axis-focused model]
 var width = 3; // default [number of on-axis nodes in the axis-focused model]
 var edgelength = 2; // base edge length
 var edgescaling = 1; // base edge scaling (from one depth to another)
 var gamma1 = pi; // branch spread angle
 var printinfo = 1;
 offsetX = 0;
 offsetY = 0;

 // angles affecting the overall layout:
// var gamma1 = pi; // spread angle of hanging nodes (smaller means "pointier" trees); default pi
 var gamma2 = 0;    // offset-angle for hanging nodes (tilts the whole "branch")
 var delta1 = 0;

 /* experiment */
// gamma1 = 1*pi/3;
// gamma2 = 0;

 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = colournames[0];
 }

 // GET INPUTS FROM THE WEB PAGE:
// var tmpvalency = eval($("#valencyfield").val());
// var tmpdepth = eval($("#depthfield").val());
 var tmpvalency = eval($("#thevalency").val());
 var tmpdepth = eval($("#thelevels").val()); // we won't change the underlying control element ID in the HTML file, just its label
 var tmpWidth = eval($("#thewidth").val());
 var tmpoffsetX = eval($("#theoffsetX").val());
 var tmpoffsetY = eval($("#theoffsetY").val());
 var tmpgamma1 = eval($("#gamma1field").val());
 var tmpedgelength = eval($("#thelength").val());
 var tmpedgescaling = eval($("#thescaling").val());
 var tmpbranchspread = eval($("#thespread").val());
 printinfo = $("#infobutton").prop('checked');

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+');
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpdepth)) depth = tmpdepth;
 if (Number.isInteger(tmpWidth)) width = tmpWidth;
 if (Number.isInteger(tmpoffsetX)) offsetX = tmpoffsetX;
 if (Number.isInteger(tmpoffsetY)) offsetY = tmpoffsetY;
 console.log('depth = '+depth); // report
 console.log('width = '+width); // report
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
  $('#info').append('<p class="error">Valency must be less than 27 (or add new colour names in the code!)</p>');
  return 0;
 }

 // angles between branches (computed):
 gamma2 = pi/2-gamma1/2;      // offset to centre the branch edges (use different values to tilt the whole tree)
 var alpha1 = gamma1/(valency-1); // angle between "hanging" edges attached to the axis
 var alpha2 = gamma1/(valency);   // angle between "hanging" edges attached to already-hanging nodes

 // set up a list which we will permute
 var Klist = new Array(valency);
 for (i=0;i<valency;i++) Klist[i] = i;

 var longestname = '';
 var tmp = ''
 inverselongestname = '';

 for (var i=0;i<valency;i++) longestname+=colournames[i];
 for (i=0;i<Math.ceil(depth/valency);i++) tmp+=longestname;
 longestname = tmp;
 for (i=longestname.length;i>0;i--) inverselongestname+=longestname[i-1];
//console.log(' longestname is '+longestname);



 // initialise arrays:
 nodePosition = new Array(width);
 nodeScreenPosition = new Array(width);
 nodeAddress = new Array(width);
 nodeParent = new Array(width);
 nodeAngle = new Array(width);
 nodeIndex = new Array(width);
 var nodeDepth = new Array(width);
 nodeOnAxis = new Array(width);
 var nodeK = new Array(width);
 var nodeKK = new Array(width);
 nodeIgnore = new Array(width); // used to stop drawing particular branches (create no child nodes of ignored nodes)
 // set values for root nodes:
 var rootSpacing = 2;
 var rootOrigin = -(width-1)*rootSpacing/2;
 for (i=0;i<width;i++){
  nodePosition[i] = [rootOrigin + rootSpacing*i, 0]; // positions of root nodes
  nodeIndex[i] = i;         // "labels" of root nodes
  if (i==0) nodeAddress[i] = collapseAddress(initialVertex[0]);
  else      nodeAddress[i] = nodeAddress[i-1]+longestname[i];
  nodeParent[i] = i-1;
  nodeDepth[i] = 0;
  nodeAngle[i] = 0;
  nodeOnAxis[i] = true; // initial nodes are on-axis, by definition
  nodeK[i] = 0;
  nodeKK[i] = 0;
  nodeIgnore[i] = false;
 }

 //
 // a bit of reporting on the size of the graph
 //
 if (valency>2){
  Ntotal = width*(valency*Math.pow(valency-1,depth)-2)/(valency-2);
 } else {
  Ntotal = width*(depth*valency+1);
 }
 console.log('Number of nodes will be '+Ntotal); // report
 if (printinfo & $('#info').html().length>0) $('#info').append('<hr width="88%"/>'); // after the first RUN, separate output with a line
 if (printinfo) $('#info').append('<p>Number of nodes is '+Ntotal+'</p>');


 //
 // Iteratively add nodes outward from the "axis nodes" above:
 //
 for (L=0;L<depth;L++){
  if (debug) console.log('Running depth '+L);
  if (printinfo) $('#info').append('<p style="text-indent:10px;">Making depth='+L+' children</p>');
  // nodes to attach edges to:
  indx = new Array(0);
  for (n=0;n<nodeDepth.length;n++){
   if (nodeDepth[n]==L){
    indx[indx.length] = n;
   }
  }
  if (debug) console.log('qqq Depth '+L+': indx = '+indx);

  for (ii=0;ii<indx.length;ii++){
//   if (debug) console.log('DEBUG: Making children of node '+indx[ii]);
   var thisnode = indx[ii]; // get the label for convenience
   thisKlist = circshift(Klist,-nodeK[thisnode]); // clockwise order for this node (ie. start with the "next" colour after the current one)
   for (var kk=0;kk<valency;kk++){ // loop through valency (kk is a dummy variable, indexing into the circshifted list)
    k = thisKlist[kk];






   } // loop over valency (ie. kk)
  } // loop over nodes at each depth
 } // loop over depth

 // do some reporting for debugging:
 for (var vv=0;vv<nodeAngle.length;vv++){
//  $('#info').append('<p class="debug">'+vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]+'</p>');
//  console.log(vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]);
 }

// return nodePosition;

  return 1; // success
 } // end axismodel function
