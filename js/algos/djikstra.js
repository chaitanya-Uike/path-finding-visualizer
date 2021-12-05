function createAdjacencyMatrix() {

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
        if (!change) {
            animation = false
        }

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