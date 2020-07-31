/* ********************************************************************************************* */
/* ********************************************************************************************* */
/* ********************************************************************************************* */
function axismodel(initialVertex){
 var pi = Math.PI;
 var debug = false;
 var valency = 5; // later we can get these from the user controls
 var Nlevels = 2; // default
 var Nroots = 1;
 var edgelength = 2; // base edge length
 var edgescaling = 1; // base edge scaling (from one level to another)
 var gamma1 = pi; // branch spread angle
 var printinfo = 1;

 // angles affecting the overall layout:
// var gamma1 = pi; // spread angle of hanging nodes (smaller means "pointier" trees); default pi
 var gamma2 = 0;    // offset-angle for hanging nodes (tilts the whole "branch")
 var delta1 = 0;

 /* experiment */
// gamma1 = 1*pi/3;
// gamma2 = 0;

 var colournames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

 if (initialVertex===undefined){
  initialVertex = Array(1);
  initialVertex[0] = colournames[0];
 }

 // GET INPUTS FROM THE WEB PAGE:
// var tmpvalency = eval($("#valencyfield").val());
// var tmpNlevels = eval($("#depthfield").val());
 var tmpvalency = eval($("#thevalency").val());
 var tmpNlevels = eval($("#thelevels").val());
//xxx var tmpWidth = eval($("#thewidth").val());
 var tmpgamma1 = eval($("#gamma1field").val());
 var tmpedgelength = eval($("#theoverallscale").val());
 var tmpedgescaling = eval($("#theedgescaling").val());
 var tmpbranchspread = eval($("#thespread").val());
 printinfo = $("#infobutton").prop('checked');
 var fadeleaves = $("#fadeleavesbutton").prop("checked");

 // VALIDATE THE INPUT:
 var afraction = RegExp('[0-9]+/[0-9]+');
 if (Number.isInteger(tmpvalency)) valency = tmpvalency;
 if (Number.isInteger(tmpNlevels)) Nlevels = tmpNlevels;
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
  $('#info').append('<p class="error">Valency must be less than '+colournames.length+' (or add new colour names in the code!)</p>');
  return 0;
 }

 // angles between branches (computed):
 gamma2 = pi/2-gamma1/2;      // offset to centre the branch edges (use different values to tilt the whole tree)
 var alpha1 = gamma1/(valency-1); // angle between "hanging" edges attached to the axis
 var alpha2 = gamma1/(valency);   // angle between "hanging" edges attached to already-hanging nodes


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
  Ntotal = Nroots*(Nlevels*valency+1);
 }
 if (debug) console.log('Number of nodes will be '+Ntotal); // report
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
 var nodeKK = new Array(Nroots);
 nodeIgnore = new Array(Nroots); // used to stop drawing particular branches (create no child nodes of ignored nodes)
 // set values for root nodes:
 var rootSpacing = 2;
 var rootOrigin = -(Nroots-1)*rootSpacing/2;
 for (var i=0;i<Nroots;i++){
  nodePosition[i] = [rootOrigin + rootSpacing*i, 0]; // positions of root nodes
  nodeIndex[i] = i;         // "labels" of root nodes
  nodeAddress[i] = collapseAddress(initialVertex[0]);
  nodeParent[i] = -1;
  nodeLevel[i] = 0;
  nodeAngle[i] = 0;
  nodeOnAxis[i] = true; // initial nodes are on-axis, by definition
  nodeK[i] = 0;
  nodeKK[i] = 0;
  nodeIgnore[i] = false;
 }
 // set up a list which we will permute
 var Klist = new Array(valency);
 for (var i=0;i<valency;i++) Klist[i] = i;

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
  if (debug) console.log('qqq Level '+L+': nodeList = '+nodeList);

  for (var ii=0;ii<nodeList.length;ii++){
//   if (debug) console.log('DEBUG: Making children of node '+nodeList[ii]);
   var thisnode = nodeList[ii]; // get the label for convenience
   if (fadeleaves){ // if we are fading the leaves, thisnode is no longer a leaf
    nodeIgnore[thisnode] = false;
   }
   thisKlist = circshift(Klist,-nodeK[thisnode]); // clockwise order for this node (ie. start with the "next" colour after the current one)
   for (var kk=0;kk<valency;kk++){ // loop through valency (kk is a dummy variable, indexing into the circshifted list)
    k = thisKlist[kk];
    if (L==0 || k!=nodeK[thisnode]){ // loop through all valencies, but don't add the "duplicate" one, which would take us back to the parent node, except the first time

     nodeIndex[nodeIndex.length] = nodeIndex[nodeIndex.length-1]+1; // label the new node incrementally
     var newnode = nodeIndex[nodeIndex.length-1]; // ... and grab that label for convenience
     // from here on, "thisnode" is the parent and "newnode" is the leaf:
     nodeParent[newnode] = nodeIndex[thisnode];
     nodeK[newnode] = k;
     nodeKK[newnode] = kk;
     nodeAddress[newnode] = collapseAddress(nodeAddress[nodeParent[newnode]] + colournames[nodeK[newnode]]);
     nodeIgnore[newnode] = (fadeleaves?true:false); // false, unless we are fading leaf nodes (user control): then, set this to true but make it false later if we add children
     nodeLevel[newnode] = nodeLevel[nodeParent[newnode]]+1; // "normal" (ie. non-root) vertex
//     if (debug) console.log('DEBUG: making a child (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);

     if (L==0){
      if (debug) $('#info').append('<p class="debug">NODE '+newnode+': k='+k+' and valency='+valency+'</p>'); // qqq
      if (k==0){ // at L=1, first [and last] added edges are on-axis
       nodeOnAxis[newnode] = 1;
       nodeAngle[newnode] = pi/2 + delta1; // node lies on the (horizontal) axis
      } else if (k==(valency-1)){ // at L=1, [first and] last added edges are on-axis [-1 because of zero-indexing]
       nodeOnAxis[newnode] = 1;
       nodeAngle[newnode] = -pi/2 + delta1; // node lies on the (horizontal) axis, to the "left"
      } else {
       nodeOnAxis[newnode] = 0; // but others are hanging (THESE ARE NODES HANGING DIRECTLY FROM THE AXIS, AT LEVEL=1)
       nodeAngle[newnode] = pi/2 + ((kk+1)-1)*alpha1 + gamma2 + delta1; // alpha1 applies when the parent *is* on-axis CORRECT
      }
     } else { // not L==0: (IE. L>0)
      if (nodeOnAxis[nodeParent[newnode]]){ // is the parent on-axis?
       // NODES TO THE RIGHT OF THE "ROOT" NODE:
       // (need to test whether nodeAddress[newnode] is found at the start of 'longestname' or 'inverselongestname':)
       if (nodeAddress[newnode]==longestname.slice(0,nodeAddress[newnode].length)){ // K sequence is ascending (eg. 123 or 451) modulo valency
        nodeOnAxis[newnode] = 1;
        nodeAngle[newnode] = pi/2 + delta1;
       // NODES TO THE LEFT OF THE "ROOT" NODE:
       } else if (nodeAddress[newnode]==inverselongestname.slice(0,nodeAddress[newnode].length)){ // K sequence is descending (eg. 321 or 543) modulo valency
        nodeOnAxis[newnode] = 1;
        nodeAngle[newnode] = -pi/2 + delta1;
       } else { // parent is on-axis but this node is not: (***for L>0***)
        nodeOnAxis[newnode] = 0; // this node is not on axis
        if (nodeKK[nodeParent[newnode]]==0){ // RHS of axis...
         var alphaMultiplier = nodeKK[newnode]-1;
        } else if (nodeKK[nodeParent[newnode]]==valency-1){ // LHS of axis...
         alphaMultiplier = nodeKK[newnode];
        } else {
         alphaMultiplier = nodeKK[newnode]-1;
//       error('oops'); // should not actually ever get to here...
        }
        nodeAngle[newnode] = pi/2 + alphaMultiplier*alpha1 + gamma2 + delta1; // alpha1 applies when the parent *is* on-axis xxx
       }
      } else {
       nodeOnAxis[newnode] = 0; // nodes hanging from hanging nodes are not on-axis
       nodeAngle[newnode] = pi/2 + kk*alpha2 + gamma2 + delta1; // alpha2 applies when the parent *is not* on-axis
      }

     }

     nodePosition[newnode]=new Array(2); // initialise
//     nodePosition[newnode][0] = nodePosition[thisnode][0] + edgeLengthAF(nodeLevel[newnode],valency,edgelength)*Math.sin(nodeAngle[newnode])
//     nodePosition[newnode][1] = nodePosition[thisnode][1] + edgeLengthAF(nodeLevel[newnode],valency,edgelength)*Math.cos(nodeAngle[newnode])
     nodePosition[newnode][0] = nodePosition[thisnode][0] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.sin(nodeAngle[newnode])
     nodePosition[newnode][1] = nodePosition[thisnode][1] + calcEdgeLength(nodeLevel[newnode],valency,edgelength,edgescaling)*Math.cos(nodeAngle[newnode])
     if (debug) console.log('DEBUG: made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
     if (debug) $('#info').append('<p class="debug">made a child with address *'+nodeAddress[newnode]+'* (kk='+kk+',k='+k+') with parent '+nodeParent[newnode]);
//     console.log('  The position for node '+nodeAddress[newnode]+' is ('+nodePosition[newnode][0]+', '+nodePosition[newnode][1]+')')
    } else {
     if (debug) console.log('Not creating "duplicate" parent node');
    } // if k>1 or L==1
   } // loop over valency (ie. kk)
  } // loop over nodes at each level
//  fprintf(' Level = %g: %g nodes\n',L,length(nodeIndex));
 } // loop over Nlevels

 // do some reporting for debugging:
 for (var vv=0;vv<nodeAngle.length;vv++){
//  $('#info').append('<p class="debug">'+vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]+'</p>');
//  console.log(vv+'] angle '+nodeAngle[vv].toFixed(3)+'   parent '+nodeParent[vv]);
 }

// return nodePosition;


 /* calculate the midpoints of all edges (these are used for edge labelling) */
 // (this code was copied from the showarrows() function, and these midpoints could be re-used there with a little editing)
 edgeLabelPosition = Array(nodeIndex.length); // initialise global variable
 for (var i=0;i<nodeIndex.length;i++){
  var fromNode = nodeParent[i];
  var toNode = nodeIndex[i];
  if (nodeAddress[i]=="LL"|nodeAddress[nodeParent[i]]=="LL"){ // axis extensions are handled slightly differently (if extant)
   fromNode = nodeIndex[i];
   toNode = nodeParent[i];
  }
  if (fromNode>=0 & toNode>=0){ // skip it if this node has no parent; faded edges can be labelled
   edgeLabelPosition[i] = canvasScale(lineMidPoint(nodePosition[fromNode],nodePosition[toNode],0.5));
  } else {
   edgeLabelPosition[i] = [NaN, NaN];
  }
 } // end loop over edges


  return 1; // success
 } // end axismodel function
