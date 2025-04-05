<template>
  <div class="typing-trainer">
    <h1>Тренажер слепой печати</h1>
    
    <div class="stats">
      <span>Скорость: {{ wpm }} слов/мин</span>
      <span>Точность: {{ accuracy }}%</span>
      <span>Время: {{ timer }}с</span>
    </div>

    <div v-if="!isCompleted" class="text-container" @keydown="handleKeyDown">
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
      <button @click="startPractice" v-if="!isStarted && !isCompleted">Начать</button>
      <button @click="reset" v-if="isStarted && !isCompleted">Сбросить</button>
      <button @click="restart" v-if="isCompleted">Начать заново</button>
      <button @click="nextLesson" v-if="isCompleted">Следующий урок</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypingTrainer',
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
        this.$el.querySelector('.text-container').focus()
      })
    },
    handleKeyDown(event) {
      if (!this.isStarted || this.isCompleted) {
        event.preventDefault()
        return
      }

      const key = event.key
      if (key.length === 1) { // Обрабатываем только одиночные символы
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
    },
    nextLesson() {
      alert('Следующий урок пока не реализован')
      this.restart()
    }
  },
  mounted() {
    this.$el.querySelector('.text-container').setAttribute('tabindex', '0')
  },
  beforeUnmount() {
    clearInterval(this.timerInterval)
  }
}
</script>

<style scoped>
.typing-trainer {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.stats {
  margin: 20px 0;
  display: flex;
  gap: 20px;
}

.text-container {
  background: #f0f0f0;
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
  background: #ffff99;
}

.correct {
  color: #2ecc71;
}

.incorrect {
  color: #e74c3c;
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