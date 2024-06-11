import { useState, useEffect } from "react"
import { useMemo } from "react";
import { db } from "../database/db"
import type { Guitar, CartItem } from "../types/index";

export const useCart = () => {

    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    function addToCart(item : Guitar) {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        if(itemExists >= 0) {
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        }else{
            const newItem: CartItem = {...item, quantity: 1};
            setCart([...cart, newItem]);
        }   

    }

    function removeFromCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function addQuantity(id : Guitar['id']) {
       const updatedCart = cart.map(item => {
        if(item.id === id && item.quantity <= MAX_ITEMS) {
            return{
                ...item,
                quantity: item.quantity + 1
            }
        }
        return item;
       });
         setCart(updatedCart);
    }

    function removeQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item;
        });
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    // state Derivado
    const emptyCart = useMemo(() => cart.length === 0, [cart]);
    const totalCart = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity),0), [cart]);


  return {
        data,
        cart,
        addToCart,
        removeFromCart,
        addQuantity,
        removeQuantity,
        clearCart,
        initialCart,
        setCart,
        emptyCart,
        totalCart
  }
}

