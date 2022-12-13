var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');

const ERROR_OCURRED = 'An error ocurred';
const USER_DELETED = 'User deleted succesfully';
const USER_NOT_FOUND = 'User was not found';
const USER_ALREADY_EXISTS = 'User already exists';

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    res.json(users);
  })
});

/* POST user. */
router.post('/', async function (req, res, next) {
  var email = req.body.email;
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    res.send(USER_ALREADY_EXISTS);
  } else {
    req.body = sanitizeUser(req.body);
    var user = User({
      _id: mongoose.Types.ObjectId(),
      nombre: req.body.nombre,
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
      secondName: req.body.secondName,
      secondSurname: req.body.secondSurname,
      surname: req.body.surname
    });
    user.save((err, user) => {
      if (err) {
        console.log(ERROR_OCURRED, err); 
      } else {
        res.send(user);
      }
    });
  }
});

/* PATCH user to update. */
router.patch('/:id', async function (req, res, next) {
  var userId = req.params.id;
  var foundUser = await User.findOne({ _id: userId });
  if (foundUser) {
    if (req.body.nombre) foundUser.nombre = req.body.nombre;
    if (req.body.email) foundUser.email = req.body.email;
    if (req.body.name) foundUser.name = req.body.name;
    if (req.body.password) foundUser.password = req.body.password;
    if (req.body.phone) foundUser.phone = req.body.phone;
    if (req.body.secondName) foundUser.secondName = req.body.secondName;
    if (req.body.secondSurname) foundUser.secondSurname = req.body.secondSurname;
    if (req.body.surname) foundUser.surname = req.body.surname;

    await foundUser.save();

    res.send(foundUser);
  } else {
    res.send(404, USER_NOT_FOUND);
  }
});

/* POST user to update. */
router.post('/:id', async function (req, res, next) {
  if (req.query.isDelete) {
    User.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        res.send(500, ERROR_OCURRED + err);
      } else {
        res.redirect('../users');
      }
    })
  } else if (req.query.isEdit) {
    var editedUser = await User.findOne({ _id: req.params.id });
    req.body = sanitizeUser(req.body);
    editedUser.nombre = req.body.nombre;
    editedUser.email = req.body.email;
    editedUser.name = req.body.name;
    editedUser.password = req.body.password;
    editedUser.phone = req.body.phone;
    editedUser.secondName = req.body.secondName;
    editedUser.secondSurname = req.body.secondSurname;
    editedUser.surname = req.body.surname;
    editedUser.save((err, user) => {
      if (err) {
        console.log(500, ERROR_OCURRED + err);
      } else {
        res.redirect('../users');
      }
    });
  }
});

/* Delete user. */
router.delete('/:id', async function (req, res, next) {
  User.findByIdAndDelete(req.params.id, (err) =>{
    if (err) {
      res.send(500, ERROR_OCURRED + err);
    } else {
      res.json({data: 'Deleted user'});
    }
  })
});

/**
 * @description Sanitiza el body para eliminar atributos invalidos
 * @param {body} reqBody body del query
 * @returns body sanitizado
 */
function sanitizeUser(reqBody) {
  if (reqBody.secondName === '') delete reqBody.secondName;
  if (reqBody.secondSurname === '') delete reqBody.secondSurname;

  return reqBody
}

module.exports = router;
