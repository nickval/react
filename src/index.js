import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


let moveStep = 20,
  startX = 140,
  startY = 0;
//   matrixBoxes,
//   gameOver = false;

function ViewPort(props) {
  console.log(props);
  return (
    <div className="ViewPort" contentEditable onKeyUp={props.onKeyUp}>
      <GameOver visibility={props.state.visibility} startNewGame = {props.startNewGame}/>
      {props.state.boxes.map(box => <InnerBox state={box} />)}
      <InnerBox state={props.state} color={props.color} />
    </div>
  );
}

function InnerBox(props) {
  const boxStyle = {
    left: props.state.x,
    top: props.state.y,
    backgroundColor: props.color,
    visibility: "visible"
  };
  return <div className="InnerBox" style={boxStyle} />;
}

function GameOver(props) {
  const gameOverStyle = {
    visibility: props.visibility
  };
  return (
    
    <div className="GameOver" style={gameOverStyle}>
      <p>Game over</p>
      <button onClick =  {props.startNewGame} >Play again</button>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.moveBox = this.moveBox.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.timer = 0;

    this.state = {
      x: startX,
      y: startY,
      boxes: [],
      gameOver: false,
      visibility: "hidden"
    };

    this.color = "red";
  }

  onKeyUp = event => {
    if (!this.state.gameOver) {
      if (event.key == "ArrowRight") {
        this.moveBox(moveStep, 0);
      }
      // if (event.key == "ArrowUp") {
      //   this.moveBox(0, -moveStep);
      // }
      if (event.key == "ArrowLeft") {
        this.moveBox(-moveStep, 0);
      }
      if (event.key == "ArrowDown") {
        this.moveBox(0, moveStep);
      }
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      if (!this.state.gameOver) {
        this.moveBox(0, moveStep);
      }
    }, 500);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    // console.log('state: ' + nextState.y);
    return nextState.y == 160 ? true : true;
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  moveBox(x, y) {
    let xPos = this.state.x + x,
      yPos = this.state.y + y;
    let busyBox;
    this.state.boxes.length === 0 && yPos === 300
      ? this.state.boxes.push({ x: xPos, y: yPos - moveStep })
      : false;
    busyBox = this.state.boxes.filter(res => {
      if ((res.x === xPos && res.y === yPos) || yPos === 300) {
        if (yPos === 0) {
          this.setState({
            gameOver: true,
            visibility: "visible"
          });
        } else if (y > 0) {
          this.state.boxes.push({ x: this.state.x, y: this.state.y });
          xPos = startX;
          yPos = startY;
          this.setState({
            y: (this.state.y = yPos),
            x: (this.state.x = xPos),
            boxes: this.state.boxes
          });
        }
        return res;
      }
      return false;
    });
    if (
      busyBox == 0 &&
      xPos <= 300 - moveStep &&
      xPos >= 0 &&
      yPos >= 0 &&
      yPos <= 300 - moveStep
    ) {
      this.setState({
        y: (this.state.y = yPos),
        x: (this.state.x = xPos)
      });
    }
  }

  startNewGame() {
      this.setState({
        x: startX,
        y: startY,
        boxes: [],
        gameOver: false,
        visibility: "hidden"
      });
  }

  render() {
    return (
      <div className="Application">
        <ViewPort
          onKeyUp={this.onKeyUp}
          state={this.state}
          color={this.props.color}
          startNewGame={this.startNewGame}
        />
      </div>
    );
  }
}

App.defaultProps = {
  visibility: "hidden"
};

App.displayName = "MyApp";

ReactDOM.render(<App />, document.getElementById("reactRoot"));
