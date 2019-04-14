const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', (req, res, next) => {
  res.render('dashboard', { title: 'Dashboard'});
});

module.exports = router;
