const express = require('express');
const router = express.Router();

let MtgSet = require('../models/MtgSet');
let MtgCard = require('../models/MtgCard');

router.use(function timeLog(req, res, next) {
  let date = new Date();
  console.log(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    "[" + req.method + "] " + req.url);
  next()
});

/* CREATE set */
router.post('/set/add', function (req, res) {
  let set = req.body;
  MtgSet.updateOne(
    {name: set.name},
    {$set: set},
    {upsert: true},
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    });
});

/* GET all sets */
router.get('/set/all', function (req, res) {
  MtgSet.find(function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort([['released_at', -1]]);
});


/* GET cards by set code */
router.get('/card/bySet/:setCode', function (req, res) {
  MtgCard.find({
    set: req.params.setCode
  }, function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort([['display_number', 1]]);
});

/* UPDATE card */
router.put('/card/update', function (req, res) {
  let mtgCard = req.body;
  MtgCard.updateOne(
    {_id: mtgCard._id},
    {$set: mtgCard},
    function (err, updatedCard) {
      if (err) res.send(err);
      res.send(updatedCard);
    });
});

/* CREATE card */
router.post('/card/add/all', function (req, res) {
  let cards = req.body;
  let okCount = 0;
  let errorsCount = 0;
  cards.forEach(function(card) {
    MtgCard.updateOne(
      {id: card.id},
      {$set: card},
      {upsert: true},
      function (err, result) {
        if (err) errorsCount++;
        okCount++;
        if (okCount === cards.length) {
          res.send({status: 'ok'});
        }
      });
  });
});

/* DELETE card */
router.delete('/card/delete/:setCode', function (req, res) {
  let setCode = req.params.setCode.toLowerCase();

  MtgCard.deleteMany({set: setCode}, function (err) {
    if (err) res.send({status: 'delete cards error'});
    res.send({status: 'ok'});
  });
});

/* DELETE set */
router.delete('/set/delete/:setCode', function (req, res) {
  let setCode = req.params.setCode.toLowerCase();

  MtgSet.deleteOne({code: setCode}, function (err) {
    if (err) res.send({status: 'delete set error'});
    res.send({status: 'ok'});
  });
});

module.exports = router;
