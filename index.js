// TODO's
// 1. cahnge the restart button to a fast forward button



const row = 22
const col = 60
let g = []



const grid = document.querySelector(".grid")

let startFlag = false

function createGrid(row, col) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            grid.innerHTML += `<div class="cell" id="${i}x${j}"></div>`
        }
    }
}

let delayTimeout
function delay(n) {
    return new Promise(function (resolve) {
        if (delayTimeout != undefined)
            clearTimeout(delayTimeout)
        delayTimeout = setTimeout(resolve, n * 1000);
    });
}



// wall creation logic
let walls = []

for (let i = 0; i < row * col; i++) {
    walls[i] = 0
}

let drawWalls = false

grid.addEventListener("mousedown", event => {
    if (event.target && event.target.matches("div.cell") && !event.target.matches("div.source") && !event.target.matches("div.dest") && loading == false) {
        drawWalls = true
    }
})

grid.addEventListener("mouseover", async event => {
    if (event.target && event.target.matches("div.cell") && !event.target.matches("div.source") && !event.target.matches("div.dest")) {
        if (drawWalls) {
            let cell_id = event.target.id.split("x")[0] * col + event.target.id.split("x")[1] * 1
            if (walls[cell_id] == 0) {
                walls[cell_id] = 1
                event.target.classList.add("wall")
            }
            else {
                walls[cell_id] = 0
                event.target.classList.remove("wall")
            }

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1
            if (startFlag) {
                await djikstra(src, dest, false)
                await showPath(src, dest, false)
            }
        }

    }
})

grid.addEventListener("mouseup", event => {
    drawWalls = false
})




function createAdjacencyMatrix(row, col) {

    for (let i = 0; i < row * col; i++) {
        g[i] = new Array()
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            // top
            if (i - 1 >= 0) {
                g[i * col + j].push((i - 1) * col + j)
            }
            else {
                g[i * col + j].push(-1)
            }

            // right
            if (j + 1 < col) {
                g[i * col + j].push(i * col + (j + 1))
            }
            else {
                g[i * col + j].push(-1)
            }

            // bottom
            if (i + 1 < row) {
                g[i * col + j].push((i + 1) * col + j)
            }
            else {
                g[i * col + j].push(-1)
            }

            // left
            if (j - 1 >= 0) {
                g[i * col + j].push(i * col + (j - 1))
            }
            else {
                g[i * col + j].push(-1)
            }
        }
    }
}

let from = new Array(row * col)

async function djikstra(src, dest, delayFlag) {


    // remove visited node
    Array.from(document.getElementsByClassName("visited")).forEach(element => {
        element.classList.remove("visited")
    })

    let n = row * col

    let D = new Array(n)
    let ST = new Array(n)

    for (let i = 0; i < n; i++) {
        D[i] = 9999
        ST[i] = 0
        from[i] = src
    }
    D[src] = 0

    let u
    for (let i = 0; i < n - 1; i++) {
        let change = false
        let min = 9999;
        for (let j = 0; j < n; j++) {
            if (D[j] < min && ST[j] == 0) {
                min = D[j];
                u = j;
                change = true
            }
        }

        ST[u] = 1;

        // if no change takes place, then it means that there is no path
        if (!change)
            delayFlag = false

        if (delayFlag) {
            await delay(1 / parseInt(document.querySelector("#speed").value))
        }

        // change color of the visited nodes
        document.getElementById(`${Math.floor(u / col)}x${u % col}`).classList.add("visited")

        if (u == dest)
            return

        for (let v = 0; v < 4; v++) {
            if (g[u][v] == -1)
                continue
            let weight = 1
            if (walls[g[u][v]] == 1 && dest != g[u][v]) {
                weight = 9999
            }
            if (D[u] + weight < D[g[u][v]]) {
                D[g[u][v]] = D[u] + weight;
                from[g[u][v]] = u;
            }
        }

    }

}

let path = []
async function showPath(src, dest, delayFlag) {

    // remove old path
    for (let i = 0; i < path.length; i++) {
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = ""
    }

    path = []

    j = dest
    while (j != src) {
        path.push(j)
        j = from[j];
    }
    path.push(src)
    path.reverse()


    for (let i = 0; i < path.length; i++) {
        if (delayFlag) {
            await delay(1 / parseInt(document.querySelector("#speed").value))
        }
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = "greenyellow"
    }
}



createAdjacencyMatrix(row, col)
createGrid(row, col)

// default source and dest
document.getElementById(`${10}x${10}`).classList.add("source")
document.getElementById(`${10}x${49}`).classList.add("dest")


let loading = false

//  code to change the source
let sourceChangeFlag = false

function setSourceFlagFalse() {
    sourceChangeFlag = false
}

function setSourceFlagTrue() {
    sourceChangeFlag = true
}

document.querySelector(".source").addEventListener("mousedown", setSourceFlagTrue)
document.querySelector(".source").addEventListener("mouseup", setSourceFlagFalse)

grid.addEventListener("mouseover", async event => {
    if (event.target && event.target.matches("div.cell") && loading == false) {
        if (sourceChangeFlag) {
            // remove old event listeners
            document.querySelector(".source").removeEventListener("mousedown", setSourceFlagTrue)
            document.querySelector(".source").removeEventListener("mouseup", setSourceFlagFalse)

            // change source
            document.querySelector(".source").classList.remove("source")
            document.getElementById(event.target.id).classList.add("source")

            // add new event listeners
            document.querySelector(".source").addEventListener("mousedown", setSourceFlagTrue)
            document.querySelector(".source").addEventListener("mouseup", setSourceFlagFalse)

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                await djikstra(src, dest, false)
                await showPath(src, dest, false)
            }
        }
    }
})

//  code to change the destination
let destChangeFlag = false

function setDestFlagFalse() {
    destChangeFlag = false
}

function setDestFlagTrue() {
    destChangeFlag = true
}

document.querySelector(".dest").addEventListener("mousedown", setDestFlagTrue)
document.querySelector(".dest").addEventListener("mouseup", setDestFlagFalse)

grid.addEventListener("mouseover", async event => {
    if (event.target && event.target.matches("div.cell") && loading == false) {
        if (destChangeFlag) {
            // remove old event listeners
            document.querySelector(".dest").removeEventListener("mousedown", setDestFlagTrue)
            document.querySelector(".dest").removeEventListener("mouseup", setDestFlagFalse)

            // change dest
            document.querySelector(".dest").classList.remove("dest")
            document.getElementById(event.target.id).classList.add("dest")

            // add new event listeners
            document.querySelector(".dest").addEventListener("mousedown", setDestFlagTrue)
            document.querySelector(".dest").addEventListener("mouseup", setDestFlagFalse)

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                await djikstra(src, dest, false)
                await showPath(src, dest, false)
            }
        }
    }
})

// start the visualizer

const djikstraStart = document.getElementById("djikstra_algo_start")

djikstraStart.addEventListener("click", async event => {

    if (startFlag && loading == false) {
        startFlag = false
        // remove old path
        for (let i = 0; i < path.length; i++) {
            document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = ""
        }
        // remove visited node
        Array.from(document.getElementsByClassName("visited")).forEach(element => {
            element.classList.remove("visited")
        })
        djikstraStart.style.backgroundColor = ""
        djikstraStart.innerHTML = `<i class="material-icons">play_arrow</i>`
    }
    else {
        startFlag = true
        loading = true
        djikstraStart.style.backgroundColor = "#f44336"
        djikstraStart.innerHTML = `<i class="material-icons">restore</i>`

        let srcNode = document.querySelector(".source")
        let destNode = document.querySelector(".dest")

        let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
        let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1
        await djikstra(src, dest, true)
        await showPath(src, dest, true)

        loading = false
        djikstraStart.style.backgroundColor = "#2196f3"
        djikstraStart.innerHTML = `<i class="material-icons">pause</i>`
    }
})

function clearWall() {
    for (let i = 0; i < row * col; i++) {
        walls[i] = 0
    }
    Array.from(document.getElementsByClassName("wall")).forEach(element => {
        element.classList.remove("wall")
    })
}

function clearBoard() {

    startFlag = false
    djikstraStart.style.backgroundColor = ""
    djikstraStart.innerHTML = `<i class="material-icons">play_arrow</i>`

    clearWall()

    // remove old path
    for (let i = 0; i < path.length; i++) {
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = ""
    }
    path = []

    // remove visited node
    Array.from(document.getElementsByClassName("visited")).forEach(element => {
        element.classList.remove("visited")
    })

}

document.getElementById("clear-board").addEventListener("click", event => {
    if (!loading)
        clearBoard()
})

