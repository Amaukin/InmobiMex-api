var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Property = require('../models/property');

const ERROR_OCURRED = 'An error ocurred';
const PROPERTY_DELETED = 'Property deleted succesfully';
const PROPERTY_NOT_FOUND = 'Property was not found';
const PROPERTY_ALREADY_EXISTS = 'Property already exists';

/* GET properties listing. */
router.get('/', function(req, res, next) {
  Property.find({}, function(err, properties) {
    res.json(properties);
  })
});

/* GET specific property. */
router.get('/:id', function(req, res, next) {
  Property.findById(req.params.id).populate('owner').exec( function (err, property) {
    if (err) console.log(err);
    res.json(property);
  })
});

/* POST property. */
router.post('/', async function (req, res, next) {
  var _id = req.body._id;
  console.log('q hay viejo', req.body);
  const foundProperty = await Property.findOne({ _id });
  if (foundProperty) {
    res.send(PROPERTY_ALREADY_EXISTS);
  } else {
    req.body = sanitizeProperty(req.body);
    var property = Property({
      _id: req.body.owner._id,
      address: req.body.address,
      bathroomQuantity: req.body.bathroomQuantity,
      description: req.body.description,
      garageQuantity: req.body.garageQuantity,
      images: req.body.images,
      isFurnished: req.body.isFurnished,
      leaseType: req.body.leaseType,
      price: req.body.price,
      roomQuantity: req.body.roomQuantity,
      services: req.body.services,
      surface: req.body.surface,
      title: req.body.title,
      owner: req.body.owner,
    });
    property.save((err, property) => {
      if (err) {
        console.log(ERROR_OCURRED, err); 
      } else {
        res.send(property);
      }
    });
  }
});

/* PATCH property to update. */
router.patch('/:id', async function (req, res, next) {
  var propertyId = req.params.id;
  var foundProperty = await Property.findOne({ _id: propertyId });
  if (foundProperty) {
    if (req.body.address) foundProperty.address = req.body.address;
    if (req.body.bathroomQuantity) foundProperty.bathroomQuantity = req.body.bathroomQuantity;
    if (req.body.description) foundProperty.description = req.body.description;
    if (req.body.garageQuantity) foundProperty.garageQuantity = req.body.garageQuantity;
    if (req.body.images) foundProperty.images = req.body.images;
    if (req.body.isFurnished) foundProperty.isFurnished = req.body.isFurnished;
    if (req.body.leaseType) foundProperty.leaseType = req.body.leaseType;
    if (req.body.price) foundProperty.price = req.body.price;
    if (req.body.roomQuantity) foundProperty.roomQuantity = req.body.roomQuantity;
    if (req.body.services) foundProperty.services = req.body.services;
    if (req.body.surface) foundProperty.surface = req.body.surface;
    if (req.body.title) foundProperty.title = req.body.title;
    if (req.body.owner) foundProperty.owner = req.body.owner;

    await foundProperty.save();

    res.send(foundProperty);
  } else {
    res.send(404, PROPERTY_NOT_FOUND);
  }
});

/* Delete property. */
router.delete('/:id', async function (req, res, next) {
  Property.findByIdAndDelete(req.params.id, (err) =>{
    if (err) {
      res.send(500, ERROR_OCURRED + err);
    } else {
      res.json({status: PROPERTY_DELETED});
    }
  })
});

/**
 * @description Sanitiza el body para eliminar atributos invalidos
 * @param {body} reqBody body del query
 * @returns body sanitizado
 */
function sanitizeProperty(reqBody) {
  if (reqBody.bathroomQuantity === '') delete reqBody.bathroomQuantity;
  if (reqBody.garageQuantity === '') delete reqBody.garageQuantity;
  if (reqBody.roomQuantity === '') delete reqBody.roomQuantity;
  if (reqBody.services === '') delete reqBody.services;
  if (reqBody.surface === '') delete reqBody.surface;
  
  return reqBody
}

module.exports = router;
