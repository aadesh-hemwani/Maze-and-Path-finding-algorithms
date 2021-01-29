class PriorityQueue {
    constructor() {
        this.data = [];
    }
    enqueue(element, priority) {
        if (this.data.length === 0) {
            this.data.push([element, priority]);
        }
        else {
            let added = false;
            let n = this.data.length;
            for (let i = 0; i < n; ++i) {
                if (priority < this.data[i][1]) {
                    this.data.splice(i, 0, [element, priority]);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.data.push([element, priority]);
            }
        }
    }
    dequeue() {
        if (this.data.length !== 0) {
            let pop = this.data.shift();
            return pop[0];
        }

    }
    peek() {
        if (this.data.length !== 0)
            return this.data[0][0];
    }
}


function Matrix(){
    this.cursorDot = document.querySelector(".cursorDot");
    this.cursor = document.querySelector(".cursor");
    this.canvas = document.getElementById("canvas");
    this.startBtn = document.querySelector("#start");
    this.resetBtn = document.querySelector("#reset");
    this.clearMatrix = document.querySelector("#clearMatrix");
    this.generateMazeBtn = document.querySelector("#generateMaze");
    this.mazeSelect = document.querySelector("#maze");
    this.algorithmSelect = document.querySelector("#algorithm");
    this.rows = 0;
    this.cols = 0;
    this.blocks = [];
    this.directions = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    this.directions2 = [[2, 0], [0, -2], [0, 2], [-2, 0]];
    this.wall = "rgb(31, 31, 31)"; //black
    this.path = "rgb(216, 232, 72)"; //yellow
    this.visited = "rgb(201, 73, 73)"; //red
    this.explore = "rgb(118, 189, 219)"; //blue
    this.block_border = ".2px solid rgba(15, 15, 15, 0.2)";
    this.start_block = [0, 0];
    this.end_block = [0, 0];
    this.startNotMarked = false;
    this.endNotMarked = false;
    this.btns = false;
    this.mouseDown = false;
    this.blockSize = 18;
    this.isRunning = false;
    this.wallAnimation = [{
        transform: "scale(0)",
        backgroundColor: "rgb(120, 120, 120)",
    },
    {
        transform: "scale(1.3)",
        backgroundColor: "rgb(61, 61, 61)",
    },
    {
        transform: "scale(1.0)",
        backgroundColor: "rgb(31,31,31)"
    }];

    this.exploreAnimation = [
        {
            transform: "scale(0.1)",
            backgroundColor: "rgba(0, 0, 66, 0.75)",
            borderRadius: "100%",
        },
        {
            backgroundColor: "rgba(64, 88, 230,.75)"
        },
        {
            transform: "scale(1.1)",
            backgroundColor: "rgba(0, 217, 159, 0.75)",
        },
        {
            transform: "scale(1.0)",
            backgroundColor: `${this.explore}`
        }
    ];
    this.visitedAnimation = [
        {
            backgroundColor: `${this.explore}`,
            transform: "scale(1.3)"
        },
        {
            backgroundColor: "rgb(201, 73, 73)",
            transform: "scale(1)"
        }];

    this.pathAnimation = [
        {
            backgroundColor: `${this.explore}`,
            transform: "scale(1.2)"
        },
        {
            backgroundColor: `${this.path}`,
        }
    ]
}

// initialize
Matrix.prototype.init = function(){
    this.buildMatrix();    
    this.startBtn.onclick = this.findPath.bind(this);
    this.resetBtn.onclick = this.reset.bind(this);
    this.generateMazeBtn.onclick = this.generateMaze.bind(this);
    this.clearMatrix.onclick = this.clearCanvas.bind(this);
    document.addEventListener('keyup', this.shortcutKeys.bind(this), false);
}

// utilities
Matrix.prototype.shortcutKeys = function(e){
    if(!this.isRunning){
        switch(e.keyCode){
            case 83:
                this.findPath();
                break;
            
            case 82:
                this.reset();
                break;
            
            case 77:
                this.generateMaze();
                break;
            case 67:
                this.clearCanvas();
                break;
                
        }
    }
}

Matrix.prototype.delay = async function(time){
    await new Promise(resolve =>{
        setTimeout(()=> resolve(), time);
    });
}

Matrix.prototype.toggelBtns = function(){
    if(!this.btns){
        this.startBtn.style.backgroundColor = "gray";
        this.resetBtn.style.backgroundColor = "gray";
        this.generateMazeBtn.style.backgroundColor = "gray";
        this.clearMatrix.style.backgroundColor = "gray";
        
    }
    else{
        this.startBtn.style.backgroundColor = "rgb(67, 182, 111)"
        this.resetBtn.style.backgroundColor = "rgb(66, 130, 242)";
        this.generateMazeBtn.style.backgroundColor = "rgb(66, 130, 242)";
        this.clearMatrix.style.backgroundColor = "rgb(66, 130, 242)";
        
    }
    this.startBtn.disabled = !this.btns;
    this.resetBtn.disabled = !this.btns;
    this.generateMazeBtn.disabled = !this.btns;
    this.clearMatrix.disabled = !this.btns;
    this.btns = !this.btns;
}

Matrix.prototype.actionListners = function(){
    for(let i=1; i<this.rows-1; i++){
        for(let j=1;  j<this.cols-1; ++j){
            let currentElement = this.blocks[i].childNodes[j];
            currentElement.onmousedown = (e) => {
                e.preventDefault();
                if(currentElement === this.blocks[this.start_block[0]].childNodes[this.start_block[1]] && !this.isRunning){
                    this.startNotMarked = true;
                    currentElement.classList.remove("home");
                }
                if(currentElement === this.blocks[this.end_block[0]].childNodes[this.end_block[1]] && !this.isRunning){
                    this.endNotMarked = true;
                    currentElement.classList.remove("exit");
                }
                this.mouseDown = true;
            }
            currentElement.onmouseup = (e) => {
                e.preventDefault();
                if(this.startNotMarked && !this.isRunning){
                    this.startNotMarked = false;
                    currentElement.classList.add("home");
                    this.start_block[0] = currentElement.closest('tr').rowIndex;
                    this.start_block[1] =  currentElement.cellIndex;
                }
                if(this.endNotMarked && !this.isRunning){
                    this.endNotMarked = false;
                    currentElement.classList.add("exit");
                    this.end_block[0] = currentElement.closest('tr').rowIndex;
                    this.end_block[1] =  currentElement.cellIndex;
                    let start = this.blocks[this.start_block[0]].childNodes[this.start_block[1]];
                    if(start.style.backgroundColor === this.path || start.style.backgroundColor === this.explore){
                        this.reset()
                        this.BFS(false);
                    }
                }
                this.mouseDown = false;
            }
            currentElement.onmouseover = (e) => {
                if(!this.isRunning){
                    this.cursor.classList.add("matrixCursor");
                }
                if(this.mouseDown && !this.isRunning && !this.startNotMarked && !this.endNotMarked){
                    this.buildWall(currentElement);
                }
            }

            currentElement.onmouseleave = (e) => {
                this.cursor.classList.remove("matrixCursor");
            }
            
            currentElement.onclick = (e) => {
                e.preventDefault();
                if(!this.isRunning){
                    this.buildWall(currentElement);    
                }
            }
        }
    }
}

// base functions
Matrix.prototype.clearCanvas = function(){
    for(let i=1; i<this.rows-1; i++){
        for(let j=1;  j<this.cols-1; ++j){
            this.blocks[i].childNodes[j].style.backgroundColor = "white";
            this.blocks[i].childNodes[j].innerHTML = "";
            this.blocks[i].childNodes[j].style.border = this.block_border;
            
        }
    }
}

Matrix.prototype.buildMatrix = async function(){
    this.toggelBtns();
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }

    if(window.innerWidth < 600){
        this.blockSize = 14;
        this.cols = Math.floor((window.innerWidth-50)/this.blockSize);
        this.rows = Math.floor((window.innerHeight-200)/this.blockSize);
    }
    else{
        this.blockSize = 20;
        this.cols = Math.floor((window.innerWidth-80)/this.blockSize);
        this.rows = Math.floor((window.innerHeight-140)/this.blockSize);    
    }

    if(this.rows % 2 === 0) this.rows+= 3;
    if(this.cols % 2 === 0) this.cols+=3;
        
    for(let i=0; i<this.rows; ++i){
        let tr = document.createElement("tr");
        tr.classList.add("row");
        for(let j=0; j<this.cols; ++j){
            let td = document.createElement("td");
            td.classList.add("block");
            td.style.width = `${this.blockSize}px`;
            td.style.height = `${this.blockSize}px`;
            
            tr.appendChild(td);    
        }
        canvas.appendChild(tr);
    }

    canvas.style.width = `${(this.cols*this.blockSize)/10}rem`;
    canvas.style.height = `${(this.rows*this.blockSize)/10}rem`;
    this.blocks = document.querySelectorAll(".row");

    if(screen.orientation.type === "landscape-primary"){
        let oddNum = Math.floor(this.rows/2) 

        this.start_block[0] = oddNum % 2 === 0 ? oddNum+1: oddNum;
        this.start_block[1] = 3;
    
        this.end_block[1] = this.blocks[0].childElementCount-4;
        this.end_block[0] = oddNum % 2 === 0 ? oddNum+1: oddNum;
    }
    else{
        let oddNum = Math.floor(this.cols/2) 

        this.start_block[0] = 1;
        this.start_block[1] = oddNum % 2 === 0 ? oddNum+1: oddNum;
    
        this.end_block[0] = this.blocks.length-2;
        this.end_block[1] = oddNum % 2 === 0 ? oddNum+1: oddNum;
    }


    if(this.rows >= 23 && this.cols >= 18 || this.row >= 18 && this.cols >= 59){
        var x = document.querySelector(".select");
        var option = document.createElement("option");
        option.text = "Not a Maze";
        option.value = "special";
        x.add(option);
    }

    this.blocks[this.start_block[0]].childNodes[this.start_block[1]].classList.add("home");
    this.blocks[this.end_block[0]].childNodes[this.end_block[1]].classList.add("exit");        
    this.buildFrame();
    this.actionListners();
    this.toggelBtns();
}

Matrix.prototype.makeWall = function(cBlock){
    cBlock.animate(this.wallAnimation, 500 );
    cBlock.style.backgroundColor = this.wall;
    cBlock.style.border = "none";
}

Matrix.prototype.breakWall = function(cBlock){
    cBlock.animate(this.wallAnimation, {duration: 500, direction:"reverse"});
    cBlock.style.backgroundColor = "white";
    cBlock.style.border = this.block_border;
}

Matrix.prototype.buildWall = function(node){
    if(node.style.backgroundColor === this.wall){
        this.breakWall(node);
    }else{
        this.makeWall(node);
    }
}

Matrix.prototype.reset = async function() {
    let start = this.blocks[this.start_block[0]].childNodes[this.start_block[1]];
    if(this.start_block[0] !== undefined && start.style.backgroundColor === this.explore || start.style.backgroundColor === this.visited || this.start_block[0] !== undefined && start.style.backgroundColor === this.explore || start.style.backgroundColor === this.path){
        for(let i=0; i<this.rows; ++i){
            for(let j=0; j<this.cols; ++j){
                this.blocks[i].childNodes[j].innerHTML = "";
                if(this.blocks[i].childNodes[j].style.backgroundColor !== this.wall && this.blocks[i].childNodes[j].style.backgroundColor!=="white"){
                    this.blocks[i].childNodes[j].style.backgroundColor = "white";
                    this.blocks[i].childNodes[j].classList.remove("visitedAnim");
                }
            }
        }
    }
}

// search algorithms
Matrix.prototype.findPath = async function() {
    this.isRunning = true;
    this.toggelBtns();
    let algo = this.algorithmSelect.value;
    if(this.start_block[0] !== undefined && this.end_block[0] !== undefined){
        if(this.blocks[this.start_block[0]].childNodes[this.start_block[1]].style.backgroundColor === this.path || this.blocks[this.start_block[0]].childNodes[this.start_block[1]].style.backgroundColor === this.visited){
            this.reset();
        }
        switch(algo){
            case 'bfs':
                await this.BFS();
                break;
            case 'dfs':
                await this.DFS(this.start_block[0], this.start_block[1]);
                break;
            case 'dijkstra':
                await this.dijkstra();
                break; 
            case "bidirectional":
                await this.bidirectionalSearch();
                break;
        }
    }
    this.toggelBtns();
    this.isRunning = false;
}

Matrix.prototype.DFS = async function (r, c){
    if(r >=0 && r < this.rows && c >=0 && c < this.cols && this.blocks[r].childNodes[c].style.backgroundColor !== this.visited && this.blocks[r].childNodes[c].style.backgroundColor !== this.explore &&this.blocks[r].childNodes[c].style.backgroundColor !== this.wall){    
        block = this.blocks[r].childNodes[c];
        block.animate(this.exploreAnimation, 1000);
        block.style.backgroundColor = this.explore;
        if(r===this.end_block[0] && c ===this.end_block[1]){    
            block.style.backgroundColor = this.path;
            return true;
        }
        await this.delay(50);
        
        for(let i=0; i<4; ++i){
             if(await this.DFS(r+this.directions[i][0], c+this.directions[i][1]) === true){
                this.blocks[r].childNodes[c].animate(this.pathAnimation, 300);
                this.blocks[r].childNodes[c].style.backgroundColor = this.path;
                await this.delay(50);
                return true;
             }
        }
        await this.delay(60);
        this.blocks[r].childNodes[c].animate(this.visitedAnimation, 1000);
        this.blocks[r].childNodes[c].style.backgroundColor = this.visited;
        return false;
    }
    else{
        return false;
    }
}

Matrix.prototype.BFS = async function(animate=true){
    let q = [];
    let visited = new Set();
    let backtrack = new Map();
    q.push(this.blocks[this.start_block[0]].childNodes[this.start_block[1]]);

    while(q.length !==0){
        let node = q.shift();
        if(node === this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){
            let path = [node];
            node.style.backgroundColor = this.explore;
            while(node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]]){
                node = backtrack.get(node);
                path.push(node);
            }
            while(path.length !== 0){
                let p = path.pop();                
                if(animate)await this.delay(35);
                if(animate) p.animate(this.pathAnimation, 300);
                p.style.backgroundColor = this.path;
            }
            break;
        }
        let row_index = node.parentElement.rowIndex;
        let col_index = node.cellIndex;    
        
        for(let i=0; i<4; ++i){
            let check_row = this.directions[i][0] + row_index;
            let check_col = this.directions[i][1] + col_index;               
            if(check_row >= 1 && check_row < this.rows-1 && check_col >=1 && check_col < this.cols-1){
                if(this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.wall && this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.explore && !visited.has(this.blocks[check_row].childNodes[check_col])){
                    q.push(this.blocks[check_row].childNodes[check_col]);
                    visited.add(this.blocks[check_row].childNodes[check_col]);
                    backtrack.set(this.blocks[check_row].childNodes[check_col], node);
                }
            }
        }
        if(animate)node.animate(this.exploreAnimation, 1000);
        node.style.backgroundColor = this.explore;
        if(animate)await this.delay(30);
    }
}  

Matrix.prototype.dijkstra = async function(){
    let distance = new Map();
    let visited = new Set();
    const q = new PriorityQueue ();
    let backtrack = new Map();

    for(let i=1; i<this.rows-1; i++){
        await this.delay(20);
        for(let j=1; j<this.cols-1; j++){
            let cBlock = this.blocks[i].childNodes[j];
            if(cBlock.style.backgroundColor !== this.wall){
                cBlock.animate(this.exploreAnimation, 500);
                distance.set(cBlock, Infinity);
                cBlock.style.fontSize = "1rem";
                cBlock.innerHTML = "&#8734;";
            }
        }
        
    }
    let start = this.blocks[this.start_block[0]].childNodes[this.start_block[[1]]];
    distance.set(start, 0);
    q.enqueue(start, distance.get(start));
    visited.add(start);
    
    while(q.peek() !== undefined){
        let node = q.dequeue();
        node.animate(this.exploreAnimation, 1500);
        node.style.backgroundColor = this.explore;
        await this.delay(30);

        if(node === this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){
            let path = [];
            path.push(node);
            while(node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]]){
                node = backtrack.get(node);
                path.push(node);
            }
            for(let i=path.length-1; i>=0; --i){                
                await this.delay(40);
                path[i].animate(this.pathAnimation, 300);
                path[i].style.backgroundColor = this.path;
            }
            break;
        }

        let row_index = node.parentElement.rowIndex;
        let col_index = node.cellIndex;    
        
        for(let i=0; i<4; ++i){
            let check_row = this.directions[i][0] + row_index;
            let check_col = this.directions[i][1] + col_index;               
            
            if(check_row >= 1 && check_row < this.rows-1 && check_col >=1 && check_col < this.cols-1){
                if(this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.wall && this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.explore && !visited.has(this.blocks[check_row].childNodes[check_col])){
                    if(distance.get(node)+1 < distance.get(this.blocks[check_row].childNodes[check_col])){
                        distance.set(this.blocks[check_row].childNodes[check_col], distance.get(node)+1);
                        backtrack.set(this.blocks[check_row].childNodes[check_col], node);
                        visited.add(this.blocks[check_row].childNodes[check_col]);
                        if(distance.has(this.blocks[check_row].childNodes[check_col])){
                            if(distance.get(this.blocks[check_row].childNodes[check_col]) === Infinity){
                                this.blocks[check_row].childNodes[check_col].innerHTML = "&#8734;";    
                            }
                            else{
                                this.blocks[check_row].childNodes[check_col].innerHTML = distance.get(this.blocks[check_row].childNodes[check_col]);
                                this.blocks[check_row].childNodes[check_col].style.fontSize = "0.7rem";
                            }                    
                        }
                    }
                    q.enqueue(this.blocks[check_row].childNodes[check_col], distance.get(this.blocks[check_row].childNodes[check_col]));
                }
            }       
        }
    }
}

Matrix.prototype.bidirectionalSearch = async function(){
    let source_q = [];
    let destin_q = [];

    let s_visited = new Set();
    let d_visited = new Set();
    
    let s_backtrack = new Map();
    let d_backtrack = new Map();
        
    source_q.push(this.blocks[this.start_block[0]].childNodes[this.start_block[1]]);
    destin_q.push(this.blocks[this.end_block[0]].childNodes[this.end_block[1]])

    while(source_q.length !==0 || destin_q.length !== 0){
        let s_node, d_node;
        if(source_q.length !==0){
            s_node = source_q.shift();
            let row_index = s_node.parentElement.rowIndex;
            let col_index = s_node.cellIndex;    
            
            if(d_visited.has(s_node)){
                s_node.animate(this.exploreAnimation, 1000);        
                s_node.style.backgroundColor = this.path;
                let path = [], path2 = [];
                d_node = s_node;
                path.push(d_node);
                
                while(s_node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]] || d_node !== this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){    
                    if(d_node !== this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){
                        d_node = d_backtrack.get(d_node);
                        path.push(d_node);
                    }                    
                    if(s_node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]]){
                        s_node = s_backtrack.get(s_node);
                        path2.push(s_node);
                    }
                }
                for(let i=path2.length-1; i>=0; --i){
                    await this.delay(40);
                    path2[i].animate(this.pathAnimation, 300);
                    path2[i].style.backgroundColor = this.path;
                }
                for(let i=0; i<path.length; ++i){
                    await this.delay(40);
                    path[i].animate(this.pathAnimation, 300);
                    path[i].style.backgroundColor = this.path;
                }
                break;
            }

            for(let i=0; i<4; ++i){
                let check_row = this.directions[i][0] + row_index;
                let check_col = this.directions[i][1] + col_index;               
                if(check_row >= 1 && check_row < this.rows-1 && check_col >=1 && check_col < this.cols-1){
                    if(this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.wall && this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.explore && !s_visited.has(this.blocks[check_row].childNodes[check_col])){
                        source_q.push(this.blocks[check_row].childNodes[check_col]);
                        s_visited.add(this.blocks[check_row].childNodes[check_col]);
                        s_backtrack.set(this.blocks[check_row].childNodes[check_col], s_node);
                    }
                }
            }
        }
        if(destin_q.length !==0){
            d_node = destin_q.shift();
            let row_index = d_node.parentElement.rowIndex;
            let col_index = d_node.cellIndex;    
            
            for(let i=0; i<4; ++i){
                let check_row = this.directions[i][0] + row_index;
                let check_col = this.directions[i][1] + col_index;               
                if(check_row >= 1 && check_row < this.rows-1 && check_col >=1 && check_col < this.cols-1){
                    if(this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.wall && this.blocks[check_row].childNodes[check_col].style.backgroundColor !== this.explore && !d_visited.has(this.blocks[check_row].childNodes[check_col])){
                        destin_q.push(this.blocks[check_row].childNodes[check_col]);
                        d_visited.add(this.blocks[check_row].childNodes[check_col]);
                        d_backtrack.set(this.blocks[check_row].childNodes[check_col],d_node);
                    }
                }
            }
        }
        
        s_node.animate(this.exploreAnimation, 1000);
        d_node.animate(this.exploreAnimation, 1000);
        
        s_node.style.backgroundColor = this.explore;
        d_node.style.backgroundColor = this.explore;
        await this.delay(30);
    }
}


// maze algorithms
Matrix.prototype.buildFrame = async function(){
    for(let i=0; i<this.rows; ++i){
        this.makeWall(this.blocks[i].childNodes[0]);
        this.makeWall(this.blocks[i].childNodes[this.cols-1]);
        await this.delay();
    }
    for(let i=1; i<this.cols-1; ++i){
        this.makeWall(this.blocks[0].childNodes[i]);
        this.makeWall(this.blocks[this.rows-1].childNodes[i]);
        await this.delay();
    }
}

Matrix.prototype.specialMaze = async function(){
    if(this.cols > 59){
        let special = [[3, 26],[3, 27],[3, 28],[3, 45],[3, 46],[3, 47],[4, 26],[4, 28],[4, 45],[4, 47],[5, 26],[5, 47],[6, 26],[6, 47],[7, 26],[7, 47],[8, 3],[8, 4],[8, 5],[8, 6],[8, 7],[8, 8],[8, 12],[8, 13],[8, 14],[8, 15],[8, 16],[8, 17],[8, 26],[8, 29],[8, 30],[8, 31],[8, 32],[8, 33],[8, 34],[8, 35],[8, 38],[8, 39],[8, 40],[8, 41],[8, 42],[8, 43],[8, 47],[9, 3],[9, 8],[9, 12],[9, 17],[9, 26],[9, 29],[9, 35],[9, 38],[9, 43],[9, 47],[10, 3],[10, 8],[10, 12],[10, 17],[10, 26],[10, 29],[10, 35],[10, 38],[10, 47],[11, 8],[11, 17],[11, 26],[11, 29],[11, 35],[11, 38],[11, 47],[12, 3],[12, 4],[12, 5],[12, 6],[12, 7],[12, 8],[12, 12],[12, 13],[12, 14],[12, 15],[12, 16],[12, 17],[12, 20],[12, 21],[12, 22],[12, 23],[12, 24],[12, 25],[12, 26],[12, 29],[12, 30],[12, 31],[12, 32],[12, 33],[12, 34],[12, 35],[12, 38],[12, 39],[12, 40],[12, 41],[12, 42],[12, 43],[12, 47],[12, 48],[12, 49],[12, 50],[12, 51],[12, 52],[13, 3],[13, 8],[13, 12],[13, 17],[13, 20],[13, 26],[13, 29],[13, 43],[13, 47],[13, 52],[14, 3],[14, 8],[14, 12],[14, 17],[14, 20],[14, 26],[14, 29],[14, 43],[14, 47],[14, 52],[15, 3],[15, 8],[15, 12],[15, 17],[15, 20],[15, 26],[15, 29],[15, 35],[15, 43],[15, 47],[15, 52],[16, 3],[16, 8],[16, 12],[16, 17],[16, 20],[16, 26],[16, 29],[16, 35],[16, 38],[16, 43],[16, 47],[16, 52],[17, 3],[17, 4],[17, 5],[17, 6],[17, 7],[17, 8],[17, 12],[17, 13],[17, 14],[17, 15],[17, 16],[17, 17],[17, 20],[17, 21],[17, 22],[17, 23],[17, 24],[17, 25],[17, 26],[17, 29],[17, 30],[17, 31],[17, 32],[17, 33],[17, 34],[17, 35],[17, 38],[17, 39],[17, 40],[17, 41],[17, 42],[17, 43],[17, 47],[17, 52],[18, 8],[18, 9],[18, 17],[18, 18],[18, 26],[18, 27],[18, 47],[18, 52],[18, 53],[18, 55],[18, 57],[18, 59]];
        for(let i=0; i<special.length; ++i){
            await this.delay(10);
            this.makeWall(this.blocks[special[i][0]].childNodes[special[i][1]]);
        }
    }
    else{
        let special = [[5, 4],[5, 5],[5, 6],[5, 7],[5, 8],[5, 9],[5, 12],[5, 13],[5, 17],[5, 18],[6, 3],[6, 4],[6, 9],[6, 10],[6, 13],[6, 18],[7, 3],[7, 10],[7, 13],[7, 18],[8, 3],[8, 10],[8, 13],[8, 18],[9, 3],[9, 10],[9, 13],[9, 18],[10, 3],[10, 10],[10, 13],[10, 18],[11, 3],[11, 10],[11, 13],[11, 18],[12, 3],[12, 10],[12, 13],[12, 18],[13, 3],[13, 10],[13, 13],[13, 18],[14, 3],[14, 10],[14, 13],[14, 18],[15, 3],[15, 4],[15, 5],[15, 6],[15, 7],[15, 8],[15, 9],[15, 10],[15, 12],[15, 13],[15, 14],[15, 15],[15, 16],[15, 17],[15, 18],[16, 3],[16, 10],[16, 13],[16, 18],[17, 3],[17, 10],[17, 13],[17, 18],[18, 3],[18, 10],[18, 13],[18, 18],[19, 3],[19, 10],[19, 13],[19, 18],[20, 3],[20, 10],[20, 13],[20, 18],[21, 3],[21, 10],[21, 13],[21, 18],[22, 3],[22, 10],[22, 13],[22, 18],[23, 2],[23, 3],[23, 4],[23, 9],[23, 10],[23, 11],[23, 12],[23, 13],[23,18]]
        for(let i=0; i<special.length; ++i){
            await this.delay(10);
            this.makeWall(this.blocks[special[i][0]].childNodes[special[i][1]]);
        }
    }
}

Matrix.prototype.generateMaze = async function(){
    this.isRunning = true;
    this.toggelBtns();
    this.clearCanvas();
    let maze = this.mazeSelect.value;
    switch(maze){
        case "rd":
            await this.recursiveDivisionMaze();
            break;
        
        case "rbt":
            await this.recursiveBTMazeSetUp();
            break;
    
        case "random":
            await this.randomMaze();
            break;

        case "vb":
            await this.verticalBarsMaze();
            break;

        case "hb":
            await this.horizontalBarsMaze();
            break;
        
        case "special":
            await this.specialMaze();
            break; 
    }
    // this.buildFrame();
    this.isRunning = false;
    this.toggelBtns();
}

Matrix.prototype.recursiveBTMazeSetUp = async function(){
    for(let i=2; i<this.rows-2; i+=2){
        await this.delay(80);
        for(let j=1;  j<this.cols-1; ++j){
            this.makeWall(this.blocks[i].childNodes[j])
        }
    }
    for(let i=2; i<this.cols-2; i+=2){
        await this.delay(80);
        for(let j=1;  j<this.rows; j+=2){
            this.makeWall(this.blocks[j].childNodes[i])
        }
    }
    await this.recursiveBTMaze(1, 1)
}

Matrix.prototype.recursiveBTMaze = async function(r, c, visited=new Set()){
    let count = 0;
    let seen = new Set();
    while(count < 4){
        let goto = Math.floor(Math.random() * (4 - 0) + 0);
        while(seen.has(goto)){
            goto = Math.floor(Math.random() * (4 - 0) + 0);
        }
        seen.add(goto);
        let check_row = r+this.directions2[goto][0];
        let check_col = c+this.directions2[goto][1];
        visited.add(this.blocks[r].childNodes[c]);
        
        if(check_row >=0 && check_row < this.rows && check_col>=0 && check_col < this.cols && !visited.has(this.blocks[check_row].childNodes[check_col])){
            switch(goto){
                case 0:
                    this.breakWall(this.blocks[r+1].childNodes[c]);
                    break;
                
                case 1:
                    this.breakWall(this.blocks[r].childNodes[c-1]);
                    break;
                    
                case 2:
                    this.breakWall(this.blocks[r].childNodes[c+1]);
                    break;

                case 3:
                    this.breakWall(this.blocks[r-1].childNodes[c]);
                    break;
            }
            await this.delay(30);
            await this.recursiveBTMaze(check_row, check_col, visited);
        }
        count++;   
    }
}

Matrix.prototype.verticalBarsMaze = async function(sRow=1,eRow=this.rows-2, sCol=1, eCol=this.cols-2){
    if(eCol-sCol <=1){
        return;
    }
    let mid = Math.floor((Math.random() * (eCol - sCol) + sCol+1));
    if(mid%2===1) mid--;
    let open = Math.floor(Math.random() * ((eRow-1) - sRow) + sRow);
    if(open%2===0)open++;
    for(let i=sRow; i<=eRow; ++i){
        await this.delay(10);
        if(i !==open)
            this.makeWall(this.blocks[i].childNodes[mid]);
    }
    this.verticalBarsMaze(sRow, eRow, sCol, mid-1);
    this.verticalBarsMaze(sRow, eRow, mid+1, eCol);
}

Matrix.prototype.horizontalBarsMaze = async function(sRow=1,eRow=this.rows-2, sCol=1, eCol=this.cols-2){
    if(eRow-sRow <= 1){
        return;
    }
    let midRow = Math.floor((Math.random() * (eRow - sRow) + sRow+1));
    if(midRow%2===1) midRow--;
        
    let open = Math.floor(Math.random() * (eCol - sCol) + sCol);
    if(open%2===0)open++;

    for(let i=sCol; i<=eCol; ++i){
        await this.delay(10);
        if(i !==open)
            this.makeWall(this.blocks[midRow].childNodes[i]);
    }
    this.horizontalBarsMaze(sRow, midRow-1, sCol, eCol);
    this.horizontalBarsMaze(midRow+1, eRow, sCol, eCol);
}

Matrix.prototype.recursiveDivisionMaze = async function(sRow=1,eRow=this.rows-2, sCol=1, eCol=this.cols-2){
    if(eCol-sCol <=1 || eRow-sRow <= 1){
        return;
    }
    await this.delay(10);
    let w = eCol-sCol;
    let h = eRow-sRow;
    if(w<h) o=0;
    else if(h<w) o=1;
    else o=Math.floor(Math.random()* (2 - 0)+0);

    //VERTICAL
    if(o===1){
        let mid = Math.floor((Math.random() * (eCol - sCol) + sCol+1));
        if(mid%2===1) mid--;
        let open = Math.floor(Math.random() * ((eRow-1) - sRow) + sRow);
        if(open%2===0)open++;
        for(let i=sRow; i<=eRow; ++i){
            await this.delay(10);
            if(i !==open)
                this.makeWall(this.blocks[i].childNodes[mid]);
        }
        await this.recursiveDivisionMaze(sRow, eRow, sCol, mid-1);
        await this.recursiveDivisionMaze(sRow, eRow, mid+1, eCol);
    }
    //HORIZONTAL
    else{
        let midRow = Math.floor((Math.random() * (eRow - sRow) + sRow+1));
        if(midRow%2===1) midRow--;
        
        let open = Math.floor(Math.random() * (eCol - sCol) + sCol);
        if(open%2===0)open++;

        for(let i=sCol; i<=eCol; ++i){
            await this.delay(10);
            if(i !==open)
                this.makeWall(this.blocks[midRow].childNodes[i]);
        }
        await this.recursiveDivisionMaze(sRow, midRow-1, sCol, eCol);
        await this.recursiveDivisionMaze(midRow+1, eRow, sCol, eCol);
    }
}

Matrix.prototype.randomMaze = async function(){
    for(let i=1; i<this.rows-1; ++i){
        await this.delay(0);
        for(let j=1; j<this.cols-1; ++j){
            if(i === this.start_block[0] && j === this.start_block[1] || i === this.end_block[0] && j === this.end_block[1]){
                continue;
            }
            let make_wall = Math.floor((Math.random() * 4)+1);
            if(make_wall === 1){
                this.buildWall(this.blocks[i].childNodes[j]);
            }
        }
    }
}

// start
window.onload = function(){
    const m = new Matrix();
    m.init();

    // custom cursor
    document.addEventListener('mousemove', e =>{
        m.cursorDot.style.top = `${e.pageY}px`;
        m.cursorDot.style.left = `${e.pageX}px`;
        m.cursor.style.top = `${e.pageY}px`;
        m.cursor.style.left = `${e.pageX}px`;
    });

}



