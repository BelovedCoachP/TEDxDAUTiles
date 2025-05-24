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
        /*0*/ "e y  ", /*1*/ "o u r", /*2*/ "a r e", /*3*/ "o f  ", /*4*/ "c a l", /*5*/ "a n d", /*6*/ "d   j o", /*7*/ "o   a ",
    const tileTexts = [
        /*0*/ "e y  ", /*1*/ "o u r", /*2*/ "a r e", /*3*/ "o f  ", /*4*/ "c a l", /*5*/ "a n d", /*6*/ "d  jo", /*7*/ "o   a ",
        /*8*/ "h   a", /*9*/ "u r n",/*10*/ "o r k",/*11*/ "g   C",/*12*/ "i s  ",/*13*/ "f l e",/*14*/ "o n  ",/*15*/ "  r e", "our",/*10*/ "ork",/*11*/ "g C",/*12*/ "is ",/*13*/ "fle",/*14*/ "on ",/*15*/ " re",
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
    //    - Slot 34 (GS35)
