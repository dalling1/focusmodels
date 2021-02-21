class FocusModel {
 constructor(themodeltype, initialfocus, thevalency, thewidth, thelevels, theedgescaling, theoverallscale, thespread, plainedgesbutton,
edgepicker, nodepicker, whichlabel, labelpicker, axesbutton, axespicker, fadeleavesbutton, showarrowsbutton, theoffsetX,
theoffsetY, thelabeloffsetX, thelabeloffsetY, thetextangle, thefontsize, thenodesize, thelinewidth, transparencybutton,
automorph1, automorph2, thearrowsize, thearrowratio, thearrowoffset, filledarrowsbutton, reversedarrowsbutton, fadedarrowsbutton,
theaxislinewidth, nodesontopbutton, nodeLabel, edgeLabel, nodeLabelOffsets, edgeLabelOffsets, theskipnodes, theskipstart, nodeRightclicked,
showselectedonly, ){

  this.name = 'FocusModel';
  this.themodeltype = themodeltype; // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  this.initialfocus = initialfocus; // formerly "V0", the initial focus vertex, edge, etc.
  this.thevalency = thevalency; // int
  this.thewidth = thewidth; // int
  this.thelevels = thelevels; // int
  this.theedgescaling = theedgescaling; // float
  this.theoverallscale = theoverallscale; // float
  this.thespread = thespread; // float
  this.plainedgesbutton = plainedgesbutton; // boolean
  this.edgepicker = edgepicker; // colour, eg "#990000"
  this.nodepicker = nodepicker; // colour
  this.whichlabel = whichlabel; // int
  this.labelpicker = labelpicker; // colour
  this.axesbutton = axesbutton; // boolean
  this.axespicker = axespicker; // colour
  this.fadeleavesbutton = fadeleavesbutton; // boolean
  this.showarrowsbutton = showarrowsbutton; // boolean
  this.theoffsetX = theoffsetX; // float
  this.theoffsetY = theoffsetY; // float
  this.thelabeloffsetX = thelabeloffsetX; // float
  this.thelabeloffsetY = thelabeloffsetY; // float
  this.showselectedonly = showselectedonly; // boolean
  this.thetextangle = thetextangle;
  this.thefontsize = thefontsize; // int
  this.thenodesize = thenodesize; // float
  this.thelinewidth = thelinewidth; // float
  this.transparencybutton = transparencybutton; // boolean
  this.automorph1 = automorph1; // string
  this.automorph2 = automorph2; // string
  this.thearrowsize = thearrowsize; // float
  this.thearrowratio = thearrowratio; // float
  this.thearrowoffset = thearrowoffset; // float
  this.filledarrowsbutton = filledarrowsbutton; // boolean
  this.reversedarrowsbutton = reversedarrowsbutton; // boolean
  this.fadedarrowsbutton = fadedarrowsbutton; // boolean
  this.theaxislinewidth = theaxislinewidth; // float
  this.nodesontopbutton = nodesontopbutton; // boolean
  this.theskipstart = theskipstart; // int
  this.theskipnodes = theskipnodes; // int

  if (typeof nodeLabel == 'object'){ // check if the custom label array exists
   this.nodeLabel = nodeLabel; // array
  } else {
   this.nodeLabel = new Array; // array
  }
  if (typeof edgeLabel == 'object'){ // check if the edge midpoint label array exists
   this.edgeLabel = edgeLabel; // array
  } else {
   this.edgeLabel = new Array; // array
  }
  if (typeof nodeLabelOffsets == 'object'){ // check if the node label offsets array exists
   this.nodeLabelOffsets = nodeLabelOffsets; // array
  } else {
   this.nodeLabelOffsets = new Array; // array
  }
  if (typeof edgeLabelOffsets == 'object'){ // check if the edge label offsets array exists
   this.edgeLabelOffsets = edgeLabelOffsets; // array
  } else {
   this.edgeLabelOffsets = new Array; // array
  }
  if (typeof nodeRightclicked == 'object'){ // check if the "node has been right-clicked" array exists
   this.nodeRightclicked = nodeRightclicked; // array
  } else {
   this.nodeRightclicked = new Array; // array
  }

 }

 // a method to draw a given model object:
 // set the page controls and then call setup, which reads those values and draws the graph
 setCurrent(){
  $("#themodeltype").val(this.themodeltype); // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  $("#thevalency").val(this.thevalency); // int
  $("#thevalencyOutput").val(this.thevalency); // int
  $("#thewidth").val(this.thewidth); // int
  $("#thewidthOutput").val(this.thewidth); // int
  $("#thelevels").val(this.thelevels); // int
  $("#thelevelsOutput").val(this.thelevels); // int
  $("#theedgescaling").val(this.theedgescaling); // float
  $("#theedgescalingOutput").val(this.theedgescaling); // float
  $("#theoverallscale").val(this.theoverallscale); // float
  $("#theoverallscaleOutput").val(this.theoverallscale); // float
  $("#thespread").val(this.thespread); // float
  $("#thespreadOutput").val(this.thespread); // float
  $("#plainedgesbutton").prop("checked",(this.plainedgesbutton?true:false)); // boolean
  $("#edgepicker").spectrum("set",this.edgepicker); // colour
  $("#nodepicker").spectrum("set",this.nodepicker); // colour
  $("#whichlabel").val(this.whichlabel); // int
  $("#labelpicker").spectrum("set",this.labelpicker); // colour
  $("#axesbutton").prop("checked",(this.axesbutton?true:false)); // boolean
  $("#axespicker").spectrum("set",this.axespicker); // colour
  $("#fadeleavesbutton").prop("checked",(this.fadeleavesbutton?true:false)); // boolean
  $("#showarrowsbutton").prop("checked",(this.showarrowsbutton?true:false)); // boolean
  $("#theoffsetX").val(this.theoffsetX); // float
  $("#theoffsetXOutput").val(this.theoffsetX); // float
  $("#theoffsetY").val(this.theoffsetY); // float
  $("#theoffsetYOutput").val(this.theoffsetY); // float
  $("#thelabeloffsetX").val(this.thelabeloffsetX); // float
  $("#thelabeloffsetXOutput").val(this.thelabeloffsetX); // float
  $("#thelabeloffsetY").val(this.thelabeloffsetY); // float
  $("#thelabeloffsetYOutput").val(this.thelabeloffsetY); // float
  $("#showselectedonly").prop("checked",(this.showselectedonly?true:false)); // boolean
  $("#thetextangle").val(this.thetextangle); // float
  $("#thetextangleOutput").val(this.thetextangle); // float
  $("#thefontsize").val(this.thefontsize); // int
  $("#thefontsizeOutput").val(this.thefontsize); // int
  $("#thenodesize").val(this.thenodesize); // float
  $("#thenodesizeOutput").val(this.thenodesize); // float
  $("#thelinewidth").val(this.thelinewidth); // float
  $("#thelinewidthOutput").val(this.thelinewidth); // float
  $("#transparencybutton").prop("checked",(this.transparencybutton?true:false)); // boolean
  $("#automorph1").val(this.automorph1); // string
  $("#automorph2").val(this.automorph2); // string
  $("#thearrowsize").val(this.thearrowsize); // float
  $("#thearrowsizeOutput").val(this.thearrowsize); // float
  $("#thearrowratio").val(this.thearrowratio); // float
  $("#thearrowratioOutput").val(this.thearrowratio); // float
  $("#thearrowoffset").val(this.thearrowoffset); // float
  $("#thearrowoffsetOutput").val(this.thearrowoffset); // float
  $("#filledarrowsbutton").prop("checked",(this.filledarrowsbutton?true:false)); // boolean
  $("#reversedarrowsbutton").prop("checked",(this.reversedarrowsbutton?true:false)); // boolean
  $("#fadedarrowsbutton").prop("checked",(this.fadedarrowsbutton?true:false)); // boolean
  $("#theaxislinewidth").val(this.theaxislinewidth); // float
  $("#theaxislinewidthOutput").val(this.theaxislinewidth); // float
  $("#nodesontopbutton").prop("checked",(this.nodesontopbutton?true:false)); // boolean
  $("#theskipstart").val(this.theskipstart); // int
  $("#theskipstartOutput").val(this.theskipstart); // int
  $("#theskipnodes").val(this.theskipnodes); // int
  $("#theskipnodesOutput").val(this.theskipnodes); // int

  $("#initialfocus1").val(this.initialfocus[0]); // string
  $("#initialfocus2").val(this.initialfocus[1]); // string

  nodeLabel = this.nodeLabel;
  edgeLabel = this.edgeLabel;
  nodeLabelOffsets = this.nodeLabelOffsets;
  edgeLabelOffsets = this.edgeLabelOffsets;
  nodeRightclicked = this.nodeRightclicked;
 }

 drawModel(){
  this.setCurrent();
  drawgraph();
 }

 // a method to save the current set-up to a FocusModel object:
 getCurrent(){
  this.themodeltype = $("#themodeltype").val(); // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  this.thevalency = parseInt($("#thevalency").val()); // int
  this.thewidth = parseInt($("#thewidth").val()); // int
  this.thelevels = parseInt($("#thelevels").val()); // int
  this.theedgescaling = parseFloat($("#theedgescaling").val()); // float
  this.theoverallscale = parseFloat($("#theoverallscale").val()); // float
  this.thespread = parseFloat($("#thespread").val()); // float
  this.plainedgesbutton = $("#plainedgesbutton").prop("checked"); // boolean
  this.edgepicker = $("#edgepicker").spectrum("get").toHexString(); // colour
  this.nodepicker = $("#nodepicker").spectrum("get").toHexString(); // colour
  this.whichlabel = parseInt($("#whichlabel").val()); // int
  this.labelpicker = $("#labelpicker").spectrum("get").toHexString(); // colour
  this.axesbutton = $("#axesbutton").prop("checked"); // boolean
  this.axespicker = $("#axespicker").spectrum("get").toHexString(); // colour
  this.fadeleavesbutton = $("#fadeleavesbutton").prop("checked"); // boolean
  this.showarrowsbutton = $("#showarrowsbutton").prop("checked"); // boolean
  this.theoffsetX = parseFloat($("#theoffsetX").val()); // float
  this.theoffsetY = parseFloat($("#theoffsetY").val()); // float
  this.thelabeloffsetX = parseFloat($("#thelabeloffsetX").val()); // float
  this.thelabeloffsetY = parseFloat($("#thelabeloffsetY").val()); // float
  this.showselectedonly = $("#showselectedonly").prop("checked"); // boolean
  this.thetextangle = parseFloat($("#thetextangle").val()); // float
  this.thefontsize = parseInt($("#thefontsize").val()); // int
  this.thenodesize = parseFloat($("#thenodesize").val()); // float
  this.thelinewidth = parseFloat($("#thelinewidth").val()); // float
  this.transparencybutton = $("#transparencybutton").prop("checked"); // boolean
  this.automorph1 = $("#automorph1").val(); // string
  this.automorph2 = $("#automorph2").val(); // string
  this.thearrowsize = parseFloat($("#thearrowsize").val()); // float
  this.thearrowratio = parseFloat($("#thearrowratio").val()); // float
  this.thearrowoffset = parseFloat($("#thearrowoffset").val()); // float
  this.filledarrowsbutton = $("#filledarrowsbutton").prop("checked"); // boolean
  this.reversedarrowsbutton = $("#reversedarrowsbutton").prop("checked"); // boolean
  this.fadedarrowsbutton = $("#fadedarrowsbutton").prop("checked"); // boolean
  this.theaxislinewidth = parseFloat($("#theaxislinewidth").val()); // float
  this.nodesontopbutton = $("#nodesontopbutton").prop("checked"); // boolean
  this.theskipstart = parseInt($("#theskipstart").val()); // int
  this.theskipnodes = parseInt($("#theskipnodes").val()); // int

  if (typeof nodeLabel == 'object'){ // check if the custom label array exists
   this.nodeLabel = nodeLabel; // array
  } else {
   this.nodeLabel = new Array; // array
  }
  if (typeof edgeLabel == 'object'){ // check if the edge midpoint label array exists
   this.edgeLabel = edgeLabel; // array
  } else {
   this.edgeLabel = new Array; // array
  }
  if (typeof nodeLabelOffsets == 'object'){ // check if the node label offsets array exists
   this.nodeLabelOffsets = nodeLabelOffsets; // array
  } else {
   this.nodeLabelOffsets = new Array; // array
  }
  if (typeof edgeLabelOffsets == 'object'){ // check if the edge label offsets array exists
   this.edgeLabelOffsets = edgeLabelOffsets; // array
  } else {
   this.edgeLabelOffsets = new Array; // array
  }
  if (typeof nodeRightclicked == 'object'){ // check if the "node has been right-clicked" array exists
   this.nodeRightclicked = nodeRightclicked; // array
  } else {
   this.nodeRightclicked = new Array; // array
  }

  this.initialfocus = [$("#initialfocus1").val(), $("#initialfocus2").val()]; // 2-tuple of strings

 }

 setDefaults(){
  var allowedModels = ['vertex','edge','axis','newaxis','monoray'];

  // some universal defaults
  if (allowedModels.indexOf(this.themodeltype)==-1){ // not a known model type
   this.themodeltype = 'vertex'; // make it a vertex-focused model then
  }

  this.initialfocus = [""]; // modified below for the edge model

  this.thevalency = 3; // int
  this.thewidth = 3; // int
  this.thelevels = 2; // int
  this.theedgescaling = 0.5; // float
  this.theoverallscale = 1.0; // float
  this.thespread = 0.5; // float
  this.plainedgesbutton = false; // boolean
  this.edgepicker = "#000000"; // colour, eg "#990000"
  this.nodepicker = "#000000"; // colour
  this.whichlabel = 0; // int
  this.labelpicker = "#ff0000"; // colour
  this.axesbutton = false; // boolean
  this.axespicker = "#888888"; // colour
  this.fadeleavesbutton = false; // boolean
  this.showarrowsbutton = false; // boolean
  this.theoffsetX = 0.0; // float
  this.theoffsetY = 0.0; // float
  this.thelabeloffsetX = 10.0; // float
  this.thelabeloffsetY = 10.0; // float
  this.showselectedonly = false; // boolean
  this.thetextangle = 0; // float
  this.thefontsize = 15; // int
  this.thenodesize = 3.0; // float
  this.thelinewidth = 0.2; // float
  this.transparencybutton = false; // boolean
  this.automorph1 = ""; // string
  this.automorph2 = ""; // string
  this.thearrowsize = 3.0; // float
  this.thearrowratio = 2.0; // float
  this.thearrowoffset = 0.3; // float; between 0 and 1
  this.filledarrowsbutton = true; // boolean
  this.reversedarrowsbutton = false; // boolean
  this.fadedarrowsbutton = true; // boolean
  this.theaxislinewidth = 0.2; // float
  this.nodesontopbutton = true; // boolean
  this.theskipstart = 0; // int
  this.theskipnodes = 0; // int

  // make some conditional changes to the default values:
  switch (this.themodeltype){
   case "vertex":
    this.thevalency = 3; // int
// testing
    this.thelevels = 3;
    this.whichlabel = 1;
    this.theedgescaling = 0.6;
    this.thelinewidth = 2.7;
// :testing:
    break;
   case "edge":
//    this.initialfocus = ["","a"];
    this.initialfocus = ["",colournames[0]];
    this.thespread = 1.0; // float
    break;
   case "axis":
    this.theoffsetY = 200.0; // float
    break;
   case "newaxis":
    this.thewidth = 3; // int
    this.thelevels = 3; // int; "depth"
    this.thespread = 0.4; // float; was 0.9
    this.theoffsetY = 200.0; // float
    break;
   case "monoray":
    this.thevalency = 6; // int
    this.thewidth = 2; // int
    this.thelevels = 1; // int
    this.theedgescaling = 0.5; // float
    this.theoverallscale = 3.0; // float
    this.thespread = 0.5; // float
    this.showarrowsbutton = true; // boolean
    this.reversedarrowsbutton = true; // boolean
    this.thearrowoffset = 0.7; // float; between 0 and 1
    this.theaxislinewidth = 3.0; // float
    break;
  }
 }

}



// function to save the current controls to a file (this is related to the FocusModel class, so is going here)
function saveToFile(){
 var params = new FocusModel;
 params.getCurrent();
 var modeltype = $("#themodeltype").val();
 var thejson = JSON.stringify(params);
 var theblob = new Blob([thejson], {type: "application/json"}); // reinforces the idea that this is json data (not just text to mess around with)
// var theblob = new Blob([thejson], {type: "text/plain"}); // easier to open and edit, perhaps: but use the web page to edit a setup...

 var saveAs = window.saveAs;
 saveAs(theblob, "focusmodel_"+modeltype+".json");
}

function readFromFile(e){
 // Tutorial at https://web.dev/read-files/
 var fileList = e.target.files;
// for (var i=0;i<fileList.length;i++){
//  console.log(fileList[i].type); // want application/json
// }
 if (fileList.length==1){
  thefile = fileList[0];
  // read the contents
  if (thefile.type && thefile.type=="application/json"){
   console.log("JSON file found");
   var reader = new FileReader;
   reader.readAsText(thefile);
   // wait for the load to complete (https://stackoverflow.com/questions/28658388/):
   reader.onload = function(e) {
    var rawLoadModel = JSON.parse(reader.result);
    // COPY THE LOADED VALUES INTO THE FocusModel OBJECT TO BE DRAWN, then
    var loadModel = Object.assign(new FocusModel, rawLoadModel);
    loadModel.drawModel();
   };

  } else {
   // wrong type
   return -1;
  }
 } else {
  // don't handle multiple files
  return -2;
 }
}
