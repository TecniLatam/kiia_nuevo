import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Detecta la emoción predominante en un texto en español
export function detectEmotionFromText(text: string): 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' {
  const t = text.toLowerCase();
  if (/feliz|content[ao]|alegr[ía]|genial|bien|excelente|fant[aá]stic[ao]|maravillos[ao]|incre[ií]ble/.test(t)) return 'happy';
  if (/triste|deprimid[ao]|llor[ao]|mal|desanimad[ao]|desesperad[ao]|solo|sola|vac[ií]o/.test(t)) return 'sad';
  if (/enojad[ao]|molest[ao]|furios[ao]|rabia|ira|fastidiad[ao]|odio/.test(t)) return 'angry';
  if (/ansios[ao]|estresad[ao]|preocupad[ao]|nervios[ao]|mied[ao]|temor|p[aá]nico|incertidumbre/.test(t)) return 'anxious';
  return 'neutral';
}
