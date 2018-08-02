<?php

use app\lib\Request;

interface CoreInterface
{

    public function init();

}





class Core implements CoreInterface
{
    //Controller $controller
    public $objRequest;

    public function __construct()
    {

        $this->init();

    }
    public function init()
    {

        $this->objRequest = new Request();
    }

}