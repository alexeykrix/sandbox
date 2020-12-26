class Snake  {
  constructor(selector='body', name='game-container') {
    this.selector = selector
    this.name = name
    this.app = document.createElement('div')
    this.template = `
    <style>
    .${this.name} {
      height: 100vh;
      border-bottom: 5px solid #2980b9;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    :root {
      background: #121212;
      font-family: Nunito, sans-serif;
    }
    .${this.name} .app {
      padding: 0;
      margin: 0;
      width: fit-content;
    }
    .${this.name} canvas {
      border: 5px solid #2980b9;
    }
    .${this.name} .stats {
      text-align: right;
      color: #ededed;
    } 
    .${this.name} .controls {
      position: absolute;
      left: 10px;
      bottom: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      user-select: none;
      width: auto;
      margin: 0;
    }
    .${this.name} .btn {
      display: inline-block;
      cursor: pointer;
      margin: 5px 0px;
      width: 20px;
      height:20px;
    }
    .${this.name} .btn.pause {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/748/748136.svg') center/80%;
    }
    .${this.name} .btn.reset {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/263/263110.svg') center/80%;
    }
    .${this.name} .controller {
      display: none;
      width: 150px;
      height: 150px;
      box-sizing: border-box;
      border: 5px solid #ededed;
      border: 5px solid #2980b9;
      border-radius: 50%;
      margin: 0;
      margin: 50px auto;
    }
    @media (max-width: 768px) {
      .${this.name} .controller {
        display: block;
      }
    }
    </style>
    <div class="app">
      <h3 class="stats">best: <span>0</span></h3>
      <canvas class="view" ></canvas>
    </div>

    <div class="controller"></div>
    <div class="controls">
      <button class="btn pause"></button>
      <button class="btn reset"></button>
    </div>
    `
    
    if (document.querySelector(this.selector) === null) return;
    this.app.innerHTML = this.template
    this.app.classList = this.name
    this.btnPause = this.app.querySelector('.pause')
    this.btnReset = this.app.querySelector('.reset')
    // this.arrows = this.app.querySelector('.arrows')
    this.w = window.innerHeight/window.innerWidth > 1 ? window.innerWidth: window.innerHeight
    this.width = this.w> 500? 480 : (this.w-10)*.9
    this.w> 550? this.width = 500:''
    this.score = 0
    this.gameData = []
    this.directions = []
    this.food = null
    this.timeout = false
    this.canvas = this.app.querySelector('.view')
    this.canvas.width = this.width
    this.canvas.height = this.width
    this.best = this.app.querySelector('.stats span')
    this.c = this.canvas.getContext('2d')
    this.best.innerHTML = localStorage.getItem('bestSnake') || 0
    this.cellSize = localStorage.getItem('cellSize') || 10
    this.cellsCount = this.canvas.width / this.cellSize
  }

  randomPos() {
    let rand = - 0.5 + Math.random() * this.cellsCount
    return Math.round(rand)
  }
  randFoodPos() {
    this.food = {
      'x': this.randomPos(),
      'y': this.randomPos(),
      'state': 0,
    }
    this.gameData.forEach(el => {
      if (el.x === this.food.x && el.y === this.food.y) this.randFoodPos()
    })
  }
  makeArray() {
    this.gameData = []
    for (let i=0; i < 5; i++) {
      this.gameData.push({'x': Math.round(this.cellsCount/2), 'y': Math.round(this.cellsCount/2), state: 1})
    }
  }
  renderCell(x, y, state, id) {
    state? this.c.fillStyle = 
      (id === 0 ? '#e74c3c' : 
        (id%2 === 0 ? '#f39c12' : '#e67e22')): this.c.fillStyle = '#64dd17'
    this.c.beginPath()
    this.c.rect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
    this.c.fill()
    this.c.closePath()
  }
  renderCells() {
    this.c.fillStyle = '#3d3d3e'
    this.c.beginPath()
    this.c.rect(0, 0, this.canvas.width, this.canvas.width)
    this.c.fill()
    this.c.closePath()
    this.c.fillStyle = '#242424'
    this.c.font = '90px "Roboto Mono"'
    this.c.textAlign = 'center';
    this.c.fillText(this.score, this.canvas.width/2, this.canvas.width/2+20)
    this.renderCell(this.food.x, this.food.y, 0)
    this.gameData.forEach((el, id) => {
      this.renderCell(el.x, el.y, el.state, id)
    })
  }
  init() {
    this.makeArray(this.cellsCount, this.cellsCount)
    this.randFoodPos()
  
    this.c.fillStyle = '#2e2d2e'
    this.c.beginPath()
    this.c.rect(0,0,this.c.width,this.c.height)
    this.c.closePath()
    this.c.fill()
  
    this.renderCells()
  }
  selfEating(id) {
    this.gameData = this.gameData.slice(0, (id>5 ? id: 5 ))
  }
  snakeMoving = () => {
    let d = this.directions[0]
    let eatId;
    const oldData = [...this.gameData]
    
    if (d === 'left') { // left
      let next = oldData[0].x-1 >= 0 ? oldData[0].x-1 : this.cellsCount-1
      oldData.forEach((el, id) => {
        if (el.x === next && 
            el.y === oldData[0].y) {
        eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': next,
        'y': this.gameData[0].y,
        'state': 1
      })
      if (this.food.x === next && 
          this.food.y === this.gameData[0].y) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'up') { // up
      const oldData = [...this.gameData]
      let next = oldData[0].y-1 >= 0 ? oldData[0].y-1 : this.cellsCount-1
      oldData.forEach((el, id) => {
        if (el.x === oldData[0].x && 
            el.y === next) {
        eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': this.gameData[0].x,
        'y': next,
        'state': 1
      })
      if (this.food.x === this.gameData[0].x && 
          this.food.y === next) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'down') { // down
      const oldData = [...this.gameData]
      let next = oldData[0].y+1 < this.cellsCount ? oldData[0].y+1 : 0
      oldData.forEach((el, id) => {
        if (el.x === oldData[0].x && 
            el.y === next) {
          eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': this.gameData[0].x,
        'y': next,
        'state': 1
      })
      if (this.food.x === this.gameData[0].x && 
          this.food.y === next) {
            this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'right') { // right
      const oldData = [...this.gameData]
      let next = oldData[0].x+1 < this.cellsCount ? oldData[0].x+1 : 0
      oldData.forEach((el, id) => {
        if (el.x === next && 
            el.y === oldData[0].y) {
          eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': next,
        'y': this.gameData[0].y,
        'state': 1
      })
      if (this.food.x === next && 
          this.food.y === this.gameData[0].y) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    this.renderCells()
    this.directions.length >1? this.directions.shift(): ''
  }
  gameRun() {
    this.snakeMoving()
    this.score = this.gameData.length-5
    if (+this.best.innerHTML < this.score) {
      this.best.innerHTML = this.score
      localStorage.setItem('bestSnake', this.best.innerHTML)
    }
    clearInterval(this.timeout)
    this.timeout = setInterval(() =>this.gameRun(), 1000/(this.score+5))
  }
  keydownHandler = (e) =>  {
    if (e.repeat) return
    if (e.code === 'KeyW' && 
        this.directions[this.directions.length-1] !== 'down' &&
        this.directions[this.directions.length-1] !== 'up') this.directions.push('up')
    if (e.code === 'KeyA' && 
        this.directions[this.directions.length-1] !== 'right' &&
        this.directions[this.directions.length-1] !== 'left') this.directions.push('left')
    if (e.code === 'KeyD' && 
        this.directions[this.directions.length-1] !== 'left' &&
        this.directions[this.directions.length-1] !== 'right') this.directions.push('right')
    if (e.code === 'KeyS' && 
        this.directions[this.directions.length-1] !== 'up' &&
        this.directions[this.directions.length-1] !== 'down') this.directions.push('down')
  
    if (!this.timeout) {
      if ((e.code === 'KeyW') ||
          (e.code === 'KeyA') ||
          (e.code === 'KeyD') ||
          (e.code === 'KeyS')) {
        this.timeout = setInterval(() =>this.gameRun(), 1000/(this.score+5))
      }
    }
  }
  
  setEvents() {
    document.addEventListener('keydown',this.keydownHandler)
  
    this.btnPause.addEventListener('click', () => {
      clearInterval(this.timeout)
      this.timeout = false
    })
    this.btnReset.addEventListener('click', () => {
      clearInterval(this.timeout)
      this.timeout = false
      this.init()
    })

    this.controller = document.querySelector('.controller')
    
    this.controller.addEventListener('touchstart', evt => {
      let e = {'code': ''}
        let left = this.controller.offsetLeft
        let up = this.controller.offsetTop
        let width = this.controller.offsetWidth
        let x = Math.round(evt.touches[0].clientX - left - width/2)
        let y = Math.round(evt.touches[0].clientY - up - width/2)

        if (x < -20) e.code = 'KeyA'
        if (x >  20) e.code = 'KeyD'
        if (y < -20) e.code = 'KeyW'
        if (y >  20) e.code = 'KeyS'
        this.keydownHandler(e)

      this.controller.addEventListener('touchmove', evt => {
        evt.preventDefault()
        let e = {'code': ''}
        let left = this.controller.offsetLeft
        let up = this.controller.offsetTop
        let width = this.controller.offsetWidth
        let x = Math.round(evt.touches[0].clientX - left - width/2)
        let y = Math.round(evt.touches[0].clientY - up - width/2)

        if (x < -20) e.code = 'KeyA'
        if (x >  20) e.code = 'KeyD'
        if (y < -20) e.code = 'KeyW'
        if (y >  20) e.code = 'KeyS'
        this.keydownHandler(e)
      })
    })

    // this.arrows.addEventListener('touchstart', evt => {
    //   evt.preventDefault()
    //   let e = {'code': ''}
      
    //   let x0 = this.arrows.offsetLeft
    //   let y0 = this.arrows.offsetTop
    
    //   if (x0<evt.touches[0].clientX+25 &&
    //       x0+49>evt.touches[0].clientX+25 &&
    //       y0<evt.touches[0].clientY &&
    //       y0+49>evt.touches[0].clientY) {
    //     e.code = 'KeyW'
    //   }
    //   if (x0<evt.touches[0].clientX+25 &&
    //       x0+49>evt.touches[0].clientX+25 &&
    //       y0+99<evt.touches[0].clientY &&
    //       y0+149>evt.touches[0].clientY) {
    //     e.code = 'KeyS'
    //   }
    //   if (x0<evt.touches[0].clientX+74 &&
    //       x0+49>evt.touches[0].clientX+74 &&
    //       y0+49<evt.touches[0].clientY &&
    //       y0+99>evt.touches[0].clientY) {
    //     e.code = 'KeyA'
    //   }
    //   if (x0<evt.touches[0].clientX-25 &&
    //       x0+49>evt.touches[0].clientX-25 &&
    //       y0+49<evt.touches[0].clientY &&
    //       y0+99>evt.touches[0].clientY) {
    //     e.code = 'KeyD'
    //   }
    //   this.keydownHandler(e)
    // })
    
    // window.addEventListener('touchmove', evt => {
    //   let e = {'code': ''}
    //   let x0 = this.arrows.offsetLeft
    //   let y0 = this.arrows.offsetTop
    
    //   if (x0<evt.touches[0].clientX+25 &&
    //       x0+49>evt.touches[0].clientX+25 &&
    //       y0<evt.touches[0].clientY &&
    //       y0+49>evt.touches[0].clientY) {
    //     e.code = 'KeyW'
    //   }
    //   if (x0<evt.touches[0].clientX+25 &&
    //       x0+49>evt.touches[0].clientX+25 &&
    //       y0+99<evt.touches[0].clientY &&
    //       y0+149>evt.touches[0].clientY) {
    //     e.code = 'KeyS'
    //   }
    //   if (x0<evt.touches[0].clientX+74 &&
    //       x0+49>evt.touches[0].clientX+74 &&
    //       y0+49<evt.touches[0].clientY &&
    //       y0+99>evt.touches[0].clientY) {
    //     e.code = 'KeyA'
    //   }
    //   if (x0<evt.touches[0].clientX-25 &&
    //       x0+49>evt.touches[0].clientX-25 &&
    //       y0+49<evt.touches[0].clientY &&
    //       y0+99>evt.touches[0].clientY) {
    //     e.code = 'KeyD'
    //   }
    //   this.keydownHandler(e)
    // })
  }
  start() {
    if (document.querySelector(this.selector) === null) return;
    document.querySelector(this.selector).appendChild(this.app)
    this.setEvents()
    this.init()
  }
}