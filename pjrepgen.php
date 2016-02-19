<?php 
/*
 * ProdJudge Report Generator 0.1
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.icosaedro.it/phplint/phplint-on-line.html>.
 */
/*. require_module 'standard';  # strlen(), fopen(), printf(), etc.
    require_module 'mysqli';     # MySQL extension
.*/
error_reporting(E_STRICT);

// Output should follow RFC 4180 (CSV) <http://tools.ietf.org/html/rfc4180>.
header('Content-Type: text/csv; charset=utf-8; header=present'); // present|absent
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

require_once 'Site.php';

$TP = 'pj_'; // Table Prefix

$db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);
$db->set_charset('UTF8');
$db->select_db(DB_NAME);

$inid = 1; //(int)$_REQUEST['inid'];

echo "email";
$rs = $db->query(<<<EOD
SELECT qid
FROM `{$TP}questions`
WHERE inid = $inid
ORDER BY qid ASC;
EOD
);
while ($obj = $rs->fetch_object()) {
    $qid = $obj->qid;
    $rs2 = $db->query(<<<EOD
SELECT iid
FROM `{$TP}questionsimages`
WHERE qid = $qid
ORDER BY iid ASC;
EOD
    );
    while ($obj2 = $rs2->fetch_object()) {
        $iid = $obj2->iid;
        echo ",Q{$qid}P$iid";
    }    
}
echo "\r\n";

$rs = $db->query(<<<EOD
SELECT uid, email
FROM `{$TP}particip`
INNER JOIN `{$TP}users`
USING ( uid )
WHERE inid = $inid
ORDER BY email ASC;
EOD
);
while ($obj = $rs->fetch_object()) {
    $uid = $obj->uid;
    $email = $obj->email;
    echo "$email";
    $rs2 = $db->query(<<<EOD
SELECT qid
FROM `{$TP}questions`
WHERE inid = $inid
ORDER BY qid ASC;
EOD
    );
    while ($obj2 = $rs2->fetch_object()) {
        $qid = $obj2->qid;
        $rs3 = $db->query(<<<EOD
SELECT quid
FROM `{$TP}questions`
INNER JOIN `{$TP}questionsusers`
USING ( qid )
WHERE qid = $qid AND uid = $uid
ORDER BY stored DESC
LIMIT 1;
EOD
        );
        while ($obj3 = $rs3->fetch_object()) {
            $quid = $obj3->quid;
            break;
        }
        $rs4 = $db->query(<<<EOD
SELECT iid, x
FROM `{$TP}imagesanswers`
WHERE quid = $quid
ORDER BY iid ASC;
EOD
        );
        while ($obj4 = $rs4->fetch_object()) {
            $x = $obj4->x;
            echo ",$x";
        }
    }
    echo "\r\n";
}
