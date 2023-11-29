const express = require('express');
const router =express.Router();
const multer =require('multer');
const path=require('path');

const AuthController = require('../projefinalBackend/authController');


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/dogrulama/:dogrulamaKodu',AuthController.authentication);
router.get('/getUsers/:username',AuthController.getUsers);

module.exports =router;