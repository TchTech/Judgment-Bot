# ⚖️ Judgment Bot: Бот-судья для Discord 🤖

## 🖼 Картинки

<div>
  <img src='src/imgs/new_logo.png' width='20%'>
</div>

## 📌 Описание

Judgment Bot - это многофункциональный Discord-бот, предназначенный для управления активностью, разрешения конфликтов и добавления интерактивности на вашем сервере. Он включает в себя систему рейтинга участников, сезонные соревнования, систему демократического разрешения конфликтов и другие полезные команды.

**[Посетите наш сайт](https://tchtech.github.io/Judgment_bot_site/index.html) для получения более подробной информации!**

**[Добавьте бота на свой сервер](https://discord.com/api/oauth2/authorize?client_id=799723410572836874&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Fchannels%2F804772492978946089%2F804772492978946092&scope=bot%20applications.commands)**

## ✨ Ключевые особенности

*   **🤑 Получение баллов:** Замотивируйте участников писать больше сообщений на вашем сервере!
*   **⚔️ Соревнование в рейтинге:** Соревнуйтесь по активности с другими серверами в каждом сезоне! Публикация результатов сезона осуществляется на официальном сервере бота в Дискорд: [Link](Укажите ссылку на ваш Discord сервер).
*   **👩‍⚖️ Разрешение конфликтов без участия администрации:** Команда `b!conflict <преступник> <наказание> <описание>` посеет чистую демократию на вашем сервере! Путем голосования ЗА или ПРОТИВ предложенного решения конфликта будет выбрано наказание. Будьте аккуратны при использовании!

## ⚙️ Функциональность

### Рейтинг

*   `b!score` - показывает ваш счет на этом сервере.
    *   Description: For every message of every members you can get from 2 to 6 scores (if your message written in the 1,10,20,30 date, you get from 6 to 10 score).
    *   Перевод: За каждое сообщение каждого участника вы можете получить от 2 до 6 баллов (если ваше сообщение написано в дату 1,10,20,30, вы получите от 6 до 10 баллов).
*   `b!rating` - показывает лучших членов гильдии.
    *   Description: Shows top members of this guild.
    *   Перевод: Показывает лучших членов гильдии.

### Сезоны

*   Description: If month is ending, we will sum up the season. The season results will be shown in our official guild in the discord - [LINK](Укажите ссылку на ваш Discord сервер).
*   Перевод: Если месяц подходит к концу, мы подведем итоги сезона. Результаты сезона будут показаны в нашей официальной гильдии в сервере DISCORD - [ССЫЛКА](Укажите ссылку на ваш Discord сервер).

### Администрация

*   `b!conflict <linked-user> <punishment (kick, ban or fall)> <reason>` - creates conflict with `<linked-user>`.
    *   Description: Important function that creates conflict, where `<linked-user>` is a lawbreaker.  `<reson>` describes why did you make conflict. If voices for `<punishment>` more than voices versus `<punishment>`, bot does `<punisment>` (kick, ban, fall). Decision makes in 2 hours after creating.
    *   Перевод: Важная функция, которая создает конфликт, где `<linked-user>` является нарушителем. `<reson>` описывает, почему вы создали конфликт. Если голосов за `<punishment>` больше, чем голосов против `<punishment>`, бот выполняет `<punisment>` (kick, ban, fall). Решение принимается в течение 2 часов после создания.

### Другое

*   `b!birthday <linked-user>` - congratulates `<linked-user>`.
    *   Перевод: b!birthday <пользователь> - поздравляет `<пользователя>`.
*   `b!census <question>` - creates census in this channel. (YES OR NO)
    *   Перевод: b!census <вопрос> - создает перепись в этом канале. (ДА ИЛИ НЕТ)
*   `b!ru_help` & `b!en_help` - help messages on different languages.
    *   Перевод: b!ru_help & b!en_help - справочные сообщения на разных языках.

## 🚀 Установка

1.  **Пригласите бота на свой сервер:**  Используйте [эту ссылку](https://discord.com/api/oauth2/authorize?client_id=799723410572836874&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Fchannels%2F804772492978946089%2F804772492978946092&scope=bot%20applications.commands).
2.  **(Опционально):** Если вы хотите запустить свою собственную копию бота (для разработки или кастомизации), следуйте инструкциям ниже:
    *   Клонируйте репозиторий: `git clone <ссылка на репозиторий>`
    *   Установите зависимости: `pip install -r requirements.txt`
    *   Настройте переменные окружения (токен бота Discord, ID сервера и т.д.).
    *   Запустите бота.

## 🤝 Вклад

Мы приветствуем вклад сообщества! Вы можете:

*   Сообщать об ошибках.
*   Предлагать улучшения.
*   Отправлять pull requests.

## 📜 Лицензия

MIT License.
