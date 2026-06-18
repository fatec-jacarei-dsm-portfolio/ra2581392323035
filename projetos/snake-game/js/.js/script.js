const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30

const snake = [
    { x: 270, y: 240 },
    { x: 300, y: 240 },
    { x: 330, y: 240 },
    { x: 360, y: 240 },
    { x: 390, y: 240 },
    { x: 420, y: 240 }
]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randowNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randowPosition = () => {
    const number = randowNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randowNumber(0, 255)
    const green = randowNumber(0, 255)
    const blue = randowNumber(0, 255)

    return ``
}


const food = {
    x : randowPosition(),
    y: randowPosition(),
    color: randomColor()
}

let direction, loopId 


const drawFood = () => {
    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index == snake.length - 1){
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({ x: head.x + size, y: head.y })
    }
    
    if(direction == "left"){
        snake.push({ x: head.x - size, y: head.y })
    }

    if(direction == "down"){
        snake.push({ x: head.x, y: head.y + size })
    }

    if(direction == "up"){
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i+=30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}
const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)

        let x = randowPosition ()
        let y = randowPosition ()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randowPosition ()
            y = randowPosition ()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.Width - size
    const neckIndex = snake.length - 2
    const wallCollision =
        head.x < 0 ||  head.x > 570 || head.y < 0 || head.y > 570

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

        if (wallCollision || selfCollision)
        alert("GAME OVER")
}

const gameOver = () => {
    direction = undefined

}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", ({ key })  => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})