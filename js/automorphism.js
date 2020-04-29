/* **************************************************************************/
function nearestNode(x,y){
 var thenode = -1;
 var dist = 10000000;
 for (var i=0;i<nodeScreenPosition.length;i++){
  var thisdist = Math.pow(Math.pow(nodeScreenPosition[i][0] - x,2) + Math.pow(nodeScreenPosition[i][1] - y,2),0.5);
  if (thisdist<dist){
   dist = thisdist;
   thenode = i;
  }
 }
 if (thenode>=0){
  return thenode;
 } else {
  return null;
 }
}



/* **************************************************************************/
function canvasClick(evt){
 // We need to test whether the user clicked on an empty piece of the canvas
 // or on an SVG element (node, line, etc.). In the latter case, get the bounding
 // box of the parent element (ie. the SVG object itself), not the clicked object.
 var e = evt.target;
 if (e.ownerSVGElement === null){ // clicked on the canvas
  var dim = e.getBoundingClientRect();
 } else { // clicked on an SVG element (node, line, etc.)
  var dim = e.parentElement.getBoundingClientRect();
 }

/*
 if (evt.shiftKey) {
  alert("Clicked while pressing SHIFT key");
 }
*/

 var x = Math.round(evt.clientX - dim.left);
 var y = Math.round(evt.clientY - dim.top);
// console.log("CLICKED x: "+x+" y:"+y);

 var usenode = nearestNode(x,y);
 if (usenode === null){
  alert("No nearest node found (??)"); // this shouldn't happen! (and probably won't)
 } else {

  if (evt.ctrlKey) {

   //
   // CTRL-click: set the automorphism nodes
   //


   var addr = nodeAddress[usenode];
   if (addr.length==0) addr = "0";
//   console.log("NEAREST NODE: "+nodeAddress[usenode]);
   var changeField = $(".clickentry:first"); //.attr("id");
   $(changeField).attr("value",addr);
   $("#auto1").addClass("clickentry");
   $("#auto2").addClass("clickentry");
   $(changeField).removeClass("clickentry");
   checkValidAddress(changeField);
//   $(changeField).removeClass("invalid");


  } else {

   //
   // simple click: set a node's custom label
   //
   var currentaddress = nodeAddress[usenode];
   if (currentaddress.length==0) currentaddress="\u{d8}";
   var currentlabel = nodeLabel[usenode];
   // request the new label; give the current custom label (if any) as default, and tell the user the node's address
   newlabel = prompt("Set node label for "+currentaddress,currentlabel);
   if (newlabel===null){
    // don't change anything if the user clicked cancel
   } else {
    nodeLabel[usenode] = newlabel;
    drawgraph();
   }


  }
 }
 return 1;
}



/* **************************************************************************/
function automorphism(node1,node2){
 /* perform re-labelling of a tree based on moving node1 to node2 */

 previousNodeAddress = nodeAddress; // save the old addresses

 var newaddr = [];
 var fromaddr = $("#auto1").attr("value");
 var toaddr = $("#auto2").attr("value");

 for (var i=0;i<nodeAddress.length;i++){
  oldaddr = nodeAddress[i];
  newaddr[i] = collapseAddress(fromaddr + reverseString(toaddr) + oldaddr);
//  console.log(oldaddr + " -> " + newaddr);
 }

 nodeAddress = newaddr;
 V0[0] = nodeAddress[0];
 V0[1] = nodeAddress[1];

 drawgraph();
 return 1;
}
