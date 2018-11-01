For the last week of the Lambda curriculum before Labs, we've been assigned implimenting Conway's Game of Life. To give some background, the Game of Life is the most well known example of [cellular automaton](http://en.wikipedia.org/wiki/cellular_automaton). 

According to [Bitstorm](https://bitstorm.org/gameoflife/ "see the game in action"), "This game became widely known when it was mentioned in an article published by Scientific American in 1970. It consists of a collection of cells which, based on a few mathematical rules, can live, die or multiply. Depending on the initial conditions, the cells form various patterns throughout the course of the game."

The week started with a kick-off lecture explaining the basics of the project, how we might go about implementing it, the MVP features, etc. We basically got free reign to tackle it however we wanted, as long as **the minimum feature set** was met:

The main entry point of your application should house the visualization of this cellular automata. Include necessary components, such as:
- Grid to display cells. 
- Cell objects or components that, at a minimum, should have:
    * Properties
        - currentState: (alive, dead), (black, white)
        - isClickable:
          - can be clicked to allow user to setup initial cell configuration 
          - should NOT be clickable while simulation is running
    * Behaviors
        - toggle_state( ): switch between alive & dead either because user manually toggled cell before starting simulation or simulation is running and rules of life caused cell to change state
- An appropriate data structure to hold a grid of cells that is at least 15 X 15. 
- Text to display current generation # being displayed
    * Utilize a timeout function to build the next generation of cells & update the display at the chosen time interval     
- Button(s) that start & stop the animation
- Button to clear the grid

Write an algorithm that:    
- Implements the following basic steps:
    - For each cell in the current generation's grid:
      1. Examine state of all eight neighbors (it's up to you whether you want cells to wrap around the grid and consider cells on the other side or not)
      2.  Apply rules of life to determine if this cell will change states
    - When loop completes:
      1. Swap current and next grids
      2. Repeat until simulation stopped
- Breaks down above steps into appropriate sub-tasks implemented with helper functions to improve readability
- Uses double buffering to update grid with next generation.

After the lecture, I did some research and planned my attack. I chose to work with react, because it's both my favourite tech to work with and the one I'm most comfortable using. So to start, I used `$ create-react-app client`. To oversimplify my initial plan of attack, I decided to start with creating a grid, then fill it with empty cells, and do some CSS (I'll like use styled components here). After installing initilizing create-react-app, I used the same basic colour scheme to get started. 

![create-react-app starter](https://ibin.co/4L7DOqZdBrtt.png)

Thinking out loud... 

As far as the grid went: 
- I wanted it to have at least 25 rows and 40 columns and responsive
- I wanted users to be able to specify its size 
- I wanted it to be able to change its state as the game stepped through the algorithm

As far the cells went:
- I wanted users to be able to toggle on and off single cells
- I wanted users to be able to randomize the active cells with the click of a button
- I wanted each cell to be responsive

This was the code I used to achieve the grid with pure CSS.

```
.Grid {
  position: relative;
  background-color: #000;
  width: 661px;
  height: 361px;
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, #80F103, 1px, transparent 1px),
    linear-gradient(to bottom, #80F103, 1px, transparent 1px);
}
```

![grid with pure css](https://ibin.co/4L7Dg1EloWNZ.png)

While the grid was relatively easy, I knew the cells would cause me some trouble. I tried to break down what I wanted into english before writing any code. Cells needed to be dead or alive and green or black - according to the README, this could be achieved using state. Cells needed to be clickable when the the simulation wasn't running and not clickable when it was running. Reading the README told me I could achieve this be using state and a toggle to turn `isClickable` on or off. 

As a side note, some extra features could be clicking and dragging cells, randomization, and a few classic presets from the game of life.

As it turns out, I wasn't able to achieve this the way I thought I might. First, I used nested for loops to populate the state with a `grid` full of `cells`. I used nested for loops as you can see below. The top function created a blank grid and the bottom filled it with clickable cells. I used the numbers 18 and 33 because that was that my grid height (660) and width (360) were divided by 20 (the length of the four sides of each cell). 

```
refreshGrid() {
    let grid = this.state.grid.slice();
    for (let y = 0; y < 18; y++) {
      grid[y] = [];
      for (let x = 0; x < 33; x++) {
        grid[y][x] = undefined;
      }
    }
    this.setState({grid});
  }

fillCells() {
    let cells = [];
    for (let y = 0; y < 18; y++) {
      for (let x = 0; x < 33; x++) {
        if (this.state.grid[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }
```

Next, I had to make a `handleClick` function that relied on two functions: `getElementOffset` and `fillCells` from above. [Retrieving the x and y coordinates for an HTML element](https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element) is an interesting task. I was pointed me to `getBoundingClientRect` which returns a top, bottom, left and right. I then did some calculation and got what I needed.

```
  getElementOffset() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: (rect.left + window.pageXOffset) - document.documentElement.clientLeft,
      y: (rect.top + window.pageYOffset) - document.documentElement.clientTop,
    };
  }
```

As you can see, each clicked `Cell` gets its own `key`, `x`, and `y`. I created a two-dimensional array.

![creating cells with x and y coordinates](https://ibin.co/4L7DvwTFELK9.png)

After getting the grid and cells working, I decided to add the buttons. This is probably a good time (sooner may have been better) to show you the wireframe we were given.

![game of life wireframe](https://ibin.co/4L7EJ2vXaxUL.png)

I like how the grid only take about half of the screen, I decided I'd likely make that change at a later time. Now that I look at it, it doesn't have the actual buttons I'd be using but if I look back at the feature list, there is more info on what I tackled next:

1.  Button(s) that start & stop the animation
2.  Button to clear the grid
3.  Add an option that creates a random cell configuration that users can run

Without further ado, here are the clear and random buttons in action.

![random and clear buttons](https://ibin.co/4KtJRjVnnHNb.gif)

I recycled my `refreshGrid()` function to clear the grid and added a `window.location.reload` (I planned to look into this later). And for the random configuration, I used `(Math.random() < 0.4)` with the number being the amount of cells I wanted to fill. Here is the full function.

```
randomGame = () => {
    for (let y = 0; y < 18; y++) {
        for (let x = 0; x < 33; x++) {
            this.state.grid[y][x] = (Math.random() < 0.4);
        }
    }
    this.setState({ cells: this.fillCells() });
  }
```

Next up was the group of functions that would actually run the simulation. From how I understood it, 
- at the highest level, I'd be using a `playGame` function
- inside state I'd need a check to see whether the game `isRunning` - start toggles is on, stop toggle it off
- it would need to run on an interval, step by step, for example, every 100ms - I could either use `setInterval` or `setTimeout` for this
- then I'd need a function that does the actual calculation/movement
- I'd repeatedly call this `nextIteration` function inside the the `playGame` function
- according to the README, here I could use double buffering: double buffering can be used to show one frame while a separate frame is being created to be shown next. so I would need to create two versions of the grid, one that is doing the calculating, then the other that is showing the movement, all the while making sure the two can swap. 
- to create a copy of the array, I could use `array.slice(0)`
- I believe all that's left now is creating the algorithm that follows the rules of the game of life

**These are the rules:**

1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

Note: Cells that are off the edge of the grid are typically assumed to be dead. (In other cases, people sometimes code it up to wrap around to the far side.)


First, I added `interval` and `isRunning` to state:
```
  state = {
    ...
    interval: 100,
    isRunning: false
  }
```

Second, I created state changes in the play and pause functions:
```
  playGame = () => {
    this.setState({ isRunning: true })
  }

  pauseGame = () => {
    this.setState({ isRunning: false })
  }
```

Third, I started a `nextIteration` function, and added it to `playGame`:
```
nextIteration = () => {

  }

  playGame = () => {
    this.setState({ isRunning: true })
    this.nextIteration();
  }
```

Fourth, I decided to [use `setInterval` rather than `setTimeout`](https://stackoverflow.com/questions/2696692/setinterval-vs-settimeout) because 
```
var intervalID = setInterval(alert, 1000); // Will alert every second.
// clearInterval(intervalID); // Will clear the timer.

setTimeout(alert, 1000); // Will alert once, after a second. 
```

Fifth, I added setInterval and clearInterval to the play and pause functions (and started to think I might not necessarily need `isRunning` to make this work):
```
playGame = () => {
    ...
    clearInterval(this.intervalID);
	this.intervalID = setInterval(this.nextIteration, this.state.interval);
  }

pauseGame = () => {
    ...
    clearInterval(this.intervalID);
  }
```

Sixth, for playGame I just set the state to generation + 1 to see that everything was functioning. Here is what I had so far: 
```
nextIteration = () => {
    this.setState({ generation: this.state.generation + 1 })
  }

playGame = () => {
    this.setState({ isRunning: true })
    clearInterval(this.intervalID);
    this.intervalID = setInterval(this.nextIteration, this.state.interval);
  }

pauseGame = () => {
    this.setState({ isRunning: false })
    clearInterval(this.intervalID);
  }
```

And... success!

![play and pause adding to generation](https://ibin.co/4Kuqz8MHuVyL.gif)

With that done, I spent a while working on the algorithm. I'll cut down the time I take to explain it and post it here with comments:

```
nextIteration = () => {

    // grid
    let firstBuffer = this.state.grid; 
    // grid copy
    let secondBuffer = this.state.grid.slice(0); 

    // loop thru rows
    for (let x = 0; x < this.state.rows; x++) { 
    // loop thru columns
		for (let y = 0; y < this.state.columns; y++) { 
    // initialize neighbours
		let neighbours = 0; 

        // left
        if (x > 0) if (firstBuffer[x-1][y]) neighbours++; 
        // diagonal up and left
        if (x > 0 && y < this.state.columns - 1) if (firstBuffer[x-1][y+1]) neighbours++; 
        // up
        if (y < this.state.columns - 1) if (firstBuffer[x][y+1]) neighbours++; 
        // diagonal up and right
        if (x < this.state.rows - 1 && y < this.state.columns - 1) if (firstBuffer[x+1][y+1]) neighbours++; 
        // right
        if (x < this.state.rows - 1) if (firstBuffer[x+1][y]) neighbours++; 
        // diagonal down and right
        if (x < this.state.rows - 1 && y > 0) if (firstBuffer[x+1][y-1]) neighbours++; 
        // down
        if (y > 0) if (firstBuffer[x][y-1]) neighbours++; 
        // diagonal down left
        if (x > 0 && y > 0) if (firstBuffer[x-1][y-1]) neighbours++; 

		// if less than 2 neighbours or more than three neighbours, it dies
    if (firstBuffer[x][y] && (neighbours < 2 || neighbours > 3)) secondBuffer[x][y] = false; 
		// if exactly 3 neighbours, it's born
    if (!firstBuffer[x][y] && neighbours === 3) secondBuffer[x][y] = true; 
		}
	}
```

Without much trouble, this allowed me to added a `Next` button, which allowed users to manually step through the simulation. I was also able to add a `Fast` button that sped up the simulation and a `Slow` button that slowed it down. 

![simulation running with buttons](https://ibin.co/4L7FVM15WiPe.gif)

Now I had to plan my attack going forward. I looked back at the wireframe and list of features and remembered I had to add info about the algorithm and the rules of the game. Because that would be easy, I decided to start with that. Afterwards, I planned to play around with my own wireframe and start to move different things around. I had one or two more features in mind that I wanted to add but I'd get to those later.

The next step was deploying, something that never seems to go as planned. I tried using Netlify for a while but eventually settled on using github pages - this [resource](https://github.com/gitname/react-gh-pages) helped. I started by creating a new `create-react-app` and a new github repo of the same name. I then deleted all of the files in the react folder and copied everything over from my other project. Then I did as follows:

```
$ yarn add gh-pages --save-dev

// Added these lines to package.json

...
"homepage": "http://gitname.github.io/react-gh-pages",
"scripts": {
  ...
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

$ git init

$ git add .

$ git commit -m "Initial commit"

$ git remote add origin http://github.com/[username]/[repo]

$ git push -u origin master

$ yarn run deploy 
```

With that, my project was hosted at https://blkfltchr.github.io/gameoflifethereactway/ and MVP plus a few extras was reached. 