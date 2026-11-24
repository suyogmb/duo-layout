import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Selection = { selectedId: string | null; select(id: string | null): void };

const SelectionContext = createContext<Selection | null>(null);

/** Lives above every layout switch so fold/rotate never loses the selection. */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, select] = useState<string | null>(null);
  const value = useMemo(() => ({ selectedId, select }), [selectedId]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): Selection {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used inside SelectionProvider');
  return ctx;
}
