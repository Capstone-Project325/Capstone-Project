import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

const TAX_RATE = 0.08;

export type CartItem = {
  lineId: string;
  id: string;
  name: string;
  image: string; // URL
  unitPrice: number; // cents
  quantity: number;
  customizations: string[];
};

type Action =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'UPDATE'; lineId: string; changes: Partial<CartItem> }
  | { type: 'REMOVE'; lineId: string }
  | { type: 'CLEAR' };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const item = action.payload;
      const existing = state.find((i) => i.lineId === item.lineId);
      if (existing) {
        return state.map((i) =>
          i.lineId === item.lineId ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...state, item];
    }
    case 'UPDATE':
      return state.map((i) => (i.lineId === action.lineId ? { ...i, ...action.changes } : i));
    case 'REMOVE':
      return state.filter((i) => i.lineId !== action.lineId);
    case 'CLEAR':
      return [];
  }
}

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

type CartContextValue = {
  items: CartItem[];
  totals: { count: number; subtotal: number; tax: number; total: number };
  dispatch: React.Dispatch<Action>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  const totals = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return { count, subtotal, tax, total: subtotal + tax };
  }, [items]);

  return <CartContext.Provider value={{ items, totals, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
