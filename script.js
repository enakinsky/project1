// Открытие/закрытие модального окна бронирования
const modal = document.getElementById('booking-modal');
const closeBtn = document.querySelector('.close-btn');
const bookButtons = document.querySelectorAll('.tour-btn');

// Открытие модалки при клике на кнопки "Забронировать"
bookButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tourCard = button.closest('.tour-card');
    const tourName = tourCard.querySelector('h3').textContent;
    
    document.getElementById('tour-select').value = tourName;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
  });
});

// Закрытие модалки
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Учитываем высоту шапки
        behavior: 'smooth'
      });
    }
  });
});

// Валидация и отправка формы бронирования
const bookingForm = document.getElementById('booking-form');
const tourSelect = document.getElementById('tour-select');
const tourDate = document.getElementById('tour-date');

// Установка минимальной даты (сегодня + 1 день)
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
tourDate.min = minDate;

// Единый обработчик отправки формы
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    const formData = {
      name: bookingForm.querySelector('input[type="text"]').value,
      phone: bookingForm.querySelector('input[type="tel"]').value,
      email: bookingForm.querySelector('input[type="email"]').value,
      tour: tourSelect.value,
      date: tourDate.value
    };
    
    console.log('Данные для отправки:', formData); // Логируем данные
    
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json()) // Ожидаем ответ от сервера
      .then((data) => {
        if (data.message) {
          showNotification(data.message); // Показываем уведомление
          closeModal(); // Закрываем модалку
          bookingForm.reset(); // Сбрасываем форму
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error);
        showNotification('Произошла ошибка. Пожалуйста, попробуйте ещё раз.');
      });
  }
});

// Функция валидации формы
function validateForm() {
  let isValid = true;
  const inputs = bookingForm.querySelectorAll('input, select');
  
  inputs.forEach(input => {
    input.style.borderColor = '#ddd'; // Сбрасываем стили
    
    if (!input.value.trim()) {
      input.style.borderColor = 'red'; // Подсветка ошибки
      isValid = false;
    }
  });
  
  if (!isValid) {
    alert('Пожалуйста, заполните все поля!'); // Уведомление об ошибке
  }
  
  return isValid;
}

// Функция показа уведомлений
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Анимации при скролле
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.tour-card, .advantage-card');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (elementPosition < screenPosition) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Инициализация анимаций
document.querySelectorAll('.tour-card, .advantage-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Запускаем сразу для видимых элементов