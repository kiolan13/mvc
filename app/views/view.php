<?php
namespace app\views;

use app\lib\Utils;
use app\models\Model;
use eftec\bladeone\BladeOne;
use \Exception;

interface ViewInterface
{
    public function __construct(Model &$objModel);
}

class View implements ViewInterface
{
    //Model $model
    public static $objModel;
    public static $objBlade;

    public function __construct(Model &$objModel)
    {

        self::$objModel = $objModel;

        define("BLADEONE_MODE", 1);
        $strRoot        = getcwd();
        $strTemplates   = $strRoot . "/templates";
        $strCache       = $strRoot . "/cache";
        self::$objBlade = new BladeOne($strTemplates, $strCache);

    }
    public function init()
    {

    }
    public function draw($strFileName)
    {
        $objHandler = fopen($strFileName, 'r');
        $strData    = fread($objHandler, filesize($strFileName));
        echo $strData;
    }
    public function menu()
    {
        echo self::$objBlade->run('menu');
    }
    public function drawCreate()
    {

        echo self::$objBlade->run('create');

    }
    public function drawList(array $arrData)
    {
        //$arrData = self::$objModel::$arrData;
       
        echo self::$objBlade->run('list', array('list' => $arrData));

    }
    public function drawEdit($arrData)
    {

        try {
            $strResult = self::$objBlade->run('update', array('intId' => $arrData['id'], 'strName' => $arrData['name'], 'doublePrice' => $arrData['price'], 'strDescription' => $arrData['description']));

            if (!$strResult) {
                throw new Exception('drawEdit error', 1);
            }
        } catch (Exception $e) {
            Utils::log($e->getMessage());
        }

        echo $strResult;
    }

}
