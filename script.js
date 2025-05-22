// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const tileBankArea = document.getElementById('tile-bank-area');
    const gridArea = document.getElementById('grid-area');
    const hintButton = document.getElementById('hint-button');
    const resetButton = document.getElementById('reset-button');
    const winPopup = document.getElementById('win-popup');
    const closePopupButton = document.getElementById('close-popup-button');
    // Instructions element can be targeted if hints need to write there, but alert is simpler for now.

    // --- Game Configuration & Data ---
    const tileTexts = [
        // Row 1 from your image/list
        "ey ", "our", "are", "of ", "cal", "and", "djo", "o a ",
        // Row 2
        "h a", "urn", "ork", "g Cz", "is ", "fle", "on ", " re",
        // Row 3
        "l t", "bot", "ge ", "han", "vin", " sh", "isi", "for",
        // Row 4
        "on ", "for", "tio", "ce. ", "cti", "cqu", "e A", " a ",
        // Row 5
        "Dri", "cti", " th", "n w"
    ];

    // Create an array of tile objects, each with a unique ID and its text
    const tilesData = tileTexts.map((text, index) => ({
        id: `tile-${index}`,
        text: text
    }));

    // This is the order the tiles will appear in the Tile Bank initially (jumbled).
    // For this example, we'll shuffle the tilesData to create a jumbled order.
    // A more deterministic jumble might be preferred for consistent testing.
    let initialTileBankLayout = shuffleArray([...tilesData]); // Keep original tilesData for solution mapping

    // --- CRITICAL: Define the correct order of tile IDs for the solution ---
    // This array must contain the tile IDs (e.g., "tile-0", "tile-1", ...)
    // in the exact sequence that forms the target sentence.
    // YOU MUST REPLACE THIS WITH THE ACTUAL CORRECT SEQUENCE OF YOUR 35 TILE IDs.
    // Example: If tilesData[0] ("ey ") is the 5th word, its ID "tile-0" would be at index 4 here.
    // For demonstration, let's assume a simple (but incorrect for your sentence) sequential order.
    // Replace this with the actual solution order based on your specific tile texts and sentence.
    const correctGridSolutionOrder = tilesData.map(tile => tile.id);
    // Example: If the solution is tile-5, then tile-0, then tile-12, etc.
    // const correctGridSolutionOrder = ["tile-5", "tile-0", "tile-12", ... ];

    const GRID_ROWS_CONFIG = [8, 8, 8, 8, 3]; // Number of cells per row in the grid & tile bank

    let draggedTile = null; // To store the tile being dragged

    // --- Utility Functions ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // --- Tile Bank and Grid Rendering ---
    function renderTileBank() {
        tileBankArea.innerHTML = ''; // Clear previous tiles
        let tileIndex = 0;
        GRID_ROWS_CONFIG.forEach(numTilesInRow => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            for (let i = 0; i < numTilesInRow; i++) {
                if (tileIndex < initialTileBankLayout.length) {
                    const tileData = initialTileBankLayout[tileIndex++];
                    const tileElement = createTileElement(tileData);
                    // Store initial bank position for reset
                    tileElement.dataset.initialBankParentId = rowDiv.id || `bank-row-${tileBankArea.children.length}`;
                    if (!rowDiv.id) rowDiv.id = tileElement.dataset.initialBankParentId;

                    rowDiv.appendChild(tileElement);
                } else { // If fewer than 35 tiles, create an empty placeholder
                    const emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.className = 'tile-placeholder'; // Needs styling if used
                    rowDiv.appendChild(emptyPlaceholder);
                }
            }
            tileBankArea.appendChild(rowDiv);
        });
    }

    function createTileElement(tileData) {
        const tileElement = document.createElement('div');
        tileElement.id = tileData.id;
        tileElement.className = 'tile';
        tileElement.textContent = tileData.text;
        tileElement.draggable = true;

        tileElement.addEventListener('dragstart', handleDragStart);
        tileElement.addEventListener('dragend', handleDragEnd);
        return tileElement;
    }

    function renderGrid() {
        gridArea.innerHTML = ''; // Clear previous grid
        let cellIndex = 0;
        GRID_ROWS_CONFIG.forEach((numCellsInRow, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'grid-row';
            for (let i = 0; i < numCellsInRow; i++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.dataset.gridPosition = cellIndex++; // 0 to 34

                cellElement.addEventListener('dragover', handleDragOver);
                cellElement.addEventListener('dragenter', handleDragEnter);
                cellElement.addEventListener('dragleave', handleDragLeave);
                cellElement.addEventListener('drop', handleDrop);
                rowDiv.appendChild(cellElement);
            }
            gridArea.appendChild(rowDiv);
        });
    }

    // --- Drag and Drop Event Handlers ---
    function handleDragStart(event) {
        draggedTile = event.target;
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => event.target.classList.add('dragging'), 0); // Visual cue
    }

    function handleDragEnd(event) {
        draggedTile.classList.remove('dragging');
        draggedTile = null;
    }

    function handleDragOver(event) {
        event.preventDefault(); // Necessary to allow dropping
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

            // If the cell is empty, append the tile
            if (targetCell.children.length === 0) {
                // If tile was in another grid cell, remove it from there
                if (draggedTile.parentElement.classList.contains('grid-cell')) {
                    draggedTile.parentElement.innerHTML = ''; // Make old cell empty
                }
                targetCell.appendChild(draggedTile);
            }
            // If cell is not empty, and we want to swap or prevent drop:
            // For now, only allows drop in empty cell. If you drag from bank to occupied, it won't drop.
            // If you drag from grid cell to occupied grid cell, it won't drop.

            checkWinCondition();
        }
    }

    // --- Game Logic Functions ---
    function handleReset() {
        // Re-render the tile bank with initial jumbled layout
        // This involves clearing the grid and putting all tiles back.
        // Simplest way is to re-initialize parts of the game.
        initialTileBankLayout = shuffleArray([...tilesData]); // Get a new jumble or reset to a fixed initial jumble
        renderTileBank();
        renderGrid(); // Clears grid cells
        hideWinPopup();
    }

    function handleHint() {
        // Option B: Pick a tile still in the bank and tell where it goes.
        const tilesInBank = Array.from(tileBankArea.querySelectorAll('.tile'));
        if (tilesInBank.length === 0) {
            alert("No tiles left in the bank to give a hint for!");
            return;
        }

        let hintGiven = false;
        for (const tileInBank of tilesInBank) {
            const tileId = tileInBank.id;
            const correctPositionIndex = correctGridSolutionOrder.indexOf(tileId);

            if (correctPositionIndex !== -1) {
                const targetGridCell = gridArea.querySelector(`.grid-cell[data-grid-position='${correctPositionIndex}']`);
                // Check if the correct cell is empty OR contains the wrong tile
                if (!targetGridCell.hasChildNodes() || (targetGridCell.firstChild && targetGridCell.firstChild.id !== tileId)) {
                    const rowIndex = Math.floor(correctPositionIndex / GRID_ROWS_CONFIG[0]) + 1; // Approximate row
                    const colIndex = (correctPositionIndex % GRID_ROWS_CONFIG[0]) + 1; // Approximate col
                    alert(`Hint: The tile '${tileInBank.textContent}' belongs in grid position approximately Row ${rowIndex}, Column ${colIndex} (Slot ${correctPositionIndex + 1}).`);
                    hintGiven = true;
                    break;
                }
            }
        }
        if (!hintGiven && tilesInBank.length > 0) {
            alert("All remaining tiles in the bank are either already correctly placed (somehow) or a hint isn't available for them right now. Try arranging some tiles!");
        } else if (!hintGiven && tilesInBank.length === 0){
            alert("All tiles placed! Check your solution or reset.");
        }
    }


    function checkWinCondition() {
        const gridCells = gridArea.querySelectorAll('.grid-cell');
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

    // --- Popup Functions ---
    function showWinPopup() {
        winPopup.classList.add('visible');
        winPopup.setAttribute('aria-hidden', 'false');
    }

    function hideWinPopup() {
        winPopup.classList.remove('visible');
        winPopup.setAttribute('aria-hidden', 'true');
    }

    // --- Initialization ---
    function initGame() {
        renderTileBank();
        renderGrid();
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame(); // Start the game
});
