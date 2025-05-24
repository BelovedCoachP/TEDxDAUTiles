// script.js (Updated with THREE Auto-Placed Tiles and Fixed Spacing)

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
        /*0*/ "e y  ", /*1*/ "o u r", /*2*/ "a r e", /*3*/ "o f  ", /*4*/ "c a l", /*5*/ "a n d", /*6*/ "d  jo", /*7*/ "o   a ",
        /*8*/ "h   a", /*9*/ "u r n",/*10*/ "o r k",/*11*/ "g   C",/*12*/ "i s  ",/*13*/ "f l e",/*14*/ "o n  ",/*15*/ "  r e",
        /*16*/"l  t", /*17*/ "b o t",/*18*/ "g e  ",/*19*/ "h a n",/*20*/ "v i n",/*21*/ "  s h",/*22*/ "i s i",/*23*/ "f o r", // Pre-placed (tile-23)
        /*24*/"o n  ", // Pre-placed (tile-24)
                      /*25*/ "f o r",/*26*/ "t i o",/*27*/ "c e.  ",/*28*/ "c t i", // Draggable "c t i" (tile-28)
                                                                                   /*29*/ "c q u",/*30*/ "e   A",/*31*/ "   a  ",
        /*32*/"D r i", /*33*/ "c t i", // Pre-placed (tile-33)
                                     /*34*/ "   t h",/*35*/ "n   w"
    ];

    const tilesData = tileTexts.map((text, index) => ({
        id: `tile-${index}`,
        text: text
    }));

    // --- Configuration for Auto-Placed Tiles ---
    const autoPlacedTilesInfo = [
        { id: "tile-24", gridPosition: 11 }, // "o n  " (from tileTexts[24]) goes into Grid Slot 12 (index 11)
        { id: "tile-23", gridPosition: 34 }, // "f o r" (from tileTexts[23]) goes into Grid Slot 35 (index 34)
        { id: "tile-33", gridPosition: 24 }  // "c t i" (from tileTexts[33]) goes into Grid Slot 25 (index 24)
    ];
    const autoPlacedTileIds = autoPlacedTilesInfo.map(info => info.id);

    // initialTileBankLayout will contain the 33 draggable tiles, jumbled.
    let initialTileBankLayout = shuffleArray(tilesData.filter(tile => !autoPlacedTileIds.includes(tile.id)));

    // --- Definitive Correct Order of ALL 36 tile IDs for the solution ---
    const solutionOrderBasedOnUserList = [
        "tile-32", "tile-20", "tile-11", "tile-19", "tile-18", "tile-12", "tile-17", "tile-8",
        "tile-15", "tile-13", "tile-33", /*GS11*/ "tile-24" /*GS12 - PRE-PLACED*/, "tile-3",  "tile-1",  "tile-21", "tile-2",
        "tile-6",  "tile-9",  "tile-0",  "tile-5",  "tile-31", "tile-4",  "tile-16", "tile-7",
        "tile-28", /*GS25*/ "tile-14", "tile-25", "tile-34", "tile-30", "tile-29", "tile-22", "tile-26",
        "tile-35", "tile-10", "tile-23" /*GS35 - PRE-PLACED*/, "tile-27"
    ];

    // Apply pre-placements and adjust:
    const finalCorrectOrder = [...solutionOrderBasedOnUserList]; // Copy
    finalCorrectOrder[10] = "tile-28"; // tile-28 (original occupant of GS25) moves to GS11 (original spot of tile-33)
    finalCorrectOrder[11] = "tile-24"; // PRE-PLACED (as per user list and confirmation)
    finalCorrectOrder[24] = "tile-33"; // PRE-PLACED (as per user request)
    finalCorrectOrder[34] = "tile-23"; // PRE-PLACED (as per user list and confirmation)

    // Verify all 36 unique tile IDs are present exactly once
    const checkSet = new Set(finalCorrectOrder);
    if (finalCorrectOrder.length !== 36 || checkSet.size !== 36) {
        console.error("CRITICAL ERROR: correctGridSolutionOrder is not valid. It has " + finalCorrectOrder.length + " items and " + checkSet.size + " unique items. Expected 36 for both.");
        // Fallback to a non-winnable state to prevent further errors if this happens.
        // In a real scenario, this needs to be fixed by the developer.
        for(let i=0; i<36; i++) { if (!finalCorrectOrder.includes(`tile-${i}`)) console.error(`Missing tile-${i}`);}
    }

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
            tileElement.classList.add('pre-placed-tile');
        }
        return tileElement;
    }

    // Re-simplified renderTileBank: just makes rows for the 33 draggable tiles
    function revisedRenderTileBank() {
        tileBankArea.innerHTML = '';
        let tileRenderIndex = 0;
        const draggableTiles = initialTileBankLayout; // 33 tiles
        const BANK_LAYOUT_CONFIG = [7, 7, 7, 6, 6]; // 7+7+7+6+6 = 33

        BANK_LAYOUT_CONFIG.forEach(numTilesInRow => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            for (let i = 0; i < numTilesInRow; i++) {
                if (tileRenderIndex < draggableTiles.length) {
                    const tileData = draggableTiles[tileRenderIndex++];
                    const tileElement = createTileElement(tileData);
                    rowDiv.appendChild(tileElement);
                }
            }
            tileBankArea.appendChild(rowDiv);
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

                const autoPlacedInfo = autoPlacedTilesInfo.find(info => info.gridPosition === currentCellPosition);
                if (autoPlacedInfo) {
                    const tileData = tilesData.find(t => t.id === autoPlacedInfo.id);
                    if (tileData) {
                        const prePlacedTile = createTileElement(tileData, false);
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

    // --- Drag and Drop Event Handlers ---
    function handleDragStart(event) {
        if (event.target.classList.contains('tile') && event.target.draggable) {
            draggedTile = event.target;
            event.dataTransfer.setData('text/plain', event.target.id);
            setTimeout(() => { if (draggedTile) draggedTile.classList.add('dragging'); }, 0);
        } else {
            event.preventDefault();
        }
    }

    function handleDragEnd(event) {
        if (draggedTile) {
            draggedTile.classList.remove('dragging');
        }
        draggedTile = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        const targetCell = event.target.closest('.grid-cell');
        if (targetCell && !autoPlacedTilesInfo.some(info => info.gridPosition === parseInt(targetCell.dataset.gridPosition))) {
            if (!targetCell.firstChild || (targetCell.firstChild.draggable)) {
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

            if (autoPlacedTilesInfo.some(info => info.gridPosition === parseInt(targetCell.dataset.gridPosition))) {
                return; 
            }

            if (!targetCell.firstChild || (targetCell.firstChild && targetCell.firstChild.draggable)) {
                if (draggedTile.parentElement.classList.contains('grid-cell')) {
                    draggedTile.parentElement.innerHTML = '';
                }
                targetCell.innerHTML = ''; 
                targetCell.appendChild(draggedTile);
                checkWinCondition();
            }
        }
    }
    
    function handleReset() {
        gridArea.querySelectorAll('.grid-cell').forEach(cell => {
            if (!autoPlacedTilesInfo.some(info => info.gridPosition === parseInt(cell.dataset.gridPosition))) {
                while (cell.firstChild) {
                    cell.removeChild(cell.firstChild);
                }
            }
        });
        initialTileBankLayout = shuffleArray(tilesData.filter(tile => !autoPlacedTileIds.includes(tile.id)));
        revisedRenderTileBank(); // Use the revised bank renderer
        hideWinPopup();
    }
    
    function handleHint() {
        const tilesInBank = Array.from(tileBankArea.querySelectorAll('.tile'));
        if (tilesInBank.length === 0) {
            alert("No draggable tiles left to give a hint for!");
            return;
        }

        let hintGiven = false;
        const shuffledBankTiles = shuffleArray([...tilesInBank]); 

        for (const tileInBank of shuffledBankTiles) {
            const tileId = tileInBank.id;
            const correctPositionIndex = finalCorrectOrder.indexOf(tileId);

            if (correctPositionIndex !== -1 && !autoPlacedTilesInfo.some(info => info.gridPosition === correctPositionIndex)) {
                const targetGridCell = gridArea.querySelector(`.grid-cell[data-grid-position='${correctPositionIndex}']`);
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
                 alert("Could not find a clear hint right now. Try rearranging some more tiles!");
            } else { 
                 alert("All draggable tiles placed!");
            }
        }
    }

    function checkWinCondition() {
        const gridCells = gridArea.querySelectorAll('.grid-cell');
        if (gridCells.length !== finalCorrectOrder.length) {
            console.error("Rendered grid cells count does not match solution length.");
            return; 
        }

        let allCorrect = true;
        for (let i = 0; i < finalCorrectOrder.length; i++) {
            const cell = gridCells[i];
            const tileInCell = cell.firstChild;
            
            if (!tileInCell || tileInCell.id !== finalCorrectOrder[i]) {
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
        if (typeof confetti === 'function') {
            console.log("Confetti function found! Firing confetti...");
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1005 }; 
            function randomInRange(min, max) { return Math.random() * (max - min) + min; }
            confetti(Object.assign({}, defaults, { particleCount: 150, spread: 100, origin: { y: 0.6 } }));
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        } else {
            console.error("Confetti function NOT FOUND! Ensure library is loaded.");
        }
    }

    function hideWinPopup() {
        winPopup.classList.remove('visible');
        winPopup.setAttribute('aria-hidden', 'true');
    }

    // --- Initialization ---
    function initGame() {
        initialTileBankLayout = shuffleArray(tilesData.filter(tile => !autoPlacedTileIds.includes(tile.id)));
        renderGrid();
        revisedRenderTileBank();
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame(); 
});
