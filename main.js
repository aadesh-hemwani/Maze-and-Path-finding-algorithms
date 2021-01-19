function Matrix(){
    this.cursorDot = document.querySelector(".cursorDot");
    this.cursor = document.querySelector(".cursor");
    this.canvas = document.getElementById("canvas");
    this.startBtn = document.querySelector("#start");
    this.resetBtn = document.querySelector("#reset");
    this.generateMazeBtn = document.querySelector("#generateMaze");
    this.mazeSelect = document.querySelector("#maze");
    this.algorithmSelect = document.querySelector("#algorithm");
    this.rows = 0;
    this.cols = 0;
    this.blocks = [];
    this.directions = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    this.directions2 = [[2, 0], [0, -2], [0, 2], [-2, 0]];
    this.wall = "rgb(31, 31, 31)"; //black
    this.path = "rgb(216, 232, 72)"; //green
    this.visited = "rgb(201, 73, 73)"; //red
    this.explore = "rgb(118, 189, 219)"; //blue
    this.start_block = [0, 0];
    this.end_block = [0, 0];
    this.startNotMarked = false;
    this.endNotMarked = false;
    this.btns = false;
    this.mouseDown = false;
    this.blockSize = 18;
    this.isRunning = false;
    this.wallAnimation = [{
        transform: "scale(.3)",
        backgroundColor: "rgb(120, 120, 120)",
    },
    {
        transform: "scale(1.2)",
        backgroundColor: "rgb(61, 61, 61)",
    },
    {
        transform: "scale(1.0)",
        backgroundColor: "rgb(31,31,31)"
    }];

    this.exploreAnimation = [
    {
        transform: "scale(0)",
        borderRadius: "200px",
        backgroundColor: "rgb(64, 88, 207)",
    },
    {
        transform: "scale(0.2)",
        borderRadius: "160px",
        backgroundColor: "rgb(11, 125, 186)",
    },
    {
        transform: "scale(0.6)",
        borderRadius: "120px",
        backgroundColor: "rgb(11, 125, 186)",
    },
    {
        transform: "scale(1)",
        borderRadius: "80px",
        backgroundColor: "rgb(51, 219, 222)",
    },
    {
        transform: "scale(1.2)",
        borderRadius: "10px",
        backgroundColor: "rgb(51, 219, 222)",
    },
    {
        transform: "scale(1)",
        borderRadius:"0px",
        backgroundColor: "rgb(118, 189, 219)",
    }];
}
// initialize
Matrix.prototype.init = function(){
    this.buildMatrix();    
    this.startBtn.onclick = this.findPath.bind(this);
    this.resetBtn.onclick = this.reset.bind(this);
    this.generateMazeBtn.onclick = this.generateMaze.bind(this);
    document.addEventListener('keyup', this.shortcutKeys.bind(this), false);
}

// utilities
Matrix.prototype.shortcutKeys = function(e){
    if(!this.isRunning){
        if (e.keyCode === 83) {
            this.findPath()
        }
        else if (e.keyCode === 82) {
            this.reset()
        }
        else if(e.keyCode === 77){
            this.generateMaze();
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
    }
    else{
        this.startBtn.style.backgroundColor = "rgb(67, 182, 111)"
        this.resetBtn.style.backgroundColor = "rgb(66, 130, 242)";
        this.generateMazeBtn.style.backgroundColor = "rgb(66, 130, 242)";
    }
    this.startBtn.disabled = !this.btns;
    this.resetBtn.disabled = !this.btns;
    this.generateMazeBtn.disabled = !this.btns;

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
Matrix.prototype.buildMatrix = async function(){
    this.toggelBtns();
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }

    if(window.innerWidth < 600){
        this.blockSize = 12;
        this.cols = Math.floor((window.innerWidth-40)/this.blockSize);
        this.rows = Math.floor((window.innerHeight-190)/this.blockSize);
    }
    else{
        this.blockSize = 18;
        this.cols = Math.floor((window.innerWidth-80)/this.blockSize);
        this.rows = Math.floor((window.innerHeight-180)/this.blockSize);    
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
    cBlock.style.border = ".5px solid rgba(190, 190, 190, 0.8)";
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
        }
    }
    this.toggelBtns();
    this.isRunning = false;
}

Matrix.prototype.DFS = async function (r, c){
    if(r >=0 && r < this.rows && c >=0 && c < this.cols && this.blocks[r].childNodes[c].style.backgroundColor !== this.visited && this.blocks[r].childNodes[c].style.backgroundColor !== this.explore &&this.blocks[r].childNodes[c].style.backgroundColor !== this.wall){    
        block = this.blocks[r].childNodes[c];
        block.animate(this.exploreAnimation, 900);
        block.style.backgroundColor = this.explore;
        if(r===this.end_block[0] && c ===this.end_block[1]){
            block.style.backgroundColor = this.path;
            return true;
        }
        await this.delay(50);
        
        for(let i=0; i<4; ++i){
             if(await this.DFS(r+this.directions[i][0], c+this.directions[i][1]) === true){
                this.blocks[r].childNodes[c].style.backgroundColor = this.path;
                await this.delay(50);
                return true;
             }
        }
        await this.delay(60);
        this.blocks[r].childNodes[c].classList.add("visitedAnim");
        this.blocks[r].childNodes[c].style.backgroundColor = this.visited;
        return false;
    }
    else{
        return false;
    }
}

Matrix.prototype.BFS = async function(){
    let q = [];
    let visited = new Set();
    let backtrack = new Map();
    q.push(m.blocks[this.start_block[0]].childNodes[this.start_block[1]]);

    while(q.length !==0){
        let node = q.shift();
        if(node === this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){
            node.style.backgroundColor = this.path;
            while(node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]]){
                await this.delay(40);
                node = backtrack.get(node);
                node.style.backgroundColor = this.path;
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
        node.animate(this.exploreAnimation, 1000);
        node.style.backgroundColor = this.explore;
        await this.delay(25);
    }
}  

Matrix.prototype.dijkstra = async function(){
    let distance = new Map();
    let visited = new Set();
    let q = [];
    let backtrack = new Map();

    for(let i=1; i<this.rows-1; i++){
        for(let j=1; j<this.cols-1; j++){
            let cBlock = this.blocks[i].childNodes[j];
            if(cBlock.style.backgroundColor !== this.wall){
                cBlock.animate(this.exploreAnimation, 300);
                distance.set(cBlock, Infinity);
                cBlock.innerHTML = "&#8734;";        
            }
        }
        await this.delay(30);
    }
    distance.set(this.blocks[this.start_block[0]].childNodes[this.start_block[[1]]], 0);
    q.push(this.blocks[this.start_block[0]].childNodes[this.start_block[[1]]]);
    visited.add(this.blocks[this.start_block[0]].childNodes[this.start_block[[1]]]);
    
    while(q.length !== 0){
        let node = q.shift();
        node.animate(this.exploreAnimation, 900);
        node.style.backgroundColor = this.explore;
        await this.delay(30);

        if(node === this.blocks[this.end_block[0]].childNodes[this.end_block[1]]){
            node.style.backgroundColor = this.path;
            while(node !== this.blocks[this.start_block[0]].childNodes[this.start_block[1]]){
                await this.delay(40);
                node = backtrack.get(node);
                node.style.backgroundColor = this.path;
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
                            }                    
                        }
                    }
                }
            }       
        }
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

Matrix.prototype.generateMaze = async function(){
    this.isRunning = true;
    this.toggelBtns();
    for(let i=0; i<this.rows; i++){
        for(let j=0;  j<this.cols; ++j){
            this.blocks[i].childNodes[j].style.backgroundColor = "white";
            this.blocks[i].childNodes[j].innerHTML = "";
            this.blocks[i].childNodes[j].style.border = ".5px solid rgba(190, 190, 190, 0.8)";
            
        }
    }
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
    }
    this.buildFrame();
    this.isRunning = false;
    this.toggelBtns();
}

Matrix.prototype.recursiveBTMazeSetUp = async function(){
    for(let i=0; i<this.rows; i+=2){
        await this.delay(150);
        for(let j=0;  j<this.cols; ++j){
            this.makeWall(this.blocks[i].childNodes[j])
        }
    }
    for(let i=0; i<this.cols; i+=2){
        await this.delay(150);
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

Matrix.prototype.verticalBarsMaze = async function(sRow=0,eRow=this.rows-1, sCol=0, eCol=this.cols-1){
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

Matrix.prototype.horizontalBarsMaze = async function(sRow=0,eRow=this.rows-1, sCol=0, eCol=this.cols-1){
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

Matrix.prototype.recursiveDivisionMaze = async function(sRow=0,eRow=this.rows-1, sCol=0, eCol=this.cols-1){
    if(eCol-sCol <=1 || eRow-sRow <= 1){
        return;
    }
    await this.delay(20);
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
    for(let i=0; i<this.rows; ++i){
        await this.delay(0);
        for(let j=0; j<this.cols; ++j){
            if(i === this.start_block[0] && j === this.start_block[1] || i === this.end_block[0] && j === this.end_block[1]){
                continue;
            }
            let make_wall = Math.floor((Math.random() * 4)+1);
            if(make_wall === 1){
                this.buildWall(this.blocks[i].childNodes[j]);
            }
        }
    }
    this.buildFrame();
}

// start
const m = new Matrix();
m.init();

// custom cursor
document.addEventListener('mousemove', e =>{
    m.cursorDot.style.top = `${e.pageY}px`;
    m.cursorDot.style.left = `${e.pageX}px`;
    m.cursor.style.top = `${e.pageY}px`;
    m.cursor.style.left = `${e.pageX}px`;
});
// resize event
// window.onresize = m.buildMatrix.bind(m);

