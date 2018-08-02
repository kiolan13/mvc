<?php

namespace app\models;

use app\lib\Utils;
use \Exception;
use \PDO;

interface ModelInterface
{
    public function __construct();
}

class Model
{
    public static $objDbLink;
    public static $arrData;
    public function __construct()
    {
        try {

            self::$objDbLink = new PDO('mysql:host=127.0.0.1;dbname=base', 'root', "");

            self::$objDbLink->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            if (!self::$objDbLink) {
                throw new Exception("Db link error", 1);
            }
        } catch (Exception $e) {
            Utils::log($e->getMessage());
        }
    }

    public function addProduct($arrData)
    {
        $strQuery       = "insert into products (name, price, description) values (:name, :price, :description)";

        try {

            $objStmt        = self::$objDbLink->prepare($strQuery);
            $arrReplacement = array(':name' => $arrData['name'], ':price' => $arrData['price'], ':description' => $arrData['description']);
            $boolResult     = $objStmt->execute($arrReplacement);

        } catch (PDOException $e) {

            Utils::log($e->getMessage());
        } 
        return;
    }
    public function selectList()
    {
        $strQuery = "Select * From products";
        $objStmt  = self::$objDbLink->prepare($strQuery);
        $objStmt->execute();
        //self::$arrData['selectList'] = $objStmt->fetchAll(PDO::FETCH_ASSOC);
        return $objStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function deleteById(int $intId)
    {
        $strQuery = "Delete from products where id = :id";
        try {
            $objStmt    = self::$objDbLink->prepare($strQuery);
            $boolResult = $objStmt->execute(array(":id" => $intId));

        } catch (PDOException $e) {

            Utils::log($e->getMessage());
        }

        return;
    }
    public function selectById(int $intId)
    {
        $strQuery = 'Select * from products where id = :id';
        try {
            $objStmt = self::$objDbLink->prepare($strQuery);
            $objStmt->execute(array(':id' => $intId));
            $arrResult = $objStmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            Utils::log($e->getMessage());
        }

        //Result of fetchAll is 2d array
        return $arrResult[0];
    }
    public function updateProduct($arrData)
    {
        $strQuery = 'Update products set name = :name, price = :price, description = :description where id = :id';
        try {
            $objStmt = self::$objDbLink->prepare($strQuery);
            $arrReplacement = array(':id' => $arrData['id'], ':name' => $arrData['name'], ':price' => $arrData['price'], ':description' => $arrData['description']);
            $objStmt->execute($arrReplacement);
        } catch (PDOException $e) {
            Utils::log($e->getMessage());
        }
    }
}
