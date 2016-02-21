<?php 
/*
 * ProdJudge Image Resizer 0.0
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.icosaedro.it/phplint/phplint-on-line.html>.
 */
/*. require_module 'standard';  # strlen(), fopen(), printf(), etc.
    require_module 'gd';
    require_module 'mysqli';     # MySQL extension
.*/
error_reporting(E_STRICT);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

/*.void.*/ function imageResizer(/*.string.*/ $dir, /*.string.*/ $ext) {
    // Set a maximum height and width
    $dst_w_l = 200;
    $dst_h_l = 200;
    $dst_w_s = 48;
    $dst_h_s = 48;
    foreach (glob($dir) as $file) {    
        if (!is_dir($file)) {
            if (strcmp(substr($file, strrpos($file, '.')+1), $ext) == 0 && strrpos($file, '_l') === false && strrpos($file, '_s') === false) { 
                echo "$file ";
                $src_wh = /*.(array[int]int).*/getimagesize($file);
                $src_w = $src_wh[0];
                $src_h = $src_wh[1];
                if ($src_w > $src_h) {
                    $src_x = intval(($src_w - $src_h)/2);
                    $src_y = 0;
                }
                else {
                    $src_x = 0;
                    $src_y = intval(($src_h - $src_w)/2);
                }
                $src_w = $src_h = (int)min($src_w, $src_h);

                // Resample
                $dst_image_l = imagecreatetruecolor($dst_w_l, $dst_h_l);
                $src_image = imagecreatefromjpeg($file);
                imagecopyresampled($dst_image_l, $src_image, 0, 0, $src_x, $src_y, $dst_w_l, $dst_h_l, $src_w, $src_h);
                $filename = substr($file, 0, strrpos($file, '.'));
                if (imagejpeg($dst_image_l, $filename.'_l.jpg', 100)) {
                    echo 'l';
                }
                $dst_image_s = imagecreatetruecolor($dst_w_s, $dst_h_s);
                imagecopyresampled($dst_image_s, $src_image, 0, 0, $src_x, $src_y, $dst_w_s, $dst_h_s, $src_w, $src_h);
                if (imagejpeg($dst_image_s, $filename.'_s.jpg', 100)) {
                    echo 's';
                }
                echo "<br>\n";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>ProdJudge Image Resizer</title>
</head>
<body>
<?php
imageResizer('img/*', 'jpg');
?>
</body>
</html>