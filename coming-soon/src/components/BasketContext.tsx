
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type BasketItem = {
    id: string;
    name: string;
    slug: string;
    price_pence: number;
    image_url: string | null;
    product_type: "physical" | "digital";
    stock_quantity: number | null;
    quantity: number;
};

type BasketContextType = {
    items: BasketItem[];
    addItem: (item: Omit<BasketItem, "quantity">) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearBasket: () => void;
    refreshItems: (items: BasketItem[]) => void;
    basketCount: number;
    basketTotal: number;
};

const BasketContext = createContext<BasketContextType | undefined>(
    undefined
);

const STORAGE_KEY = "little-wolf-pack-basket";

export function BasketProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<BasketItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed: unknown = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    setItems(parsed as BasketItem[]);
                }
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, loaded]);

    function addItem(item: Omit<BasketItem, "quantity">) {
        setItems((current) => {
            const existing = current.find((entry) => entry.id === item.id);

            const maxQuantity =
                item.product_type === "physical" && item.stock_quantity !== null
                    ? item.stock_quantity
                    : Infinity;

            if (maxQuantity < 1) return current;

            if (existing) {
                if (existing.quantity >= maxQuantity) return current;

                return current.map((entry) =>
                    entry.id === item.id
                        ? { ...entry, quantity: entry.quantity + 1 }
                        : entry
                );
            }

            return [...current, { ...item, quantity: 1 }];
        });
    }

    function updateQuantity(id: string, quantity: number) {
        setItems((current) =>
            current.flatMap((item) => {
                if (item.id !== id) return [item];

                const maxQuantity =
                    item.product_type === "physical" &&
                        item.stock_quantity !== null
                        ? item.stock_quantity
                        : Infinity;

                if (quantity < 1) return [];
                return [{ ...item, quantity: Math.min(quantity, maxQuantity) }];
            })
        );
    }

    function removeItem(id: string) {
        setItems((current) => current.filter((item) => item.id !== id));
    }

    function clearBasket() {
        setItems([]);
    }

    const basketCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function refreshItems(updatedItems: BasketItem[]) {
        setItems(updatedItems);
    }

    const basketTotal = items.reduce(
        (total, item) => total + item.price_pence * item.quantity,
        0
    );

    return (
        <BasketContext.Provider
            value={{
                items,
                addItem,
                updateQuantity,
                removeItem,
                clearBasket,
                refreshItems,
                basketCount,
                basketTotal,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
}

export function useBasket() {
    const context = useContext(BasketContext);

    if (!context) {
        throw new Error("useBasket must be used within a BasketProvider.");
    }

    return context;
}
