function demoOne(){
 // change the values of the controls and then call setup(), which sets the control output labels and then draws the graph
 $("#thevalency").val(3);
 $("#thelevels").val(6);
 $("#thescaling").val(0.8);
 $("#thelength").val(1.3);
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
 setup("edge");
}

function demoTwo(){
 // same example as demoOne() but using the FocusModel class
 var demo2 = new FocusModel();
 demo2.themodeltype = "edge";
 demo2.thevalency = 4;
 demo2.thelevels = 5;
 demo2.thescaling = 0.8;
 demo2.thelength = 1.3;
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

 demo2.drawModel();
}
