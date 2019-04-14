const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', (req, res, next) => {
  res.render('dashboard', { title: 'Dashboard'});
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login page'});
});

router.post('/login', (req, res, next) => {
  res.render('login', { title: 'Login page'});
});

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register page'});
});

router.post('/register', (req, res, next) => {
  res.render('register', { title: 'Register page'});
});

router.get('/places', (req, res, next) => {
  res.render('places', { title: 'Register page'});
});

router.get('/profile', (req, res, next) => {
  res.render('profile', { title: 'Register page'});
});

router.post('/profile', (req, res, next) => {
  res.render('profile', { title: 'Register page'});
});

router.get('/password', function(req, res, next) {
  res.render('password', { title: 'Change password' });
});

router.get('/users', (req, res, next) => {
  res.render('users', { title: 'Register page'});
});

router.get('/logout', (req, res, next) => {
  res.render('login', { title: 'Register page'});
});

module.exports = router;
