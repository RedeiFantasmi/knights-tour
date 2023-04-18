// (function () {
//     const gameController = problemeCavalier(document.querySelector('main'));
//     gameController.init(5, 2, 2);


/**
 * Game controlleer
 * @param {HTMLElement} container - HTMLElement which will contain the game
 * @returns object
 */
function knightsTour(container = document.body) {
    if (!(container instanceof HTMLElement)) container = document.body;
    container.style.transition = 'background-color .5s';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'max-width: 680px; width: 100%; position: relative; margin: 24px;';
    container.appendChild(wrapper);

    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = 'display: grid; grid-template-columns: repeat(var(--nbColumns), 1fr); outline: solid 24px darkgray; border-radius: 4px; position: relative;';
    wrapper.appendChild(gridContainer);
    let grid = [];

    // Square states
    const EMPTY = 0;
    const AVAILABLE = 1;
    const VISITED = 2;

    // Square colors
    const colors = {
        0: '#FFFFFF',
        1: 'green',
        2: 'gray',
        'alternate': '#111111',
        'hover': 'darkgreen',
        'win': 'green',
        'lose': 'red',
    }

    // Knight informations
    const knightPos = {}

    // Store gridSize in memory
    let size = 0;

    // Is the knight moving ?
    let knightMoving = false;

    // Knight HTMLElement
    const knight = document.createElement('div');
    knight.style.background = 'center / contain no-repeat url("./knight.gif")';
    knight.style.position = 'absolute';
    knight.style.aspectRatio = '1 / 1';
    
    wrapper.appendChild(knight);

    // Width of a square
    let width = 0;


    return {
        /**
         * Initialize the grid
         * @param {Integer} gridSize - Size of the grid
         * @param {Integer} defaultX - Default x position of the knight
         * @param {Integer} defaultY - Default y position of the knight
         */
        init(gridSize, defaultX = 0, defaultY = 0) {
            if (defaultX < 0 || defaultX >= gridSize || isNaN(parseInt(defaultX))) defaultX = 0;
            if (defaultY < 0 || defaultY >= gridSize || isNaN(parseInt(defaultY))) defaultY = 0;

            document.documentElement.style.setProperty('--nbColumns', gridSize);

            grid = [];

            // Store the size
            size = gridSize;

            // Width of a square from the grid
            width = gridContainer.offsetWidth / size;
            // We set the same width to the knight is the same as a square
            knight.style.width = width + 'px';

            // Initilization of the grid
            for (let i = 0; i < gridSize; i++) {
                const row = [];
                for (let j = 0; j < gridSize; j++) {
                    // Square object
                    const square = {}
                    square.state = EMPTY;
                    square.alternate = false; // used for chess grid style

                    // Square HTMLElement
                    const squareElement = document.createElement('div');
                    if ((i + j) % 2 === 1) square.alternate = true;
                    squareElement.style.cssText = `aspect-ratio: 1 / 1; transition: background-color .25s;`;
                    square.element = squareElement;                        

                    row.push(square);
                    gridContainer.appendChild(squareElement);
                }
                grid.push(row);
            }

            // Default coordinates of the knight
            knightPos.x = defaultX;
            knightPos.y = defaultY;

            window.onresize = () => {
                if (width != gridContainer.offsetHeight / size) {
                    width = gridContainer.offsetHeight / size;
    
                    knight.style.width = width + 'px';
                    this.moveKnight(knightPos.x, knightPos.y);
                }                    
            }

            // Move knight to default position
            this.moveKnight(knightPos.x, knightPos.y, 0);
        },

        /**
         * Moves the knight to his next square
         * @param {Integer} x - x coordinate of the destination square
         * @param {Integer} y - y coordinate of the destination square
         * @param {Integer} animDuration - duration of the Knight's movement animation
         * @returns void
         */
        moveKnight(x, y, animDuration = 500) {
            // Old coordinates                
            const oldLeft = knightPos.x * width + 'px';
            const oldTop = knightPos.y * width + 'px';
            // New coordinates
            const left = x * width + 'px';
            const top = y * width + 'px';

            // Two different movement animations
            const animations = {
                0: [
                    { top: oldTop, left: oldLeft },
                    { top: oldTop, left: left },
                    { top: top, left: left }
                ],
                1: [
                    { top: oldTop, left: oldLeft },
                    { top: top, left: oldLeft },
                    { top: top, left: left }
                ],
            }

            // Random choice of animation
            const animMovement = animations[Math.floor(Math.random()*2)];

            // Declare knight is moving: prevents interaction with the available squares
            knightMoving = true;
            
            const anim = knight.animate(animMovement, { duration: animDuration, fill: 'forwards' });

            anim.onfinish = async () => {
                // Coordinates update
                knightPos.x = x;
                knightPos.y = y;

                this.updateGrid();
                knightMoving = false;
            }                
        },

        /**
         * Updates the squares of the grid
         * @returns void
         */
        updateGrid() {
            // Number of available squares
            let movesCount = 0
            // Number of visited squares
            let visitedCount = 0;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const square = grid[i][j];

                    const deltas = [Math.abs(knightPos.x - j), Math.abs(knightPos.y - i)];
                    // Reset old unused available squares
                    if (square.state === AVAILABLE) {
                        square.state = EMPTY;
                        square.element.onclick = ''
                        square.element.onmouseenter = ''
                        square.element.onmouseleave = '';
                    }
                    // If square reachable by knight and not already visited
                    if (deltas.includes(1) && deltas.includes(2) && square.state !== VISITED) {
                        square.state = AVAILABLE;
                        movesCount++;
                        square.element.onclick = () => {
                            if (knightMoving) return;

                            const currentPos = grid[knightPos.y][knightPos.x];
                            currentPos.state = VISITED;

                            this.moveKnight(j, i);
                        }
                        square.element.onmouseenter = () => {
                            square.element.style.background = colors.hover;
                            square.element.style.cursor = 'pointer';
                        }
                        square.element.onmouseleave = () => {
                            square.element.style.background = colors[AVAILABLE]
                            square.element.style.cursor = 'default';
                        }
                    }
                    if (square.state === VISITED) visitedCount ++;

                    square.element.style.backgroundColor = colors[square.state];
                    if (square.alternate && square.state === EMPTY) square.element.style.backgroundColor = colors['alternate'];
                }
            }
            if (visitedCount === (size % 2 === 0 ? size ** 2 - 2 : size ** 2 - 1)) { // If all possible squares visited, user wins
                container.style.backgroundColor = colors['win'];
                this.reset();
                return;
            };
            if (movesCount === 0) { // If no moves available, user loses
                container.style.backgroundColor = colors['lose'];
                this.reset();
            };
        },

        /**
         * Resets the grid and launch a new game with random coords for the knight
         */
        reset() {
            setTimeout(() => {
                container.style.backgroundColor = '';
                gridContainer.innerHTML = '';

                const randX = Math.floor(Math.random() * size);
                const randY = Math.floor(Math.random() * size);

                this.init(size, randX, randY);
            }, 1500);
        }
    }
}



// })();
