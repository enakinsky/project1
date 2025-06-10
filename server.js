const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(express.json());

// Путь к JSON-файлу
const bookingsPath = path.join(__dirname, 'bookings.json');

// Если файла нет, создадим его
if (!fs.existsSync(bookingsPath)) {
    fs.writeFileSync(bookingsPath, '[]');
}

// Роут для бронирования тура
app.post('/api/bookings', (req, res) => {
    const { name, phone, email, tour, date } = req.body;

    // Чтение текущих данных
    fs.readFile(bookingsPath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const bookings = JSON.parse(data);
        bookings.push({ name, phone, email, tour, date });

        // Запись новых данных
        fs.writeFile(bookingsPath, JSON.stringify(bookings), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }
            res.json({ message: 'Заявка успешно отправлена!' });
        });
    });
});

// Раздача статических файлов (HTML, CSS, JS, изображения)
app.use(express.static(__dirname));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
