class Board extends React.Component {
    state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameStatus: false,
        mineCount: this.props.mines
    };
    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">
                    mines: {this.state.mineCount}
                    </span>
                    <br />
                    <span className="info">
                    {this.state.gameStatus}
                    </span>
                </div>
                { this.renderBoard(this.state.boardData)}
            </div>
        );
    }
}

Board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mines: PropTypes.number,
}

const initBoard = (height, width, mines) => {
    let data = this.createEmptyArray(height, width);
    data = this.plantMines(data, height, width, mines);
    data = this.getNeighbours(data, height, width);

    return data;
}

const createEmptyArray = (height, width) => {
    let data = [];
    for (let i = 0; i < height; i++) {
        data.push([]);
        for (let j = 0; j < width; j++) {    
            data[i][j] = {
                x: i,      
                y: j,      
                isMine: false,      
                neighbour: 0,      
                isRevealed: false,      
                isEmpty: false,      
                isFlagged: false,      
            };    
        }  
    }  
    return data;
}

const plantMines = (data, height, width, mines) => {
    let randomx, randomy, minesPlanted = 0;  while (minesPlanted < mines) {
        randomx = this.getRandomNumber(width);
        randomy = this.getRandomNumber(height);    
        if (!(data[randomx][randomy].isMine)) {
            data[randomx][randomy].isMine = true;
            minesPlanted++;
        }
    }

    return (data);
}

const getNeighbours = (data, height, width) => {
    let updatedData = data;for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (data[i][j].isMine !== true) {
                let mine = 0;
                const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                area.map(value => {
                if (value.isMine) {
                    mine++;
                }
                });
                if (mine === 0) {
                    updatedData[i][j].isEmpty = true;
                }
                updatedData[i][j].neighbour = mine;
            }
        }
    }
    return (updatedData);
}

// looks for neighbouring cells and returns them
const traverseBoard = (x, y, data) => {
    const el = [];  
    //up
    if (x > 0) {
        el.push(data[x - 1][y]);
    }  
     //down
    if (x < this.props.height - 1) {
        el.push(data[x + 1][y]);
    }  
    //left
    if (y > 0) {
        el.push(data[x][y - 1]);
    }  
    //right
    if (y < this.props.width - 1) {
        el.push(data[x][y + 1]);
    }  
    // top left
    if (x > 0 && y > 0) {
        el.push(data[x - 1][y - 1]);
    }  
    // top right
    if (x > 0 && y < this.props.width - 1) {
        el.push(data[x - 1][y + 1]);
    }  
    // bottom right
    if (x < this.props.height - 1 && y < this.props.width - 1) {
        el.push(data[x + 1][y + 1]);
    }  
    // bottom left
    if (x < this.props.height - 1 && y > 0) {
        el.push(data[x + 1][y - 1]);
    }  
    return el;
}

const renderBoard = (data) => {  
    return data.map((datarow) => {    
        return datarow.map((dataitem) => {      
            return (
                <div 
                    key={dataitem.x * datarow.length + dataitem.y}>
                    <Cell
                        onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                        cMenu={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
                        value={dataitem}
                    />
                    {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}        
                </div>
            );
        })
    });
}

const handleCellClick = (x, y) => {  
    if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged){ 
        return null;
    }
    if (this.state.boardData[x][y].isMine) {
      this.setState({gameStatus: "You Lost."});
      this.revealBoard();
      alert("game over");
    }  
    
    let updatedData = this.state.boardData;
    
    if (updatedData[x][y].isEmpty) {
        updatedData = this.revealEmpty(x, y, updatedData);
    }
    if (this.getHidden(updatedData).length === this.props.mines) {
        this.setState({gameStatus: "You Win."});
        this.revealBoard();
        alert("You Win");
    }  
    this.setState({
        boardData: updatedData,
        mineCount: this.props.mines -this.getFlags(updatedData).length,
        gameWon: win,
    });
}

revealEmpty(x, y, data) {
    let area = this.traverseBoard(x, y, data);
    area.map(value => {
        if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
            data[value.x][value.y].isRevealed = true;
            if (value.isEmpty) {
                this.revealEmpty(value.x, value.y, data);
            }
        }
    });
    return data;
}

handleContextMenu(event, x, y) {  
    event.preventDefault();
    let updatedData = this.state.boardData;  
    let mines = this.state.mineCount;  
    let win = false;  
    if (updatedData[x][y].isRevealed) {
        return;
    }  
        if (updatedData[x][y].isFlagged) {    
            updatedData[x][y].isFlagged = false;    
            mines++;  
        } else {    
            updatedData[x][y].isFlagged = true;    
            mines--;  
        }  
        if (mines === 0) {    
            const mineArray = this.getMines(updatedData);    
            const FlagArray = this.getFlags(updatedData);    
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {      
                this.revealBoard();      
                alert("You Win");    
            }  
        }  
        this.setState({    
            boardData: updatedData,    
            mineCount: mines,    
            gameWon: win,  
        });
    }