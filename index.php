<?php

require_once('../../include/util.inc'); 
$labels = parse_aux_labels('MAS435');

$demos_json = <<<JSON
[
 ["misc_surf","Various surfaces",["sec-intro"]],
 ["holeycube","A cube with holes",[]],
 ["trefoil","Trefoil knot",["sec-intro"]], 
 ["torus_fold","Folding a square to make a torus",[]],
 ["R2Z2_eq_T","The torus as a quotient of the plane",[]],
 ["letters","Letters of the alphabet",["sec-intro"]],
 ["letters_grouped","Letters grouped by type",["sec-intro"]],
 ["cage","Cage with two or three holes",["sec-intro"]],
 ["simplices","Simplices",["sec-intro"]],
 ["barycentric","Barycentric coordinates",[]],
 ["ico_oct","Different triangulations of the sphere",["sec-intro"]],
 ["tri_square","The triangle and the square",["sec-intro"]],
 ["skeleta","Skeleta of simplices",["sec-intro"]],
 ["open","Open sets",["defn-metric-open"]],
 ["fem","Finite element model",["rem-fem"]],
 ["annulus","A cylinder is homeomorphic to an annulus",["eg-radial"]],
 ["stereo","Stereographic projection",["eg-stereo"]],
 ["RP1_eq_S1","\$\\\\mathbb{R}P^1\$ is homeomorphic to \$S^1\$",["eg-projective-one"]],
 ["two_discs","Gluing two discs to make a sphere",["eg-two-discs"]],
 ["sphere_loops","Loops on the sphere",[]],
 ["torus_loops","Loops on the torus",[]],
 ["trefoil_homotopy","A homotopy of the trefoil",[]],
 ["mobius_defn","Geometry of the Möbius strip",["eg-circles"]],
 ["mobius_homotopy","The Möbius strip and the circle",["eg-circles"]],
 ["R2_minus_0","The punctured plane",["eg-circles"]],
 ["S2_minus_1","The punctured sphere",[]],
 ["T_minus_1","The punctured torus",["rem-vk-torus"]],
 ["mobius_wrap","Wrapping an annulus",["eg-vk-proj"]],
 ["exp","The exponential map",[]],
 ["exp_cover","The exponential map is a covering",["prop-exp-covering"]],
 ["exp_lift","Path lifting",["prop-path-lifting"]],
 ["tetra_bdy","Boundary of a tetrahedron",["eg-simplex-boundary"]],
 ["tetra_subdiv","Barycentric subdivision of a tetrahedron",["eg-simplex-subdiv"]],
 ["mu","The map \$\\\\mu\\\\colon|K'|\\\\to|K|\$",["eg-mu"]]
]
JSON;

$ex_demos_json = <<<JSON
[
 ["ex_cech","Cech nerve",[]],
 ["ex_sketch_spaces_i","Pictures of various spaces",[]], 
 ["ex_triangulate_cube","A triangulation of the cube",[]]
]
JSON;

$demos0 = json_decode($demos_json);

$demos = array();

foreach($demos0 as $d0) {
 $d = new stdClass();
 $demos[] = $d;
 $d->name = $d0[0];
 $d->title = $d0[1];
 $d->refs = array();
 foreach($d0[2] as $label) {
  $d->refs[] = $labels[$label];
 }
 $d->ref_string = implode(', ', $d->refs);
 $d->html = <<<HTML
 <tr>
  <td width="300px"><a href="{$d->name}.html">{$d->title}</a></td>
  <td width="250px">{$d->ref_string}</td>
 </tr>

HTML;
}

$num_demos = count($demos);
$num_rows = ceil($num_demos / 2);

echo <<<HTML

<html>
 <head>
  <style type="text/css" media="screen">
   @import url(algtop_demo.css);
   
   table#A {
    position: absolute;
    left: 50px;
    top: 70px;
   }
   
   table#B {
    position: absolute;
    left: 680px;
    top: 70px;
   }
     
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js"> 
   MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX","output/HTML-CSS"],
    tex2jax: {inlineMath: [["$","$"]]}
   });
  </script> 
 </head>
 <body>
  <div id="frame">
   <div  style="margin-left:50px;">
    <h1>Interactive pages for Algebraic Topology</h1>
    <table id="A" class="edged">

HTML;

$i = 0;
while ($i < $num_rows) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
    <table id ="B" class="edged">

HTML;

while ($i < $num_demos) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
   </div>
  </div>
 </body>
</html>

HTML;
