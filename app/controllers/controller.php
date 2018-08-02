<?php

use app\lib\Utils;
use app\models\Model;
use app\views\View;

interface ControllerInterface
{
}

class Controller implements ControllerInterface
{

    protected static $objModel;
    protected static $objView;

    public function __construct()
    {
        self::$objModel = new Model();
        self::$objView  = new View(self::$objModel);
    }

}
class IndexController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

}
class AdminController extends Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->menu();

    }
    public function init()
    {

    }
    public function menu()
    {
        self::$objView->menu();

    }
    public function create()
    {
        self::$objView->drawCreate();

    }
    function list() {

        $arrList = self::$objModel->selectList();
        self::$objView->drawList($arrList);

    }
    public function addProduct()
    {
        $arrPost = self::postValidation("addProduct error");

        self::$objModel->addProduct($arrPost);
    }
    public function deleteById()
    {
        $arrPost = self::postValidation("deleteById error");
        $intId = $arrPost['id'];
        self::$objModel->deleteById($intId);
        $arrList = self::$objModel->selectList();
        self::$objView->drawList($arrList);
    }

    public function editById()
    {

        $arrPost = self::postValidation("editById error");
        $intId = $arrPost['id'];
        $arrItem = self::$objModel->selectById($intId);
        self::$objView->drawEdit($arrItem);

    }
    public function updateProduct()
    {
        $arrPost = self::postValidation();
        self::$objModel->updateProduct($arrPost);

    }
    public static function postValidation($strMessage)
    {
        try {
            if (!$_POST) {
                throw new Exception($strMessage, 1);

            }
        } catch (Exception $e) {
            Utils::log($e->getMessage());
        }
        return $_POST;
    }

}
