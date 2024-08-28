import { writable } from "svelte/store";

export const lockedCard = writable(undefined);
export const arrayCards = writable(undefined);
export const currentCard = writable(false);
