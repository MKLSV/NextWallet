// Импортируем модуль axios для отправки HTTP-запросов
const axios = require('axios');

// Задаем URL для отправки сообщения
const url = 'https://api.telegram.org/bot6587081386:AAEFpKmoTbj52EpWirs8WTN33I4VCqC6fdw/sendMessage?chat_id=555207329&text=Привет';
const messageService = {
    sendMessage
};
function sendMessage() {
    // Отправляем GET-запрос по URL
    axios.get(url)
        .then((response) => {
            // Выводим статус ответа
            console.log(response.status);
        })
        .catch((error) => {
            // Выводим ошибку, если есть
            console.error(error);
        });
}

// Запускаем функцию каждые 15 секунд
// setInterval(sendMessage, 15 * 1000); // 15 секунд в миллисекундах


export default messageService