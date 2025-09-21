import { writable } from "svelte/store";

export const statuscard = writable(false); // True when one card is selected in ArrayCards
export const lockedCard = writable(undefined); // suit and card of the locked card (selected card)
export const arrayCards = writable(undefined); // Give Randome Array of the 27 cards when we start
export const currentCard = writable(false);
export const cycle1array = writable([]); // important! // sorted array after cycle1 (for use in pile2)
export const cycle2array = writable([]); // sorted array after cycle2 (for use in pile3)
export const cycle3array = writable([]);
export const assembly2 = writable(false); // is true after drawing in pile2

export const annotations = writable(true); //annotaions
export const positions = writable(false); //positions

// NEW: global reset key (increments to broadcast a reset pulse)
export const resetKey = writable(0);
export function triggerReset() {
	resetKey.update((n) => n + 1);
}
