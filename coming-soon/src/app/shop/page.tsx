
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    product_type: "physical" | "digital";
    price_pence: number;
    image_url: string | null;
    stock_quantity: number | null;
};

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const { data, error: queryError } = await supabase
                    .from("products")
                    .select(
                        "id, name, slug, description, product_type, price_pence, image_url, stock_quantity"
                    )
                    .eq("is_published", true)
                    .order("created_at", { ascending: false });

                if (queryError) throw queryError;
                setProducts((data ?? []) as Product[]);
            } catch (err) {
                console.error("Failed to load shop products:", err);
                setError(
                    "We couldn't load the shop just now. Please try again shortly."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    const formatPrice = (pricePence: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(pricePence / 100);

    return (
        <main className="min-h-screen overflow-hidden bg-neutral-950/40 text-white">
            {/* Woodland shop introduction */}
            <section className="relative px-6 pb-16 pt-36 text-center sm:pb-20 sm:pt-44">
                <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/10 blur-[100px]" />

                <div className="relative mx-auto max-w-4xl">
                    <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-green-300/20 bg-green-950/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-green-200 backdrop-blur-md sm:text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-300 shadow-[0_0_12px_rgba(134,239,172,0.9)]" />
                        A little magic awaits
                    </div>

                    <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
                        <span className="block bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text pb-2 text-transparent">
                            The Pack Shop
                        </span>
                        <span className="mt-2 block text-3xl sm:text-4xl">
                            <span className="text-green-300">Wild</span>{" "}
                            <span className="text-white">at heart.</span>{" "}
                            <span aria-hidden="true">🐺</span>
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">
                        Little treasures for big adventures. Discover thoughtful
                        finds, woodland-inspired goodies and a little extra magic
                        for your world.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-400">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                            🌿 Made for curious minds
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                            ✨ Little things, big magic
                        </span>
                    </div>
                </div>

                <div className="mx-auto mt-14 h-px max-w-5xl bg-gradient-to-r from-transparent via-green-300/40 to-transparent" />
            </section>

            {/* Product collection */}
            <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-green-300">
                            Explore the collection
                        </p>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Treasures for your next adventure
                        </h2>
                    </div>

                    {!loading && !error && products.length > 0 && (
                        <p className="text-sm text-neutral-400">
                            {products.length}{" "}
                            {products.length === 1 ? "treasure" : "treasures"} to discover
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                            >
                                <div className="aspect-[4/3] animate-pulse bg-green-950/40" />
                                <div className="space-y-4 p-6">
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                                    <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                                    <div className="h-4 w-4/5 animate-pulse rounded bg-white/5" />
                                    <div className="h-11 w-36 animate-pulse rounded-full bg-green-400/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-950/20 p-8 text-center backdrop-blur-md sm:p-12"
                    >
                        <div className="mb-4 text-4xl">🌧️</div>
                        <h2 className="mb-3 text-xl font-bold">
                            A little woodland hiccup
                        </h2>
                        <p className="text-sm leading-7 text-neutral-300">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-green-300/40 hover:bg-green-400/10"
                        >
                            Try again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-green-300/15 bg-gradient-to-br from-green-950/40 to-neutral-950/70 p-10 text-center shadow-[0_0_70px_rgba(74,222,128,0.05)] backdrop-blur-xl sm:p-14">
                        <div className="mb-5 text-5xl">🌱</div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-green-300">
                            Something is growing
                        </p>
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                            Our shelves are getting ready
                        </h2>
                        <p className="leading-7 text-neutral-300">
                            There aren&apos;t any treasures to explore just yet.
                            Something wonderful is growing behind the scenes.
                            Check back soon, little adventurer!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                            const outOfStock =
                                product.product_type === "physical" &&
                                product.stock_quantity !== null &&
                                product.stock_quantity <= 0;

                            return (
                                <article
                                    key={product.id}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-black/30 shadow-[0_15px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-green-300/30 hover:shadow-[0_20px_60px_rgba(34,197,94,0.10)]"
                                >
                                    {/* Product image */}
                                    <Link
                                        href={`/shop/${product.slug}`}
                                        aria-label={`Discover ${product.name}`}
                                        className="relative block aspect-[4/3] overflow-hidden border-b border-white/10 bg-gradient-to-br from-green-950/70 via-neutral-900 to-black"
                                    >
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <span className="text-7xl transition duration-500 group-hover:scale-110">
                                                    {product.product_type === "digital" ? "✨" : "🌿"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20" />

                                        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3.5 py-2 text-xs font-medium text-green-100 backdrop-blur-lg">
                                            {product.product_type === "digital"
                                                ? "✧ Digital download"
                                                : "✧ Woodland treasure"}
                                        </span>

                                        {outOfStock && (
                                            <span className="absolute right-4 top-4 rounded-full border border-red-200/20 bg-red-950/80 px-3 py-2 text-xs font-semibold text-red-100 backdrop-blur-md">
                                                Out of stock
                                            </span>
                                        )}

                                        <span className="absolute bottom-4 left-4 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                                            Little Wolf Pack
                                        </span>
                                    </Link>

                                    {/* Product details */}
                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <h3 className="text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-green-200 sm:text-2xl">
                                                {product.name}
                                            </h3>
                                            <span className="shrink-0 rounded-xl border border-green-300/15 bg-green-400/[0.08] px-3 py-2 text-base font-bold tabular-nums text-green-200">
                                                {formatPrice(product.price_pence)}
                                            </span>
                                        </div>

                                        <p className="mb-5 line-clamp-4 whitespace-pre-line text-sm leading-7 text-neutral-400">
                                            {product.description ||
                                                "A little something special from Little Wolf Pack."}
                                        </p>

                                        {product.product_type === "physical" &&
                                            product.stock_quantity !== null &&
                                            !outOfStock && (
                                                <p className="mb-5 text-xs font-medium text-green-200/90">
                                                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-green-300" />
                                                    {product.stock_quantity === 1
                                                        ? "Only 1 left in the Pack!"
                                                        : `${product.stock_quantity} available in the Pack`}
                                                </p>
                                            )}

                                        <div className="mt-auto pt-2">
                                            {outOfStock ? (
                                                <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-semibold text-neutral-400">
                                                    Currently unavailable
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/shop/${product.slug}`}
                                                    className="group/button relative flex items-center justify-center gap-3 overflow-hidden rounded-full border border-green-200/30 bg-green-400 px-6 py-3.5 font-bold text-green-950 transition duration-300 hover:border-green-100 hover:bg-green-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                                                >
                                                    <span>Discover this treasure</span>
                                                    <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                                                        ↗
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Closing brand message */}
            <section className="relative overflow-hidden border-t border-green-200/10 px-6 py-16 text-center sm:py-20">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-green-500/[0.07] blur-[80px]" />
                <div className="relative">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-green-300">
                        Wherever the wild takes you
                    </p>
                    <p className="mx-auto max-w-xl text-lg leading-8 text-neutral-300">
                        Every great adventure begins with a little curiosity.
                        Thanks for being part of our pack. 🌲
                    </p>
                </div>
            </section>
        </main>
    );
}
