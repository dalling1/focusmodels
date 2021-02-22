/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
async function automorphism(){
 /*
    Perform re-labelling of a tree based on moving node1 to node2 [need async to use await]
    node1 and node2 are read from the text input fields automorph1 and automorph2
 */
 var debug = false;

 previousNodeAddress = nodeAddress; // save the old addresses

 var oldaddr = [];
 var newaddr = [];
 var fromaddr = $("#automorph1").attr("value");
 var toaddr = $("#automorph2").attr("value");

 // perform the relabelling:
 for (var i=0;i<nodeAddress.length;i++){
  oldaddr[i] = nodeAddress[i];
  newaddr[i] = collapseAddress(fromaddr + reverseString(toaddr) + oldaddr[i]);
 }

 // set the new addresses as the node addresses
 nodeAddress = newaddr;


 // animate the movement of labels
 // -- ideally the style of animation (linear or rotational) will depend on the type of automorphism being performed
 // move any label in previousNodeAddress which is also in newaddr
 for (var i=0;i<previousNodeAddress.length;i++){
  indx = nodeAddress.indexOf(previousNodeAddress[i]);
  var thelabelID = "nodelabel"+i;

  if (indx>-1){
   // found this label in the "before" and "after" sets of nodes, so animate it:
   startPosition = canvasScale(nodePosition[i]);
   endPosition = canvasScale(nodePosition[indx]);

   // helper variables
   var ABS_PATH = 0;
   var RELATIVE_PATH = 1;
   var USE_OFFSET = -1; // -1 gives default curves in createPath()

   // generate the path that we want to draw:
   var thepathAbs = createPath(startPosition[0],startPosition[1],endPosition[0],endPosition[1],USE_OFFSET,ABS_PATH);
   // generate the path that we want the label to follow:
   var thepathRel = createPath(startPosition[0],startPosition[1],endPosition[0],endPosition[1],USE_OFFSET,RELATIVE_PATH);

   // add the path to the admin group (and so drawing it on the screen; need absolute path):
   addPath(thepathAbs,"admingroup",previousNodeAddress[i],previousNodeAddress[indx]);
   // add the (relative) animation path to the label and run the animation:
   addAnimateMotion(thelabelID,thepathRel);
   // run it!
   document.getElementById("animate_"+thelabelID).beginElement();
  } else {
   // this address doesn't appear after the automorphism is applied (?), so fade it out
   var thefadelabel = document.getElementById(thelabelID);
   // change colour to white (the CSS transition rule for .alabel will make it fade:
   // (NOTE: there is no control over speed, though, without changing the CSS)
   thefadelabel.attributes.fill.value = "#ffffff";

/*
   // the animation isn't working this way
   $(document.createElementNS("http://www.w3.org/2000/svg","animate")).attr({
    attributeName:"fill",
    values:"red;blue;red",
    dur:"5s",
    repeatCount:"indefinite",
    id:"fademe",
   }).appendTo(thefadelabel);
   // need to get the new (child) animate element and call beginElement() on it?
   //  -- not quite, still working on this
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
function addPath(d,g="admingroup",from="",to=""){
 // create an SVG path and add it to the nominated group
 // (note that this will draw the path, not just create an abstract SVG path object)
 // eg. d = 'M638 212 Q 573 299.5 508 387', g = 'admingroup'

  $(document.createElementNS("http://www.w3.org/2000/svg","path")).attr({
   "fill": "none",
   "stroke": "#0003",
   "stroke-width": 1,
   "d": d,
   "class": "animpath",
   "fromto": from+" "+to,
  }).appendTo("#"+g);
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function addAnimateMotion(parentID,d){
  // create an SVG animateMotion element for a specific element (usually a node label)
  // d should be a "raw" path, eg. d = 'M638 212 Q 573 299.5 508 387'
  var theparent = document.getElementById(parentID);

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
 var c1y = Math.round(mpy - offset * Math.sin(theta)); // fixed
 p1x = Math.round(p1x);
 p1y = Math.round(p1y);
 p2x = Math.round(p2x);
 p2y = Math.round(p2y);

 // construct the command to draw a quadratic curve
 var thepath = "M " + p1x + " " + p1y + " Q " + c1x + " " + c1y + " " + p2x + " " + p2y;
 if (debug) console.log(" PATH: "+thepath);

 return thepath;
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function readAutomFromFile(e){
 /*
   Read an automorphism from a CSV text file.

   Currently this reads the file and puts the resulting array into the variable 'theautom'.

   This is then passed to the function extractAutomorphism(), which tests it and converts node addresses to those used by the focus models.
 */
 var fileList = e.target.files;
 for (var i=0;i<fileList.length;i++){
  console.log(fileList[i].type); // want application/json
 }

 if (fileList.length==1){
  thefile = fileList[0];
  // read the contents
  if (thefile.type) { // probably application/vnd.ms-excel (but, in general, is that a csv file or an Excel file?)
   var reader = new FileReader;
   reader.readAsText(thefile);
   // wait for the load to complete (https://stackoverflow.com/questions/28658388/):
   reader.onload = function(e) {
    var rawLoadAutom = reader.result;
    // remove consecutive newlines (okay for our purposes but not necessarily valid in general CSV files, which might have a single field (ie. no commas)...):
    rawLoadAutom = rawLoadAutom.replace(/[\n|\r]+/g,'\n');
    // parse the CSV format:
    theautom = CSV.parse(rawLoadAutom); // extract an array of comma-separated entries

    // This would be the place to test the file contents and ensure that the automorphism is sane:
    // -- each element of theautom should have two elements (the "from" and "to" addresses)
    // -- the "from" and "to" address do not need to match in length (eg. (0,1,2) could move to (1,2,1,2,1,2,1,2) etc.)
    // test for and/or remove duplicates?
    // -- better to give a warning/error that the file is not valid

    // Run the extractor, which tests the format and converts to the address structure used by the focus models:
    extractAutomorphism(theautom);

   };
  } else {
   // wrong type (not actually tested for at the moment)
   return false;
  }

 } else {
  // don't handle multiple files
  return false;
 }
}


/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function extractAutomorphism(automIn){
 /*
   Function which takes the input (read from a CSV file) and
     (i) tests it
    (ii) converts the addresses to those used by the focus models.

   The input format is specific to our input files, which are comma-separated pairs
   of addresses in parentheses inside quotation marks,

      eg. "(1, 0, 2)", "(2, 1, 2)"

   Note that some entries have a comma inside the parentheses after the last entry,
   such as "(1,)", "(2,)", or no commas at all such as "()", "()".  These indicate
   the presence of the "empty label".

   Not all of the input addresses will necessarily be show on the currently drawn
   graph, and not all of the currently drawn addresses will be present in the input.
   This is fine: we want to handle the case of a fairly general automorphism (the
   effect of the automorphism on nodes in some finite subset of the infinite tree is
   specified in the input).

   We could change the number of levels drawn according to the input, but it is
   probably more instructive to leave that setting as the user has chosen it.

   The main thing to test is that the valency in the input is compatible with that
   drawn by the focus model.
 */

 // Loop through the input and convert each address to a focus model address
 //  -- eg. "(1, 0, 2)", "(2, 1, 2)" becomes "bac", "cbc"
 //  -- keep track of the longest address given -> no. of levels
 //  -- keep track of the highest element value -> valency

 debug = false;
 focusAutom = [];
 automFrom = [];
 automTo = [];
 inputValency = -1;
 inputLevels = -1;

 for (var i=0;i<automIn.length;i++){
  var from = automIn[i][0];
  var to = automIn[i][1]; // extra entries are ignored!
  parethesesRegex = RegExp(/\(.*\)/);

  var formatOkay = true;
  formatRegex = RegExp(/\(( *\d+ *, *)*\d* *\)/); // regex for testing the format (comma-separated numbers (multiple digits) with optional spaces; ",)" allowed only at the end)

  if (formatRegex.test(from) && formatRegex.test(to)){
   if (debug) console.log(" Correct format in entry "+i+": from = "+from+", to = "+to);
   // this entry is okay, form an address
   var fromSplit = from.slice(1,-1).trim().split(/ *, */); // remove parentheses and split the automorphism entry into its parts (removing spare spaces along the way)
   var toSplit = to.slice(1,-1).trim().split(/ *, */);

   // Note: the "from" and "to" address do not need to match in length (eg. (0,1,2) could move to (1,2,1,2,1,2,1,2) etc.)

   // initialise
   automFrom[i] = "";
   automTo[i] = "";

   // split the entries up to convert to the focus model addressing scheme
   for (j=0;j<fromSplit.length;j++){
    if (fromSplit[j].length) automFrom[i] += colournames[fromSplit[j]]; // append this character to the address
    if (toSplit[j].length) automTo[i] += colournames[toSplit[j]]; // append this character to the address

    if (fromSplit[j]>inputValency) inputValency = fromSplit[j]; // assume a 0-based scheme (plus the empty label), check the implicit valency in the input
    if (toSplit[j]>inputValency) inputValency = toSplit[j]; // assume a 0-based scheme (plus the empty label), check the implicit valency in the input

   }

   if (fromSplit.length>inputLevels) inputLevels = fromSplit.length; // check the implicit number of levels in the input
   if (toSplit.length>inputLevels) inputLevels = toSplit.length; // check the implicit number of levels in the input

  } else {
   formatOkay = false;
   console.log(" Incorrect format in entry "+i+": from = "+from+", to = "+to);
  }

 }

 if (!formatOkay){
  alert('Format of input file is incorrect (see console for details)');
 } else {
  inputValency++; // highest value in input, but zero-indexed, so add on to get the valency
  // quick report:
  console.log("Input automorphism file had an implicit valency of "+inputValency+", and "+inputLevels+" level"+(inputLevels===1?"":"s"));
 }
}
