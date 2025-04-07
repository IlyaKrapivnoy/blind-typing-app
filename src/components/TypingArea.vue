<template>
  <div class="typing-trainer">
    <Header />

    <div class="container">
      <div class="levels-sidebar">
        <h3>Уровни</h3>
        <ul>
          <li v-for="level in levels" :key="level.id">
            <router-link
              :to="`/level/${level.id}`"
              :class="{ active: currentLevelId === level.id }"
              @click="changeLevel(level.id)"
            >
              {{ level.id }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="main-content">
        <div class="stats">
          <span>Скорость: {{ wpm }} слов/мин</span>
          <span>Точность: {{ accuracy }}%</span>
          <span>Время: {{ timer }}с</span>
        </div>

        <div
          v-if="!isCompleted"
          ref="textContainer"
          class="text-container"
          @keydown="handleKeyDown"
          tabindex="0"
        >
          <div class="text-to-type">
            <span
              v-for="(char, index) in currentText"
              :key="index"
              :class="{
                current: index === currentPosition,
                correct: typedText[index] === char && index < currentPosition,
                incorrect:
                  typedText[index] !== char &&
                  typedText[index] &&
                  index < currentPosition,
              }"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <div v-if="isCompleted" class="completion-message">
          Поздравляю, вы прошли уровень {{ currentLevelId }}!
          <div v-if="isLastLevel" class="coming-soon">
            Скоро появятся новые уровни!
          </div>
        </div>

        <div class="controls">
          <CustomButton
            @click="startPractice"
            v-if="!isStarted && !isCompleted"
            color="green"
            >Начать</CustomButton
          >
          <CustomButton
            @click="reset"
            v-if="isStarted && !isCompleted"
            color="red"
            >Сбросить</CustomButton
          >
          <CustomButton @click="restart" v-if="isCompleted"
            >Начать заново</CustomButton
          >
          <CustomButton
            @click="nextLesson"
            v-if="isCompleted && !isLastLevel"
            color="green"
          >
            Следующий уровень
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./partials/Header.vue";
import CustomButton from "./partials/CustomButton.vue";

export default {
  name: "TypingArea",
  components: {
    Header,
    CustomButton,
  },
  data() {
    return {
      levels: [
        { id: 1, text: ["привет, мир!", "как дела сегодня?"] },
        { id: 2, text: ["сегодня хороший день", "для практики набора"] },
        { id: 3, text: ["быстрая лиса", "прыгнула через забор"] },
        { id: 4, text: ["скорый поезд", "перешагнул через рельсы"] },
        {
          id: 5,
          text: ["дождь в ноябре", "успокаивает лучше чая из шиповника"],
        },
        { id: 6, text: ["нора для зайца", "небо для воробья"] },
        { id: 7, text: ["солнце над лесом", "утренний свет в окне"] },
        { id: 8, text: ["котёнок на крыше", "смотрит на звёзды ночью"] },
        { id: 9, text: ["река течёт медленно", "трава шепчет на ветру"] },
        { id: 10, text: ["снег покрыл поля", "зима пришла незаметно"] },
        { id: 11, text: ["птицы поют весной", "цветы раскрывают лепестки"] },
        { id: 12, text: ["луна освещает путь", "сова охотится в тишине"] },
        { id: 13, text: ["горы стоят веками", "облака плывут над ними"] },
        { id: 14, text: ["книга на столе ждёт", "чай остывает в кружке"] },
        { id: 15, text: ["дети играют в парке", "смех разносится повсюду"] },
        { id: 16, text: ["старик шёл по тропе", "воспоминания грели душу"] },
        { id: 17, text: ["море шумит вдали", "волны целуют берег"] },
        { id: 18, text: ["закат красит небо", "вечер обещает покой"] },
        { id: 19, text: ["утро в деревне", "запах свежескошенной травы"] },
        { id: 20, text: ["звёзды над озером", "тишина обнимает ночь"] },
      ],
      typedText: [],
      currentPosition: 0,
      currentLineIndex: 0,
      isStarted: false,
      isCompleted: false,
      startTime: null,
      timer: 0,
      correctChars: 0,
      totalChars: 0,
      timerInterval: null,
    };
  },
  computed: {
    currentLevelId() {
      return parseInt(this.$route.params.lessonId) || 1;
    },
    currentLevel() {
      return (
        this.levels.find((level) => level.id === this.currentLevelId) ||
        this.levels[0]
      );
    },
    currentText() {
      return this.currentLevel.text[this.currentLineIndex];
    },
    isLastLevel() {
      return this.currentLevelId === this.levels.length;
    },
    wpm() {
      if (!this.startTime || this.timer === 0) return 0;
      const minutes = this.timer / 60;
      const words = this.correctChars / 5;
      return Math.round(words / minutes) || 0;
    },
    accuracy() {
      if (this.totalChars === 0) return 100;
      return Math.round((this.correctChars / this.totalChars) * 100);
    },
  },
  methods: {
    startPractice() {
      this.isStarted = true;
      this.startTime = Date.now();
      this.startTimer();
      this.$nextTick(() => {
        if (this.$refs.textContainer) {
          this.$refs.textContainer.focus();
        }
      });
    },
    handleKeyDown(event) {
      if (this.isCompleted) {
        event.preventDefault();
        return;
      }

      if (!this.isStarted) {
        this.startPractice();
      }

      const key = event.key;
      if (key.length === 1) {
        this.totalChars++;
        const currentChar = this.currentText[this.currentPosition];

        if (key === currentChar) {
          this.correctChars++;
        }

        this.typedText[this.currentPosition] = key;
        this.currentPosition++;

        if (this.currentPosition >= this.currentText.length) {
          this.moveToNextLine();
        }
      } else if (key === "Backspace" && this.currentPosition > 0) {
        this.currentPosition--;
        this.typedText[this.currentPosition] = undefined;
        this.totalChars--;
        if (
          this.typedText[this.currentPosition] ===
          this.currentText[this.currentPosition]
        ) {
          this.correctChars--;
        }
      }
    },
    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timer = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);
    },
    moveToNextLine() {
      if (this.currentLineIndex + 1 < this.currentLevel.text.length) {
        this.currentLineIndex++;
        this.typedText = [];
        this.currentPosition = 0;
      } else {
        this.isStarted = false;
        this.isCompleted = true;
        clearInterval(this.timerInterval);
      }
    },
    reset() {
      this.isStarted = false;
      this.isCompleted = false;
      this.typedText = [];
      this.currentPosition = 0;
      this.currentLineIndex = 0;
      this.startTime = null;
      this.timer = 0;
      this.correctChars = 0;
      this.totalChars = 0;
      clearInterval(this.timerInterval);
    },
    restart() {
      this.reset();
      this.$nextTick(() => {
        this.startPractice();
      });
    },
    nextLesson() {
      const nextLevelId = this.currentLevelId + 1;
      if (nextLevelId <= this.levels.length) {
        this.$router
          .push(`/level/${nextLevelId}`)
          .then(() => {
            this.reset();
          })
          .catch((err) => {
            console.error("Navigation error:", err);
          });
      }
    },
    changeLevel(levelId) {
      this.$router
        .push(`/level/${levelId}`)
        .then(() => {
          this.reset();
        })
        .catch((err) => {
          console.error("Navigation error:", err);
        });
    },
  },
  watch: {
    "$route.params.lessonId": {
      immediate: true,
      handler(newVal) {
        const levelId = parseInt(newVal) || 1;
        if (this.levels.some((level) => level.id === levelId)) {
          this.reset();
        }
      },
    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
.typing-trainer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Noto Sans", sans-serif;
}

.container {
  display: flex;
  gap: 20px;
}

.levels-sidebar {
  width: 190px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 5px;
}

.levels-sidebar h3 {
  margin: 0 0 15px 0;
  font-weight: 600;
  color: #fff;
}

.levels-sidebar ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  outline: none;
}

.levels-sidebar li {
  flex: 0 0 calc(25% - 10px);
  margin: 0;
}

.levels-sidebar a {
  text-decoration: none;
  color: #a0a0a0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 16px;
  transition: background 0.3s;
}

.levels-sidebar a:hover {
  background: rgba(0, 0, 0, 0.1);
}

.levels-sidebar a.active {
  background: rgba(76, 175, 80, 0.5);
  color: white;
  outline: none;
}

.main-content {
  flex: 1;
}

.stats {
  margin: 20px 0;
  display: flex;
  gap: 20px;
}

.text-container {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 5px;
  margin: 20px 0;
  font-size: 24px;
  font-family: monospace;
  outline: none;
}

.text-to-type span {
  transition: all 0.1s;
}

.current {
  background: #646464;
}

.correct {
  color: #3cb371;
}

.incorrect {
  color: #cd5c5c;
  text-decoration: underline;
}

.controls {
  display: flex;
  gap: 10px;
}

.completion-message {
  font-size: 24px;
  color: #2ecc71;
  text-align: center;
  margin: 20px 0;
}

.coming-soon {
  font-size: 18px;
  color: #3498db;
  margin-top: 10px;
}
</style>
