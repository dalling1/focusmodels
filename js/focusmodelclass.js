class FocusModel {
 constructor(themodeltype, thevalency, thelevels, thescaling, thelength, thespread, plainedgesbutton, edgepicker, nodepicker, whichlabel, 
labelpicker, axesbutton, axespicker, fadeleavesbutton, showarrowsbutton, theoffsetX, theoffsetY, thetextangle, 
thefontsize, thenodesize, thelinewidth, transparencybutton, automorph1, automorph2, thearrowsize, thearrowratio, 
thearrowoffset, filledarrowsbutton, reversedarrowsbutton, fadedarrowsbutton, theaxislinewidth){

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

 // a method to draw a given model object
 drawModel(){
//  $("#name").val(this.name);
  $("#themodeltype").val(this.themodeltype); // string, only one of {'vertex','edge','axis','newaxis','monoray'}
  $("#thevalency").val(this.thevalency); // int
  $("#thelevels").val(this.thelevels); // int
  $("#thescaling").val(this.thescaling); // float
  $("#thelength").val(this.thelength); // float
  $("#thespread").val(this.thespread); // float
  $("#plainedgesbutton").prop("checked",(this.plainedgesbutton?"true":"false")); // boolean
  $("#edgepicker").val(this.edgepicker); // colour, eg "#990000"
  $("#nodepicker").val(this.nodepicker); // colour
  $("#whichlabel").val(this.whichlabel); // int
  $("#labelpicker").val(this.labelpicker); // colour
  $("#axesbutton").prop("checked",(this.axesbutton?"true":"false")); // boolean
  $("#axespicker").val(this.axespicker); // colour
  $("#fadeleavesbutton").prop("checked",(this.fadeleavesbutton?"true":"false")); // boolean
  $("#showarrowsbutton").prop("checked",(this.showarrowsbutton?"true":"false")); // boolean
  $("#theoffsetX").val(this.theoffsetX); // float
  $("#theoffsetY").val(this.theoffsetY); // float
  $("#thetextangle").val(this.thetextangle); // float
  $("#thefontsize").val(this.thefontsize); // int
  $("#thenodesize").val(this.thenodesize); // float
  $("#thelinewidth").val(this.thelinewidth); // float
  $("#transparencybutton").prop("checked",(this.transparencybutton?"true":"false")); // boolean
  $("#automorph1").val(this.automorph1); // float
  $("#automorph2").val(this.automorph2); // float
  $("#thearrowsize").val(this.thearrowsize); // float
  $("#thearrowratio").val(this.thearrowratio); // float
  $("#thearrowoffset").val(this.thearrowoffset); // float
  $("#filledarrowsbutton").prop("checked",(this.filledarrowsbutton?"true":"false")); // boolean
  $("#reversedarrowsbutton").prop("checked",(this.reversedarrowsbutton?"true":"false")); // boolean
  $("#fadedarrowsbutton").prop("checked",(this.fadedarrosbutton?"true":"false")); // boolean
  $("#theaxislinewidth").val(this.theaxislinewidth); // float

  setup(this.themodeltype);
 }
}
