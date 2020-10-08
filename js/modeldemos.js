/*
 Three (so far) examples of graphs.  Different ways of specifying the model are used for illustration.

 The third version uses the output from the "Save setup" file and is probably the most useful if further demos are added.
*/


function demoOne(){
 // change the values of the controls and then call setup(), which sets the control output labels and then draws the graph
 $("#themodeltype").val("edge");
 $("#thevalency").val(3);
 $("#thelevels").val(6);
 $("#theedgescaling").val(0.8);
 $("#theoverallscale").val(1.3);
 $("#thespread").val(1.8);
 $("#plainedgesbutton").prop("checked",true);
 $("#edgepicker").spectrum("set","#000000");
 $("#nodepicker").spectrum("set","#990000");
 $("#whichlabel").val(1);
 $("#labelpicker").spectrum("set","#2244ff");
 $("#axesbutton").prop("checked",false);
 $("#axespicker").spectrum("set","#3399ff");
 $("#fadeleavesbutton").prop("checked",true);
 $("#showarrowsbutton").prop("checked",false);
 $("#theoffsetX").val(0);
 $("#theoffsetY").val(0);
 $("#thelabeloffsetX").val(11);
 $("#thelabeloffsetY").val(8);
 $("#thetextangle").val(0);
 $("#thefontsize").val(10);
 $("#thenodesize").val(4);
 $("#thelinewidth").val(1.3);
 $("#transparencybutton").prop("checked",false);
 $("#automorph1").val("");
 $("#automorph2").val("");
 $("#thearrowsize").val(3);
 $("#thearrowratio").val(2);
 $("#thearrowoffset").val(0.3);
 $("#filledarrowsbutton").prop("checked",true);
 $("#reversedarrowsbutton").prop("checked",false);
 $("#fadedarrowsbutton").prop("checked",false);
 $("#theaxislinewidth").val(0.2);
 $("#nodesontopbutton").prop("checked",true);
 $("#theskipstart").val(0);
 $("#theskipnodes").val(0);
 drawgraph();
}

function demoTwo(rundemo = false){
 // same example as demoOne() but using the FocusModel class
 var demo2 = new FocusModel();
 demo2.themodeltype = "edge";
 demo2.thevalency = 4;
 demo2.thelevels = 5;
 demo2.theedgescaling = 0.8;
 demo2.theoverallscale = 1.3;
 demo2.thespread = 1.8;
 demo2.plainedgesbutton = true;
 demo2.edgepicker = "#ffcc00";
 demo2.nodepicker = "#990000";
 demo2.whichlabel = 0;
 demo2.labelpicker = "#2244ff";
 demo2.axesbutton = false;
 demo2.axespicker = "#3399ff";
 demo2.fadeleavesbutton = true;
 demo2.showarrowsbutton = true;
 demo2.theoffsetX = 0;
 demo2.theoffsetY = 0;
 demo2.thelabeloffsetX = 0;
 demo2.thelabeloffsetY = 0;
 demo2.thetextangle = 0;
 demo2.thefontsize = 10;
 demo2.thenodesize = 4;
 demo2.thelinewidth = 1.3;
 demo2.transparencybutton = false;
 demo2.automorph1 = "";
 demo2.automorph2 = "";
 demo2.thearrowsize = 3;
 demo2.thearrowratio = 2;
 demo2.thearrowoffset = 0.3;
 demo2.filledarrowsbutton = true;
 demo2.reversedarrowsbutton = false;
 demo2.fadedarrowsbutton = false;
 demo2.theaxislinewidth = 0.2;
 demo2.nodesontopbutton = true;
 demo2.theskipstart = 0;
 demo2.theskipnodes = 0;

 // actually draw the example graph?
 if (rundemo){
  demo2.drawModel();
 }

 return demo2;
}

function demoThree(){
 // this is the output from the "Save setup" .json file (with slashes added to the quotation marks):
 var demo3 = "{\"name\":\"FocusModel\",\"themodeltype\":\"vertex\",\"initialfocus\":[\"\"],\"thevalency\":5,\"thewidth\":3,\"thelevels\":3,\"theedgescaling\":0.4,\"theoverallscale\":1.7,\"thespread\":0.5,\"plainedgesbutton\":true,\"edgepicker\":\"#000000\",\"nodepicker\":\"#ffffff\",\"whichlabel\":1,\"labelpicker\":\"#d01c1c\",\"axesbutton\":false,\"axespicker\":\"#888888\",\"fadeleavesbutton\":false,\"showarrowsbutton\":false,\"theoffsetX\":0,\"theoffsetY\":0,\"thelabeloffsetX\":0,\"thelabeloffsetY\":0,\"thetextangle\":0,\"thefontsize\":10,\"thenodesize\":10,\"thelinewidth\":0.2,\"transparencybutton\":false,\"automorph1\":null,\"automorph2\":null,\"thearrowsize\":3,\"thearrowratio\":2,\"thearrowoffset\":0.3,\"filledarrowsbutton\":true,\"reversedarrowsbutton\":false,\"fadedarrowsbutton\":true,\"theaxislinewidth\":0.2,\"nodesontopbutton\":true,\"theskipstart\":0,\"theskipnodes\":0,\"nodeLabel\":[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"],\"edgeLabel\":[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"],\"edgeLabelOffsets\":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],\"nodeLabelOffsets\":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]}";
 var demoModel = Object.assign(new FocusModel, JSON.parse(demo3));
 demoModel.drawModel();
}
