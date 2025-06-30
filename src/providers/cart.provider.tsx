import React, { createContext, useContext, useState } from "react";
import { CartItem } from "../models/cart-item";
import { Product, ProductOption } from "../models/product";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, option: ProductOption) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, option: ProductOption) => {
    const optionSuffix = option.name ? `-${option.name}` : "";
    const id = `${product.name}${optionSuffix}`.toLowerCase();

    const existingItem = items.find((item) => item.id === id);
    if (existingItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const cartItem: CartItem = {
        id,
        product,
        option,
        quantity: 1,
      };
      setItems((prevItems) => [...prevItems, cartItem]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clear = () => {
    setItems([]);
  };

  const groupCartItemsBySection = () => {
    const grouped = items.reduce((acc, item) => {
      const section = item.product.section || "Andere";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    return Object.keys(grouped)
      .sort()
      .reduce((acc, section) => {
        acc[section] = grouped[section];
        return acc;
      }, {} as Record<string, CartItem[]>);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, clear }}
    >{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};