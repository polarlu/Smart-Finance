// app/_hooks/use-custom-categories.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface CustomCategory {
  value: string;
  label: string;
}

const STORAGE_EVENT = "customCategoriesChanged";

export const useCustomCategories = () => {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    [],
  );
  const [isLoaded, setIsLoaded] = useState(false); // ✅ Estado de carregamento

  const loadCategories = useCallback(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("customCategories");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error loading custom categories:", error);
        return [];
      }
    }
    return [];
  }, []);

  useEffect(() => {
    setCustomCategories(loadCategories());
    setIsLoaded(true); // ✅ Marca como carregado
  }, [loadCategories]);

  useEffect(() => {
    if (!isLoaded) return;

    const handleCustomEvent = () => {
      setCustomCategories(loadCategories());
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "customCategories") {
        setCustomCategories(loadCategories());
      }
    };

    window.addEventListener(STORAGE_EVENT, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadCategories, isLoaded]);

  const saveToLocalStorage = (categories: CustomCategory[]) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("customCategories", JSON.stringify(categories));
    setCustomCategories(categories);

    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const addCategory = (label: string): string => {
    const value = `CUSTOM_${label.toUpperCase().replace(/\s+/g, "_")}`;
    const newCategory: CustomCategory = { value, label };

    const updated = [...customCategories, newCategory];
    saveToLocalStorage(updated);
    return value;
  };

  const removeCategory = (value: string): void => {
    const updated = customCategories.filter((cat) => cat.value !== value);
    saveToLocalStorage(updated);
  };

  return {
    customCategories,
    addCategory,
    removeCategory,
  };
};
