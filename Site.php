<?php
function define_constants($constants, $values) {
	$i = 0;
	foreach($constants as $constant) {
		define((string)$constant, $values[$i++]);
	}
}

define_constants(array('DB_SERVER', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'), 
	array('localhost', 'domain_com', 'db_password', 'domain_com'));
?>
