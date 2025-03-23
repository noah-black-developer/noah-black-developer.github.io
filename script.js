// GLOBAL OBJECTS.
// Job Title Constants.
const TITLE_SWITCH_INTERVAL_IN_MS = 6000;
const TITLE_DELETE_PAUSE_IN_MS = 500;
const DEFAULT_MAX_TYPE_DELAY_IN_MS = 120;
const DEFAULT_MIN_TYPE_DELAY_IN_MS = 80;
const DEFAULT_MAX_DELETE_DELAY_IN_MS = 240;
const DEFAULT_MIN_DELETE_DELAY_IN_MS = 120;
const CURSOR_FLICKER_RATE_IN_MS = 600;

// Storage for the displayed title information.
const TITLES_ARRAY = [
    "Software Developer",
    "DevOps Engineer",
    "Systems Engineer",
    "UI Designer"
];
let currentTitleIndex_g = 0;

// Global flags + page state.
let pageRunning_g = true;

// HELPER FUNCTIONS.
/**
 * General-use function to 'sleep' from within async/Promise execution.
 * @param {int} delayInMs - Time to sleep before returning, in milliseconds.
 * @returns None
 */
async function asyncDelay(delayInMs) {
    // Create a new Promise object for the given delay.
    // Return only after the promise has finished and returned.
    await new Promise(r => setTimeout(r, delayInMs));
    return;
}

// PAGE FUNCTIONS.
/**
 * Remove any previously set 'job title' values in a typewriter-esque fashion.
 * @param {string} minDelayInMs  - Represents the minimum time between character 'deletes', in milliseconds. Default min of DEFAULT_MIN_TYPE_DELAY_IN_MS.
 * @param {string} maxDelayInMs  - Represents the maximum time between character 'deletes', in milliseconds. Default max of DEFAULT_MAX_TYPE_DELAY_IN_MS.
 * @returns None
 */
async function deleteTitle(minDelayInMs = DEFAULT_MIN_DELETE_DELAY_IN_MS, maxDelayInMs = DEFAULT_MAX_DELETE_DELAY_IN_MS) {
    // CHECK IF VIABLE.
    // If the current page is not visible, skip execution.
    if (!pageRunning_g) {
        return;
    }

    // REMOVE OLD TITLE.
    // Store a reference to the 'title' element on the page.
    titleElem = document.getElementById("devTitle");
    let currentTitle = titleElem.textContent;

    // Iterate once for each character in the existing title.
    for (let charIndex = 0; charIndex < currentTitle.length; charIndex++) {
        // Remove one character from the current title and reapply.
        let iterationText = titleElem.textContent;
        titleElem.textContent = iterationText.substring(0, iterationText.length - 1);

        // Add a random delay between the given min/max.
        let randomDelayInMseconds = Math.floor(Math.random() * (minDelayInMs - maxDelayInMs)) + minDelayInMs;
        await asyncDelay(randomDelayInMseconds);
    }

    // Return once finished.
    return;
}

/**
 * @description Display a new title in the 'job title' page section. Shows characters in a typewriter-like fashion.
 * @param {String} newTitle - String representation of the new title to appear. Must be list of characters, empty is allowed.
 * @param {String} minDelayInMs - Represents the minimum time between character 'types', in milliseconds. Default min of DEFAULT_MIN_TYPE_DELAY_IN_MS.
 * @param {String} maxDelayInMs - Represents the maximum time between character 'types', in milliseconds. Default max of DEFAULT_MAX_TYPE_DELAY_IN_MS.
 * @returns None
 */
async function typeTitle(newTitle, minDelayInMs = DEFAULT_MIN_TYPE_DELAY_IN_MS, maxDelayInMs = DEFAULT_MAX_TYPE_DELAY_IN_MS) {
    // CHECK IF VIABLE.
    // If the current page is not visible, skip execution.
    if (!pageRunning_g) {
        return;
    }

    // TYPE NEW TITLE BY CHARACTER.
    // Store a reference to the 'title' element on the page.
    titleElem = document.getElementById("devTitle");

    // Iterate once for each character in the given title.
    for (let charIndex = 0; charIndex < newTitle.length; charIndex++) {
        // Get a substring from the given title based on current index, then set.
        titleElem.textContent = newTitle.substring(0, charIndex + 1);

        // Add a random delay between the given min/max.
        let randomDelayInMseconds = Math.floor(Math.random() * (minDelayInMs - maxDelayInMs)) + minDelayInMs;
        await asyncDelay(randomDelayInMseconds);
    }

    // Return once finished.
    return;
}

/**
 * Shift to the next 'title' in the defined job title list.
 * @returns None
 */
async function typeNextTitle() {
    // CHECK IF VIABLE.
    // If the current page is not visible, skip execution.
    if (!pageRunning_g) {
        return;
    }

    // REMOVE CURRENT TITLE.
    // Call functions to delete the current title, if any.
    await deleteTitle();

    // Add a pause between deleting and writing the new title.
    await asyncDelay(TITLE_DELETE_PAUSE_IN_MS);

    // SET NEXT TITLE.
    // Incrememt to the next title available. Loop if last element is reached.
    currentTitleIndex_g = (currentTitleIndex_g === TITLES_ARRAY.length - 1) ? 0 : currentTitleIndex_g + 1;
    await typeTitle(TITLES_ARRAY[currentTitleIndex_g]);

    return;
}
 
/**
 * When called, hides/shows the cursor for the job title depending on current state.
 * @returns None
 */
function toggleTitleCursorVisibility() {
    // CHECK IF VIABLE.
    // If the current page is not visible, skip execution.
    if (!pageRunning_g) {
        return;
    }

    // Reference the cursor element. Set opacity as needed before returning.
    let cursorElem = document.getElementById("devTitleCursor");
    try {
        let currentOpacity = parseInt(cursorElem.style.opacity);
        let newOpacity = (currentOpacity == 0) ? 1 : 0;
        cursorElem.style.opacity = newOpacity;
    } catch {
        // If any errors occur, log them without making page changes.
        console.log(`Failed to read cursor opacity as int: ${cursorElem.style.opacity}`);
        cursorElem.style.opacity = "1.0";
    }

    return;
}

// EVENT HANDLERS.
document.addEventListener("visibilitychange", () => {
    // Enable/disable custom function calls based on page visibility.
    pageRunning_g = !document.hidden;
})

// MAIN ENTRY.
// The following function is called one upon page startup.
window.onload = () => {
    // SET UP TIMERS.
    // Configure functions that should be called at regular intervals.
    window.setInterval(typeNextTitle, TITLE_SWITCH_INTERVAL_IN_MS);
    window.setInterval(toggleTitleCursorVisibility, CURSOR_FLICKER_RATE_IN_MS);
}
