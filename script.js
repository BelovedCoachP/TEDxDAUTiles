// script.js (Final version based on user's definitive solution map)

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
        /*0*/ "e y  ", /*1*/ "o u r", /*2*/ "a r e", /*3*/ "o f  ", /*4*/ "c a l", /*5*/ "a n d", /*6*/ "d j o", /*7*/ "o   a ",
        /*8*/ "h   a", /*9*/ "u r n",/*10*/ "o r k",/*11*/ "g   C",/*12*/ "i s  ",/*13*/ "f l e",/*14*/ "o n  ",/*15*/ "  r e",
        /*16*/"l  t", /*17*/ "b o t",/*18*/ "g e  ",/*19*/ "h a n",/*20*/ "v i n",/*21*/ "  s h",/*22*/ "i s i",/*23*/ "f o r",
        /*24*/"o n  ", /*25*/ "f o r",/*26*/ "t i o",/*27*/ "c e.  ",/*28*/ "c t i",/*29*/ "c q u",/*30*/ "e   A",/*31*/ "   a  ",
        /*32*/"D r i", /*33*/ "c t i",/*34*/ "   t h",/*35*/ "n   w"
    ];

    const tilesData = tileTexts.map((text, index) => ({
        id: `tile-${index}`,
        text: text
    }));

    // --- Configuration for Auto-Placed Tiles ---
    const autoPlacedTilesInfo = [
        { id: "tile-24", gridPosition: 11 }, // "o n  " (from tileTexts[24]) goes into Grid Slot 12 (index 11)
        { id: "tile-23", gridPosition: 34 }  // "f o r" (from tileTexts[23]) goes into Grid Slot 35 (index 34)
    ];
    const autoPlacedTileIds = autoPlacedTilesInfo.map(info => info.id);

    let initialTileBankLayout = shuffleArray(tilesData.filter(tile => !autoPlacedTileIds.includes(tile.id))); // 34 draggable tiles

    // --- Definitive Correct Order of ALL 36 tile IDs for the solution ---
    const correctGridSolutionOrder = [
        "tile-32", // Grid Slot 1
        "tile-20", // Grid Slot 2
        "tile-11", // Grid Slot 3
        "tile-19", // Grid Slot 4
        "tile-18", // Grid Slot 5
        "tile-12", // Grid Slot 6
        "tile-17", // Grid Slot 7
        "tile-8",  // Grid Slot 8
        "tile-15", // Grid Slot 9
        "tile-13", // Grid Slot 10
        "tile-33", // Grid Slot 11 (Player places this)
        "tile-24", // Grid Slot 12 (PRE-PLACED "o n  ")
        "tile-3",  // Grid Slot 13
        "tile-1",  // Grid Slot 14
        "tile-21", // Grid Slot 15
        "tile-2",  // Grid Slot 16
        "tile-6",  // Grid Slot 17
        "tile-9",  // Grid Slot 18
        "tile-0",  // Grid Slot 19
        "tile-5",  // Grid Slot 20
        "tile-31", // Grid Slot 21
        "tile-4",  // Grid Slot 22
        "tile-16", // Grid Slot 23
        "tile-7",  // Grid Slot 24
        "tile-28", // Grid Slot 25
        "tile-14", // Grid Slot 26 (This is the other "o n  " tile, player places)
        "tile-25", // Grid Slot 27 (This is the other "f o r" tile, player places)
        "tile-34", // Grid Slot 28
        "tile-30", // Grid Slot 29
        "tile-29", // Grid Slot 30
        "tile-22", // Grid Slot 31
        "tile-26", // Grid Slot 32
        "tile-35", // Grid Slot 33
        "tile-10", // Grid Slot 34
        "tile-23", // Grid Slot 35 (PRE-PLACED "f o r")
        "tile-27"  // Grid Slot 36
    ];

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

    function renderTileBank() {
        tileBankArea.innerHTML = '';
        let tileRenderIndex = 0;
        let bankSlotsCreated = 0;
        const totalDraggableTiles = 34;

        GRID_ROWS_CONFIG.forEach((numSlotsInGridRow, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            
            let slotsToCreateInThisBankRow = numSlotsInGridRow;
            // For the rows containing pre-placed items, the bank row will be shorter
            if (rowIndex === 1 && numSlotsInGridRow === 8) { // Second row (index 1) where grid slot 11 (index 10) is pre-placed
                 const prePlacedHere = autoPlacedTilesInfo.find(info => info.gridPosition >= 8 && info.gridPosition < 16 && Math.floor((info.gridPosition)/8) === rowIndex);
                 if(prePlacedHere) slotsToCreateInThisBankRow--;
            }
             if (rowIndex === 4 && numSlotsInGridRow === 4) { // Last row (index 4) where grid slot 34 (index 34) is pre-placed
                const prePlacedHere = autoPlacedTilesInfo.find(info => info.gridPosition >= 32 && info.gridPosition < 36 && Math.floor((info.gridPosition)/8) === rowIndex);
                if(prePlacedHere) slotsToCreateInThisBankRow--;
            }


            for (let i = 0; i < slotsToCreateInThisBankRow; i++) {
                if (tileRenderIndex < initialTileBankLayout.length) {
                    const tileData = initialTileBankLayout[tileRenderIndex++];
                    const tileElement = createTileElement(tileData);
                    rowDiv.appendChild(tileElement);
                    bankSlotsCreated++;
                } else {
                    // This case should only be hit if not enough draggable tiles for the calculated bank slots
                    // For visual consistency, an empty placeholder can be added.
                    const emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.className = 'tile-placeholder';
                    rowDiv.appendChild(emptyPlaceholder);
                }
            }
            if (rowDiv.hasChildNodes()) {
                 tileBankArea.appendChild(rowDiv);
            }
        });
        if (bankSlotsCreated !== totalDraggableTiles) {
             console.warn(`Rendered ${bankSlotsCreated} tile slots in bank, expected ${totalDraggableTiles}.`);
        }
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
            if (!targetCell.firstChild || (targetCell.firstChild.draggable)) { // Check if cell is empty or has a draggable tile
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
                return; // Don't allow drop onto an auto-placed tile's cell
            }

            if (!targetCell.firstChild || (targetCell.firstChild && targetCell.firstChild.draggable)) {
                if (draggedTile.parentElement.classList.contains('grid-cell')) {
                    draggedTile.parentElement.innerHTML = '';
                }
                targetCell.innerHTML = ''; // Clear cell before appending
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
        renderTileBank();
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
            const correctPositionIndex = correctGridSolutionOrder.indexOf(tileId);

            // Ensure the correct position is not one of the auto-placed slots
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
                 alert("Could not find a clear hint right now. All remaining bank tiles might be for spots that are already correctly filled by other draggable tiles, or something is amiss in the solution order. Try rearranging!");
            } else { 
                 alert("All draggable tiles placed!");
            }
        }
    }

    function checkWinCondition() {
        const gridCells = gridArea.querySelectorAll('.grid-cell');
        if (gridCells.length !== correctGridSolutionOrder.length) {
            console.error("Rendered grid cells count does not match solution length.");
            return; 
        }

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

    function initGame() {
        initialTileBankLayout = shuffleArray(tilesData.filter(tile => !autoPlacedTileIds.includes(tile.id)));
        renderGrid();
        renderTileBank();
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame();
});
