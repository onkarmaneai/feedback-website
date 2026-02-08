const bannedWords = ["hate", "idiot", "stupid", "trash"];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase();
  return bannedWords.some((word) => normalized.includes(word));
}
