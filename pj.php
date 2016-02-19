<?php 
/*
 * ProdJudge Server 0.3
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.icosaedro.it/phplint/phplint-on-line.html>.
 */
/*. require_module 'standard';  # strlen(), fopen(), printf(), etc.
    require_module 'mysqli';     # MySQL extension
.*/
error_reporting(E_STRICT);

header('Content-Type: text/javascript');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

require_once 'Site.php';

$TP = 'pj_'; // Table Prefix

$db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);
$db->set_charset('UTF8');
$db->select_db(DB_NAME);
/*
 * Codes according to The Major System.
 * 0 = s, z, soft c
 * 1 = d, t, th
 * 2 = n
 * 3 = m
 * 4 = r
 * 5 = l
 * 6 = j, sh, soft ch, dg, soft g
 * 7 = k, hard ch, hard c, hard g, ng, qu 	
 * 8 = f, v
 * 9 = b, p
 * - = a, e, i, o, u, h, w, y
 */
define('GET_TOTAL_NO', 711152);
define('GET_AXIS',     71700);
define('GET_IMAGES',   71360);
define('GET_ANSWERS',  712040);
define('PUT_ANSWERS',  912040);

$cmd = 0;
if (isset($_REQUEST['cmd'])) {
    $cmd = (int)$_REQUEST['cmd'];
}
switch ($cmd) {
    case GET_TOTAL_NO:
        $inid = (int)$_REQUEST['inid'];
        $rs = $db->query(<<<EOD
SELECT count( `iid` ) AS total_no
FROM `{$TP}questions`
INNER JOIN `{$TP}questionsimages`
USING ( qid )
WHERE inid = $inid
EOD
        );
        echo '{';
        while ($obj = $rs->fetch_object()) {
            $total_no = $obj->total_no;
            echo '"total_no":"' . $total_no . '"';
            break;
        }
        echo '}';
        break;
    case GET_AXIS:
        $qid = (int)$_REQUEST['qid'];
        $rs = $db->query(<<<EOD
SELECT `text`, `frontispiece`, `dimension`, `left`, `right`
FROM `{$TP}questions`
INNER JOIN `{$TP}axis`
USING ( qid )
WHERE qid = $qid
EOD
        );
        echo '{';
        while ($obj = $rs->fetch_object()) {
            $question = $obj->text;
            $frontispiece = $obj->frontispiece;
            $dimension = $obj->dimension;
            $left = $obj->left;
            $right = $obj->right;
            echo '"question":"' . $question . '","frontispiece":"' . $frontispiece 
                . '","dimension":"' . $dimension . '","left":"' . $left . '","right":"' . $right . '"';
            break;
        }
        echo '}';
        break;
    case GET_IMAGES:
        $qid = (int)$_REQUEST['qid'];
        $rs = $db->query(<<<EOD
SELECT rand() AS rnd, iid, filename
FROM `{$TP}images`
INNER JOIN `{$TP}questionsimages`
USING ( iid )
WHERE qid = $qid
ORDER BY 1 ASC;
EOD
        );
        echo '{"iids":["';
        $iids = /*. (array[]int) .*/array();
        $filenames = /*. (array[]string) .*/array();
        while ($obj = $rs->fetch_object()) {
            array_push($iids, $obj->iid);
            array_push($filenames, $obj->filename);
        }
        echo join('","', $iids);
        echo '"],"filenames":["';
        echo join('","', $filenames);
        echo '"]}';
        break;
    case GET_ANSWERS:
        $uid = (int)$_REQUEST['uid'];
        $qid = (int)$_REQUEST['qid'];
        $rs = $db->query('SELECT email FROM '.$TP."users WHERE uid = $uid;");
        echo '{';
        while ($obj = $rs->fetch_object()) {
            $email = $obj->email;
            echo '"email":"' . $email . '"';
            break;
        }
        $rs = $db->query('SELECT iid, x, y FROM '.$TP.'imagesanswers '
                           . 'INNER JOIN '.$TP.'questionsusers '
                           . 'USING ( quid ) '
                           . "WHERE uid = $uid AND qid = $qid ORDER BY iid ASC;");
        echo ',"coords":[';
        $first = true;
        while ($obj = $rs->fetch_object()) {
            $iid = $obj->iid;
            $x = $obj->x;
            $y = $obj->y;
            if ($first) {
                $first = false;
            }
            else {
                echo ",\n";
            }
            echo '["' . $iid . '","' . $x . '","' . $y . '"]';
        }
        echo ']}';
        break;
    case PUT_ANSWERS:
        $qid = (int)$_REQUEST['qid'];
        $email = (string)$_REQUEST['email'];
        $rs = $db->query('SELECT uid FROM '.$TP."users WHERE email = '$email';");
        while ($obj = $rs->fetch_object()) {
            $uid = $obj->uid;
            break;
        }
        if (!isset($uid)) {
            $db->query('INSERT INTO '.$TP.'users (uid, email, firstname, lastname, password, level, sid)'
                    . " VALUES (NULL, '$email', '', '', '', 1, 1);");
            $uid = $db->insert_id;
            $db->query('INSERT INTO '.$TP.'particip (inid, uid)'
                            . " VALUES (1, $uid);");
        }
        $db->query('INSERT INTO '.$TP.'questionsusers (qid, uid)'
                        . " VALUES ($qid, $uid);");
        $quid = $db->insert_id;
        foreach ($_REQUEST as $key => $val) {
            if (strcmp(substr($key, 0, 2), 'pl') == 0) {
                $iid = (int)substr($key, 2);
                $x = (int)$_REQUEST['pl' . $iid];
                $y = (int)$_REQUEST['pt' . $iid];
                $db->query('INSERT INTO '.$TP.'imagesanswers (iaid, quid, iid, x, y)'
                            . " VALUES (NULL, $quid, $iid, $x, $y);");
            }
        }
        echo '{"uid":"'.(string)$uid.'"}';
        break;
    default:
        echo '{"error":"WARNING: All cracking attempts are automatically logged!"}';
        break;
}
if (isset($rs)) {
    $rs->close();
}
$db->close();
