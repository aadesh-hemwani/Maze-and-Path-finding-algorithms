import {wall, explore, path, visited} from './colors.js'
import {exploreAnimation, visitedAnimation, pathAnimation} from './animation.js'
import PriorityQueue from './priority_queue.js'
import {delay} from './util.js'

class Search {
    constructor() {
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    }
    DFS = async (blocks, start, end) => {
        let rows = blocks.length;
        let cols = blocks[0].childElementCount;
        
        if(start[0] >= 1 && start[0] < rows-1 && start[1] >=1 && start[1] < cols-1 && blocks[start[0]].childNodes[start[1]].style.backgroundColor !== visited && blocks[start[0]].childNodes[start[1]].style.backgroundColor !== explore && blocks[start[0]].childNodes[start[1]].style.backgroundColor !== wall){    
            let block = blocks[start[0]].childNodes[start[1]];
            block.animate(exploreAnimation, 1000);
            block.style.backgroundColor = explore;
            await delay(30);
            if(start[0] === end[0] && start[1] === end[1]){    
                block.style.backgroundColor = path;
                return true;
            }
            
            for(let i=0; i<4; ++i){
                 if(await this.DFS(blocks, [start[0]+this.directions[i][0], start[1]+this.directions[i][1]], end) === true){
                    blocks[start[0]].childNodes[start[1]].animate(pathAnimation, 300);
                    blocks[start[0]].childNodes[start[1]].style.backgroundColor = path;
                    await delay(30);
                    return true;
                 }
            }
            await delay(60);
            blocks[start[0]].childNodes[start[1]].animate(visitedAnimation, 1000);
            blocks[start[0]].childNodes[start[1]].style.backgroundColor = visited;
            return false;
        }
        else{
            return false;
        }
    }

    BFS = async (blocks, start, end) =>{
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;
        
        let q = [];
        let visited = new Set();
        let backtrack = new Map();
        q.push(blocks[start[0]].childNodes[start[1]]);

        while (q.length > 0) {
            let node = q.shift();
            
            if (node === blocks[end[0]].childNodes[end[1]]) {
                let pathNodes = [node];
                node.style.backgroundColor = explore;
                while (node !== blocks[start[0]].childNodes[start[1]]) {
                    node = backtrack.get(node);
                    pathNodes.push(node);
                }
                while (pathNodes.length !== 0) {
                    let p = pathNodes.pop();
                    await delay(30);
                    p.animate(pathAnimation, 300);
                    p.style.backgroundColor = path;
                }
                break;
            }
            let row_index = node.parentElement.rowIndex;
            let col_index = node.cellIndex;

            for (let i = 0; i < 4; ++i) {
                let check_row = this.directions[i][0] + row_index;
                let check_col = this.directions[i][1] + col_index;
                if (check_row >= 1 && check_row < rows - 1 && check_col >= 1 && check_col < cols - 1) {
                    if (blocks[check_row].childNodes[check_col].style.backgroundColor !== wall && blocks[check_row].childNodes[check_col].style.backgroundColor !== explore && !visited.has(blocks[check_row].childNodes[check_col])) {
                        q.push(blocks[check_row].childNodes[check_col]);
                        visited.add(blocks[check_row].childNodes[check_col]);
                        backtrack.set(blocks[check_row].childNodes[check_col], node);
                    }
                }
            }
            node.animate(exploreAnimation, 1000);
            node.style.backgroundColor = explore;
            await delay(20);    
        }
    }

    dijkstra = async (blocks, start, end) => {
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;
        let distance = new Map();
        let visited = new Set();
        const q = new PriorityQueue();
        let backtrack = new Map();

        for (let i = 1; i < rows - 1; i++) {
            await delay(20);
            for (let j = 1; j < cols - 1; j++) {
                let cBlock = blocks[i].childNodes[j];
                if (cBlock.style.backgroundColor !== wall) {
                    cBlock.animate(exploreAnimation, 500);
                    distance.set(cBlock, Infinity);
                    cBlock.style.fontSize = "1rem";
                    cBlock.innerHTML = "&#8734;";
                }
            }
        }
        let startNode = blocks[start[0]].childNodes[start[[1]]];
        distance.set(startNode, 0);
        q.enqueue(startNode, distance.get(startNode));
        visited.add(startNode);

        while (q.peek() !== undefined) {
            let node = q.dequeue();
            node.animate(exploreAnimation, 1500);
            node.style.backgroundColor = explore;
            await delay(30);

            if (node === blocks[end[0]].childNodes[end[1]]) {
                let pathNodes = [];
                pathNodes.push(node);
                while (node !== blocks[start[0]].childNodes[start[1]]) {
                    node = backtrack.get(node);
                    pathNodes.push(node);
                }
                for (let i = pathNodes.length - 1; i >= 0; --i) {
                    await delay(30);
                    pathNodes[i].animate(pathAnimation, 300);
                    pathNodes[i].style.backgroundColor = path;
                }
                break;
            }

            let row_index = node.parentElement.rowIndex;
            let col_index = node.cellIndex;

            for (let i = 0; i < 4; ++i) {
                let check_row = this.directions[i][0] + row_index;
                let check_col = this.directions[i][1] + col_index;

                if (rows - 1 > check_row >= 1 && cols - 1 > check_col >= 1) {
                    let neighbour = blocks[check_row].childNodes[check_col];
                    if (neighbour.style.backgroundColor !== wall && neighbour.style.backgroundColor !== explore && !visited.has(neighbour)) {
                        if (distance.get(node) + 1 < distance.get(neighbour)) {
                            distance.set(neighbour, distance.get(node) + 1);
                            backtrack.set(neighbour, node);
                            visited.add(neighbour);
                            if (distance.has(neighbour)) {
                                if (distance.get(neighbour) === Infinity) {
                                    neighbour.innerHTML = "&#8734;";
                                }
                                else {
                                    neighbour.innerHTML = distance.get(neighbour);
                                    neighbour.style.fontSize = "0.7rem";
                                }
                            }
                        }
                        q.enqueue(neighbour, distance.get(neighbour));
                    }
                }
            }
        }
    }

    bidirectionalSearch = async (blocks, start, end) => {
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;
        let source_q = [];
        let destin_q = [];

        let s_visited = new Set();
        let d_visited = new Set();

        let s_backtrack = new Map();
        let d_backtrack = new Map();

        source_q.push(blocks[start[0]].childNodes[start[1]]);
        destin_q.push(blocks[end[0]].childNodes[end[1]]);
        
        while (source_q.length > 0 || destin_q.length > 0) {
            let s_node, d_node;
            if (source_q.length > 0) {
                s_node = source_q.shift();

                let row_index = s_node.parentElement.rowIndex;
                let col_index = s_node.cellIndex;

                if (d_visited.has(s_node)) {
                    s_node.animate(exploreAnimation, 1000);
                    // s_node.style.backgroundColor = path;
                    let path1 = [], path2 = [];
                    d_node = s_node;
                    path1.push(d_node);

                    while (s_node !== blocks[start[0]].childNodes[start[1]] || d_node !== blocks[end[0]].childNodes[end[1]]) {
                        if (d_node !== blocks[end[0]].childNodes[end[1]]) {
                            d_node = d_backtrack.get(d_node);
                            path1.push(d_node);
                        }
                        if (s_node !== blocks[start[0]].childNodes[start[1]]) {
                            s_node = s_backtrack.get(s_node);
                            path2.push(s_node);
                        }
                    }
                    for (let i = path2.length - 1; i >= 0; --i) {
                        await delay(30);
                        path2[i].animate(pathAnimation, 300);
                        path2[i].style.backgroundColor = path;
                    }
                    for (let i = 0; i < path1.length; ++i) {
                        await delay(30);
                        path1[i].animate(pathAnimation, 300);
                        path1[i].style.backgroundColor = path;
                    }
                    break;
                }

                for (let i = 0; i < 4; ++i) {
                    let check_row = this.directions[i][0] + row_index;
                    let check_col = this.directions[i][1] + col_index;
                    if(rows-1 > check_row >= 1 && cols-1 > check_col >= 1) {
                        let neighbour = blocks[check_row].childNodes[check_col];
                        if (neighbour.style.backgroundColor !== wall && neighbour.style.backgroundColor !== explore && !(s_visited.has(neighbour))) {
                            source_q.push(neighbour);
                            s_visited.add(neighbour);
                            s_backtrack.set(neighbour, s_node);
                        }
                    }
                }
            }
            if (destin_q.length !== 0) {
                d_node = destin_q.shift();
                let row_index = d_node.parentElement.rowIndex;
                let col_index = d_node.cellIndex;

                for (let i = 0; i < 4; ++i) {
                    let check_row = this.directions[i][0] + row_index;
                    let check_col = this.directions[i][1] + col_index;
                    if(rows-1 > check_row >= 1 && cols-1 > check_col >= 1) {
                        let neighbour = blocks[check_row].childNodes[check_col];
                        if (neighbour.style.backgroundColor !== wall && neighbour.style.backgroundColor !== explore && !d_visited.has(neighbour)) {
                            destin_q.push(neighbour);
                            d_visited.add(neighbour);
                            d_backtrack.set(neighbour, d_node);
                        }
                    }
                }
            }

            s_node.animate(exploreAnimation, 1000);
            d_node.animate(exploreAnimation, 1000);

            s_node.style.backgroundColor = explore;
            d_node.style.backgroundColor = explore;
            await delay(20);
        }
    }

    manhattanHeuristic(current, goal) {
        let curr = [current.closest('tr').rowIndex, current.cellIndex];
        let h = Math.abs(curr[0] - goal[0]) + Math.abs(curr[1] - goal[1]);
        return h;
    }

    AStar = async (blocks, start, end) =>{
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;

        let openQueue = new PriorityQueue();
        let openSet = new Set();

        let cameFrom = new Map();

        let gScore = new Map();
        let fScore = new Map();
        for (let i = 1; i < rows - 1; i++) {
            for (let j = 1; j < cols - 1; j++) {
                gScore.set(blocks[i].childNodes[j], Infinity);
                fScore.set(blocks[i].childNodes[j], Infinity);
            }
        }
        let startNode = blocks[start[0]].childNodes[start[1]];
        let endNode = blocks[end[0]].childNodes[end[1]];

        gScore.set(startNode, 0);
        fScore.set(startNode, this.manhattanHeuristic(startNode, end) + gScore.get(startNode));

        openQueue.enqueue(startNode, fScore.get(startNode));
        openSet.add(startNode);

        while (openSet.size > 0) {
            let current = openQueue.dequeue();
            if (current === endNode) {
                current.style.backgroundColor = path;
                let p = cameFrom.get(current);
                while (p !== undefined) {
                    await delay(30);
                    p.animate(pathAnimation, 300);
                    p.style.backgroundColor = path;
                    p = cameFrom.get(p);
                }
                return;
            }

            current.animate(exploreAnimation, 500);
            current.style.backgroundColor = explore;
            await delay(20);

            openSet.delete(current);
            let curr = [current.closest('tr').rowIndex, current.cellIndex];
            for (let i = 0; i < 4; i++) {
                let check_row = this.directions[i][0] + curr[0];
                let check_col = this.directions[i][1] + curr[1];
                if (rows-1 > check_row >= 1 && cols-1 > check_col >= 1) {
                    let neighbour = blocks[check_row].childNodes[check_col];
                    if (neighbour.style.backgroundColor !== wall && !(openSet.has(neighbour))) {
                        let tempG = gScore.get(current) + 1;
                        if (tempG < gScore.get(neighbour)) {
                            cameFrom.set(neighbour, current);
                            gScore.set(neighbour, tempG);
                            fScore.set(neighbour, this.manhattanHeuristic(neighbour, end) + tempG);
                            if (!openSet.has(neighbour)) {
                                openSet.add(neighbour);
                                openQueue.enqueue(neighbour, fScore.get(neighbour));
                            }
                        }
                    }
                }
            }
        }
        console.log("no solution");
    }

    bestFirst = async (blocks, start, end) => {
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;
        let openQueue = new PriorityQueue();
        let visited = new Set();
        let cameFrom = new Map();

        let fScore = new Map();
        let startNode = blocks[start[0]].childNodes[start[1]];
        let endNode = blocks[end[0]].childNodes[end[1]];
        fScore.set(startNode, this.manhattanHeuristic(startNode, end));

        openQueue.enqueue(startNode, fScore.get(startNode));
        visited.add(startNode);

        while (openQueue.peek() !== undefined) {
            let current = openQueue.dequeue();
            if (current === endNode) {
                current.style.backgroundColor = path;
                let p = cameFrom.get(current);
                while (p !== undefined) {
                    await delay(30);
                    p.animate(pathAnimation, 300);
                    p.style.backgroundColor = path;
                    p = cameFrom.get(p);
                }
                return;
            }

            current.animate(exploreAnimation, 800);
            current.style.backgroundColor = explore;
            await delay(30);

            let curr = [current.closest('tr').rowIndex, current.cellIndex];
            for (let i = 0; i < 4; i++) {
                let check_row = this.directions[i][0] + curr[0];
                let check_col = this.directions[i][1] + curr[1];
                if (rows-1 > check_row >= 1 && cols-1 > check_col >= 1) {
                    let neighbour = blocks[check_row].childNodes[check_col];
                    if (neighbour.style.backgroundColor !== wall && !(visited.has(neighbour))) {
                        cameFrom.set(neighbour, current);
                        fScore.set(neighbour, this.manhattanHeuristic(neighbour, end));
                        visited.add(neighbour);
                        openQueue.enqueue(neighbour, fScore.get(neighbour));
                    }
                }
            }
        }
        console.log("no solution");
    }
}

export default new Search();