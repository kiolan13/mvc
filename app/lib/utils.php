<?php
namespace app\lib;

class Utils {
	static function log($strData){
		$handler = fopen('log.txt', 'a');
		$strData = date('h:i:s') . '  ' . $strData . ' ' . "\n"; 
		$result = fwrite($handler, $strData);
	}

	static function clearlog(){
		$handler = fopen('log.txt', 'w');
		$result = fwrite($handler, "");
	}
}
