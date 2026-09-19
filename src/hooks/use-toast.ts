"use client";

import { create } from "zustand";

export type ToastItem = { id: number; title: string; description?: string };

type ToastState = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Imperative helper — same API as before: toast({ title, description }). */
export function toast(t: { title: string; description?: string }) {
  useToastStore.getState().push(t);
}
