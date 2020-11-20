/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
async function automorphism(node1,node2){
 /* perform re-labelling of a tree based on moving node1 to node2 [need async to use await] */
 var debug = false;

 previousNodeAddress = nodeAddress; // save the old addresses

 var newaddr = [];
 var fromaddr = $("#automorph1").attr("value");
 var toaddr = $("#automorph2").attr("value");

 for (var i=0;i<nodeAddress.length;i++){
  oldaddr = nodeAddress[i];
  newaddr[i] = collapseAddress(fromaddr + reverseString(toaddr) + oldaddr);
 }

 // set the new addresses as the node addresses
 nodeAddress = newaddr;


 // animate the movement of labels
 // -- ideally the style of animation (linear or rotational) will depend on the type of automorphism being performed
 // move any label in previousNodeAddress which is also in newaddr
 for (var i=0;i<previousNodeAddress.length;i++){
  indx = nodeAddress.indexOf(previousNodeAddress[i]);
  if (indx>-1){//remove: canvasScale
   // found this label in the "before" and "after" sets of nodes, so animate it:
   startPosition = canvasScale(nodePosition[i]);
   endPosition = canvasScale(nodePosition[indx]);
   if (debug) console.log(" ANIMATE address \""+previousNodeAddress[i]+"\" from ("+startPosition[0]+","+startPosition[1]+") to ("+endPosition[0]+","+endPosition[1]+")");

   // helper variables
   var ABS_PATH = 0;
   var RELATIVE_PATH = 1;
   var USE_OFFSET = -1; // -1 gives default curves

   // get the ID:
   var thelabelID = "nodelabel"+indx;
   // generate the path that we want
   var thepathAbs = createPath(endPosition[0],endPosition[1],startPosition[0],startPosition[1],USE_OFFSET,ABS_PATH);
   // the animation motion was wrong, try this: (the path from A to B was being applied to B instead of A):
   var thepathRel = createPath(endPosition[0],endPosition[1],startPosition[0],startPosition[1],USE_OFFSET,RELATIVE_PATH);
   // add the path to the admin group (and so drawing it on the screen; need absolute path):
   addPath(thepathAbs,"admingroup");
   // add the (relative) animation path to the label and run the animation:
   addAnimateMotion(thelabelID,thepathRel);
   // run it!
   document.getElementById("animate_"+thelabelID).beginElement();
  } else {
   // this address doesn't appear after the automorphism is applied (?), so fade it out
/*
   $(document.createElementNS("http://www.w3.org/2000/svg","animate")).attr({
    attributeName:"fill",
    values:"red;blue;red",
    dur:"5s",
    repeatCount:"indefinite",
    id:"fademe",
   }).appendTo("#nodelabel9");
*/

  }
 }



 var params = new FocusModel;
 params.getCurrent();
 params.initialfocus[0] = nodeAddress[0];
 if (params.themodeltype=="edge"){
  params.initialfocus[1] = nodeAddress[1];
 }
 params.setCurrent();

 await new Promise(r => setTimeout(r, 2000)); // "sleep" while the animation runs
 drawgraph();
 return 1;
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function euclideanDistance(p1,p2){
 return Math.pow( Math.pow(p1[0]-p2[0],2.0)+Math.pow(p1[1]-p2[1],2.0),0.5);
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function addPath(d,g="admingroup"){
 // create an SVG path and add it to the nominated group
 // (note that this will draw the path, not just create an abstract SVG path object)
 // eg. d = 'M638 212 Q 573 299.5 508 387', g = 'admingroup'

  $(document.createElementNS("http://www.w3.org/2000/svg","path")).attr({
   "fill": "none",
   "stroke": "#0003",
   "stroke-width": 1,
   "d": d,
   "class": "animpath",
  }).appendTo("#"+g);
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function addAnimateMotion(parentID,d){
  // create an SVG animateMotion element for a specific element (usually a node label)
  // d should be a "raw" path, eg. d = 'M638 212 Q 573 299.5 508 387'
  var theparent = document.getElementById(parentID);
  console.log("Adding animation to "+parentID);

  $(document.createElementNS("http://www.w3.org/2000/svg","animateMotion")).attr({
   "dur": "2s", // animation duration, must match the "sleep"
   "repeatCount": "indefinite", // later use "1"
   "path": d,
   "begin": "indefinite",
   "id": "animate_"+parentID,
  }).appendTo(theparent);
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function createPath(startX,startY,endX,endY,offset=0,relativePath=1){
 /*
   PREVIOUSLY: function createPath(mystart,myend,offset=0,relativePath=1)
   This function was causing trouble because arrays are passed in as function parameters,
   and so the original values (nodePosition) were being modified globally when a relative
   path was requested.  Lesson learnt.
 */
 var startPos = Array(startX,startY);
 var endPos = Array(endX,endY);
 // startPos and endPos are two-element positions
 // offset is the maximum distance from the line between them that the path should reach
 //  - use offset = -1 for a default curve
 //  - offset = 0 will be a straight line
 var debug = false;
 if (debug) console.log("Making path from "+String(startPos[0])+","+String(startPos[1])+" to "+String(endPos[0])+","+String(endPos[1]));

 if (relativePath){
  for (var d=0;d<startPos.length;d++){ // loop over each dimension
   endPos[d] -= startPos[d]; // subtract the starting coordinate to create a relative path
   startPos[d] = 0;
  }
 } else {
  // else don't subtract the starting point
 }


 // taken from https://stackoverflow.com/a/49286885
 if (offset==-1){
  // default offset is 0 but if -1 is given, make a nice "long" curve (ie. put the control point fairly far from the line between start and end)
  offset = euclideanDistance(startPos,endPos)*0.75;
 }

 var midpt = lineMidPoint(startPos,endPos);

 var p1x=startPos[0];
 var p1y=startPos[1];
 var p2x=endPos[0];
 var p2y=endPos[1];
 var mpx=midpt[0];
 var mpy=midpt[1];

 // angle of the perpendicular to line joining start and end:
 var theta = -Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;

 // location of control point:
 var c1x = Math.round(mpx + offset * Math.cos(theta));
 var c1y = Math.round(mpy + offset * Math.sin(theta));
 p1x = Math.round(p1x);
 p1y = Math.round(p1y);
 p2x = Math.round(p2x);
 p2y = Math.round(p2y);

 // construct the command to draw a quadratic curve
 var thepath = "M " + p1x + " " + p1y + " Q " + c1x + " " + c1y + " " + p2x + " " + p2y;
 if (debug) console.log(" PATH: "+thepath);

 return thepath;
}
