<?php
namespace app\lib;
use app\lib\Utils;
use \Exception;

class Request
{
    public function __construct()
    {
        $this->init();
    }

    public function init()
    {
        global $argv;
        if ($argv) {
            echo $argv[1];
            return;
        }
        $strRawRoute         = "";
        $strControllerName   = "";
        $strControllerMethod = "";
        $arrRouteParts       = [];
        $objController       = null;

        $strRawRoute   = $_SERVER['REQUEST_URI'];
        $arrRouteParts = explode('/', $strRawRoute);

        $strControllerName = $arrRouteParts[1] . 'Controller';

        try {
            if (class_exists($strControllerName)) {
                $objController = new $strControllerName();
                
                if (count($arrRouteParts) > 2) {
                    $strControllerMethod = $arrRouteParts[2];
                                
                    if(method_exists($objController, $strControllerMethod)){
                        $objController->$strControllerMethod();
                    } else {
                        throw new Exception("Method doesnt exist", 1);
                        
                    }
                }

            } else {
                throw new Exception("Controller's class does'nt exist", 1);

            }

        } catch (Exception $e) {
            Utils::log($e->getMessage());
        }

        return;
    }
}
