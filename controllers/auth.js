// Подключаем модель Country
const Country = require('models/country');

// Подключаем модель User
const User = require('models/user');

// Подключаем модуль ajv
const Ajv = require('ajv');

// Подключаем модуль bcrypt для хеширования паролей
const bcrypt = require('bcrypt');

// Подключаем модуль config
const config = require('config');

// Подключаем модуль json схемы profileJsonSchema
const ProfileJsonSchema = require('schemes/profile');

// Подключаем модуль json схемы passwordJsonSchema
const PasswordJsonSchema = require('schemes/password');

// Подключаем модуль json схемы loginJsonSchema
const LoginJsonSchema = require('schemes/login');

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /register методом GET
const registerView = async (req, res, next) => {
    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    // Передаем в шаблон название страницы, массив стран, данные из формы, текст ошибки
    res.render('register', { title: 'Register page', countries: countries, data: {}, error: false });
};

module.exports.registerView = registerView;