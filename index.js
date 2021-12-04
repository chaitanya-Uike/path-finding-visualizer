const row = 22
const col = 60


let g = []
let from = new Array(row * col)
let path = []
let walls = []

for (let i = 0; i < row * col; i++) {
    walls[i] = 0
}

let startFlag = false
let loading = false
let animation = false

const grid = document.querySelector(".grid")

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

//  Grid drawing logic (changing the source and dest, drwaing walls)
let sourceChangeFlag = false

let destChangeFlag = false

let drawWalls = false

grid.addEventListener("mousedown", event => {

    if (event.target && event.target.matches("div.source")) {
        sourceChangeFlag = true
    }
    else if (event.target && event.target.matches("div.dest")) {
        destChangeFlag = true
    }
    else if (event.target && event.target.matches("div.cell")) {
        drawWalls = true
    }
})

grid.addEventListener("mouseup", event => {
    drawWalls = false
    sourceChangeFlag = false
    destChangeFlag = false
})

grid.addEventListener("mouseover", async event => {
    if (event.target && event.target.matches("div.cell") && loading == false) {

        if (sourceChangeFlag) {
            // change source
            document.querySelector(".source").classList.remove("source")
            document.getElementById(event.target.id).classList.add("source")

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                await djikstra(src, dest)
                await showPath(src, dest)
            }
        }


        else if (destChangeFlag) {
            // change dest
            document.querySelector(".dest").classList.remove("dest")
            document.getElementById(event.target.id).classList.add("dest")

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                await djikstra(src, dest)
                await showPath(src, dest)
            }
        }


        else if (drawWalls) {
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
                await djikstra(src, dest)
                await showPath(src, dest)
            }
        }

    }
})

// to draw walls based on individual clicks
grid.addEventListener("click", async event => {
    if (event.target && event.target.matches("div.cell") && !event.target.matches("div.source") && !event.target.matches("div.dest") && !loading) {
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
            await djikstra(src, dest)
            await showPath(src, dest)
        }
    }
})


// algos
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


async function djikstra(src, dest) {
    // remove visited node
    clearVisitedNodes()

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
            animation = false

        if (animation) {
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

async function showPath(src, dest) {

    // remove old path
    clearPath()

    j = dest
    while (j != src) {
        path.push(j)
        j = from[j];
    }
    path.push(src)
    path.reverse()


    for (let i = 0; i < path.length; i++) {
        if (animation) {
            await delay(1 / parseInt(document.querySelector("#speed").value))
        }
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = "greenyellow"
    }
}


// starting the program
createAdjacencyMatrix(row, col)
createGrid(row, col)

// default source and dest
document.getElementById(`${10}x${10}`).classList.add("source")
document.getElementById(`${10}x${49}`).classList.add("dest")


// start the visualizer
const djikstraStart = document.getElementById("djikstra_algo_start")

djikstraStart.addEventListener("click", async event => {

    // after clicking pause button
    if (startFlag && loading == false) {
        startFlag = false

        clearPath()

        clearVisitedNodes()

        djikstraStart.style.backgroundColor = ""
        djikstraStart.innerHTML = `<i class="material-icons">play_arrow</i>`
    }

    // after clicking forward button
    else if (startFlag && loading) {
        animation = false
    }

    // after clicking play button
    else {
        startFlag = true
        loading = true
        animation = true

        djikstraStart.style.backgroundColor = "#f44336"
        djikstraStart.innerHTML = `<i class="material-icons">fast_forward</i>`

        let srcNode = document.querySelector(".source")
        let destNode = document.querySelector(".dest")

        let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
        let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

        await djikstra(src, dest)
        await showPath(src, dest)

        loading = false
        animation = false
        djikstraStart.style.backgroundColor = "#2196f3"
        djikstraStart.innerHTML = `<i class="material-icons">pause</i>`
    }
})


// grid clearing functions

function resetNodes() {

    // remove old source and dest
    document.querySelector(".source").classList.remove("source")
    document.querySelector(".dest").classList.remove("dest")

    // default source and dest
    document.getElementById(`${10}x${10}`).classList.add("source")
    document.getElementById(`${10}x${49}`).classList.add("dest")
}

function clearWall() {
    for (let i = 0; i < row * col; i++) {
        walls[i] = 0
    }
    Array.from(document.getElementsByClassName("wall")).forEach(element => {
        element.classList.remove("wall")
    })
}

function clearPath() {

    for (let i = 0; i < path.length; i++) {
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = ""
    }

    path = []
}

function clearVisitedNodes() {
    Array.from(document.getElementsByClassName("visited")).forEach(element => {
        element.classList.remove("visited")
    })
}

function clearBoard() {
    startFlag = false
    djikstraStart.style.backgroundColor = ""
    djikstraStart.innerHTML = `<i class="material-icons">play_arrow</i>`

    clearWall()
    clearPath()
    clearVisitedNodes()
    resetNodes()
}

document.getElementById("clear-board").addEventListener("click", event => {
    if (!loading)
        clearBoard()
})

