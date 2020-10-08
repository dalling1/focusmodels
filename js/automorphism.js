/* **************************************************************************/
/* **************************************************************************/
/* **************************************************************************/
function automorphism(node1,node2){
 /* perform re-labelling of a tree based on moving node1 to node2 */

 previousNodeAddress = nodeAddress; // save the old addresses

 var newaddr = [];
 var fromaddr = $("#automorph1").attr("value");
 var toaddr = $("#automorph2").attr("value");

 for (var i=0;i<nodeAddress.length;i++){
  oldaddr = nodeAddress[i];
  newaddr[i] = collapseAddress(fromaddr + reverseString(toaddr) + oldaddr);
//  console.log(oldaddr + " -> " + newaddr);
 }

 nodeAddress = newaddr;

 // old way:
// V0[0] = nodeAddress[0];
// V0[1] = nodeAddress[1];

 var params = new FocusModel;
 params.getCurrent();
 params.initialfocus[0] = nodeAddress[0];
 if (params.themodeltype=="edge"){
  params.initialfocus[1] = nodeAddress[1];
 }
 params.setCurrent();

 drawgraph();
 return 1;
}
