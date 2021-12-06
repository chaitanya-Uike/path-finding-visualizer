let delayTimeout
function delay(n) {
    return new Promise(function (resolve) {
        if (delayTimeout != undefined)
            clearTimeout(delayTimeout)
        delayTimeout = setTimeout(resolve, n * 1000);
    });
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
        let pathNode = document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`)
        pathNode.classList.remove("visited")
        pathNode.classList.remove("visited-animated")

        if (animation)
            pathNode.classList.add("path-animated")
        else
            pathNode.classList.add("path")
    }
}

function initWallsArray() {
    // initilize the walls array with 0's
    for (let i = 0; i < row * col; i++) {
        walls[i] = 0
    }
}

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

    Array.from(document.getElementsByClassName("wall-animated")).forEach(element => {
        element.classList.remove("wall-animated")
    })
}

function clearPath() {

    Array.from(document.getElementsByClassName("path")).forEach(element => {
        element.classList.remove("path")
    })

    Array.from(document.getElementsByClassName("path-animated")).forEach(element => {
        element.classList.remove("path-animated")
    })

    path = []
}

function clearVisitedNodes() {
    Array.from(document.getElementsByClassName("visited")).forEach(element => {
        element.classList.remove("visited")
    })

    Array.from(document.getElementsByClassName("visited-animated")).forEach(element => {
        element.classList.remove("visited-animated")
    })

}

function clearBoard() {
    startFlag = false
    djikstraStart.style.backgroundColor = ""
    djikstraStart.innerHTML = `<i style="color: #92D050; font-size: 60px;" class="material-icons">play_arrow</i>`

    clearWall()
    clearPath()
    clearVisitedNodes()
    resetNodes()
}


// maze generation functions
function initMaze() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            visited[i * col + j] = 0
            if (i % 2 != 0 && j % 2 != 0)
                continue
            walls[i * col + j] = 1
            document.getElementById(`${i}x${j}`).classList.add("wall")
        }
    }
}
