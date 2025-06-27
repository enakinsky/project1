require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json()); // Парсим JSON-тела запросов

// Подключение к MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Подключено к MongoDB Atlas'))
  .catch(err => console.error('❌ Ошибка подключения:', err));

// Роуты
// 1. Сохранение бронирования
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, tour, date } = req.body;

    // Валидация (можно добавить больше проверок)
    if (!name || !phone || !tour) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }

    const booking = new Booking({
      name,
      phone,
      email,
      tour,
      date: date || new Date() // Если дата не указана, используем текущую
    });

    await booking.save();
    console.log('📌 Сохранено бронирование:', booking);
    res.status(201).json({ message: 'Бронирование успешно создано!', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Получение всех бронирований (для админки)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 }); // Сортировка по дате (новые сначала)
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Удаление бронирования (опционально)
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }
    res.json({ message: 'Бронирование удалено', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Статика для фронтенда (если фронт и бэк на одном сервере)
app.use(express.static('public'));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
