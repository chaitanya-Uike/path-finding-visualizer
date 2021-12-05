function getMazeNeighbours(cell) {
    let neighbours = []

    let i = Math.floor(cell / col)
    let j = cell % col

    // only pick unvisited neighbours

    // top
    if (i - 2 >= 1) {
        if (visited[(i - 2) * col + j] == 0)
            neighbours.push((i - 2) * col + j)
    }

    // right
    if (j + 2 < col - 1) {
        if (visited[i * col + (j + 2)] == 0)
            neighbours.push(i * col + (j + 2))
    }

    // bottom
    if (i + 2 < row - 1) {
        if (visited[(i + 2) * col + j] == 0)
            neighbours.push((i + 2) * col + j)
    }

    // left
    if (j - 2 >= 1) {
        if (visited[i * col + (j - 2)] == 0)
            neighbours.push(i * col + (j - 2))
    }


    return neighbours
}

function removeWall(cell1, cell2) {
    let i1 = Math.floor(cell1 / col)
    let j1 = cell1 % col

    let i2 = Math.floor(cell2 / col)
    let j2 = cell2 % col

    // top
    if (j1 == j2 && i1 > i2) {
        walls[(i1 - 1) * col + j1] = 0
        document.getElementById(`${i1 - 1}x${j1}`).classList.remove("wall")
    }

    // right
    else if (i1 == i2 && j2 > j1) {
        walls[i1 * col + (j1 + 1)] = 0
        document.getElementById(`${i1}x${j1 + 1}`).classList.remove("wall")
    }

    // bottom
    else if (j1 == j2 && i2 > i1) {
        walls[(i1 + 1) * col + j1] = 0
        document.getElementById(`${i1 + 1}x${j1}`).classList.remove("wall")
    }

    // left
    else if (i1 == i2 && j1 > j2) {
        walls[i1 * col + (j1 - 1)] = 0
        document.getElementById(`${i1}x${j1 - 1}`).classList.remove("wall")
    }
}


async function recursiveBacktracker() {
    let stack = []

    let initialCell = 1 * col + 1

    // Make the initial cell the current cell and mark it as visited
    let currentCell = initialCell
    visited[initialCell] = 1

    while (true) {
        let neighbours = getMazeNeighbours(currentCell)
        // if the current cell has any unvisited neighbour 
        let neighbour
        if (neighbours.length > 0) {
            // choose randomly one of the unvisited neighbours
            neighbour = neighbours[Math.floor(Math.random() * neighbours.length)]

            // push the currentcell to the stack
            stack.push(currentCell)

            // remove the wall between  current cell and chosen cell
            await delay(1 / parseInt(document.querySelector("#speed").value))
            removeWall(currentCell, neighbour)

            // make the chosen cell the current cell and mark it as visited
            currentCell = neighbour
            visited[currentCell] = 1
        }
        else {
            currentCell = stack.pop()
        }

        // if we reach the initial cell return
        if (currentCell == initialCell)
            return
    }

}