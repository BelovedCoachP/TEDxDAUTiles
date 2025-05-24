// script.js (Updated with THREE Auto-Placed Tiles)

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
    // This IS the final solution based on your comprehensive list.
    const correctGridSolutionOrder = [
        "tile-32", // Grid Slot 1 (index 0)
        "tile-20", // Grid Slot 2 (index 1)
        "tile-11", // Grid Slot 3 (index 2)
        "tile-19", // Grid Slot 4 (index 3)
        "tile-18", // Grid Slot 5 (index 4)
        "tile-12", // Grid Slot 6 (index 5)
        "tile-17", // Grid Slot 7 (index 6)
        "tile-8",  // Grid Slot 8 (index 7)
        "tile-15", // Grid Slot 9 (index 8)
        "tile-13", // Grid Slot 10 (index 9)
        "tile-33", // Grid Slot 11 (index 10) - Player places tileTexts[33] which is "c t i". WAIT, this is now pre-placed.
                   // The pre-placed "c t i" (tile-33) is for Grid Slot 25 (index 24).
                   // The "o n  " (tile-24) is pre-placed for Grid Slot 12 (index 11).
                   // Let's correct the correctGridSolutionOrder based on YOUR list and MY understanding of pre-placements.

        // Reconstructing based on your full list and applying pre-placements:
        // Your list: GS1=32, GS2=20, GS3=11, GS4=19, GS5=18, GS6=12, GS7=17, GS8=8, GS9=15, GS10=13
        // GS11=33 (You want tile-33, which is a "c t i", here)
        // GS12=24 (You want tile-24, which is "o n  ", here AND pre-placed)
        // GS13=3, GS14=1, GS15=21, GS16=2
        // ...
        // GS25=28 (You want tile-28, the OTHER "c t i", here. One "c t i" (tile-33) is pre-placed in this slot)
        // ...
        // GS35=23 (You want tile-23, which is "f o r", here AND pre-placed)

        // Let's use YOUR solution list directly and ENSURE the pre-placed IDs are correct for their slots.
        "tile-32", // GS1  (idx 0)
        "tile-20", // GS2  (idx 1)
        "tile-11", // GS3  (idx 2)
        "tile-19", // GS4  (idx 3)
        "tile-18", // GS5  (idx 4)
        "tile-12", // GS6  (idx 5)
        "tile-17", // GS7  (idx 6)
        "tile-8",  // GS8  (idx 7)
        "tile-15", // GS9  (idx 8)
        "tile-13", // GS10 (idx 9)
        "tile-33", // GS11 (idx 10) - Your list says tile-33 ("c t i") goes here. NOT pre-placed.
        "tile-24", // GS12 (idx 11) - PRE-PLACED "o n  "
        "tile-3",  // GS13 (idx 12)
        "tile-1",  // GS14 (idx 13)
        "tile-21", // GS15 (idx 14)
        "tile-2",  // GS16 (idx 15)
        "tile-6",  // GS17 (idx 16)
        "tile-9",  // GS18 (idx 17)
        "tile-0",  // GS19 (idx 18)
        "tile-5",  // GS20 (idx 19)
        "tile-31", // GS21 (idx 20)
        "tile-4",  // GS22 (idx 21)
        "tile-16", // GS23 (idx 22)
        "tile-7",  // GS24 (idx 23)
        "tile-28", // GS25 (idx 24) - PRE-PLACED "c t i" (this is tile-28, as tile-33 is at GS11)
        "tile-14", // GS26 (idx 25) - This is the other "o n  "
        "tile-25", // GS27 (idx 26) - This is the other "f o r"
        "tile-34", // GS28 (idx 27)
        "tile-30", // GS29 (idx 28)
        "tile-29", // GS30 (idx 29)
        "tile-22", // GS31 (idx 30)
        "tile-26", // GS32 (idx 31)
        "tile-35", // GS33 (idx 32)
        "tile-10", // GS34 (idx 33)
        "tile-23", // GS35 (idx 34) - PRE-PLACED "f o r"
        "tile-27"  // GS36 (idx 35)
    ];
    
    // Let's adjust the autoPlacedTilesInfo based on the above corrected solution order.
    // 1. "o n  " tile-24 is at index 11 (GS12)
    // 2. "f o r" tile-23 is at index 34 (GS35)
    // 3. "c t i" tile-28 is at index 24 (GS25) -- you requested tile-33 pre-placed at GS25.
    //    However, your solution list places tile-33 at GS11 and tile-28 at GS25.
    //    So, if tile-33 is pre-placed at GS25 (index 24), then your list for correctGridSolutionOrder needs an update.

    // Based on YOUR explicit request for pre-placement:
    // Pre-placed 1: "o n  " (tile-24) at Grid Slot 12 (index 11)
    // Pre-placed 2: "f o r" (tile-23) at Grid Slot 35 (index 34)
    // Pre-placed 3: "c t i" (tile-33) at Grid Slot 25 (index 24)

    // The correctGridSolutionOrder MUST reflect this.
    // This means the values at these indices in correctGridSolutionOrder are FIXED.
    // The other values must be from your list.

    // Updated `correctGridSolutionOrder` ensuring pre-placed tiles are correctly sited
    // according to your explicit pre-placement requests.
    const finalCorrectGridSolutionOrder = [
        "tile-32", // GS1  (idx 0)
        "tile-20", // GS2  (idx 1)
        "tile-11", // GS3  (idx 2)
        "tile-19", // GS4  (idx 3)
        "tile-18", // GS5  (idx 4)
        "tile-12", // GS6  (idx 5)
        "tile-17", // GS7  (idx 6)
        "tile-8",  // GS8  (idx 7)
        "tile-15", // GS9  (idx 8)
        "tile-13", // GS10 (idx 9)
        // GS11 (idx 10) must be a player-placed tile. Your list says tile-33.
        // BUT tile-33 is now pre-placed at GS25 (index 24).
        // This means the tile for GS11 from your list needs to be re-evaluated.
        // Let's assume your list is the ground truth for player-placed tiles,
        // and the pre-placements override those specific slots.

        // Let's take your full provided list for correctGridSolutionOrder first:
        "tile-32", "tile-20", "tile-11", "tile-19", "tile-18", "tile-12", "tile-17", "tile-8",
        "tile-15", "tile-13", "tile-33", "tile-24", "tile-3",  "tile-1",  "tile-21", "tile-2",
        "tile-6",  "tile-9",  "tile-0",  "tile-5",  "tile-31", "tile-4",  "tile-16", "tile-7",
        "tile-28", "tile-14", "tile-25", "tile-34", "tile-30", "tile-29", "tile-22", "tile-26",
        "tile-35", "tile-10", "tile-23", "tile-27"
    ];

    // Now, enforce the pre-placements in the correctGridSolutionOrder
    // This ensures the solution key matches what will be auto-placed.
    finalCorrectGridSolutionOrder[11] = "tile-24"; // Pre-placed "o n  " (GS12)
    finalCorrectGridSolutionOrder[34] = "tile-23"; // Pre-placed "f o r" (GS35)
    finalCorrectGridSolutionOrder[24] = "tile-33"; // Pre-placed "c t i" (GS25) - YOU asked for tile-33 here.
                                                // Your list originally had tile-28 for GS25.
                                                // This means tile-28 is now a draggable tile that must fit elsewhere.
                                                // We must ensure all 36 unique tile IDs are used exactly once.

    // To ensure all tile IDs are used correctly after enforcing pre-placements:
    // 1. Start with the user's provided sequence.
    // 2. Identify the IDs of the tiles the user wants pre-placed: tile-24, tile-23, tile-33.
    // 3. Identify the IDs that were *originally* in the pre-placed slots in the user's sequence:
    //    - Slot 11 (GS12) had tile-24 (matches pre-placement, good).
    //    - Slot 34 (GS35) had tile-23 (matches pre-placement, good).
    //    - Slot 24 (GS25) had tile-28. Now it will have tile-33 (pre-placed).
    //      This means tile-28 needs to go where tile-33 *was* in the user's original list.
    //      User's list had tile-33 at Slot 11 (index 10).
    // So, if Slot 24 now takes tile-33 (pre-placed), and Slot 11 originally had tile-33,
    // then tile-28 (which was at Slot 24) should now go to Slot 11.

    const solutionOrderBasedOnUserList = [
        "tile-32", "tile-20", "tile-11", "tile-19", "tile-18", "tile-12", "tile-17", "tile-8",
        "tile-15", "tile-13", "tile-33", /*GS11*/ "tile-24" /*GS12 - PRE-PLACED*/, "tile-3",  "tile-1",  "tile-21", "tile-2",
        "tile-6",  "tile-9",  "tile-0",  "tile-5",  "tile-31", "tile-4",  "tile-16", "tile-7",
        "tile-28", /*GS25*/ "tile-14", "tile-25", "tile-34", "tile-30", "tile-29", "tile-22", "tile-26",
        "tile-35", "tile-10", "tile-23" /*GS35 - PRE-PLACED*/, "tile-27"
    ];

    // Apply pre-placements and adjust:
    // Pre-placed:
    // 1. tile-24 (on) at index 11 (GS12) - User list already has this.
    // 2. tile-23 (for) at index 34 (GS35) - User list already has this.
    // 3. tile-33 (cti) at index 24 (GS25) - User requested tile-33 here.
    //    User's list has tile-28 at index 24 (GS25).
    //    User's list has tile-33 at index 10 (GS11).
    //    So, if index 24 gets tile-33, then tile-28 must go to index 10.

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

    // (Keep shuffleArray, createTileElement as they were)
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
        const draggableTiles = initialTileBankLayout; // Already filtered (33 tiles)
        let bankSlotsFilledInLogic = 0; // How many actual tiles we place

        GRID_ROWS_CONFIG.forEach((numSlotsInGridRow, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tile-bank-row';
            
            let slotsToVisuallyRepresentInBankRow = numSlotsInGridRow;
            // Count how many pre-placed tiles fall into this grid row
            autoPlacedTilesInfo.forEach(info => {
                const prePlacedTileRow = Math.floor(info.gridPosition / 8); // Assuming 8 is a common row width
                if (info.gridPosition >= rowIndex * 8 && info.gridPosition < (rowIndex + 1) * 8 && GRID_ROWS_CONFIG[rowIndex] === 8) { // Crude check
                     slotsToVisuallyRepresentInBankRow--;
                } else if (rowIndex === 4 && info.gridPosition >=32) { // Check for last row specifically
                     slotsToVisuallyRepresentInBankRow--;
                }
            });
            //This logic for slotsToVisuallyRepresentInBankRow needs to be more robust or simplified.
            //Simpler: just fill based on GRID_ROWS_CONFIG but skip if tile needed isn't in bankTiles
            //For now, let's aim to just place the 33 draggable tiles sequentially into the bank rows,
            //and the rows might look uneven if not all are full.
            //A better visual approach would be a dedicated BANK_ROWS_CONFIG for 33 items.

            // Simplified renderTileBank - places 33 tiles in rows of ~8, last row shorter
            let currentTilesInThisRow = 0;
            const maxTilesForThisRow = (rowIndex < GRID_ROWS_CONFIG.length -1) ? GRID_ROWS_CONFIG[rowIndex] : 
                                       GRID_ROWS_CONFIG[GRID_ROWS_CONFIG.length -1] - autoPlacedTilesInfo.filter(info => Math.floor(info.gridPosition / 8) === GRID_ROWS_CONFIG.length -1).length; // Approximate
            // This still feels complex. Let's make it very simple:
            // Create rows according to GRID_ROWS_CONFIG, but only fill with available draggable tiles.
            // The bank will have "gaps" visually.

            for (let i = 0; i < numSlotsInGridRow; i++) {
                // This loop determines the *visual width* of the bank row (matches grid row width)
                // We only add a draggable tile if one is available.
                if (tileRenderIndex < draggableTiles.length) {
                    // Is the *current grid slot this visual bank slot corresponds to* one of the pre-placed ones?
                    // If so, this bank slot should be empty.
                    const correspondingGridSlotIndex = (rowIndex * GRID_ROWS_CONFIG[0]) + i; // Approximate, assumes all but last row are same length
                    
                    let isPrePlacedSpot = false;
                    for(const autoInfo of autoPlacedTilesInfo){
                        // A bit complex to map bank visual slot to grid slot if rows vary
                        // For simplicity, just fill the bank sequentially with draggable tiles.
                    }

                    // Simplest: Distribute the 33 tiles across the bank structure.
                    // The bank will look like 8,8,8,8,1 or some other distribution of 33.
                    // Let's define BANK_ROWS_CONFIG for 33 items: e.g. [7,7,7,6,6] or [8,8,8,9]
                    // For now, just iterate through draggableTiles and make rows of 8 until leftover.
                    if (tileRenderIndex < draggableTiles.length) {
                         if (currentTilesInThisRow < numSlotsInGridRow) { // Respect the intended width of the row from grid config
                            const tileData = draggableTiles[tileRenderIndex++];
                            const tileElement = createTileElement(tileData);
                            rowDiv.appendChild(tileElement);
                            currentTilesInThisRow++;
                            bankSlotsFilledInLogic++;
                         }
                    }
                } else if (rowDiv.children.length < numSlotsInGridRow) {
                    // If we want to maintain the visual grid structure in the bank with empty spots:
                    // This part is tricky to get visually perfect without knowing exactly where pre-placed were.
                    // For now, the bank rows may not be full if we run out of draggable tiles for that row's capacity.
                }
            }

            if (rowDiv.hasChildNodes()) {
                 tileBankArea.appendChild(rowDiv);
            }
        });
         if (bankSlotsFilledInLogic !== draggableTiles.length) {
             console.warn(`Rendered ${bankSlotsFilledInLogic} tiles in bank, expected ${draggableTiles.length}.`);
        }
    }

    // Re-simplified renderTileBank: just makes rows for the 33 draggable tiles
    function revisedRenderTileBank() {
        tileBankArea.innerHTML = '';
        let tileRenderIndex = 0;
        const draggableTiles = initialTileBankLayout; // 33 tiles
        const bankRowLengths = [8,8,8,9]; // Example to fit 33 tiles (8+8+8+9 = 33) or [7,7,7,6,6]
                                         // Or, stick to GRID_ROWS_CONFIG and have empty visual spots.
                                         // Let's use a layout that fills nicely for 33 tiles:
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

    // --- Drag and Drop Event Handlers --- (Keep as is, but handleDragEnter/Drop ensure no interaction with pre-placed)
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
            const correctPositionIndex = finalCorrectOrder.indexOf(tileId); // Use finalCorrectOrder

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
        if (gridCells.length !== finalCorrectOrder.length) { // Use finalCorrectOrder
            console.error("Rendered grid cells count does not match solution length.");
            return; 
        }

        let allCorrect = true;
        for (let i = 0; i < finalCorrectOrder.length; i++) { // Use finalCorrectOrder
            const cell = gridCells[i];
            const tileInCell = cell.firstChild;
            
            if (!tileInCell || tileInCell.id !== finalCorrectOrder[i]) { // Use finalCorrectOrder
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            showWinPopup();
        }
    }

    // --- Popup Functions --- (Keep as is)
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
        revisedRenderTileBank(); // Use the revised bank renderer
        resetButton.addEventListener('click', handleReset);
        hintButton.addEventListener('click', handleHint);
        closePopupButton.addEventListener('click', hideWinPopup);
    }

    initGame(); 
});
