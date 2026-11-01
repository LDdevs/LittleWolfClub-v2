
"use client";

import { useState } from "react";
import { useBasket } from "@/components/BasketContext";

type Props = {
    product: {
        id: string;
        name: string;
        slug: string;
        price_pence: number;
        image_url: string | null;
        product_type: "physical" | "digital";
        stock_quantity: number | null;
    };
};

export default function AddToBasketButton({ product }: Props) {
    const { addItem } = useBasket();
    const [added, setAdded] = useState(false);

    const outOfStock =
        product.product_type === "physical" &&
        product.stock_quantity !== null &&
        product.stock_quantity <= 0;

    function handleAdd() {
        if (outOfStock) return;

        addItem(product);
        setAdded(true);

        window.setTimeout(() => setAdded(false), 2000);
    }

    return (
        <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="mt-6 w-full rounded-full bg-green-400 px-6 py-4 font-bold text-black transition hover:bg-green-300 hover:shadow-[0_0_25px_rgba(74,222,128,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {outOfStock
                ? "Currently unavailable"
                : added
                    ? "Added to your basket ✓"
                    : "Add to Basket"}
        </button>
    );
}
