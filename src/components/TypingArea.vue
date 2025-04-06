<template>
  <div class="typing-trainer">
    <Header />
    
    <div class="stats">
      <span>Скорость: {{ wpm }} слов/мин</span>
      <span>Точность: {{ accuracy }}%</span>
      <span>Время: {{ timer }}с</span>
    </div>

    <div v-if="!isCompleted" ref="textContainer" class="text-container" @keydown="handleKeyDown" tabindex="0">
      <div class="text-to-type">
        <span 
          v-for="(char, index) in currentText" 
          :key="index" 
          :class="{
            'current': index === currentPosition,
            'correct': typedText[index] === char && index < currentPosition,
            'incorrect': typedText[index] !== char && typedText[index] && index < currentPosition
          }"
        >
          {{ char }}
        </span>
      </div>
    </div>

    <div v-if="isCompleted" class="completion-message">
      Поздравляю, вы прошли урок!
    </div>

    <div class="controls">
      <CustomButton @click="startPractice" v-if="!isStarted && !isCompleted" color="green">Начать</CustomButton>
      <CustomButton @click="reset" v-if="isStarted && !isCompleted" color="red">Сбросить</CustomButton>
      <CustomButton @click="restart" v-if="isCompleted">Начать заново</CustomButton>
      <CustomButton @click="nextLesson" v-if="isCompleted" color="green">Следующий урок</CustomButton>
    </div>
  </div>
</template>

<script>
import Header from './partials/Header.vue'
import CustomButton from './partials/CustomButton.vue'

export default {
  name: 'TypingTrainer',
  components: {
    Header,
    CustomButton
  },
  data() {
    return {
      textLines: [
        'привет мир как дела у тебя сегодня',
        'сегодня хороший день для практики'
      ],
      currentLineIndex: 0,
      typedText: [],
      currentPosition: 0,
      isStarted: false,
      isCompleted: false,
      startTime: null,
      timer: 0,
      correctChars: 0,
      totalChars: 0,
      timerInterval: null
    }
  },
  computed: {
    currentText() {
      return this.textLines[this.currentLineIndex]
    },
    wpm() {
      if (!this.startTime || this.timer === 0) return 0
      const minutes = this.timer / 60
      const words = this.correctChars / 5
      return Math.round(words / minutes) || 0
    },
    accuracy() {
      if (this.totalChars === 0) return 100
      return Math.round((this.correctChars / this.totalChars) * 100)
    }
  },
  methods: {
    startPractice() {
      this.isStarted = true
      this.startTime = Date.now()
      this.startTimer()
      this.$nextTick(() => {
        if (this.$refs.textContainer) {
          this.$refs.textContainer.focus()
        }
      })
    },
    handleKeyDown(event) {
      if (this.isCompleted) {
        event.preventDefault()
        return
      }
      
      if (!this.isStarted) {
        this.isStarted = true
        this.startTime = Date.now()
        this.startTimer()
      }

      const key = event.key
      if (key.length === 1) {
        this.totalChars++
        const currentChar = this.currentText[this.currentPosition]
        
        if (key === currentChar) {
          this.correctChars++
        }
        
        this.typedText[this.currentPosition] = key
        this.currentPosition++
        
        if (this.currentPosition >= this.currentText.length) {
          this.moveToNextLine()
        }
      } else if (key === 'Backspace' && this.currentPosition > 0) {
        this.currentPosition--
        this.typedText[this.currentPosition] = undefined
        this.totalChars--
        if (this.typedText[this.currentPosition] === this.currentText[this.currentPosition]) {
          this.correctChars--
        }
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timer = Math.floor((Date.now() - this.startTime) / 1000)
      }, 1000)
    },
    moveToNextLine() {
      if (this.currentLineIndex + 1 < this.textLines.length) {
        this.currentLineIndex++
        this.typedText = []
        this.currentPosition = 0
      } else {
        this.isStarted = false
        this.isCompleted = true
        clearInterval(this.timerInterval)
      }
    },
    reset() {
      this.isStarted = false
      this.typedText = []
      this.currentPosition = 0
      this.startTime = null
      this.timer = 0
      this.correctChars = 0
      this.totalChars = 0
      clearInterval(this.timerInterval)
    },
    restart() {
      this.reset()
      this.isCompleted = false
      this.currentLineIndex = 0
      
      setTimeout(() => {
        this.isStarted = true
        this.startTime = Date.now()
        this.startTimer()
        
        this.$nextTick(() => {
          if (this.$refs.textContainer) {
            this.$refs.textContainer.focus()
          }
        })
      }, 50)
    },
    nextLesson() {
      alert('Следующий урок пока не реализован')
      this.restart()
    }
  },
  mounted() {},
  beforeUnmount() {
    clearInterval(this.timerInterval)
  }
}
</script>

<style scoped>
.typing-trainer {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Noto Sans", sans-serif;
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
  color: #3CB371;
}

.incorrect {
  color: #CD5C5C;
  text-decoration: underline;
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #2980b9;
}

.completion-message {
  font-size: 24px;
  color: #2ecc71;
  text-align: center;
  margin: 20px 0;
}
</style>