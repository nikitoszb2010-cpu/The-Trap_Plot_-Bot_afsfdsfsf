// Инициализация Telegram WebApp API
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

// --- НАСТРОЙКИ СЕКРЕТНЫХ КОДОВ И ССЫЛОК ---
const PRIVATE_VIDEO_URL = "https://t.me/c/123456789/12"; // Ссылка на приватное видео

// Словарь секретных кодов и ответов ПК
const SECRET_CODES = {
  "date": `ДОСТУП РАЗРЕШЕН.<br>Ссылка на приватный материал:<br><a href="${PRIVATE_VIDEO_URL}" target="_blank" class="secret-link">${PRIVATE_VIDEO_URL}</a>`,
  "experiment": "на что ты намекаешь",
  "number_of_release": "возможно" // Позже замените "возможно" на нужную дату выхода, например: "Дата выхода: 25.12.2026"
};

// Запрограммированные стандартные ответы ПК (если код не подошел)
const BOT_RESPONSES = [
  "ОШИБКА: Команда не распознана. Введите валидный ключ доступа.",
  "Сканирование... Доступ ограничен.",
  "Для получения приватной видеозаписи требуется секретный код.",
  "Введенные данные не совпадают с протоколом безопасности.",
  "Система работает в штатном режиме. Ожидание корректного кода..."
];

// Получаем элементы интерфейса
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
let isTyping = false; // Флаг, блокирующий отправку во время печати текста

// Обработчики событий
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  if (isTyping) return; // Не отправляем новое сообщение, пока терминал печатает

  const text = chatInput.value.trim();
  if (!text) return;

  // Отображаем сообщение пользователя
  addMessage(text, 'user', 'USER');
  chatInput.value = '';

  // Блокируем ввод на время ответа
  isTyping = true;

  // Искусственная задержка (600мс) перед ответом терминала
  setTimeout(() => {
    let responseText = "";

    // Приводим ввод к нижнему регистру для удобства проверки
    const cleanText = text.toLowerCase();

    // Проверка на секретные коды
    if (SECRET_CODES.hasOwnProperty(cleanText)) {
      responseText = SECRET_CODES[cleanText];
    } else {
      // Выбор случайного ответа
      const randomIndex = Math.floor(Math.random() * BOT_RESPONSES.length);
      responseText = BOT_RESPONSES[randomIndex];
    }

    // Печать ответа терминала
    typeMessage(responseText, 'pc', 'SYSTEM_AI');
  }, 600);
}

// Добавление обычного сообщения (для пользователя)
function addMessage(htmlContent, sender, senderName) {
  const container = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  
  msgDiv.innerHTML = `
    <div class="msg-sender">${senderName}</div>
    <div class="msg-content">${htmlContent}</div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// Эффект посимвольной печати терминала ПК
function typeMessage(htmlContent, sender, senderName) {
  const container = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  
  const senderDiv = document.createElement('div');
  senderDiv.className = 'msg-sender';
  senderDiv.innerText = senderName;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'msg-content';

  msgDiv.appendChild(senderDiv);
  msgDiv.appendChild(contentDiv);
  container.appendChild(msgDiv);

  // Если ответ содержит HTML-ссылки или теги, выводим сразу без посимвольной анимации
  if (htmlContent.includes('<a') || htmlContent.includes('<br>')) {
    contentDiv.innerHTML = htmlContent;
    container.scrollTop = container.scrollHeight;
    isTyping = false;
    return;
  }

  // Посимвольный вывод текста
  let index = 0;
  const interval = setInterval(() => {
    contentDiv.textContent += htmlContent[index];
    index++;
    container.scrollTop = container.scrollHeight;

    if (index >= htmlContent.length) {
      clearInterval(interval);
      isTyping = false; // Разблокируем ввод
    }
  }, 35); // Скорость печати (35 мс на символ)
}