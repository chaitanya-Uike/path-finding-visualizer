// A* algo
class Node {
    constructor(x, y, gcost, hcost) {
        this.x = x
        this.y = y
        this.gcost = gcost
        this.hcost = hcost
        this.fcost = this.gcost + this.hcost
    }

    get index() {
        return this.x * col + this.y
    }

}

function getNeighbours(node) {
    let neighbours = []
    let x, y, gcost, hcost

    let destNode = document.querySelector(".dest")
    let dest = new Node(parseInt(destNode.id.split("x")[0]), parseInt(destNode.id.split("x")[1]), 0, 0)

    // top
    if (node.x - 1 >= 0) {
        x = node.x - 1
        y = node.y
        gcost = node.gcost + 1
        hcost = Math.abs(dest.x - x) + Math.abs(dest.y - y)

        neighbours.push(new Node(x, y, gcost, hcost))

    }

    // right
    if (node.y + 1 < col) {
        x = node.x
        y = node.y + 1
        gcost = node.gcost + 1
        hcost = Math.abs(dest.x - x) + Math.abs(dest.y - y)

        neighbours.push(new Node(x, y, gcost, hcost))
    }

    // bottom
    if (node.x + 1 < row) {
        x = node.x + 1
        y = node.y
        gcost = node.gcost + 1
        hcost = Math.abs(dest.x - x) + Math.abs(dest.y - y)

        neighbours.push(new Node(x, y, gcost, hcost))
    }

    // left
    if (node.y - 1 >= 0) {
        x = node.x
        y = node.y - 1
        gcost = node.gcost + 1
        hcost = Math.abs(dest.x - x) + Math.abs(dest.y - y)

        neighbours.push(new Node(x, y, gcost, hcost))
    }

    return neighbours
}




async function aStar(src, dest) {

    // remove visited node
    clearVisitedNodes()

    for (let i = 0; i < row * col; i++)
        from[i] = src

    src = new Node(Math.floor(src / col), src % col, 0, 0)

    let openSet = new Map()
    let closedSet = new Map()

    openSet.set(src.index, src)

    while (openSet.size > 0) {

        // get the first element in the map
        let node = openSet.entries().next().value[1]
        openSet.forEach((value, key) => {
            if (value.fcost < node.fcost || value.fcost == node.fcost && value.hcost < node.hcost) {
                node = value
            }
        })

        openSet.delete(node.index)
        closedSet.set(node.index, node)

        if (node.index == dest)
            return


        let neighbours = getNeighbours(node)
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i]

            let isWall = false

            // if dest node is placed on a wall node
            if (walls[neighbour.index] == 1) {
                let destNode = document.querySelector(".dest")
                let destIndex = destNode.id.split("x")[0] * col + destNode.id.split("x")[1] * 1

                if (neighbour.index != destIndex)
                    isWall = true
            }


            if (isWall || closedSet.has(neighbour.index))
                continue

            if (openSet.has(neighbour.index)) {
                if (openSet.get(neighbour.index).gcost < neighbour.gcost)
                    continue
            }

            openSet.set(neighbour.index, neighbour)
            from[neighbour.index] = node.index

            if (animation) {
                await delay(1 / parseInt(document.querySelector("#speed").value))
            }

            // change color of the visited nodes
            document.getElementById(`${node.x}x${node.y}`).classList.add("visited")
        }
    }
}