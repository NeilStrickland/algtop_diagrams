<?php

if (isset($_REQUEST['key'])) {
 $key = $_REQUEST['key'];
 $key = preg_replace("/[^_A-Za-z0-9 -]/", '', $key);
}

echo <<<HTML
<html>
 <head>
  <style type="text/css">
   .video-container {
    position:relative;
    padding-bottom:56.25%;
    padding-top:30px;
    height:0;
    overflow:hidden;
   }

   .video-container iframe {
    position:absolute;
    top:0;
    left:0;
    width:90%;
    height:90%;
   }
  </style>
 </head>
 <body>
  <div class="video-container">
   <iframe
    src="https://www.youtube.com/embed/$key"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
   </iframe>
  </div>
 </body>
</html>

HTML
 ;
