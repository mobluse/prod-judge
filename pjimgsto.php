<?php 
/*
 * ProdJudge Image Storer 0.0
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.icosaedro.it/phplint/phplint-on-line.html>.
 */
/*. require_module 'standard';  # strlen(), fopen(), printf(), etc.
    require_module 'mysqli';     # MySQL extension
.*/
error_reporting(E_STRICT);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

require_once 'Site.php';

$TP = 'pj_'; // Table Prefix

$db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);
$db->set_charset('UTF8');
$db->select_db(DB_NAME);

/*.void.*/ function imageStorer(/*.string.*/ $dir, /*.string.*/ $ext) {
    global $TP, $db;
    foreach (glob($dir) as $file) {    
        if (!is_dir($file)) {
            if (strcmp(substr($file, strrpos($file, '.')+1), $ext) == 0 && strrpos($file, '_s.'.$ext) > 0) {
                $filename = substr($file, 0, strrpos($file, '_'));
                $filename = substr($filename, strrpos($filename, '/')+1);
                echo "$filename<br>\n";
                // $filename = mb_convert_encoding($filename, 'UTF-8', 'ISO-8859-1');
                $db->query('INSERT INTO '.$TP.'images (iid, filename)'
                        . " VALUES (NULL, '$filename');");
                $iid = $db->insert_id;
                $db->query('INSERT INTO '.$TP.'questionsimages (qid, iid)'
                        . " VALUES (1, $iid);");
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>ProdJudge Image Storer</title>
</head>
<body>
<?php
imageStorer('img/*', 'jpg');
$db->close();
?>
</body>
</html>