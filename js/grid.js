const grid = document.querySelector(".grid")

function createGrid(row, col) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            grid.innerHTML += `<div class="cell" id="${i}x${j}"></div>`
        }
    }
}

//  Grid drawing logic (changing the source and dest, drwaing walls)
let sourceChangeFlag = false

let destChangeFlag = false

let drawWalls = false

grid.addEventListener("mousedown", event => {

    if (event.target && event.target.matches("div.source") && !loading) {
        sourceChangeFlag = true
    }
    else if (event.target && event.target.matches("div.dest") && !loading) {
        destChangeFlag = true
    }
    else if (event.target && event.target.matches("div.cell") && !loading) {
        drawWalls = true
    }
})

grid.addEventListener("mouseup", event => {
    drawWalls = false
    sourceChangeFlag = false
    destChangeFlag = false

    // after mouse hold is stopped change the cursor to original
    document.querySelector(".source").style.cursor = ""
    document.querySelector(".dest").style.cursor = ""
})

grid.addEventListener("mouseover", async event => {
    if (event.target && event.target.matches("div.cell")) {

        if (sourceChangeFlag) {

            // change source
            // when node changes revert to original cursor
            document.querySelector(".source").style.cursor = ""
            document.querySelector(".source").classList.remove("source")

            document.getElementById(event.target.id).classList.add("source")
            // when node is being moved change the cursor to grabbing
            document.querySelector(".source").style.cursor = "grabbing"

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                if (algoSelect.value == "djikstra")
                    await djikstra(src, dest)
                else
                    await aStar(src, dest)
                await showPath(src, dest)
            }
        }


        else if (destChangeFlag) {
            // change dest
            // when node changes revert to original cursor
            document.querySelector(".dest").style.cursor = ""
            document.querySelector(".dest").classList.remove("dest")

            document.getElementById(event.target.id).classList.add("dest")
            // when node is being moved change the cursor to grabbing
            document.querySelector(".dest").style.cursor = "grabbing"

            let srcNode = document.querySelector(".source")
            let destNode = document.querySelector(".dest")

            let src = srcNode.id.split("x")[0] * col + srcNode.id.split("x")[1] * 1
            let dest = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

            if (startFlag) {
                if (algoSelect.value == "djikstra")
                    await djikstra(src, dest)
                else
                    await aStar(src, dest)
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
                if (algoSelect.value == "djikstra")
                    await djikstra(src, dest)
                else
                    await aStar(src, dest)
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
            if (algoSelect.value == "djikstra")
                await djikstra(src, dest)
            else
                await aStar(src, dest)
            await showPath(src, dest)
        }
    }
})