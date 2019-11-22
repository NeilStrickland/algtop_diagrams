<?php

$shapes = array(
 'boys' => array('Boys surface',10),
 'boys2' => array('Boys surface 2',10),
 'cyl' => array('Cylinder',10),
 'holeycube' => array('Holey cube',20),
 'icos' => array('Icosahedron',5),
 'klein' => array('Klein bottle',80),
 'mobius' => array('Mobius strip',20),
 'nonmanifold' => array('Non-manifold',8),
 'simptor' => array('Simplicial torus',10),
 'sphere' => array('Sphere',5),
 'torus' => array('Torus',16),
 'triple_torus' => array('Triple torus',40)
);

$shapes_json = json_encode($shapes);

$key = 'torus';

if (isset($_REQUEST['key'])) {
 $key = $_REQUEST['key'];
 if (! isset($shapes[$key])) {
  $key = 'torus';
 }
}

$name = $shapes[$key][0];
$dist = $shapes[$key][1];
$shapes_json = json_encode($shapes);

$script = <<<JS
var shapes = $shapes_json;
var key = '$key';
JS;

echo <<<HTML
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$name</title>

  <style>
   html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
   }

   #renderCanvas {
    width: 100%;
    height: 100%;
    touch-action: none;
   }
  </style>

  <script src="https://preview.babylonjs.com/babylon.js"></script>
  <script src="https://preview.babylonjs.com/loaders/babylon.objFileLoader.js"></script>
  <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
  <script src="https://preview.babylonjs.com/gui/babylon.gui.min.js"></script>
</head>

<body>
 <canvas id="renderCanvas" touch-action="none"></canvas>

 <script>
  $script;
  var shape = shapes[key];
  var title = shape[0];
  var dist = shape[1];

  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var addAction = function(b,k) {
   b.onPointerClickObservable.add(function() {
    document.location = 'show.php?key=' + k;
   })
  }

  var createScene = function () {
   var scene = new BABYLON.Scene(engine);
   var camera = new BABYLON.ArcRotateCamera("Camera",0,0,dist, new BABYLON.Vector3(0,0,0), scene);
   camera.attachControl(canvas, true);

   var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
   var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

   var result = BABYLON.SceneLoader.Append("./obj/",key + '.obj',scene);

   var mat = new BABYLON.StandardMaterial("mat", scene);
   mat.backFaceCulling = false;
   mat.diffuseColor  = new BABYLON.Color3(0.30, 0.30, 0.60);
   
   var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
   var panel = new BABYLON.GUI.StackPanel();
   gui.addControl(panel);   
   panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
   panel.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

   var shapes = $shapes_json;

   for (k in shapes) {
    var s = shapes[k][0];
    var n = "btn_" + k;
    var button = new BABYLON.GUI.Button(n);
    button.width = "150px";
    button.height = "30px";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.background = (k == key) ? "grey" : "white";
    panel.addControl(button);     

    var textBlock = new BABYLON.GUI.TextBlock(n + '_text',s);
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock.paddingLeft = "10px";
    button.addControl(textBlock);  

    addAction(button,k);
   }

   scene.ambientColor = new BABYLON.Color3(1, 1, 1);

   return scene;
  };

  var scene = createScene();

  var z = 1;

  engine.runRenderLoop(function () {
   scene.render(); 
   var zz = z;
   var m = scene.getMeshByName('object0');
   if (zz && m) {
    console.log('Setting material');
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.backFaceCulling = false;
    mat.diffuseColor  = new BABYLON.Color3(0.30, 0.30, 0.60);
    m.material = mat;
    z = 0;
   }
  });

  window.addEventListener("resize", function () { engine.resize(); });
 </script>
</body>
</html>
HTML;
