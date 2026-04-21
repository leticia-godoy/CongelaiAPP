import { useCallback, useEffect, useState } from "react";

export type FreezerItemType = "marmita" | "carne" | "vegetal" | "outro";
export type FreezerItemSize = "individual" | "familia" | "grande";

export interface FreezerItem {
  id: string;
  name: string;
  frozenAt: string; // ISO date (yyyy-mm-dd)
  expiresAt: string; // ISO date (yyyy-mm-dd)
  type: FreezerItemType;
  size: FreezerItemSize;
  createdAt: number;
}

const STORAGE_KEY = "congela.ai:items";

function readStorage(): FreezerItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FreezerItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: FreezerItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useFreezerItems() {
  const [items, setItems] = useState<FreezerItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((data: Omit<FreezerItem, "id" | "createdAt">) => {
    const newItem: FreezerItem = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  return { items, addItem, removeItem, clearAll, hydrated };
}

export const TYPE_LABELS: Record<FreezerItemType, string> = {
  marmita: "Marmita",
  carne: "Carne",
  vegetal: "Vegetal",
  outro: "Outro",
};

export const SIZE_LABELS: Record<FreezerItemSize, string> = {
  individual: "Individual",
  familia: "Família",
  grande: "Grande",
};

export function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateIso + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
