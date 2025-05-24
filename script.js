// script.js (Complete version with Auto-Populate and Confetti)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const tileBankArea = document.getElementById('tile-bank-area');
    const gridArea = document.getElementById('grid-area');
    const hintButton = document.getElementById('hint-button');
    const resetButton = document.getElementById('reset-button');
    const winPopup = document.getElementById('win-popup');
    const closePopupButton = document.getElementById('close-popup-button');

    // --- Game Configuration & Data ---
    const tileTexts = [
        // Row 1 (indices 0-7)
        "e y  ", "o u r", "a r e", "o f  ", "c a l", "a n d", "d j o", "o   a ",
        // Row 2 (indices 8-15)
        "h   a", "u r n", "o r k", "g   C", "i s  ", "f l e", "o n  ", "  r e",
        // Row 3 (indices 16-23)
        "l  t", "b o t", "g e  ", "h a n", "v i n", "  s h", "i s i", "f o r", // tileTexts[23] is "f o r"
        // Row 4 (indices 24-31)
        "o n  ", "f o r", "t i o", "c e.  ", "c t i", "c q u", "e   A", "   a  ",
        // Row 5 (indices 32-35)
        "D r i", "c t i", "   t h", "n   w"
    ];

    const tilesData = tileTexts.map((text, index) => ({
        id: `tile-${index}`, // IDs will be tile-0 to tile-35
        text: text
    }));

    // --- Configuration for Auto-Placed Tile ---
    const AUTOPLACED_TILE_ID = "tile-23"; // This is the "f o r" from Row 3, Tile 8
    const AUTOPLACED_TILE_GRID_POSITION = 34; // Grid slot 35 (0-indexed, which is the 3rd slot in the last row)

    // initialTileBankLayout will contain the 35 draggable tiles, jumbled.
    let initialTileBankLayout = shuffleArray(tilesData.filter(tile => tile.id !== AUTOPLACED_TILE_ID));

    // --- CRITICAL: Define the correct order of ALL 36 tile IDs for the solution ---
    // This array must contain the 36 tile IDs (e.g., "tile-0" to "tile-35")
    // in the exact sequence that forms the target sentence.
    // AUTOPLACED_TILE_ID ("tile-23") will be part of this sequence at index AUTOPLACED_TILE_GRID_POSITION (34).
    // YOU MUST REPLACE THIS WITH THE ACTUAL CORRECT SEQUENCE.
    const correctGridSolutionOrder = tilesData.map(tile => tile.id); // Placeholder! Needs to be the actual solution.
    // Example: correctGridSolutionOrder = ["tile-32", "tile-20", /*...,*/ "tile-23", /*...,*/ "tile-15" ]; // Total 36 IDs

    const GRID_ROWS_CONFIG = [8, 8, 8, 8, 4]; // Total 36 cells

    let draggedTile = null; // To store the tile being dragged

    // --- Utility Functions ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // --- Tile Creation ---
    function createTileElement(tileData, isDraggable = true) {
        const tileElement = document.createElement('div');
        tileElement.id = tileData.id;
        tileElement.className = 'tile';
        tileElement.textContent = tileData.text;
        tileElement.draggable = isDraggable;

        if (isDraggable) {
            tileElement.addEventListener('dragstart', handleDragStart);
            tileElement.addEventListener('dragend', handleDragEnd);
        } else {
            tileElement.style.cursor = 'default';
            tileElement.classList.add('pre-placed-tile'); // For distinct styling
        }
        return tileElement;
    }

    // --- Tile Bank Rendering ---
    function renderTileBank() {
        tileBankArea.innerHTML = '';
        let tileRenderIndex = 0; // Index for accessing tiles from initialTileBankLayout (which has 35 tiles)
        
        // The bank visually represents places for 35 draggable tiles,
        // matching the grid structure minus one auto-placed tile.
        let bankSlotsRendered = 0;
        GRID_ROWS_CONFIG.forEach((numGridSlotsInRow, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            
            let slotsInThisBankRow = numGridSlotsInRow;
            if (rowIndex === GRID_ROWS_CONFIG.length -1) { // If it's the last row
                // The grid has 4 slots, but bank only needs to show 3 tiles for this row.
                slotsInThisBankRow = numGridSlotsInRow - 1; 
            }
            // For all other rows, slotsInThisBankRow is same as numGridSlotsInRow

            for (let i = 0; i < slotsInThisBankRow; i++) {
                if (tileRenderIndex < initialTileBankLayout.length) {
                    const tileData = initialTileBankLayout[tileRenderIndex++];
                    const tileElement = createTileElement(tileData); // Draggable by default
                    rowDiv.appendChild(tileElement);
                    bankSlotsRendered++;
                } else {
                    // This should only happen if logic to calculate slotsInThisBankRow is off
                    // or if initialTileBankLayout is unexpectedly short.
                    // For safety, add a placeholder, but ideally not reached.
                    const emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.className = 'tile-placeholder';
                    rowDiv.appendChild(emptyPlaceholder);
                }
            }
            if (rowDiv.hasChildNodes()) { // Only append row if it has tiles/placeholders
                 tileBankArea.appendChild(rowDiv);
            }
        });
         // Sanity check
        if (bankSlotsRendered !== 35) {
            console.warn(`Rendered ${bankSlotsRendered} slots in bank, expected 35.`);
        }
    }

    // --- Grid Rendering ---
    function renderGrid() {
        gridArea.innerHTML = '';
        let cellIndex = 0;
        GRID_ROWS_CONFIG.forEach(numCellsInRow => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'grid-row';
            for (let i = 0; i < numCellsInRow; i++) {
                const currentCellPosition = cellIndex++;
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.dataset.gridPosition = currentCellPosition;

                if (currentCellPosition === AUTOPLACED_TILE_GRID_POSITION) {
                    const tileData = tilesData.find(t => t.id === AUTOPLACED_TILE_ID);
                    if (tileData) {
                        const prePlacedTile = createTileElement(tileData, false); // Not draggable
                        cellElement.appendChild(prePlacedTile);
                    }
                } else {
                    // Add event listeners for player-interactive cells
                    cellElement.addEventListener('dragover', handleDragOver);
                    cellElement.addEventListener('dragenter', handleDragEnter);
                    cellElement.addEventListener('dragleave', handleDragLeave);
                    cellElement.addEventListener('drop', handleDrop);
                }
                rowDiv.appendChild(cellElement);
            }
            gridArea.appendChild(rowDiv);
        });
    }

    // --- Drag and Drop Event Handlers ---
    function handleDragStart(event) {
        // Check if the target is actually a draggable tile and not something else
        if (event.target.classList.contains('tile') && event.target.draggable) {
            draggedTile = event.target;
            event.dataTransfer.setData('text/plain', event.target.id);
            setTimeout(() => {
                if (draggedTile) draggedTile.classList.add('dragging');
            }, 0); // Visual cue
        } else {
            event.preventDefault(); // Prevent drag if not a draggable tile
        }
    }

    function handleDragEnd(event) {
        if (draggedTile) { // Check if draggedTile exists
            draggedTile.classList.remove('dragging');
        }
        draggedTile = null;
    }

    function handleDragOver(event) {
        event.preventDefault(); // Necessary to allow dropping
    }

    function handleDragEnter(event) {
        event.preventDefault();
        const targetCell = event.target.closest('.grid-cell');
        // Only add drag-over class if it's not the auto-placed tile's cell AND it's empty or has a user-placed tile
        if (targetCell && parseInt(targetCell.dataset.gridPosition) !== AUTOPLACED_TILE_GRID_POSITION) {
             if (!targetCell.firstChild || (targetCell.firstChild && targetCell.firstChild.id !== AUTOPLACED_TILE_ID && targetCell.firstChild.draggable)) {
                targetCell.classList.add('drag-over');
            }
        }
    }

    function handleDragLeave(event) {
        const targetCell = event.target.closest('.grid-cell');
        if (targetCell) {
            targetCell.classList.remove('drag-over');
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        const targetCell = event.target.closest('.grid-cell');

        if (targetCell && draggedTile) {
            targetCell.classList.remove('drag-over');

            // Prevent dropping onto the auto-placed tile's cell
            if (parseInt(targetCell.dataset.gridPosition) === AUTOPLACED_TILE_GRID_POSITION) {
                return; // Don't allow drop here
            }

            // If the target cell is empty or contains another draggable tile (allowing swap/overwrite)
            if (!targetCell.firstChild || (targetCell.firstChild && targetCell.firstChild.draggable)) {
                // If tile was in another grid cell, make that cell empty
                if (draggedTile.parentElement.classList.contains('grid-cell')) {
                    draggedTile.parentElement.innerHTML = '';
                }
                // Clear target cell before appending (if it had another draggable tile)
                targetCell.innerHTML = '';
                targetCell.appendChild(draggedTile);
                checkWinCondition();
            }
        }
    }

    // --- Game Logic Functions ---
    function handleReset() {
        // Clear player-placed tiles from the grid
        gridArea.querySelectorAll('.grid-cell').forEach(cell => {
            if (parseInt(cell.dataset.gridPosition) !== AUTOPLACED_TILE_GRID_POSITION) {
                while (cell.firstChild) { // Clear all children (just in case)
                    cell.removeChild(cell.firstChild);
                }
            }
        });

        // Re-shuffle the draggable tiles for the bank (optional, or use fixed initial jumble)
        initialTileBankLayout = shuffleArray(tilesData.filter(tile => tile.id !== AUTOPLACED_TILE_ID));
        renderTileBank(); // Re-renders the 35 draggable tiles in the bank
        
        hideWinPopup();
    }
    
    function handleHint() {
        const tilesInBank = Array.from(tileBankArea.querySelectorAll('.tile'));
        if (tilesInBank.length === 0) {
            alert("No draggable tiles left in the bank to give a hint for!");
            return;
        }

        let hintGiven = false;
        const shuffledBankTiles = shuffleArray([...tilesInBank]); 

        for (const tileInBank of shuffledBankTiles) {
            const tileId = tileInBank.id;
            // This tile is draggable, so it's not the AUTOPLACED_TILE_ID

            const correctPositionIndex = correctGridSolutionOrder.indexOf(tileId);

            // Ensure the correct position is not the auto-placed slot
            if (correctPositionIndex !== -1 && correctPositionIndex !== AUTOPLACED_TILE_GRID_POSITION) {
                const targetGridCell = gridArea.querySelector(`.grid-cell[data-grid-position='${correctPositionIndex}']`);
                // Check if this correct cell is empty OR contains the wrong tile
                if (targetGridCell && (!targetGridCell.hasChildNodes() || (targetGridCell.firstChild && targetGridCell.firstChild.id !== tileId))) {
                    let cumulativeCells = 0;
                    let hintRowIndex = -1, hintColIndex = -1;
                    for(let r=0; r < GRID_ROWS_CONFIG.length; r++) {
                        const cellsInThisRow = GRID_ROWS_CONFIG[r];
                        if(correctPositionIndex < cumulativeCells + cellsInThisRow) {
                            hintRowIndex = r + 1;
                            hintColIndex = (correctPositionIndex - cumulativeCells) + 1;
                            break;
                        }
                        cumulativeCells += cellsInThisRow;
                    }
                    alert(`Hint: The tile '${tileInBank.textContent}' goes into Row ${hintRowIndex}, Column ${hintColIndex} (Overall Slot ${correctPositionIndex + 1}).`);
                    hintGiven = true;
                    break; 
                }
            }
        }
        if (!hintGiven) {
             if (tilesInBank.length > 0) {
                 alert("Could not find a clear hint right now. Try arranging some more tiles or check existing ones!");
            } else { // Should be caught by the initial check, but as a fallback
                 alert("All draggable tiles placed! If the puzzle isn't solved, some may be in the wrong order.");
            }
        }
    }

    function checkWinCondition() {
        const gridCells = gridArea.querySelectorAll('.grid-cell');
        // Ensure we have the correct number of grid cells matching the solution order length
        if (gridCells.length !== correctGridSolutionOrder.length) {
            console.error("Mismatch between rendered grid cells and solution length.");
            return; 
        }

        let allCorrect = true;
        for (let i = 0; i < correctGridSolutionOrder.length; i++) {
            const cell = gridCells[i]; // gridCells is a NodeList, access by index
            const tileInCell = cell.firstChild; // The tile div is the first child
            
            if (!tileInCell || tileInCell.id !== correctGridSolutionOrder[i]) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            showWinPopup();
        }
    }

    // --- Popup Functions ---
    function showWinPopup() {
        winPopup.classList.add('visible');
        winPopup.setAttribute('aria-hidden', 'false');

        // Trigger confetti!
        if (typeof confetti === 'function') {
            const duration = 3 * 1000; // 3 seconds
            const animationEnd = Date.now() + duration;
            // zIndex for confetti should be higher than popup's if necessary, but popup is 1000.
            // Let's ensure confetti itself doesn't block the popup close button visually for too long.
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1005 }; 

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            // Initial burst
            confetti(Object.assign({}, defaults, { particleCount: 150, spread: 100, origin: { y: 0.6 } }));
            
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }

    function hideWinPopup() {
        winPopup.classList.remove('visible');
        winPopup.setAttribute('aria-hidden', 'true');
    }

    // --- Initialization ---
    function initGame() {
        // Set the initial jumbled layout for draggable tiles once for the session
        initialTileBankLayout = shuffleArray(tilesData.filter(tile => tile.id !== AUTOPLACED_TILE_ID));
        
        renderGrid();     // Render grid first to place the auto-placed tile
        renderTileBank(); // Then render the bank with the remaining 35 draggable tiles
        
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame(); // Start the game
});
