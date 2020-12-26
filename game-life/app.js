class Live {
  constructor(selector='body', name='game-live') {
    this.selector = selector || 'body'
    this.name = name
    this.template = `
    <style>
    .${this.name} {
      height: 100vh;
      padding-top: 30px;
      border-bottom: 5px solid #2980b9;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .${this.name} .app {
      margin: 20px auto;
      width: fit-content;
      border: 1px solid #121212;
    }
    .${this.name} canvas {
      border: 5px solid #2980b9;
    }
    .${this.name} .controls {
      user-select: none;
      width: fit-content;
      margin: 0 auto 30px;
      text-align: center;
      display: flex;
      border-bottom: 5px solid #2980b9;
    }
    .${this.name} .btn {
      display: inline-block;
      cursor: pointer;
      margin: 20px 5px;
      width: 20px;
      height:20px;
      border: none;
    }
    .${this.name} input {
      display: block;
      width: 150px;
    }
    .${this.name} .btn.play {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/748/748134.svg') center/80%;
    }
    .${this.name} .btn.pause {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/748/748136.svg') center/80%;
    }
    .${this.name} .btn.reset {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/263/263110.svg') center/80%;
    }
    </style>
    <div class="app">
      <canvas class="view"></canvas>
    </div>
    <div class="controls">
      <button class="btn play"></button>
      <button class="btn pause"></button>
      <button class="btn reset"></button>
    </div>
    `
    
    if (document.querySelector(this.selector) === null) return;
    this.container = document.createElement('div')
    this.container.classList = this.name
    this.container.innerHTML = this.template
    document.querySelector(this.selector).appendChild(this.container)
    this.btnPlay = this.container.querySelector('.play')
    this.btnPause = this.container.querySelector('.pause')
    this.btnReset = this.container.querySelector('.reset')
    this.canvas = this.container.querySelector('.view')
    this.c = this.canvas.getContext('2d')
    this.w = window.innerHeight/window.innerWidth > 1 ? window.innerWidth: window.innerHeight
    this.width = this.w> 500? 480 : (this.w-10)*.9
    this.w> 550? this.width = 500:''
    this.width = Math.floor(this.width/10)*10
    this.canvas.width = this.canvas.height = this.width
    this.c.fillStyle = '#eeeeee'
    this.c.strokeStyle = '#000'
    this.gameData = []
    this.cellSize = 10
    this.cellsCount = this.canvas.width / this.cellSize
    this.timeout = null
  }

  makeRow = (w, h) => {
    let row = []
    for (let i=0; i<w; i++) {
      row.push({'x': i, 'y': h, state: 0})
    }
    return row
  }
  makeArray = (w, h) => {
    let arr = []
    for (let i=0; i<h; i++) {
      arr.push(this.makeRow(w, i))
    }
    this.gameData = arr
  }
  renderCell = (x, y, isLive, id) => {
    if (!isLive) return
    this.c.fillStyle = id%2? '#e67e22': '#f39c12'
    this.c.beginPath()
    this.c.rect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
    this.c.fill()
    this.c.closePath()
  }
  renderCells = () => {
    this.c.fillStyle = '#2e2d2e'
    this.c.beginPath()
    this.c.rect(0, 0, this.canvas.width, this.canvas.width)
    this.c.fill()
    this.c.closePath()
    this.gameData.flat().forEach((el, id) => {
      this.renderCell(el.x, el.y, el.state, id)
    })
  }
  init = () => {
    this.makeArray(this.cellsCount, this.cellsCount)
  
    this.c.fillStyle = '#2e2d2e'
    this.c.beginPath()
    this.c.rect(0,0,this.c.width,this.c.height)
    this.c.closePath()
    this.c.fill()
  
    this.renderCells()
  }
  gameRun = (t) => {
    let newData = [... this.gameData]
    let alive = []
    let willLive = []
    let toBorn = []
  
    this.gameData.flat().forEach(el => {
      if (el.state) alive.push(el)
      else willLive.push(el)
    })
  
    let toKill = []  
    alive.forEach(el => {
      let near = 0
      if (el.y-1 >= 0 && el.x-1 >= 0 &&
        el.y+1 < this.cellsCount && el.x+1 < this.cellsCount) {
        if (this.gameData[el.y-1][el.x-1].state) near++
        if (this.gameData[el.y-1][el.x].state) near++
        if (this.gameData[el.y-1][el.x+1].state) near++
        if (this.gameData[el.y][el.x-1].state) near++
        if (this.gameData[el.y][el.x+1].state) near++
        if (this.gameData[el.y+1][el.x-1].state) near++
        if (this.gameData[el.y+1][el.x].state) near++
        if (this.gameData[el.y+1][el.x+1].state) near++
      }
      if (near >= 0) {
        if (near === 2 || near === 3) ''
        else toKill.push(newData[el.y][el.x])
      }
    })
  
    willLive.forEach(el => {
      let near = 0
      if (el.y-1 >= 0 && el.x-1 >= 0 &&
          el.y+1 < this.cellsCount && el.x+1 < this.cellsCount) {
        if (this.gameData[el.y-1][el.x].state) near++
        if (this.gameData[el.y-1][el.x+1].state) near++
        if (this.gameData[el.y-1][el.x-1].state) near++
        if (this.gameData[el.y][el.x-1].state) near++
        if (this.gameData[el.y][el.x+1].state) near++
        if (this.gameData[el.y+1][el.x-1].state) near++
        if (this.gameData[el.y+1][el.x].state) near++
        if (this.gameData[el.y+1][el.x+1].state) near++
      }
      
      if (near === 3) {
        toBorn.push(newData[el.y][el.x])
      }
    })
  
    toKill.forEach((el) => {
      el.state = 0  
    })
    toBorn.forEach((el) => {
      el.state = 1
    })
  
    this.gameData = newData
    this.renderCells()
  }
  start() {
    if (document.querySelector(this.selector) === null) return;
    this.init()

    this.canvas.addEventListener('contextmenu', e => {
      e.preventDefault()
      let x = Math.floor(e.layerX/this.cellSize)
      let y = Math.floor(e.layerY/this.cellSize)
      let target = this.gameData[y][x]
      target.state = 0
      this.renderCells()
    })

    this.canvas.addEventListener('mousedown', e => {
      this.mouseHandler(e)
      this.canvas.addEventListener('mousemove', this.mousemoveHandler)
    })
    
    this.canvas.addEventListener('mouseup', e => {
      this.canvas.removeEventListener('mousemove', this.mousemoveHandler)
    })
    
    this.btnPlay.addEventListener('click', () => {
      this.timeout = setInterval(() => {
        this.gameRun()
      }, 50)
    })
    this.btnPause.addEventListener('click', () => {
      clearInterval(this.timeout)
    })
    this.btnReset.addEventListener('click', () => {
      clearInterval(this.timeout)
      this.init()
    })
  }
  mouseHandler = e => {
    let x = Math.floor(e.layerX/this.cellSize)
    let y = Math.floor(e.layerY/this.cellSize)
    
    let target = this.gameData[y][x]
    target.state = !target.state
  
    this.renderCells()
  }
  mousemoveHandler = e => {
    let x = Math.floor(e.layerX/this.cellSize)
    let y = Math.floor(e.layerY/this.cellSize)
    
    let target = this.gameData[y][x]
    target.state = 1
  
    this.renderCells()
  }
}

new Live().start()