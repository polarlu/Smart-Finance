// app/_hooks/use-custom-categories.ts
"use client";

import { useState, useEffect } from "react";

interface CustomCategory {
  value: string;
  label: string;
}

export const useCustomCategories = () => {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem("customCategories");
    if (stored) {
      try {
        setCustomCategories(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading custom categories:", error);
      }
    }
  }, []);

  const saveToLocalStorage = (categories: CustomCategory[]) => {
    localStorage.setItem("customCategories", JSON.stringify(categories));
    setCustomCategories(categories);
  };

  const addCategory = (label: string) => {
    const value = `CUSTOM_${label.toUpperCase().replace(/\s+/g, "_")}`;
    const newCategory: CustomCategory = { value, label };

    const updated = [...customCategories, newCategory];
    saveToLocalStorage(updated);
    return value;
  };

  const removeCategory = (value: string) => {
    const updated = customCategories.filter((cat) => cat.value !== value);
    saveToLocalStorage(updated);
  };

  return {
    customCategories,
    addCategory,
    removeCategory,
  };
};
