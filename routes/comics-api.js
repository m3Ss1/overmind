const express = require('express');
const router = express.Router();

let Comic = require('../models/Comic');

router.use(function timeLog(req, res, next) {
  let date = new Date();
  console.log(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    "[" + req.method + "] " + req.url);
  next()
});

/* GET all comics */
router.get('/', function (req, res) {
  Comic.find(function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort([['publisher', -1], ['serie_title', 1], ['serie_number', 1]]);
});

/* GET all missing comics */
router.get('/missing', function (req, res) {
  Comic.find({
      'in_collection': false
    }, function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort([['publisher', -1], ['serie_title', 1], ['serie_number', 1]]);
});

/* GET comics by Serie ID */
router.get('/bySerie/:serieId', function (req, res) {
  Comic.find({
    'serie_title': req.params.serieId
  }, function (err, comics) {
    if (err) res.send(err);
    res.send(comics);
  }).sort([['publisher', -1], ['serie_number', 1]]);
});

/* GET distinct series, total and read count */
router.get('/seriesCount', function (req, res) {
  Comic.aggregate(
    [
      // Grouping
      {"$group": {
          "_id": "$serie_title",
          "total": {"$sum": 1},
          "read": {"$sum": {"$cond": [{"$eq": ["$read", true]}, 1, 0]}},
          "archived": {"$sum": {"$cond": [{"$eq": ["$archived", true]}, 1, 0]}}
      }},
      // Sorting
      {"$sort": {"_id": 1}}
    ], function (err, titles) {
      if (err) res.send(err);
      res.send(titles);
    });
});

/* CREATE comic */
router.post('/add', function (req, res) {
  let comic = req.body;
  Comic.create(comic, function (err, newComic) {
    if (err) res.send(err);
    res.send(newComic);
  });
});

/* UPDATE comic */
router.put('/update', function (req, res) {
  let comic = req.body;
  Comic.update(
    {_id: comic._id},
    {$set: comic},
    function (err, comic) {
      if (err) res.send(err);
      res.send(comic);
    });
});

/* DELETE comic */
router.delete('/delete/:id', function (req, res) {
  let comicId = req.params.id;
  Comic.deleteOne({_id: comicId}, function (err) {
    if (err) res.send(err);
    res.send({'status': 'ok'});
  });
});

module.exports = router;
