import React, { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext();

const MAX_COMPARE = 3;
const STORAGE_KEY = 'compareSelections';

export const CompareProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedProducts(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load compare selections', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
    } catch (err) {
      console.error('Failed to persist compare selections', err);
    }
  }, [selectedProducts]);

  const isSelected = (id) => selectedProducts.some((item) => item._id === id);

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev.filter((item) => item._id !== product._id);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      const summary = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        description: product.description,
        inStock: product.inStock
      };
      return [...prev, summary];
    });
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((item) => item._id !== id));
  };

  const clearProducts = () => setSelectedProducts([]);

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        toggleProduct,
        isSelected,
        removeProduct,
        clearProducts,
        maxCompare: MAX_COMPARE
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
