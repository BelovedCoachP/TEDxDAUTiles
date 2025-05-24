// script.js (Updated with Auto-Populate Logic)

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
        id: `tile-${index}`,
        text: text
    }));

    // --- Configuration for Auto-Placed Tile ---
    const AUTOPLACED_TILE_ID = "tile-23"; // This is the "f o r" from Row 3, Tile 8
    const AUTOPLACED_TILE_GRID_POSITION = 34; // Grid slot 35 (0-indexed)

    let initialTileBankLayout = shuffleArray(tilesData.filter(tile => tile.id !== AUTOPLACED_TILE_ID));

    // --- CRITICAL: Define the correct order of ALL 36 tile IDs for the solution ---
    // This array must contain the 36 tile IDs (e.g., "tile-0" to "tile-35")
    // in the exact sequence that forms the target sentence.
    // AUTOPLACED_TILE_ID will be part of this sequence at AUTOPLACED_TILE_GRID_POSITION.
    // YOU MUST REPLACE THIS WITH THE ACTUAL CORRECT SEQUENCE.
    const correctGridSolutionOrder = tilesData.map(tile => tile.id); // Placeholder! Needs to be the actual solution.

    const GRID_ROWS_CONFIG = [8, 8, 8, 8, 4]; // Total 36 cells

    let draggedTile = null;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

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

    function renderTileBank() {
        tileBankArea.innerHTML = '';
        let tileRenderIndex = 0;
        // initialTileBankLayout already excludes the auto-placed tile
        const totalBankSlotsToFill = GRID_ROWS_CONFIG.reduce((sum, count) => sum + count, 0) -1; // 35 slots to represent in bank rows

        let currentBankSlotIndex = 0;
        GRID_ROWS_CONFIG.forEach((numSlotsInRowOriginal, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            rowDiv.id = `bank-row-${rowIndex}`;
            
            // Adjust numSlotsInRow if this row would contain the 36th slot which is now empty in the bank's visual
            let numTilesInThisRowVisual = numSlotsInRowOriginal;
            if (rowIndex === GRID_ROWS_CONFIG.length - 1) { // Last row
                numTilesInThisRowVisual = GRID_ROWS_CONFIG[GRID_ROWS_CONFIG.length -1] -1; // one less because one tile is auto-placed
            }
             if (initialTileBankLayout.length < totalBankSlotsToFill && rowIndex === GRID_ROWS_CONFIG.length -1 && GRID_ROWS_CONFIG.reduce((a,b)=>a+b,0) === 36){
                // This logic ensures that if the grid has 36 slots, the bank visually represents 35 slots for tiles.
                // For 8,8,8,8,4 config, last bank row shows 3 tiles + 1 empty placeholder visually
             }


            for (let i = 0; i < numSlotsInRowOriginal; i++) {
                 if (currentBankSlotIndex < totalBankSlotsToFill && tileRenderIndex < initialTileBankLayout.length) {
                    const tileData = initialTileBankLayout[tileRenderIndex++];
                    const tileElement = createTileElement(tileData); // Draggable by default
                    rowDiv.appendChild(tileElement);
                 } else if (currentBankSlotIndex < totalBankSlotsToFill) { // If we still expect slots but ran out of tiles to render (shouldn't happen with correct logic)
                    const emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.className = 'tile-placeholder'; // Visual empty slot in bank
                    rowDiv.appendChild(emptyPlaceholder);
                 }
                 currentBankSlotIndex++;
                 if(rowDiv.children.length === numSlotsInRowOriginal && rowIndex < GRID_ROWS_CONFIG.length -1) break; // filled normal row
                 if(rowIndex === GRID_ROWS_CONFIG.length -1 && rowDiv.children.length === numTilesInThisRowVisual) break; // filled last row which is shorter
            }
            if(rowDiv.children.length > 0) tileBankArea.appendChild(rowDiv);
        });
    }


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

    function handleDragStart(event) {
        dragged
