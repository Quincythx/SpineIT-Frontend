import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { SHELVES, type ShelfName } from '../utils/shelves';
import { useAuth } from '../context/AuthContext';

async function getShelfListMap(): Promise<Record<ShelfName, number>> {
  const lists = await api.getReadingLists();
  const map = {} as Record<ShelfName, number>;
  for (const name of SHELVES) {
    const existing = lists.find((l) => l.name === name);
    map[name] = existing ? existing.id : (await api.createReadingList(name)).id;
  }
  return map;
}

export function useShelfStatus(bookId: number | null) {
  const { user } = useAuth();
  const [status, setStatus] = useState<ShelfName | null>(null);
  const [itemId, setItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !bookId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const shelfMap = await getShelfListMap();
      for (const name of SHELVES) {
        const items = await api.getReadingListItems(shelfMap[name]);
        const match = items.find((i) => i.book.id === bookId);
        if (match) {
          if (!cancelled) {
            setStatus(name);
            setItemId(match.id);
          }
          break;
        }
      }
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, bookId]);

  const setShelf = useCallback(
    async (name: ShelfName | null) => {
      if (!bookId) return;
      setIsLoading(true);
      if (itemId) {
        await api.removeBookFromList(itemId);
        setItemId(null);
      }
      if (name) {
        const shelfMap = await getShelfListMap();
        const item = await api.addBookToList(shelfMap[name], bookId);
        setItemId(item.id);
      }
      setStatus(name);
      setIsLoading(false);
    },
    [bookId, itemId]
  );

  return { status, isLoading, setShelf };
}
