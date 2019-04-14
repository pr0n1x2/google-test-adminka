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

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /register методом POST
const registerAction = async (req, res, next) => {
    // Получаем данные их формы, которые храняться в объекте req свойстве body
    const { name, surname, email, countryId, phone, birthday, password, passwordRetype } = req.body;

    // Формируем объекты, которые будем сравнивать с JSON Схемами
    const personObj = {
        name: name,
        surname: surname,
        email: email,
        countryId: countryId,
        phone: phone,
        birthday: birthday
    };

    const passwordObj = {
        password: password,
        passwordRetype: passwordRetype
    };

    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    try {
        // Создаем объект Ajv, который будет проверять данных из формы с json схемами
        let ajv = new Ajv({verbose: true});

        // Проверяем объект personObj на то, что он соответствует схеме ProfileJsonSchema
        // и результат true или false записываем в константу validProfile
        const validProfile = ajv.validate(ProfileJsonSchema, personObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validProfile) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Создаем новый объект Ajv, который будет валидировать пароль
        ajv = new Ajv({verbose: true, $data: true});

        // Проверяем объект passwordObj на то, что он соответствует схеме PasswordJsonSchema
        // и результат true или false записываем в константу validPassword
        const validPassword = ajv.validate(PasswordJsonSchema, passwordObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validPassword) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Ищем в БД пользователя с E-mail который ввел пользователь
        const emailUser = await User.findOne({'person.email': email});

        // Проверяем, если в базе есть другой пользователь с таким E-mail,
        // тогда выбрасываем исключение и показываем ошибку, так как нам
        // нельзя вставлять в базу пользователей с одинакомыми E-mail
        if (emailUser) {
            throw new Error('A user with this E-mail already exists');
        }

        // Хешируем пароль, чтобы он не хранился в базе в оригинальном виде
        const passwordHash = await bcrypt.hash(password, 10);

        // Создает объект Date из строки birthday
        const birthdayDate = birthday.length ? new Date(birthday) : null;

        // Создаем нового пользователя
        const newUser = new User({
            person: {
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                birthday: birthdayDate,
                password: passwordHash
            },
            role: 'user'
        });

        // Проверяем если пользователь выбрал страну, тогда в объект newUser
        // добавляем идентификатор выбранной страны
        if (countryId.length) {
            newUser.person.country = countryId;
        }

        // Сохраняем в базу нового пользователя
        // После сохранения в константу user будет записан объект User, который храниться в базе данных
        const user = await newUser.save();

        res.render('success', { title: 'Registration Сompleted', user: user });
    } catch (error) {
        res.render('register', { title: 'Register page', countries: countries, data: personObj, error: error.message });
    }
};

module.exports.registerView = registerView;
module.exports.registerAction = registerAction;