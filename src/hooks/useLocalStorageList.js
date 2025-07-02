import { useState, useEffect } from "react";

export const useLocalStorageList = (key) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const hasItem = (id) => {
    return items.some((item) => item.id === id);
  };

  return { items, addItem, removeItem, hasItem };
};
