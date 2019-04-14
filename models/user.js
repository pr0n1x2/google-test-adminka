// Подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');

// Подключаем схему Person
const PersonSchema = require('./schemes/person');

// Получаем объект Schema, который позволит нам создать
// коллекцию User
// Источник: https://mongoosejs.com/docs/guide.html
const Schema = mongoose.Schema;

// Создаем схему User
const userSchema = new Schema({
    // Указываем, что в свойстве person будут храниться значение из схемы PersonSchema
    person: PersonSchema,
    // Права которыми обладает пользователь
    role: {
        type: String,               // Указываем тип поля Строка
        enum: ['admin', 'user'],    // Указываем, что в этом поле могут храниться только 2 значение admin или user
        default: 'user'             // Указываем, что по умолчанию будет вставляться значение user
    },
    // Случайная строка, в которой будет храниться токен пользователя, еслион нажал галочку Remember Me
    token: {
        type: String,
        required: false
    }
}, {
    // Временные метки
    // Источник: https://mongoosejs.com/docs/guide.html#timestamps
    timestamps: true,
});

// Создаем виртуальное свойство, которого на самом деле не существует в реальной
// коллекции, но мы можем к нему обратиться и получить значение на основе
// вычислений, которые мы укажем в этом свойстве
// Источник: https://mongoosejs.com/docs/guide.html#virtuals
userSchema.virtual('fullName').get(function () {
    return `${this.person.name} ${this.person.surname}`;
});

// Создаем виртуальное свойство age
// Вычисляем его из даты рождения пользователя
userSchema.virtual('age').get(function () {
    if (this.person.birthday) {
        const today = new Date();
        const month = today.getMonth() - this.person.birthday.getMonth();

        let age = today.getFullYear() - this.person.birthday.getFullYear();

        if (month < 0 || (month === 0 && today.getDate() < this.birthday.getDate())) {
            age--;
        }

        return age;
    }

    return null;
});

// Создаем коллекцию User на основе схемы userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;