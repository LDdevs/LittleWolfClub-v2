
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBasket } from "@/components/BasketContext";

export default function BasketPage() {

    const [validating, setValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [validationError, setValidationError] = useState(false);

    const {
        items,
        updateQuantity,
        removeItem,
        basketTotal,
        clearBasket,
        refreshItems,
    } = useBasket();

    const formatPrice = (pricePence: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(pricePence / 100);

    async function verifyBasket() {
        setValidating(true);
        setValidationMessage("");
        setValidationError(false);

        try {
            const response = await fetch("/api/validate-basket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setValidationError(true);
                setValidationMessage(
                    result.error || "Unable to verify your basket."
                );

                if (
                    response.status === 409 &&
                    typeof result.product_id === "string" &&
                    Number.isInteger(result.available_stock) &&
                    result.available_stock >= 0
                ) {
                    const affectedItem = items.find(
                        (item) => item.id === result.product_id
                    );

                    if (affectedItem) {
                        const updatedItems = items.map((item) =>
                            item.id === result.product_id
                                ? {
                                    ...item,
                                    stock_quantity: result.available_stock,
                                    quantity: Math.max(
                                        1,
                                        Math.min(item.quantity, result.available_stock)
                                    ),
                                }
                                : item
                        );

                        refreshItems(updatedItems);

                        setValidationMessage(
                            result.available_stock === 0
                                ? `${affectedItem.name} is now out of stock. Please remove it from your basket.`
                                : `${affectedItem.name} has been adjusted to ${result.available_stock} available. Your basket has been updated.`
                        );
                    }
                }

                return;
            }

            const priceChanges = result.items.filter(
                (verifiedItem: (typeof items)[number]) => {
                    const currentItem = items.find((item) => item.id === verifiedItem.id);

                    return currentItem && currentItem.price_pence !== verifiedItem.price_pence;
                }
            );

            refreshItems(result.items);

            if (priceChanges.length > 0) {
                const changedProducts = priceChanges
                    .map(
                        (item: (typeof items)[number]) =>
                            `${item.name} is now ${formatPrice(item.price_pence)}`
                    )
                    .join(" • ");

                setValidationMessage(
                    `Basket updated — ${changedProducts}. Your new total is ${formatPrice(
                        result.total_pence
                    )}.`
                );
            } else {
                setValidationMessage(
                    `Basket verified. Current total: ${formatPrice(result.total_pence)}`
                );
            }

        } catch (error) {
            setValidationError(true);
            setValidationMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to verify your basket. Please try again."
            );
        } finally {
            setValidating(false);
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950/40 px-4 pb-24 pt-32 text-white sm:px-6 sm:pt-40">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/shop"
                    className="text-sm text-green-300 transition hover:text-green-200"
                >
                    ← Back to the Pack Shop
                </Link>

                <section className="mb-10 mt-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.35em] text-green-400">
                        Your woodland finds
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                        Your Basket <span>🐺</span>
                    </h1>
                    <p className="mt-4 text-neutral-300">
                        Your next little adventure starts here.
                    </p>
                </section>

                {items.length === 0 ? (
                    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                        <div className="mb-5 text-6xl">🌲</div>
                        <h2 className="text-2xl font-bold">Your basket is taking a nap</h2>
                        <p className="mx-auto mt-3 max-w-md text-neutral-300">
                            You haven&apos;t added anything yet. Explore the shop and find
                            something special for your next adventure.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-7 inline-flex rounded-full bg-green-400 px-6 py-3 font-bold text-black transition hover:bg-green-300"
                        >
                            Explore the shop
                        </Link>
                    </section>
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
                        <section className="space-y-4">
                            {items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:p-5"
                                >
                                    <Link
                                        href={`/shop/${item.slug}`}
                                        className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/30 sm:h-28 sm:w-28"
                                    >
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 112px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="text-4xl">
                                                {item.product_type === "digital" ? "✨" : "📦"}
                                            </span>
                                        )}
                                    </Link>

                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/shop/${item.slug}`}
                                            className="text-lg font-bold transition hover:text-green-300"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-1 text-sm text-neutral-400">
                                            {item.product_type === "digital"
                                                ? "Digital product"
                                                : "Physical product"}
                                        </p>
                                        <p className="mt-2 font-semibold text-green-300">
                                            {formatPrice(item.price_pence)} each
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <label
                                                htmlFor={`quantity-${item.id}`}
                                                className="text-sm text-neutral-300"
                                            >
                                                Quantity
                                            </label>

                                            <input
                                                id={`quantity-${item.id}`}
                                                type="number"
                                                min={1}
                                                max={
                                                    item.product_type === "physical" &&
                                                        item.stock_quantity !== null
                                                        ? item.stock_quantity
                                                        : undefined
                                                }
                                                value={item.quantity}
                                                onChange={(event) => {
                                                    const value = Number(event.target.value);
                                                    if (Number.isInteger(value) && value >= 1) {
                                                        updateQuantity(item.id, value);
                                                    }
                                                }}
                                                className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center text-white outline-none focus:border-green-400"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-sm text-red-300 transition hover:text-red-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-neutral-400">Item total</p>
                                        <p className="mt-1 text-xl font-bold">
                                            {formatPrice(item.price_pence * item.quantity)}
                                        </p>
                                    </div>
                                </article>
                            ))}

                            <button
                                type="button"
                                onClick={clearBasket}
                                className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-red-400/40 hover:text-red-300"
                            >
                                Clear basket
                            </button>
                        </section>

                        <aside className="rounded-3xl border border-green-400/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:sticky lg:top-28">
                            <h2 className="text-xl font-bold">Order summary</h2>

                            <button
                                type="button"
                                onClick={verifyBasket}
                                disabled={validating || items.length === 0}
                                className="mt-4 w-full rounded-full border border-green-400/30 bg-green-400/10 px-5 py-3 font-semibold text-green-300 transition hover:bg-green-400/20 disabled:opacity-50"
                            >
                                {validating ? "Checking basket..." : "Verify basket"}
                            </button>

                            {validationMessage && (
                                <p
                                    role="status"
                                    className={`mt-3 text-sm ${validationError ? "text-red-300" : "text-green-300"
                                        }`}
                                >
                                    {validationMessage}
                                </p>
                            )}

                            <div className="mt-6 flex justify-between gap-4 text-neutral-300">
                                <span>
                                    Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                                </span>
                                <span>{formatPrice(basketTotal)}</span>
                            </div>

                            <div className="my-5 border-t border-white/10" />

                            <div className="flex justify-between gap-4 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-green-300">
                                    {formatPrice(basketTotal)}
                                </span>
                            </div>

                            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                                Delivery costs, where applicable, will be confirmed at checkout.
                                Checkout isn&apos;t available yet.
                            </p>

                            <button
                                type="button"
                                disabled
                                className="mt-6 w-full cursor-not-allowed rounded-full bg-green-400/40 px-5 py-3 font-bold text-white/70"
                            >
                                Checkout coming soon
                            </button>

                            <Link
                                href="/shop"
                                className="mt-4 block text-center text-sm text-green-300 transition hover:text-green-200"
                            >
                                Continue shopping →
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}
