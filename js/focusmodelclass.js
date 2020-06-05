class FocusModel {
 constructor(themodeltype, thevalency, thelevels, thescaling, thelength, thespread, plainedgesbutton, edgepicker,
nodepicker, whichlabel, labelpicker, axesbutton, axespicker, fadeleavesbutton, showarrowsbutton, theoffsetX, theoffsetY,
thetextangle, thefontsize, thenodesize, thelinewidth, transparencybutton, automorph1, automorph2, thearrowsize,
thearrowratio, thearrowoffset, filledarrowsbutton, reversedarrowsbutton, fadedarrowsbutton, theaxislinewidth){

  this.name = 'FocusModel';
  this.themodeltype = themodeltype; // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  this.thevalency = thevalency; // int
  this.thelevels = thelevels; // int
  this.thescaling = thescaling; // float
  this.thelength = thelength; // float
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
  this.thetextangle = thetextangle;
  this.thefontsize = thefontsize; // int
  this.thenodesize = thenodesize; // float
  this.thelinewidth = thelinewidth; // float
  this.transparencybutton = transparencybutton; // boolean
  this.automorph1 = automorph1; // float
  this.automorph2 = automorph2; // float
  this.thearrowsize = thearrowsize; // float
  this.thearrowratio = thearrowratio; // float
  this.thearrowoffset = thearrowoffset; // float
  this.filledarrowsbutton = filledarrowsbutton; // boolean
  this.reversedarrowsbutton = reversedarrowsbutton; // boolean
  this.fadedarrowsbutton = fadedarrowsbutton; // boolean
  this.theaxislinewidth = theaxislinewidth; // float

 }

 // a method to draw a given model object:
 // set the page controls and then call setup, which reads those values and draws the graph
 drawModel(){
  $("#themodeltype").val(this.themodeltype); // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  $("#thevalency").val(this.thevalency); // int
  $("#thelevels").val(this.thelevels); // int
  $("#thescaling").val(this.thescaling); // float
  $("#thelength").val(this.thelength); // float
  $("#thespread").val(this.thespread); // float
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
  $("#theoffsetY").val(this.theoffsetY); // float
  $("#thetextangle").val(this.thetextangle); // float
  $("#thefontsize").val(this.thefontsize); // int
  $("#thenodesize").val(this.thenodesize); // float
  $("#thelinewidth").val(this.thelinewidth); // float
  $("#transparencybutton").prop("checked",(this.transparencybutton?true:false)); // boolean
  $("#automorph1").val(this.automorph1); // float
  $("#automorph2").val(this.automorph2); // float
  $("#thearrowsize").val(this.thearrowsize); // float
  $("#thearrowratio").val(this.thearrowratio); // float
  $("#thearrowoffset").val(this.thearrowoffset); // float
  $("#filledarrowsbutton").prop("checked",(this.filledarrowsbutton?true:false)); // boolean
  $("#reversedarrowsbutton").prop("checked",(this.reversedarrowsbutton?true:false)); // boolean
  $("#fadedarrowsbutton").prop("checked",(this.fadedarrosbutton?true:false)); // boolean
  $("#theaxislinewidth").val(this.theaxislinewidth); // float

  setup(this.themodeltype);
 }

 // a method to save the current set-up to a FocusModel object:
 saveCurrent(){
//  this.themodeltype = $("#themodeltype").val(); // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  this.thevalency = $("#thevalency").val(); // int
  this.thelevels = $("#thelevels").val(); // int
  this.thescaling = $("#thescaling").val(); // float
  this.thelength = $("#thelength").val(); // float
  this.thespread = $("#thespread").val(); // float
  this.plainedgesbutton = $("#plainedgesbutton").prop("checked"); // boolean
  this.edgepicker = $("#edgepicker").spectrum("get"); // colour
  this.nodepicker = $("#nodepicker").spectrum("get"); // colour
  this.whichlabel = $("#whichlabel").val(); // int
  this.labelpicker = $("#labelpicker").spectrum("get"); // colour
  this.axesbutton = $("#axesbutton").prop("checked"); // boolean
  this.axespicker = $("#axespicker").spectrum("get"); // colour
  this.fadeleavesbutton = $("#fadeleavesbutton").prop("checked"); // boolean
  this.showarrowsbutton = $("#showarrowsbutton").prop("checked"); // boolean
  this.theoffsetX = $("#theoffsetX").val(); // float
  this.theoffsetY = $("#theoffsetY").val(); // float
  this.thetextangle = $("#thetextangle").val(); // float
  this.thefontsize = $("#thefontsize").val(); // int
  this.thenodesize = $("#thenodesize").val(); // float
  this.thelinewidth = $("#thelinewidth").val(); // float
  this.transparencybutton = $("#transparencybutton").prop("checked"); // boolean
  this.automorph1 = $("#automorph1").val(); // float
  this.automorph2 = $("#automorph2").val(); // float
  this.thearrowsize = $("#thearrowsize").val(); // float
  this.thearrowratio = $("#thearrowratio").val(); // float
  this.thearrowoffset = $("#thearrowoffset").val(); // float
  this.filledarrowsbutton = $("#filledarrowsbutton").prop("checked"); // boolean
  this.reversedarrowsbutton = $("#reversedarrowsbutton").prop("checked"); // boolean
  this.fadedarrosbutton = $("#fadedarrowsbutton").prop("checked"); // boolean
  this.theaxislinewidth = $("#theaxislinewidth").val(); // float

 }
}

// function to save the current controls to a file (this is related to the FocusModel class, so is going here)
function saveToFile(){
 var params = new FocusModel;
 params.saveCurrent();
 var thejson = JSON.stringify(params);
// var theblob = new Blob([thejson], {type: "application/json"});
 var theblob = new Blob([thejson], {type: "text/plain"}); // easier to open and edit, perhaps

 var saveAs = window.saveAs;
 saveAs(theblob, "FocusModelSetup.txt");
}
