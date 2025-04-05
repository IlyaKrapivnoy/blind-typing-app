<template>
  <div class="typing-container">
    <!-- Список уроков слева -->
    <nav class="lesson-nav">
      <h3>Уроки</h3>
      <ul>
        <li><router-link to="/lesson/1">Урок 1</router-link></li>
        <li><router-link to="/lesson/2">Урок 2</router-link></li>
        <li><router-link to="/lesson/3">Урок 3</router-link></li>
        <li><router-link to="/lesson/4">Урок 4</router-link></li>
        <li><router-link to="/lesson/5">Урок 5</router-link></li>
      </ul>
    </nav>

    <!-- Основной контент -->
    <div class="typing-area">
      <p class="sample-text" v-html="highlightedText"></p>

      <!-- Поле ввода или результат -->
      <div v-if="!isFinished">
        <textarea
          v-model="userInput"
          @input="checkInput"
          placeholder="Начинайте печатать здесь..."
          :disabled="isStarted === false && startTime === null"
          class="input-field"
        ></textarea>
        <p class="start-text">Нажмите, чтобы начать</p>
        <button @click="toggleTyping" :disabled="isFinished">
          {{ isStarted ? "Отменить" : "Начать" }}
        </button>
      </div>
      <div v-else class="results">
        <h2>Поздравляю, урок {{ currentLesson }} закончен!</h2>
        <div class="stats">
          <p>Количество знаков: {{ stats.characters }}</p>
          <p>Ошибки: {{ stats.errors }}</p>
          <p>Точность: {{ stats.accuracy }}%</p>
          <p>Скорость: {{ stats.cpm }} зн/мин</p>
          <p>Время: {{ stats.time }} сек</p>
        </div>
        <div v-if="currentLesson < 5">
          <router-link :to="`/lesson/${currentLesson + 1}`">
            <button>Приступить к уроку {{ currentLesson + 1 }}</button>
          </router-link>
        </div>
        <div v-else>
          <p class="completed-text">Вы прошли все уроки, скоро мы добавим новые!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lessons: {
        1: [
          "Привет, это пример текста для слепой печати.",
          "Быстрая коричневая лисица прыгает через ленивую собаку.",
        ],
        2: [
          "Солнце светит ярко над зелёными полями.",
          "Дети играют в парке с разноцветными мячами.",
        ],
        3: [
          "Осень раскрасила лес в золотые и красные тона.",
          "Река тихо течёт среди высоких гор.",
        ],
        4: [
          "Котёнок спит на мягком коврике у окна.",
          "Птицы поют весёлые песни на ветках.",
        ],
        5: [
          "Зима покрыла землю белым пушистым снегом.",
          "Люди катались на санках с высокой горки.",
        ],
      },
      currentLineIndex: 0,
      sampleText: "",
      userInput: "",
      startTime: null,
      endTime: null,
      isStarted: false,
      isFinished: false,
      totalErrors: 0,
      stats: {
        characters: 0,
        errors: 0,
        accuracy: 0,
        cpm: 0,
        time: 0,
      },
    };
  },
  computed: {
    currentLesson() {
      return parseInt(this.$route.params.lessonId) || 1;
    },
    textLines() {
      return this.lessons[this.currentLesson] || this.lessons[1];
    },
    highlightedText() {
      const sample = this.sampleText;
      const input = this.userInput;
      let result = "";
      for (let i = 0; i < sample.length; i++) {
        if (i < input.length) {
          result +=
            input[i] === sample[i]
              ? `<span>${sample[i]}</span>`
              : `<span class="error">${sample[i]}</span>`;
        } else {
          result += `<span>${sample[i]}</span>`;
        }
      }
      return result;
    },
  },
  watch: {
    "$route"(to) {
      this.resetLesson(to.params.lessonId);
    },
  },
  mounted() {
    this.resetLesson(this.$route.params.lessonId);
  },
  methods: {
    resetLesson(lessonId) {
      const lesson = parseInt(lessonId) || 1;
      this.currentLineIndex = 0;
      this.sampleText = this.lessons[lesson][this.currentLineIndex];
      this.userInput = "";
      this.totalErrors = 0;
      this.isStarted = false;
      this.isFinished = false;
      this.startTime = null;
      this.endTime = null;
    },
    toggleTyping() {
      if (!this.isStarted) {
        this.userInput = "";
        this.totalErrors = 0;
        this.isStarted = true;
        this.isFinished = false;
        this.startTime = new Date();
      } else {
        this.resetLesson(this.currentLesson); // Просто сбрасываем урок
      }
    },
    checkInput() {
      if (!this.isStarted) return;

      const sample = this.sampleText;
      const input = this.userInput;

      // Подсчёт ошибок
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== sample[i]) {
          if (input.length > sample.slice(0, input.length).lastIndexOf(input[i])) {
            this.totalErrors++;
          }
          break;
        }
      }

      // Переход к следующей строке или завершение
      if (input === sample) {
        this.currentLineIndex++;
        if (this.currentLineIndex < this.textLines.length) {
          this.sampleText = this.textLines[this.currentLineIndex];
          this.userInput = "";
        } else {
          this.isFinished = true;
          this.isStarted = false;
          this.endTime = new Date();
          this.calculateStats();
        }
      }
    },
    calculateStats() {
      const timeDiff = (this.endTime - this.startTime) / 1000; // Время в секундах
      const totalChars = this.textLines.join("").length;
      const minutes = timeDiff / 60;

      this.stats.characters = totalChars;
      this.stats.errors = this.totalErrors;
      this.stats.accuracy = Math.round(((totalChars - this.totalErrors) / totalChars) * 100);
      this.stats.cpm = Math.round(totalChars / minutes);
      this.stats.time = Math.round(timeDiff);
    },
  },
};
</script>

<style scoped>
.typing-container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
}

.lesson-nav {
  width: 200px;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.lesson-nav ul {
  list-style: none;
  padding: 0;
}

.lesson-nav a {
  text-decoration: none;
  color: #007bff;
}

.lesson-nav a:hover {
  text-decoration: underline;
}

.typing-area {
  flex: 1;
  padding: 20px;
  text-align: center;
}

.sample-text {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.sample-text .error {
  color: #ff4081; /* Розовый цвет для ошибок */
  font-weight: bold;
}

.input-field {
  width: 400px;
  height: 100px;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
}

.start-text {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.results h2 {
  color: #28a745;
  margin-bottom: 20px;
}

.stats p {
  margin: 5px 0;
}

.completed-text {
  color: #ff4081;
  font-size: 18px;
  margin-top: 20px;
}
</style>