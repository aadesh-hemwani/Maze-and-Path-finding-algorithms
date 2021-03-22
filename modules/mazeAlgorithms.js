import {delay, makeWall, buildWall, breakWall} from './util.js'

class Maze {
    constructor() {
        this.directions2 = [[2, 0], [0, -2], [0, 2], [-2, 0]];
    }
    specialMaze = async (blocks) =>{
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;

        if (cols > 59) {
            let special = [[3, 26], [3, 27], [3, 28], [3, 45], [3, 46], [3, 47], [4, 26], [4, 28], [4, 45], [4, 47], [5, 26], [5, 47], [6, 26], [6, 47], [7, 26], [7, 47], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 12], [8, 13], [8, 14], [8, 15], [8, 16], [8, 17], [8, 26], [8, 29], [8, 30], [8, 31], [8, 32], [8, 33], [8, 34], [8, 35], [8, 38], [8, 39], [8, 40], [8, 41], [8, 42], [8, 43], [8, 47], [9, 3], [9, 8], [9, 12], [9, 17], [9, 26], [9, 29], [9, 35], [9, 38], [9, 43], [9, 47], [10, 3], [10, 8], [10, 12], [10, 17], [10, 26], [10, 29], [10, 35], [10, 38], [10, 47], [11, 8], [11, 17], [11, 26], [11, 29], [11, 35], [11, 38], [11, 47], [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 12], [12, 13], [12, 14], [12, 15], [12, 16], [12, 17], [12, 20], [12, 21], [12, 22], [12, 23], [12, 24], [12, 25], [12, 26], [12, 29], [12, 30], [12, 31], [12, 32], [12, 33], [12, 34], [12, 35], [12, 38], [12, 39], [12, 40], [12, 41], [12, 42], [12, 43], [12, 47], [12, 48], [12, 49], [12, 50], [12, 51], [12, 52], [13, 3], [13, 8], [13, 12], [13, 17], [13, 20], [13, 26], [13, 29], [13, 43], [13, 47], [13, 52], [14, 3], [14, 8], [14, 12], [14, 17], [14, 20], [14, 26], [14, 29], [14, 43], [14, 47], [14, 52], [15, 3], [15, 8], [15, 12], [15, 17], [15, 20], [15, 26], [15, 29], [15, 35], [15, 43], [15, 47], [15, 52], [16, 3], [16, 8], [16, 12], [16, 17], [16, 20], [16, 26], [16, 29], [16, 35], [16, 38], [16, 43], [16, 47], [16, 52], [17, 3], [17, 4], [17, 5], [17, 6], [17, 7], [17, 8], [17, 12], [17, 13], [17, 14], [17, 15], [17, 16], [17, 17], [17, 20], [17, 21], [17, 22], [17, 23], [17, 24], [17, 25], [17, 26], [17, 29], [17, 30], [17, 31], [17, 32], [17, 33], [17, 34], [17, 35], [17, 38], [17, 39], [17, 40], [17, 41], [17, 42], [17, 43], [17, 47], [17, 52], [18, 8], [18, 9], [18, 17], [18, 18], [18, 26], [18, 27], [18, 47], [18, 52], [18, 53], [18, 55], [18, 57], [18, 59]];
            for (let i = 0; i < special.length; ++i) {
                await delay(10);
                makeWall(blocks[special[i][0]].childNodes[special[i][1]]);
            }
        }
        else {
            let special = [[5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 12], [5, 13], [5, 17], [5, 18], [6, 3], [6, 4], [6, 9], [6, 10], [6, 13], [6, 18], [7, 3], [7, 10], [7, 13], [7, 18], [8, 3], [8, 10], [8, 13], [8, 18], [9, 3], [9, 10], [9, 13], [9, 18], [10, 3], [10, 10], [10, 13], [10, 18], [11, 3], [11, 10], [11, 13], [11, 18], [12, 3], [12, 10], [12, 13], [12, 18], [13, 3], [13, 10], [13, 13], [13, 18], [14, 3], [14, 10], [14, 13], [14, 18], [15, 3], [15, 4], [15, 5], [15, 6], [15, 7], [15, 8], [15, 9], [15, 10], [15, 12], [15, 13], [15, 14], [15, 15], [15, 16], [15, 17], [15, 18], [16, 3], [16, 10], [16, 13], [16, 18], [17, 3], [17, 10], [17, 13], [17, 18], [18, 3], [18, 10], [18, 13], [18, 18], [19, 3], [19, 10], [19, 13], [19, 18], [20, 3], [20, 10], [20, 13], [20, 18], [21, 3], [21, 10], [21, 13], [21, 18], [22, 3], [22, 10], [22, 13], [22, 18], [23, 2], [23, 3], [23, 4], [23, 9], [23, 10], [23, 11], [23, 12], [23, 13], [23, 18]];
            for (let i = 0; i < special.length; ++i) {
                await delay(10);
                makeWall(blocks[special[i][0]].childNodes[special[i][1]]);
            }
        }
    }

    recursiveBTMazeSetUp = async (blocks) => {
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;

        for (let i = 2; i < rows - 2; i += 2) {
            await delay(80);
            for (let j = 1; j < cols - 1; ++j) {
                makeWall(blocks[i].childNodes[j]);
            }
        }
        for (let i = 2; i < cols - 2; i += 2) {
            await delay(80);
            for (let j = 1; j < rows; j += 2) {
                makeWall(blocks[j].childNodes[i]);
            }
        }
        await this.recursiveBTMaze(blocks, 1, 1, rows, cols);
    }

    recursiveBTMaze = async (blocks, r, c, rows, cols, visited=new Set()) => {
        let count = 0;
        let seen = new Set();

        while (count < 4) {
            let goto = Math.floor(Math.random() * (4 - 0) + 0);
            while (seen.has(goto)) {
                goto = Math.floor(Math.random() * (4 - 0) + 0);
            }
            seen.add(goto);
            let check_row = r + this.directions2[goto][0];
            let check_col = c + this.directions2[goto][1];
            visited.add(blocks[r].childNodes[c]);
            if(check_row >=0 && check_row < rows && check_col>=0 && check_col < cols){
                if(!visited.has(blocks[check_row].childNodes[check_col])){
                    switch (goto) {
                        case 0:
                            breakWall(blocks[r + 1].childNodes[c]);
                            break;

                        case 1:
                            breakWall(blocks[r].childNodes[c - 1]);
                            break;

                        case 2:
                            breakWall(blocks[r].childNodes[c + 1]);
                            break;

                        case 3:
                            breakWall(blocks[r - 1].childNodes[c]);
                            break;
                    }
                    await delay(30);
                    await this.recursiveBTMaze(blocks, check_row, check_col,rows, cols, visited);
                }
            }
            count++;
        }
    }

    verticalBarsMaze = async (blocks, sRow, eRow, sCol, eCol) => {
        if (eCol - sCol <= 1) {
            return;
        }
        let mid = Math.floor((Math.random() * (eCol - sCol) + sCol + 1));
        if (mid % 2 === 1)
            mid--;
        let open = Math.floor(Math.random() * ((eRow - 1) - sRow) + sRow);
        if (open % 2 === 0)
            open++;
        for (let i = sRow; i <= eRow; ++i) {
            await delay(10);
            if (i !== open)
                makeWall(blocks[i].childNodes[mid]);
        }
        await this.verticalBarsMaze(blocks, sRow, eRow, sCol, mid - 1);
        await this.verticalBarsMaze(blocks, sRow, eRow, mid + 1, eCol);
    }

    horizontalBarsMaze = async (blocks, sRow, eRow, sCol, eCol) => {
        if (eRow - sRow <= 1) {
            return;
        }
        let midRow = Math.floor((Math.random() * (eRow - sRow) + sRow + 1));
        if (midRow % 2 === 1)
            midRow--;

        let open = Math.floor(Math.random() * (eCol - sCol) + sCol);
        if (open % 2 === 0)
            open++;

        for (let i = sCol; i <= eCol; ++i) {
            await delay(10);
            if (i !== open)
                makeWall(blocks[midRow].childNodes[i]);
        }
        await this.horizontalBarsMaze(blocks, sRow, midRow - 1, sCol, eCol);
        await this.horizontalBarsMaze(blocks, midRow + 1, eRow, sCol, eCol);
    }

    recursiveDivisionMaze = async (blocks, sRow, eRow, sCol, eCol) =>{
        if (eCol - sCol <= 1 || eRow - sRow <= 1) {
            return;
        }
        await delay(10);
        let w = eCol - sCol;
        let h = eRow - sRow;
        let o;
        if (w < h)
            o = 0;
        else if (h < w)
            o = 1;
        else
            o = Math.floor(Math.random() * (2 - 0) + 0);

        //VERTICAL
        if (o === 1) {
            let mid = Math.floor((Math.random() * (eCol - sCol) + sCol + 1));
            if (mid % 2 === 1)
                mid--;
            let open = Math.floor(Math.random() * ((eRow - 1) - sRow) + sRow);
            if (open % 2 === 0)
                open++;
            for (let i = sRow; i <= eRow; ++i) {
                await delay(10);
                if (i !== open)
                    makeWall(blocks[i].childNodes[mid]);
            }
            await this.recursiveDivisionMaze(blocks, sRow, eRow, sCol, mid - 1);
            await this.recursiveDivisionMaze(blocks, sRow, eRow, mid + 1, eCol);
        }

        //HORIZONTAL
        else {
            let midRow = Math.floor((Math.random() * (eRow - sRow) + sRow + 1));
            if (midRow % 2 === 1)
                midRow--;

            let open = Math.floor(Math.random() * (eCol - sCol) + sCol);
            if (open % 2 === 0)
                open++;

            for (let i = sCol; i <= eCol; ++i) {
                await delay(10);
                if (i !== open)
                    makeWall(blocks[midRow].childNodes[i]);
            }
            await this.recursiveDivisionMaze(blocks, sRow, midRow - 1, sCol, eCol);
            await this.recursiveDivisionMaze(blocks, midRow + 1, eRow, sCol, eCol);
        }
    }

    randomMaze = async (blocks, start, end) =>{
        const rows = blocks.length;
        const cols = blocks[0].childElementCount;

        for (let i = 1; i < rows-1; ++i) {
            await delay(0);
            for (let j = 1; j < cols - 1; ++j) {
                if (i === start[0] && j === start[1] || i === end[0] && j === end[1]) {
                    continue;
                }
                let make_wall = Math.floor((Math.random() * 4) + 1);
                if (make_wall === 1) {
                    buildWall(blocks[i].childNodes[j]);
                }
            }
        }
    }
}

export default  new Maze();