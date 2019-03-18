const express = require('express');
const router = express.Router();

let MtgSet = require('../models/MtgSet');
let MtgCard = require('../models/MtgCard');
let MtgDeck = require('../models/MtgDeck');

router.use(function timeLog(req, res, next) {
  let date = new Date();
  console.log(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    "[" + req.method + "] " + req.url);
  next()
});

/* CREATE deck */
router.post('/deck/add', function (req, res) {
  let deck = req.body;
  MtgDeck.updateOne(
    {name: deck.name},
    {$set: deck},
    {upsert: true},
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    });
});

/* DELETE deck */
router.post('/deck/delete', function (req, res) {
  MtgDeck.deleteOne({_id: req.body._id}, function (err) {
    if (err) res.send({status: 'delete set error'});
    res.send({status: 'ok'});
  });
});

/* GET all decks */
router.get('/deck/all', function (req, res) {
  MtgDeck.find({}, function (err, sets) {
    if (err) res.send(err);
    res.send(sets);
  }).sort([['name', 1]]);
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
  MtgSet.find({
    $where: 'this.code.length == 3'
  }, function (err, sets) {
    if (err) res.send(err);
    res.send(sets);
  }).sort([['released_at', -1]]);
});

/* GET only not in SET cards */
router.get('/card/notInSet', function (req, res) {
  MtgSet.find(function (err, sets) {
    var codes = [];
    for (const set of sets) {
      codes.push(set.code);
    }
    console.log(codes);
    MtgCard.find({set: {$nin: codes}}, function (err, comics) {
      if (err) res.send(err);
      res.send(comics);
    });
  });
});

/* GET cards by set code */
router.get('/card/filter/:setCode/:rarity/:onlyMissing', function (req, res) {

  let setCode = req.params.setCode;
  let rarity = req.params.rarity;
  let onlyMissing = req.params.onlyMissing;

  let customFilter = {};

  if (setCode === 'all') {
    customFilter['$where'] = 'this.set.length == 3'
  } else if (setCode === 'tokens') {
    customFilter['$where'] = 'this.set.length == 4'
  } else {
    customFilter['set'] = setCode;
  }

  if (rarity !== 'all') {
    customFilter['rarity'] = rarity;
  }

  if (onlyMissing === 'true') {
    customFilter['$or'] = [{collection_count: 0}, {collection_count: null}, {collection_count: {$exists: false}}];
  }

  MtgCard.find(customFilter, function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort({'released_at': -1, 'set': 1, 'display_number': 1});
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
  cards.forEach(function (card) {
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
