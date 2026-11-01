
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AddToBasketButton from "@/components/AddToBasketButton";

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    product_type: "physical" | "digital";
    price_pence: number;
    image_url: string | null;
    stock_quantity: number | null;
    is_published: boolean;
};

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;

    const { data: product, error } = await supabase
        .from("products")
        .select(
            "id, name, slug, description, product_type, price_pence, image_url, stock_quantity, is_published"
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

    if (error) {
        throw new Error("Unable to load this product.");
    }

    if (!product) {
        notFound();
    }

    const item = product as Product;

    const outOfStock =
        item.product_type === "physical" &&
        item.stock_quantity !== null &&
        item.stock_quantity <= 0;

    const price = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(item.price_pence / 100);

    return (
        <main className="relative min-h-screen overflow-hidden bg-neutral-950/40 px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40">
            {/* Subtle woodland glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/4 top-40 h-80 w-80 rounded-full bg-green-500/[0.07] blur-[110px]"
            />

            <div className="relative mx-auto max-w-7xl">
                {/* Breadcrumb navigation */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-400"
                >
                    <Link
                        href="/shop"
                        className="transition hover:text-green-200"
                    >
                        The Pack Shop
                    </Link>
                    <span aria-hidden="true" className="text-green-400/60">
                        /
                    </span>
                    <span
                        aria-current="page"
                        className="max-w-[220px] truncate text-neutral-200"
                    >
                        {item.name}
                    </span>
                </nav>

                <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    {/* Product image */}
                    <div className="lg:sticky lg:top-28">
                        <div className="group relative overflow-hidden rounded-[2rem] border border-green-200/15 bg-gradient-to-br from-green-950/70 via-neutral-900 to-black p-2 shadow-[0_25px_100px_rgba(0,0,0,0.35)]">
                            <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-green-400/[0.06] blur-2xl" />

                            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.6rem] bg-black/20">
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                        className="object-cover transition duration-700 group-hover:scale-[1.025]"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <span className="text-8xl sm:text-9xl">
                                            {item.product_type === "digital"
                                                ? "✨"
                                                : "🌿"}
                                        </span>
                                        <p className="text-xs uppercase tracking-[0.25em] text-green-200/70">
                                            A Little Wolf Pack treasure
                                        </p>
                                    </div>
                                )}

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                                <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-medium tracking-wide text-white/90 backdrop-blur-xl">
                                    🐺 A Little Wolf Pack treasure
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md">
                                <span className="mb-2 block text-lg">🌲</span>
                                <p className="text-xs font-semibold text-white">
                                    Made for adventures
                                </p>
                                <p className="mt-1 text-xs leading-5 text-neutral-400">
                                    Little treasures, big possibilities.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md">
                                <span className="mb-2 block text-lg">
                                    {item.product_type === "digital" ? "✨" : "💚"}
                                </span>
                                <p className="text-xs font-semibold text-white">
                                    {item.product_type === "digital"
                                        ? "Digital treasure"
                                        : "Pack favourite"}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-neutral-400">
                                    A little something special for you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product information */}
                    <div className="pt-1 lg:py-4">
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-green-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-green-200 backdrop-blur-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                                {item.product_type === "digital"
                                    ? "Digital download"
                                    : "Woodland treasure"}
                            </span>

                            <span className="text-xs text-neutral-500">
                                Part of the Pack Shop
                            </span>
                        </div>

                        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                                {item.name}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-8 text-neutral-300 sm:text-lg">
                            {item.description ||
                                "A little something special from Little Wolf Pack."}
                        </p>

                        {/* Price and availability */}
                        <div className="mt-8 rounded-3xl border border-green-200/15 bg-gradient-to-br from-green-950/35 via-white/[0.035] to-transparent p-5 backdrop-blur-xl sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                                Your next little treasure
                            </p>

                            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                                <p className="text-4xl font-black tracking-tight text-green-200 sm:text-5xl">
                                    {price}
                                </p>

                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-neutral-300">
                                    {item.product_type === "digital"
                                        ? "Digital product"
                                        : "Physical product"}
                                </span>
                            </div>

                            <div className="my-6 h-px bg-gradient-to-r from-green-300/30 via-white/10 to-transparent" />

                            {outOfStock ? (
                                <div
                                    role="status"
                                    className="flex items-start gap-3 rounded-2xl border border-red-300/20 bg-red-950/30 p-4"
                                >
                                    <span className="text-xl">🌧️</span>
                                    <div>
                                        <p className="font-semibold text-red-100">
                                            This treasure is resting for now
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-red-100/70">
                                            Currently out of stock. Please check
                                            back another time.
                                        </p>
                                    </div>
                                </div>
                            ) : item.product_type === "physical" &&
                                item.stock_quantity !== null ? (
                                <div
                                    role="status"
                                    className="flex items-start gap-3 rounded-2xl border border-green-300/15 bg-green-400/[0.06] p-4"
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-300/10 text-green-200">
                                        ✓
                                    </span>
                                    <div>
                                        <p className="font-semibold text-green-100">
                                            {item.stock_quantity === 1
                                                ? "Only 1 left in the Pack!"
                                                : `${item.stock_quantity} available in the Pack`}
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-neutral-400">
                                            Stock can change, so grab your
                                            favourite while it&apos;s available.
                                        </p>
                                    </div>
                                </div>
                            ) : item.product_type === "digital" ? (
                                <div
                                    role="status"
                                    className="flex items-start gap-3 rounded-2xl border border-green-300/15 bg-green-400/[0.06] p-4"
                                >
                                    <span className="text-xl">✨</span>
                                    <div>
                                        <p className="font-semibold text-green-100">
                                            A little digital magic
                                        </p>
                                        <p className="mt-1 text-sm text-neutral-400">
                                            A digital product, ready for its
                                            next adventure.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    role="status"
                                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-neutral-300"
                                >
                                    🌿 Ready for your next adventure.
                                </div>
                            )}

                            <div className="mt-5">
                                <AddToBasketButton
                                    product={{
                                        id: item.id,
                                        name: item.name,
                                        slug: item.slug,
                                        price_pence: item.price_pence,
                                        image_url: item.image_url,
                                        product_type: item.product_type,
                                        stock_quantity: item.stock_quantity,
                                    }}
                                />
                            </div>

                            <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                                Your basket will check current prices and
                                availability when you verify your items.
                            </p>
                        </div>

                        {/* More shopping links */}
                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition hover:text-green-200"
                            >
                                <span aria-hidden="true">←</span>
                                Explore more treasures
                            </Link>

                            <Link
                                href="/basket"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-green-200 transition hover:text-green-100"
                            >
                                View your basket
                                <span aria-hidden="true">↗</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Closing brand touch */}
                <div className="mt-20 border-t border-white/10 pt-10 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-300">
                        Find your little bit of magic
                    </p>
                    <p className="mt-3 text-sm leading-7 text-neutral-400">
                        Thanks for being part of the Little Wolf Pack. 🌲
                    </p>
                </div>
            </div>
        </main>
    );
}
