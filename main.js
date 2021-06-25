import maze from "./modules/mazeAlgorithms.js";
import search from "./modules/searchAlgorithms.js";
import { makeWall, buildWall, delay, clearCanvas } from "./modules/util.js";
import { explore, visited, path, wall } from "./modules/colors.js";

function Matrix() {
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
	this.start_block = [0, 0];
	this.end_block = [0, 0];
	this.startNotMarked = false;
	this.endNotMarked = false;
	this.btns = false;
	this.mouseDown = false;
	this.blockSize = 18;
	this.isRunning = false;
}

// initialize
Matrix.prototype.init = function () {
	this.buildMatrix();
	this.startBtn.onclick = this.findPath.bind(this);
	this.resetBtn.onclick = this.reset.bind(this);
	this.generateMazeBtn.onclick = this.generateMaze.bind(this);
	this.clearMatrix.onclick = clearCanvas.bind(null, this.blocks);
	document.addEventListener("keyup", this.shortcutKeys.bind(this), false);
};

// utilities
Matrix.prototype.shortcutKeys = function (e) {
	if (!this.isRunning) {
		switch (e.keyCode) {
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
				clearCanvas(this.blocks);
				break;
		}
	}
};

Matrix.prototype.toggelBtns = function () {
	if (!this.btns) {
		this.startBtn.style.backgroundColor = "gray";
		this.resetBtn.style.backgroundColor = "gray";
		this.generateMazeBtn.style.backgroundColor = "gray";
		this.clearMatrix.style.backgroundColor = "gray";
	} else {
		this.startBtn.style.backgroundColor = "rgb(67, 182, 111)";
		this.resetBtn.style.backgroundColor = "rgb(66, 130, 242)";
		this.generateMazeBtn.style.backgroundColor = "rgb(66, 130, 242)";
		this.clearMatrix.style.backgroundColor = "rgb(66, 130, 242)";
	}
	this.startBtn.disabled = !this.btns;
	this.resetBtn.disabled = !this.btns;
	this.generateMazeBtn.disabled = !this.btns;
	this.clearMatrix.disabled = !this.btns;
	this.btns = !this.btns;
};

Matrix.prototype.actionListners = function () {
	for (let i = 1; i < this.rows - 1; i++) {
		for (let j = 1; j < this.cols - 1; ++j) {
			let currentElement = this.blocks[i].childNodes[j];
			currentElement.onmousedown = (e) => {
				e.preventDefault();
				if (
					currentElement ===
						this.blocks[this.start_block[0]].childNodes[this.start_block[1]] &&
					!this.isRunning
				) {
					this.startNotMarked = true;
					currentElement.classList.remove("home");
				}
				if (
					currentElement ===
						this.blocks[this.end_block[0]].childNodes[this.end_block[1]] &&
					!this.isRunning
				) {
					this.endNotMarked = true;
					currentElement.classList.remove("exit");
				}
				this.mouseDown = true;
			};
			currentElement.onmouseup = (e) => {
				e.preventDefault();
				if (this.startNotMarked && !this.isRunning) {
					this.startNotMarked = false;
					currentElement.classList.add("home");
					this.start_block[0] = currentElement.closest("tr").rowIndex;
					this.start_block[1] = currentElement.cellIndex;
				}
				if (this.endNotMarked && !this.isRunning) {
					this.endNotMarked = false;
					currentElement.classList.add("exit");
					this.end_block[0] = currentElement.closest("tr").rowIndex;
					this.end_block[1] = currentElement.cellIndex;
					let start =
						this.blocks[this.start_block[0]].childNodes[this.start_block[1]];
					if (
						start.style.backgroundColor === this.path ||
						start.style.backgroundColor === this.explore
					) {
						// this.reset()
						// this.BFS(false);
					}
				}
				this.mouseDown = false;
			};
			currentElement.onmouseover = (e) => {
				if (
					this.mouseDown &&
					!this.isRunning &&
					!this.startNotMarked &&
					!this.endNotMarked
				) {
					buildWall(currentElement);
				}
			};

			currentElement.onclick = (e) => {
				e.preventDefault();
				if (!this.isRunning) {
					buildWall(currentElement);
				}
			};
		}
	}
};

// base functions
Matrix.prototype.buildMatrix = async function () {
	this.toggelBtns();
	while (canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}

	if (window.innerWidth < 600) {
		this.blockSize = 15;
		this.cols = Math.floor((window.innerWidth - 48) / this.blockSize);
		this.rows = Math.floor((window.innerHeight - 230) / this.blockSize);
	} else {
		this.blockSize = 18;
		this.cols = Math.floor((window.innerWidth - 40) / this.blockSize);
		this.rows = Math.floor((window.innerHeight - 150) / this.blockSize);
	}

	if (this.rows % 2 === 0) this.rows += 3;
	if (this.cols % 2 === 0) this.cols += 3;

	for (let i = 0; i < this.rows; ++i) {
		let tr = document.createElement("tr");
		tr.classList.add("row");
		for (let j = 0; j < this.cols; ++j) {
			let td = document.createElement("td");
			td.classList.add("block");
			td.style.width = `${this.blockSize}px`;
			td.style.height = `${this.blockSize}px`;

			tr.appendChild(td);
		}
		canvas.appendChild(tr);
	}

	canvas.style.width = `${(this.cols * this.blockSize) / 10}rem`;
	canvas.style.height = `${(this.rows * this.blockSize) / 10}rem`;
	this.blocks = document.querySelectorAll(".row");

	if (screen.orientation.type === "landscape-primary") {
		let oddNum = Math.floor(this.rows / 2);

		this.start_block[0] = oddNum % 2 === 0 ? oddNum + 1 : oddNum;
		this.start_block[1] = 3;

		this.end_block[1] = this.blocks[0].childElementCount - 4;
		this.end_block[0] = oddNum % 2 === 0 ? oddNum + 1 : oddNum;
	} else {
		let oddNum = Math.floor(this.cols / 2);

		this.start_block[0] = 1;
		this.start_block[1] = oddNum % 2 === 0 ? oddNum + 1 : oddNum;

		this.end_block[0] = this.blocks.length - 2;
		this.end_block[1] = oddNum % 2 === 0 ? oddNum + 1 : oddNum;
	}

	if (
		(this.rows >= 23 && this.cols >= 18) ||
		(this.row >= 18 && this.cols >= 59)
	) {
		var x = document.querySelector(".select");
		var option = document.createElement("option");
		option.text = "Not a Maze";
		option.value = "special";
		x.add(option);
	}

	this.blocks[0].childNodes[0].style.borderTopLeftRadius = "15px";
	this.blocks[0].childNodes[0].style.border = "none";

	this.blocks[0].childNodes[this.cols - 1].style.borderTopRightRadius = "15px";
	this.blocks[0].childNodes[this.cols - 1].style.border = "none";

	this.blocks[this.rows - 1].childNodes[0].style.borderBottomLeftRadius =
		"15px";
	this.blocks[this.rows - 1].childNodes[0].style.border = "none";

	this.blocks[this.rows - 1].childNodes[
		this.cols - 1
	].style.borderBottomRightRadius = "15px";
	this.blocks[this.rows - 1].childNodes[this.cols - 1].style.border = "none";

	this.blocks[this.start_block[0]].childNodes[
		this.start_block[1]
	].classList.add("home");
	this.blocks[this.end_block[0]].childNodes[this.end_block[1]].classList.add(
		"exit"
	);
	this.buildFrame();
	this.actionListners();
	this.toggelBtns();
};

Matrix.prototype.reset = async function () {
	let start = this.blocks[this.start_block[0]].childNodes[this.start_block[1]];
	if (
		(this.start_block[0] !== undefined &&
			start.style.backgroundColor === explore) ||
		start.style.backgroundColor === visited ||
		(this.start_block[0] !== undefined &&
			start.style.backgroundColor === explore) ||
		start.style.backgroundColor === path
	) {
		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				this.blocks[i].childNodes[j].innerHTML = "";
				if (
					this.blocks[i].childNodes[j].style.backgroundColor !== wall &&
					this.blocks[i].childNodes[j].style.backgroundColor !== "white"
				) {
					this.blocks[i].childNodes[j].style.backgroundColor = "white";
				}
			}
		}
	}
};

// search algorithms
Matrix.prototype.findPath = async function () {
	this.isRunning = true;
	this.toggelBtns();
	let algo = this.algorithmSelect.value;
	if (this.start_block[0] !== undefined && this.end_block[0] !== undefined) {
		if (
			this.blocks[this.start_block[0]].childNodes[this.start_block[1]].style
				.backgroundColor === path ||
			this.blocks[this.start_block[0]].childNodes[this.start_block[1]].style
				.backgroundColor === visited
		) {
			this.reset();
		}
		switch (algo) {
			case "bestFirst":
				await search.bestFirst(this.blocks, this.start_block, this.end_block);
				break;
			case "bfs":
				await search.BFS(this.blocks, this.start_block, this.end_block);
				break;
			case "dfs":
				await search.DFS(this.blocks, this.start_block, this.end_block);
				break;
			case "dijkstra":
				await search.dijkstra(this.blocks, this.start_block, this.end_block);
				break;
			case "bidirectional":
				await search.bidirectionalSearch(
					this.blocks,
					this.start_block,
					this.end_block
				);
				break;
			case "astar":
				await search.AStar(this.blocks, this.start_block, this.end_block);
				break;
		}
	}
	this.toggelBtns();
	this.isRunning = false;
};

// maze algorithms
Matrix.prototype.buildFrame = async function () {
	for (let i = 0; i < this.rows; ++i) {
		makeWall(this.blocks[i].childNodes[0]);
		makeWall(this.blocks[i].childNodes[this.cols - 1]);
		await delay();
	}
	for (let i = 1; i < this.cols - 1; ++i) {
		makeWall(this.blocks[0].childNodes[i]);
		makeWall(this.blocks[this.rows - 1].childNodes[i]);
		await delay();
	}
};

Matrix.prototype.generateMaze = async function () {
	this.isRunning = true;
	this.toggelBtns();
	clearCanvas(this.blocks);
	let select_maze = this.mazeSelect.value;
	switch (select_maze) {
		case "rd":
			await maze.recursiveDivisionMaze(
				this.blocks,
				1,
				this.rows - 2,
				1,
				this.cols - 2
			);
			break;

		case "rbt":
			await maze.recursiveBTMazeSetUp(this.blocks);
			break;

		case "random":
			await maze.randomMaze(this.blocks, this.start_block, this.end_block);
			break;

		case "vb":
			await maze.verticalBarsMaze(
				this.blocks,
				1,
				this.rows - 2,
				1,
				this.cols - 2
			);
			break;

		case "hb":
			await maze.horizontalBarsMaze(
				this.blocks,
				1,
				this.rows - 2,
				1,
				this.cols - 2
			);
			break;

		case "special":
			await maze.specialMaze(this.blocks);
			break;
	}

	// for(let i=1; i< this.rows-1; i++){
	//     for(let j=1; j<this.cols-1; j++){
	//         if( this.blocks[i].childNodes[j].style.backgroundColor === wall){
	//             let top = this.blocks[i-1].childNodes[j].style.backgroundColor;
	//             let bottom = this.blocks[i+1].childNodes[j].style.backgroundColor;
	//             let left = this.blocks[i].childNodes[j-1].style.backgroundColor;
	//             let right = this.blocks[i].childNodes[j+1].style.backgroundColor;

	//             if(left !== wall && top !== wall){
	//                 this.blocks[i].childNodes[j].style.borderTopLeftRadius = "50px";
	//             }
	//             if(left !== wall && bottom !== wall){
	//                 this.blocks[i].childNodes[j].style.borderBottomLeftRadius = "50px";
	//             }
	//             if(right !== wall && top !== wall){
	//                 this.blocks[i].childNodes[j].style.borderTopRightRadius = "50px";
	//             }
	//             if(right !== wall && bottom !== wall){
	//                 this.blocks[i].childNodes[j].style.borderBottomRightRadius = "50px";
	//             }
	//         }
	//         else{
	//             this.blocks[i].childNodes[j].style.borderRadius = "50px";
	//         }
	//     }
	// }

	this.isRunning = false;
	this.toggelBtns();
};

// start
window.onload = function () {
	const m = new Matrix();
	m.init();
};
