<template>
    <div class="feedback-form">
      <h2>Оставить отзыв</h2>
      <form @submit.prevent="submitFeedback">
        <div>
          <label for="feedback">Ваш отзыв:</label>
          <textarea v-model="feedback" id="feedback" required placeholder="Введите ваш отзыв"></textarea>
        </div>
        <button type="submit" :disabled="loading">Отправить</button>
        <p v-if="message" :class="messageType">{{ message }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        feedback: "",  // Текст отзыва
        loading: false,  // Флаг загрузки
        message: "",  // Сообщение об ошибке или успехе
        messageType: "",  // Тип сообщения (успех или ошибка)
        apiUrl: "https://api.telegram.org/bot7211851895:AAFURcFxLYIXvS8DiSSb5EtygyPzwITv6Vc/sendMessage", // URL для отправки сообщения через API
        telegramLink: "https://t.me/ElephantSQL_bot",  // Ссылка на ваш чат с ботом
        chatId: "-4791872970"  // ID группы, куда будет отправляться отзыв
      };
    },
    methods: {
      async submitFeedback() {
        if (!this.feedback.trim()) return;  // Проверка, что отзыв не пустой

        this.loading = true;

        // Формируем данные для отправки в Telegram API
        const feedbackMessage = this.feedback;
        const data = {
          chat_id: this.chatId,
          text: `Новый отзыв: \n\n${feedbackMessage}`
        };

        try {
          // Отправляем POST-запрос в Telegram API для отправки сообщения
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          const link = `${this.telegramLink}`;

          if (response.ok) {
            window.open(link, "_blank");
            this.message = "Ваш отзыв успешно отправлен! Перейдите в Telegram.";
            this.messageType = "success";
          } else {
            this.message = "Ошибка при отправке отзыва.";
            this.messageType = "error";
          }
        } catch (error) {
          console.error('Ошибка:', error);
          this.message = "Произошла ошибка при отправке отзыва.";
          this.messageType = "error";
        } finally {
          this.loading = false;
        }

        // Очистка формы
        this.feedback = "";
      },
    },
  };
</script>
  
  <style scoped>
  .feedback-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  textarea {
    width: 100%;
    height: 150px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: none;
  }
  
  button {
    background-color: #0277bd;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #aaa;
  }
  
  button:hover:not(:disabled) {
    background-color: #01579b;
  }
  
  p.success {
    color: green;
    text-align: center;
  }
  
  p.error {
    color: red;
    text-align: center;
  }
  </style>
  