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
        document.getElementById(`${Math.floor(path[i] / col)}x${path[i] % col}`).style.backgroundColor = "greenyellow"
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