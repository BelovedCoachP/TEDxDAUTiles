// script.js (Updated Sections)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References --- ( zůstává stejné )
    const tileBankArea = document.getElementById('tile-bank-area');
    const gridArea = document.getElementById('grid-area');
    const hintButton = document.getElementById('hint-button');
    const resetButton = document.getElementById('reset-button');
    const winPopup = document.getElementById('win-popup');
    const closePopupButton = document.getElementById('close-popup-button');

    // --- Game Configuration & Data ---
    // UPDATED TILE TEXTS (36 tiles)
    const tileTexts = [
        // Row 1
        "e y  ", "o u r", "a r e", "o f  ", "c a l", "a n d", "d j o", "o   a ",
        // Row 2
        "h   a", "u r n", "o r k", "g   C", "i s  ", "f l e", "o n  ", "  r e",
        // Row 3
        "l  t", "b o t", "g e  ", "h a n", "v i n", "  s h", "i s i", "f o r",
        // Row 4
        "o n  ", "f o r", "t i o", "c e.  ", "c t i", "c q u", "e   A", "   a  ",
        // Row 5
        "D r i", "c t i", "   t h", "n   w"
    ];

    const tilesData = tileTexts.map((text, index) => ({
        id: `tile-${index}`, // IDs will be tile-0 to tile-35
        text: text
    }));

    let initialTileBankLayout = shuffleArray([...tilesData]);

    // --- CRITICAL: Define the correct order of tile IDs for the solution ---
    // This array must contain the 36 tile IDs (e.g., "tile-0" to "tile-35")
    // in the exact sequence that forms the target sentence.
    // YOU MUST REPLACE THIS WITH THE ACTUAL CORRECT SEQUENCE.
    // The placeholder below will NOT solve the puzzle.
    const correctGridSolutionOrder = tilesData.map(tile => tile.id); // Placeholder!
    // Example: correctGridSolutionOrder = ["tile-32", "tile-20", "tile-12", ...etc. for all 36 tiles ];

    // UPDATED GRID CONFIGURATION
    const GRID_ROWS_CONFIG = [8, 8, 8, 8, 4]; // Total 36 cells

    let draggedTile = null;

    // --- Utility Functions --- (shuffleArray - zůstává stejné)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Tile Bank and Grid Rendering --- (Logic remains the same, uses new GRID_ROWS_CONFIG and 36 tiles)
    function renderTileBank() {
        tileBankArea.innerHTML = '';
        let tileIndex = 0;
        GRID_ROWS_CONFIG.forEach((numTilesInRow, rowIndex) => { // Added rowIndex for unique row IDs if needed
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            rowDiv.id = `bank-row-${rowIndex}`; // Assign an ID to the bank row for more specific resets if ever needed
            for (let i = 0; i < numTilesInRow; i++) {
                if (tileIndex < initialTileBankLayout.length) {
                    const tileData = initialTileBankLayout[tileIndex++];
                    const tileElement = createTileElement(tileData);
                    // Store reference to its original bank row for precise reset
                    tileElement.dataset.initialBankRowId = rowDiv.id;
                    rowDiv.appendChild(tileElement);
                } else {
                    // This case should ideally not be hit if GRID_ROWS_CONFIG sums to tile count
                    const emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.className = 'tile-placeholder';
                    emptyPlaceholder.style.width = '70px'; // Match tile style
                    emptyPlaceholder.style.height = '50px';// Match tile style
                    emptyPlaceholder.style.margin = '3px'; // Match tile style
                    rowDiv.appendChild(emptyPlaceholder);
                }
            }
            tileBankArea.appendChild(rowDiv);
        });
    }

    function createTileElement(tileData) { // (zůstává stejné)
        const tileElement = document.createElement('div');
        tileElement.id = tileData.id;
        tileElement.className = 'tile';
        tileElement.textContent = tileData.text;
        tileElement.draggable = true;

        tileElement.addEventListener('dragstart', handleDragStart);
        tileElement.addEventListener('dragend', handleDragEnd);
        return tileElement;
    }

    function renderGrid() { // (Logic remains the same, uses new GRID_ROWS_CONFIG for 36 cells)
        gridArea.innerHTML = '';
        let cellIndex = 0;
        GRID_ROWS_CONFIG.forEach(numCellsInRow => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'grid-row';
            for (let i = 0; i < numCellsInRow; i++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.dataset.gridPosition = cellIndex++; // 0 to 35

                cellElement.addEventListener('dragover', handleDragOver);
                cellElement.addEventListener('dragenter', handleDragEnter);
                cellElement.addEventListener('dragleave', handleDragLeave);
                cellElement.addEventListener('drop', handleDrop);
                rowDiv.appendChild(cellElement);
            }
            gridArea.appendChild(rowDiv);
        });
    }

    // --- Drag and Drop Event Handlers --- (zůstávají stejné)
    function handleDragStart(event) {
        draggedTile = event.target;
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => event.target.classList.add('dragging'), 0);
    }

    function handleDragEnd(event) {
        if (draggedTile) { // Check if draggedTile is not null
            draggedTile.classList.remove('dragging');
        }
        draggedTile = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        if (event.target.classList.contains('grid-cell')) {
            event.target.classList.add('drag-over');
        }
    }

    function handleDragLeave(event) {
        if (event.target.classList.contains('grid-cell')) {
            event.target.classList.remove('drag-over');
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        const targetCell = event.target.closest('.grid-cell');
        if (targetCell && draggedTile) {
            targetCell.classList.remove('drag-over');
            if (targetCell.children.length === 0) {
                if (draggedTile.parentElement.classList.contains('grid-cell')) {
                    // draggedTile.parentElement.innerHTML = ''; // Clear child instead of innerHTML
                     while (draggedTile.parentElement.firstChild) {
                        draggedTile.parentElement.removeChild(draggedTile.parentElement.firstChild);
                    }
                }
                targetCell.appendChild(draggedTile);
            }
            checkWinCondition();
        }
    }
    
    // --- Game Logic Functions ---
    function handleReset() {
        // To ensure tiles go back to their *original* bank spots, we need a more robust reset.
        // The simplest way to ensure the original jumbled layout is to re-render it.
        // If initialTileBankLayout is shuffled once at the start, keep that shuffled order.
        // Or, re-shuffle if you want a new jumble on each reset. Let's stick to resetting to the initial jumble.

        // Clear the grid first
        const gridCells = gridArea.querySelectorAll('.grid-cell');
        gridCells.forEach(cell => {
            // cell.innerHTML = '';
            while (cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
        });

        // Re-render the tile bank with the exact same initialTileBankLayout
        // This requires initialTileBankLayout to be the fixed jumbled order for the session.
        // The createTileElement is fine, renderTileBank should just use the fixed initialTileBankLayout.
        renderTileBank(); // This will recreate tiles based on initialTileBankLayout
        
        hideWinPopup();
    }
    
    // Hint function might need slight adjustment if tile IDs change due to reordering tileTexts.
    // But core logic of finding a tile in bank and its correct spot remains.
    function handleHint() { // (zůstává stejné v logice, ale bude pracovat s 36 dlaždicemi)
        const tilesInBank = Array.from(tileBankArea.querySelectorAll('.tile'));
        if (tilesInBank.length === 0) {
            alert("No tiles left in the bank to give a hint for!");
            return;
        }

        let hintGiven = false;
        // Create a copy of tilesInBank and shuffle it to provide a random hint
        const shuffledBankTiles = shuffleArray([...tilesInBank]);

        for (const tileInBank of shuffledBankTiles) {
            const tileId = tileInBank.id;
            const correctPositionIndex = correctGridSolutionOrder.indexOf(tileId);

            if (correctPositionIndex !== -1) {
                const targetGridCell = gridArea.querySelector(`.grid-cell[data-grid-position='${correctPositionIndex}']`);
                if (targetGridCell && (!targetGridCell.hasChildNodes() || (targetGridCell.firstChild && targetGridCell.firstChild.id !== tileId))) {
                    // Determine row and column more accurately based on GRID_ROWS_CONFIG
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
                 alert("All remaining tiles in the bank appear to be for already correctly filled spots, or no simple hint is available. Keep trying!");
            } else {
                 alert("All tiles placed! If the puzzle isn't solved, some may be in the wrong order.");
            }
        }
    }

    function checkWinCondition() { // (Bude kontrolovat 36 dlaždic)
        const gridCells = gridArea.querySelectorAll('.grid-cell');
        if (gridCells.length !== correctGridSolutionOrder.length) return; // Should not happen if rendered correctly

        let allCorrect = true;
        for (let i = 0; i < correctGridSolutionOrder.length; i++) {
            const cell = gridCells[i];
            const tileInCell = cell.firstChild;
            if (!tileInCell || tileInCell.id !== correctGridSolutionOrder[i]) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            showWinPopup();
        }
    }

    // --- Popup Functions --- (zůstávají stejné)
// In script.js

function showWinPopup() {
    winPopup.classList.add('visible');
    winPopup.setAttribute('aria-hidden', 'false');

    // Trigger confetti!
    if (typeof confetti === 'function') {
        // Basic confetti burst
        confetti({
            particleCount: 150, // More particles
            spread: 100,       // Wider spread
            origin: { y: 0.6 } // Start confetti a bit lower than the top
        });

        // You can even make it a bit more festive:
        // A few seconds of continuous confetti
        const duration = 3 * 1000; // 3 seconds
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
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
        // Ensure initialTileBankLayout is set once for the session for consistent reset
        initialTileBankLayout = shuffleArray([...tilesData]); // Set the jumbled order for this game session

        renderTileBank();
        renderGrid();
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame();
});
