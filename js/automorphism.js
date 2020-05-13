/* **************************************************************************/
/* **************************************************************************/
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
