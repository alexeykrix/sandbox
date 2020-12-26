class Tetris {
  constructor (selector="body", name="tetris") {
    this.selector = selector
    this.name = name
    this.template = `
    <style>
    .${this.name} {
      height: 100vh;
      position: relative;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .${this.name} .app {
      margin: 0;
      width: fit-content;
      display: flex;
      flex-direction: column;
    }
    .${this.name} .view {
      margin: 0;
      border: 5px solid #e67e22;
    }
    .${this.name} .info {
      margin-top: 10px;
      border: none;
      padding: 0 5px;
      border-bottom: 5px solid #e67e22;
    }
    .${this.name} .controls {
      position: absolute;
      left: 10px;
      top: 10px;
      width: fit-content;
      margin: 0 auto 5px;
      color: bisque;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }  
    .${this.name} .btn {
      display: inline-block;
      cursor: pointer;
      margin: 5px 0px;
      width: 20px;
      height:20px;
      border: none;
    }
    .${this.name} .btn.reset {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/263/263110.svg') center/80%;
    }
    .${this.name} .btn.pause {
      background: #ededed no-repeat url('https://www.flaticon.com/svg/static/icons/svg/748/748136.svg') center/80%;
    }
    </style>
    <div class="app">
      <div class="controls">
        <button class="btn pause"></button>
        <button class="btn reset"></button>
      </div>
      <canvas class="view" ></canvas>
      <canvas class="info"></canvas>
    </div>
    
    `
    if (document.querySelector(this.selector) === null) return;
    this.conatiner = document.createElement('div')
    this.conatiner.classList = this.name
    this.conatiner.innerHTML = this.template
    document.querySelector(this.selector).appendChild(this.conatiner)
    this.btnPlay = this.conatiner.querySelector('.play')
    this.btnPause = this.conatiner.querySelector('.pause')
    this.btnReset = this.conatiner.querySelector('.reset')
    this.canvas = this.conatiner.querySelector('.view')
    this.c = this.canvas.getContext('2d')
    this.canvasInfo = this.conatiner.querySelector('.info')
    this.cInfo = this.canvasInfo.getContext('2d')
    this.canvas.width = 300
    this.canvas.height = 600
    this.canvasInfo.height = 40
    this.c.fillStyle = this.cInfo.fillStyle  = '#eeeeee'
    this.c.strokeStyle = this.cInfo.strokeStyle  = '#000'
    this.c.lineWidth = this.cInfo.lineWidth  = '1'
    this.score = 0
    this.cellSize = 30
    this.cellsX = this.canvas.width / this.cellSize
    this.cellsY = this.canvas.height / this.cellSize
    this.figures = [
      [ //  I
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},],
        [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},]
      ],
      [ // J
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2},],
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 0},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2},]
      ],
      [ // L
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2},],
        [{x: 0, y: 2}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 0},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0},]
      ],
      [ // O
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},]
      ],
      [ // S
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2},],
        [{x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2},],
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2},],
      ],
      [ // T
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 1},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1},],
      ],
      [ // Z
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, ],
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, ],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, ],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}, ],
      ],
      [ //  I
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},],
        [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},]
      ],
      [ // J
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2},],
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 0},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2},]
      ],
      [ // L
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2},],
        [{x: 0, y: 2}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 0},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0},]
      ],
      [ // O
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},],
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1},]
      ],
      [ // S
        [{x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2},],
        [{x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2},],
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2},],
      ],
      [ // T
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 1},],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0},],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1},],
      ],
      [ // Z
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, ],
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, ],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, ],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}, ],
      ],
    ]
    this.gameData = this.directions = this.figure = this.current = []
    this.figId = null
    this.figRotate = 0
    this.scoreMylty = 0
    this.speed = 1000/(this.score/10+1.5)
    this.nextFigureId = this.randomFigure()
    this.touchOldY
    this.touchOldX
    this.renderTimeout
    this.moveTimeout
  }

  randomFigure = () => {
    let rand = - 0.5 + Math.random() * this.figures.length;
    return Math.round(rand);
  }
  checkSolved = () => {
    for (let i = 0; i < 20; i++) {
      let lastRow = [0,0,0,0,0,0,0,0,0,0,]
      this.gameData.forEach(el=> {
        if (el.y === i) {
          lastRow[el.x] = 1
        }
      })
    
      let allLine = true
      lastRow.forEach(el => el === 1? '': allLine=false)
  
      let ids = []
      
      if (allLine === true) {
        this.gameData.forEach((el, id) => el.y === i? ids.push(id) :'')
        this.gameData.forEach(el => el.y <= i? el.y++ :'')
      }
  
      ids.forEach(id => {
        this.gameData[id].x = -1
        this.gameData[id].y = -1
      })
  
      this.gameData = this.gameData.filter(a => (a.x !== -1 && a.y !== -1))
      if (ids.length) this.scoreMylty++
    }
  }
  nextFig = isInit => {
    isInit? '' : this.current.forEach(el => this.gameData.push(JSON.parse(JSON.stringify(el))))
    let colors = ['#e67e22','#e74c3c','#3498db','#9b59b6','#f1c40f',
        '#2ecc71','#44bd32','#f39c12','#16a085','#c0392b','#2980b9',
        '#8e44ad','#575fcf','#e1b12c','#ff5e57','#cf6a87','#f8a5c2',
        '#f7d794','#f3a683','#786fa6','#e84118',]
    let color = colors[Math.round(-0.5 + Math.random()*colors.length)]
    this.figId = this.nextFigureId
    this.figure = JSON.parse(JSON.stringify(this.figures[this.figId]))
    this.current = this.figure[this.figRotate].slice()
    this.current.forEach(el => el.color = color)
    this.current.forEach(el=> el.x = el.x +3)
    this.checkSolved()
    this.nextFigureId = this.randomFigure()
    
    this.directions = []
    this.touchOldY = null
    this.touchOldX = null
  }
  clearCanvas = () => {
    this.c.fillStyle = '#3d3d3e'
    this.c.beginPath()
    this.c.rect(0, 0, this.canvas.width, this.canvas.height)
    this.c.fill()
    this.c.closePath()
  
    this.cInfo.fillStyle = '#121212'
    this.cInfo.beginPath()
    this.cInfo.rect(0, 0, this.canvas.width, this.canvas.height)
    this.cInfo.fill()
    this.cInfo.closePath()
  }
  renderBlock = (x, y, color) => {  
    this.c.fillStyle = color
  
    this.c.beginPath()
    this.c.rect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
    this.c.fill()
    this.c.closePath()
  }
  renderNextBlock = (x, y, color) => {  
    this.cInfo.fillStyle = color
  
    this.cInfo.beginPath()
    this.cInfo.rect(x*10+10, y*10, 10, 10)
    this.cInfo.fill()
    this.cInfo.closePath()
  }
  makeChanges = () => {
    let d = this.directions[0]
    if (d === 'moveDown') this.moveFigure() 
    if (d === 'moveLeft') this.leftHandler()
    if (d === 'moveRight') this.rightHandler()
    if (d === 'rotate') this.rotateHandler()
  
    this.directions.shift()
  }
  render = () => {
    this.makeChanges()
    this.clearCanvas()
  
    this.cInfo.fillStyle = '#e67e22'
    this.cInfo.font = '20px "Roboto Mono"'
    this.cInfo.textAlign = 'right';
    this.cInfo.fillText('best: '+ (localStorage.getItem('bestTetris') || 0), 290, 27)
    
    this.c.fillStyle = '#242424'
    this.c.font = '90px "Roboto Mono"'
    this.c.textAlign = 'center';
    this.c.fillText(this.score, this.canvas.width/2, this.canvas.width/2+20)
    
    this.figures[this.nextFigureId][0]
      .forEach( block => this.renderNextBlock(block.x, block.y, '#e67e22'))
  
    let fallFigure = [0,0,0,0,0,0,0,0,0,0]
    this.current.forEach(block=> {
      if (fallFigure[block.x] < block.y) {
        fallFigure[block.x] = block.y
      }
    })
  
    fallFigure.forEach((y, x) => {
      if (y > 0) {
        for (let i=1; i < 20; i++) {
          this.renderBlock(x, y+i, '#12121240')
        }
      }
    })
  
    this.current.forEach( block => this.renderBlock(block.x, block.y, block.color))
    this.gameData.forEach( block => this.renderBlock(block.x, block.y, block.color))
  }
  
  moveFigure = () => {
    let scoreset = [0, 1, 3, 7, 15]
  
    if (this.scoreMylty > 0) {
      clearInterval(this.moveTimeout)
      this.moveTimeout = setInterval(() =>this.directions.push('moveDown'), this.speed)
    } 
    this.score += scoreset[this.scoreMylty]
    this.scoreMylty = 0
  
    if (+localStorage.getItem('bestTetris') < this.score) {
      localStorage.setItem('bestTetris', this.score)
    }
  
    let fallFigure = [0,0,0,0,0,0,0,0,0,0]
    this.current.forEach(block=> {
      if (fallFigure[block.x] < block.y) {
        fallFigure[block.x] = block.y
      }
    })
  
    let futurePos = []
    let isNewBusy = false
  
    fallFigure.forEach( (el, id) => {
      if (el !== 0) futurePos.push({'x': id, 'y': el+1})
    })
    
    futurePos.forEach( el => {
      if (19 < el.y ) isNewBusy = true
    })
  
    for (let i = 0; i < this.gameData.length-1; i++) {
      let data = this.gameData[i]
      futurePos.forEach( el => {
        if (data.x === el.x && data.y === el.y ) isNewBusy = true
      })
    }
  
    if (isNewBusy) {
      if (this.current[0].y === 0 ||
          this.current[0].y === 1 ||
          this.current[0].y === 2) {
        this.score = 0
        clearInterval(this.renderTimeout)
        clearInterval(this.moveTimeout)
        this.directions = []
        this.renderTimeout = undefined
        this.moveTimeout = undefined

        this.c.fillStyle = '#121212e0'
        this.c.beginPath()
        this.c.rect(0, 0, this.canvas.width, this.canvas.height)
        this.c.fill()
        this.c.closePath()
            
        this.c.fillStyle = '#ededed'
        this.c.font = '50px "Roboto Mono"'
        this.c.textAlign = 'center';
        this.c.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2 +25)
        
        this.gameData = []
        return
      } else this.nextFig()
    } else this.current.forEach(block => block.y++)
    
  }
  init = () => {
    this.nextFig(true)
    this.renderTimeout = setInterval(() =>this.render(), 20)
    this.moveTimeout = setInterval(() =>this.directions.push('moveDown'), this.speed)
    this.render()
  }
  rotateHandler = () => {
    let nextFigId = this.figRotate !== 3? this.figRotate +1 : 0
    let thisRotate = this.figures[this.figId][this.figRotate]
    let nextRotate = this.figures[this.figId][nextFigId]
    let moveX, moveY
    let isNewBusy = false
    let movedFig = []
    this.current.forEach( block => movedFig.push(JSON.parse(JSON.stringify(block))))
  
    moveX = movedFig[0].x - thisRotate[0].x
    moveY = movedFig[0].y - thisRotate[0].y
  
    nextRotate.forEach( el => {
      if (9 < (el.x + moveX) || 0 > (el.x + moveX) || 
          19 < (el.y + moveY) ) isNewBusy = true
    })
  
    for (let i = 0; i < this.gameData.length-1; i++) {
      let data = this.gameData[i]
      nextRotate.forEach( el => {
        if (data.x === (el.x + moveX) && 
            data.y === (el.y + moveY) ) isNewBusy = true
      })
    }
  
    if (!isNewBusy) {
      this.current.forEach( (block, id) => {
        block.x = nextRotate[id].x + moveX
        block.y = nextRotate[id].y + moveY
      })  
      this.figRotate = nextFigId
    }
  }
  leftHandler = () => {
    let fallFigure = [10,10,10,10,10,10,10,10,10,10,
                      10,10,10,10,10,10,10,10,10,10]
    
    let isNewBusy = false
    this.current.forEach(block=> {
      if (fallFigure[block.y] > block.x) fallFigure[block.y] = block.x
    })
    let fallFigureY = 20
    fallFigure = fallFigure.filter(a => {
      if (a <= 9) {
        if (a-1 < 0) isNewBusy = true
        if (fallFigureY > fallFigure.indexOf(a)) {
          fallFigureY = fallFigure.indexOf(a)
        }
        return true
      }
    })
    
    let futurePos = []
    fallFigure.forEach((x, id) => {
      futurePos.push({
        'x': x-1,
        'y': fallFigureY + id,
      })
    })
  
    for (let i = 0; i < this.gameData.length-1; i++) {
      let data = this.gameData[i]
      futurePos.forEach( el => {
        if (data.x === el.x && data.y === el.y ) isNewBusy = true
      })
    }
  
    !isNewBusy? this.current.forEach(el => el.x--) :''
  }
  rightHandler = () => {
    let fallFigure = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    let isNewBusy = false
    this.current.forEach(block => {
      if (fallFigure[block.y] < block.x) fallFigure[block.y] = block.x
    })
    let fallFigureY = 20
    fallFigure = fallFigure.filter(a => {
      if (a > 0 ) {
        if (a+1 > 9) isNewBusy = true
        if (fallFigureY > fallFigure.indexOf(a)) {
          fallFigureY = fallFigure.indexOf(a)
        }
        return true
      }
    })
    
    let futurePos = []
    fallFigure.forEach((x, id) => {
      futurePos.push({
        'x': x+1,
        'y': fallFigureY + id,
      })
    })
    for (let i = 0; i < this.gameData.length-1; i++) {
      let data = this.gameData[i]
      futurePos.forEach( el => {
        if (data.x === el.x && data.y === el.y ) isNewBusy = 1
      })
    }
    !isNewBusy? this.current.forEach(el => el.x++) :''
  }
  keydownHandler = (e) => {
    if (e.code === 'ArrowUp' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'ArrowDown') e.preventDefault()
    if (this.renderTimeout === undefined && 
        (e.code === 'Space' || e.code === 'KeyP' ||
        e.code === 'Enter' || e.code === 'Escape' || 
        e.code === 'KeyW' || e.code === 'ArrowUp'||
        e.code === 'KeyA' || e.code === 'ArrowLeft'||
        e.code === 'KeyD' || e.code === 'ArrowRight'||
        e.code === 'KeyS' || e.code === 'ArrowDown')) {
      this.directions= []
      this.renderTimeout = setInterval(() =>this.render(), 20)
      this.moveTimeout = setInterval(() =>this.directions.push('moveDown'), this.speed)
    }
    if (e.code === 'KeyW' || e.code === 'ArrowUp') this.directions.push('rotate')
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.directions.push('moveLeft')
    if (e.code === 'KeyD' || e.code === 'ArrowRight') this.directions.push('moveRight')
    if (e.code === 'KeyS' || e.code === 'ArrowDown') this.directions.push('moveDown')
  }
  

  start() {    
    if (document.querySelector(this.selector) === null) return;
    
    this.nextFig(true)
    this.render()
    document.addEventListener('keydown', this.keydownHandler)

    this.btnPause.addEventListener('click', () => {
      clearInterval(this.renderTimeout)
      clearInterval(this.moveTimeout)
      this.renderTimeout = undefined
      this.moveTimeout = undefined
      this.directions= []
    
      this.c.fillStyle = '#121212f0'
      this.c.beginPath()
      this.c.rect(0, 0, this.canvas.width, this.canvas.height)
      this.c.fill()
      this.c.closePath()
    })
    this.btnReset.addEventListener('click', () => {
      clearInterval(this.renderTimeout)
      clearInterval(this.moveTimeout)
      this.gameData = []
      this.directions= []
      this.init()
    })
    
    this.canvas.addEventListener('touchstart', e => {
      let t = e.touches[0]
    
      this.touchOldX = t.clientX
      this.touchOldY = t.clientY
      
      if (e.target.id) {
        if (e.target.id === 'info') {
          return
        }
      }
    
      if (this.renderTimeout === undefined) {
        this.renderTimeout = setInterval(() =>this.render(), 20)
        this.moveTimeout = setInterval(() =>this.directions.push('moveDown'), this.speed)
      }
    })
    
    this.canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      let tX = e.touches[0].clientX
      let tY = e.touches[0].clientY
      
      if (this.touchOldX === null || this.touchOldY === null) {
        this.touchOldX = tX
        this.touchOldY = tY
        return
      }
    
      let moduleX = this.touchOldX - tX
      let moduleY = tY - this.touchOldY
    
      if (moduleY > 100) {
        this.directions.push('moveDown')
        this.touchOldX = tX
        this.touchOldY = tY
        return
      }
      if (moduleX < -30) {
        this.directions.push('moveRight')
        this.touchOldX = tX
        this.touchOldY = tY
        return
      }
      if (moduleX > 30) {
        this.directions.push('moveLeft')
        this.touchOldX = tX
        this.touchOldY = tY
        return
      }
    })
    
    this.canvas.addEventListener('touchend', e => {
      let t = e.changedTouches[0].clientX
      let moduleX = this.touchOldX - t
    
      if (e.target.id) {
        if (e.target.id === 'info') return
      }
    
      if (moduleX === 0) this.rotateHandler()
    })
    
    this.canvasInfo.addEventListener('touchstart', e => this.moveFigure())
  }
}

new Tetris('body', 'tetris').start()