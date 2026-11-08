"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const locationDetails = {
    "Acorn Meadow": {
        icon: "🌰",
        introduction: "Welcome to Acorn Meadow! This sunny woodland clearing is full of life. Look closely and you might spot squirrels collecting acorns, birds searching for food and tiny creatures hiding in the grass.",
        tip: "Oak trees grow from tiny acorns. Squirrels sometimes bury acorns to save for later, but forget where they put them!",
        missions: [
            "Become an Acorn Detective – look for acorns and oak leaves.",
            "Wildlife Watch – quietly observe the birds and creatures around you."
        ],
        discoveries: "Acorns, oak leaves, squirrels and woodland birds."
    },
    "Whispering River": {
        icon: "💧",
        introduction: "Listen carefully! The Whispering River winds its way through the woodland. Its flowing water provides a home for lots of fascinating wildlife.",
        tip: "Rivers and streams provide important habitats for insects, fish, amphibians and birds.",
        missions: [
            "Water Watcher – observe the movement and sounds of the water from a safe spot.",
            "River Detective – look for signs of wildlife along the riverbank with an adult."
        ],
        discoveries: "Water insects, river stones, reflections and signs of wildlife."
    },
    "Old Oak Tree": {
        icon: "🌳",
        introduction: "Welcome to the heart of the woodland! The Old Oak Tree has stood here for generations. Its branches, bark and roots provide shelter for many different creatures. Scout thinks it might be hiding a few secrets too!",
        tip: "Oak trees can live for hundreds of years and support hundreds of different species.",
        missions: [
            "The Great Oak Hunt – discover the different shapes and textures of an oak tree.",
            "Woodland Mystery – find something interesting near the tree and imagine its story."
        ],
        discoveries: "Tree bark, acorns, moss, lichens and tiny habitats."
    },
    "Fern Valley": {
        icon: "🌿",
        introduction: "Welcome to Fern Valley, a wonderfully green corner of the woodland. Ferns love shady, damp places, and their delicate leaves make perfect hiding places for tiny creatures.",
        tip: "Ferns are ancient plants. They reproduce using tiny spores rather than flowers and seeds.",
        missions: [
            "Leaf Explorer – compare the shapes and patterns of different leaves.",
            "Mini-Beast Search – look carefully for tiny creatures living among the plants."
        ],
        discoveries: "Fern fronds, moss, leaves, insects and shady habitats."
    },
    "Mushroom Hollow": {
        icon: "🍄",
        introduction: "Something magical is happening on the woodland floor! Mushroom Hollow is full of fascinating fungi, fallen leaves and hidden natural treasures.",
        tip: "Fungi help break down fallen leaves and dead wood, returning important nutrients to the soil.",
        missions: [
            "Fungi Finder – look for different shapes and colours of mushrooms without touching them.",
            "Forest Floor Detective – discover how many different natural materials you can spot."
        ],
        discoveries: "Fungi, fallen leaves, decaying wood and woodland textures."
    }
} as const;

export default function ScoutsCornerPage() {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const mapSectionRef = useRef<HTMLElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!selectedLocation) return;

        const scrollTimer = window.setTimeout(() => {
            if (!panelRef.current) return;

            const panelPosition =
                panelRef.current.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: panelPosition - 170,
                behavior: "smooth",
            });
        }, 500);

        return () => window.clearTimeout(scrollTimer);
    }, [selectedLocation]);

    const selectedDetails = selectedLocation
        ? locationDetails[selectedLocation as keyof typeof locationDetails]
        : null;

    return (
        <main className="min-h-screen bg-[#101b16] text-white">

            {/* HERO - ENCHANTED WOODLAND ENTRANCE */}
            <section
                className="relative isolate overflow-hidden min-h-[850px] flex items-center px-8 py-28 md:px-16 bg-cover bg-center"
                style={{ backgroundImage: "url('/forest-bg.png')" }}
            >
                {/* Woodland atmosphere */}
                <div className="absolute inset-0 bg-[#06130b]/45" />
                <div className="absolute inset-0 bg-linear-to-r from-[#06130b]/85 via-[#06130b]/35 to-[#06130b]/10" />
                <div className="absolute inset-0 bg-linear-to-t from-[#101b16] via-transparent to-[#06130b]/30" />

                {/* Soft magical light behind Scout */}
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-green-400/10 blur-[100px]" />

                {/* Fireflies */}
                <div className="absolute top-[22%] left-[12%] w-2 h-2 rounded-full bg-lime-200 shadow-[0_0_18px_6px_rgba(190,242,100,0.45)] firefly" />
                <div className="absolute top-[38%] left-[48%] w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_16px_5px_rgba(253,224,71,0.4)] firefly-slow" />
                <div className="absolute top-[68%] left-[18%] w-1.5 h-1.5 rounded-full bg-lime-200 shadow-[0_0_16px_5px_rgba(190,242,100,0.4)] firefly-fast" />
                <div className="absolute top-[25%] right-[18%] w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_18px_6px_rgba(253,224,71,0.4)] firefly-slow" />
                <div className="absolute bottom-[25%] right-[35%] w-1.5 h-1.5 rounded-full bg-lime-200 shadow-[0_0_16px_5px_rgba(190,242,100,0.4)] firefly" />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-16">

                    {/* Welcome text */}
                    <div className="text-center md:text-left">

                        <p className="uppercase tracking-[0.4em] text-green-300 text-sm mb-8">
                            Little Wolf Pack Presents
                        </p>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] drop-shadow-lg">
                            Welcome to
                            <span className="block text-green-300">
                                Scout&apos;s Corner
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-neutral-100 leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-md">
                            A world of woodland adventures, hidden discoveries and
                            exciting family missions. Grab your explorer&apos;s hat
                            and come along!
                        </p>

                        <div className="mt-12">
                            <a
                                href="#missions"
                                className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-green-700 hover:bg-green-600 text-white font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105"
                            >
                                Begin Your Adventure
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>

                    </div>

                    {/* Scout illustration */}
                    <div className="relative flex justify-center items-center">
                        <Image
                            src="/Scout-Hero.svg"
                            alt="Scout the woodland explorer"
                            width={600}
                            height={600}
                            priority
                            className="relative z-10 w-full max-w-[520px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] scout-float"
                        />
                    </div>

                </div>
            </section>
            {/* SCOUT WELCOME */}
            <section className="px-6 py-20 max-w-6xl mx-auto">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 text-center">

                    <p className="uppercase tracking-[0.35em] text-green-400 text-sm mb-4">
                        Your Woodland Guide
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        A Little Adventure Awaits!
                    </h2>

                    <p className="text-neutral-300 text-lg leading-relaxed max-w-3xl mx-auto">
                        Hi, I&apos;m Scout! I love exploring the woodland, discovering
                        hidden treasures and learning all about the amazing world around
                        us. There&apos;s always something new to find, and I&apos;d love
                        you to come along!
                    </p>

                </div>
            </section>

            {/* WOODLAND EXPLORER MAP */}
            <section
                ref={mapSectionRef}
                className="px-6 py-20 max-w-7xl mx-auto"
            >

                <div className="text-center mb-12">
                    <p className="uppercase tracking-[0.35em] text-green-400 text-sm mb-4">
                        Your Adventure Begins
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Explore the Woodland
                    </h2>

                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Follow the woodland paths, discover special places
                        and see what adventures await!
                    </p>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-green-700/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <Image
                        src="/map1.webp"
                        alt="Illustrated map of the Little Wolf Pack woodland"
                        width={2245}
                        height={1587}
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="w-full h-auto"
                    />

                    {/* ACORN MEADOW */}
                    <button
                        type="button"
                        onClick={() => setSelectedLocation("Acorn Meadow")}
                        aria-pressed={selectedLocation === "Acorn Meadow"}
                        className={`absolute left-[20%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl p-2 transition-all hover:scale-110 ${selectedLocation === "Acorn Meadow"
                            ? "bg-green-800 ring-2 ring-yellow-300"
                            : "bg-black/60 hover:bg-green-900/90"
                            }`}
                    >
                        <span className="text-2xl">🌰</span>
                        <span className="text-xs font-bold whitespace-nowrap">Acorn Meadow</span>
                    </button>

                    {/* WHISPERING RIVER */}
                    <button
                        type="button"
                        onClick={() => setSelectedLocation("Whispering River")}
                        aria-pressed={selectedLocation === "Whispering River"}
                        className={`absolute left-[80%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl p-2 transition-all hover:scale-110 ${selectedLocation === "Whispering River"
                            ? "bg-green-800 ring-2 ring-yellow-300"
                            : "bg-black/60 hover:bg-green-900/90"
                            }`}
                    >
                        <span className="text-2xl">💧</span>
                        <span className="text-xs font-bold whitespace-nowrap">Whispering River</span>
                    </button>

                    {/* OLD OAK TREE */}
                    <button
                        type="button"
                        onClick={() => setSelectedLocation("Old Oak Tree")}
                        aria-pressed={selectedLocation === "Old Oak Tree"}
                        className={`absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl p-2 transition-all hover:scale-110 ${selectedLocation === "Old Oak Tree"
                            ? "bg-green-800 ring-2 ring-yellow-300"
                            : "bg-black/60 hover:bg-green-900/90"
                            }`}
                    >
                        <span className="text-2xl">🌳</span>
                        <span className="text-xs font-bold whitespace-nowrap">Old Oak Tree</span>
                    </button>

                    {/* FERN VALLEY */}
                    <button
                        type="button"
                        onClick={() => setSelectedLocation("Fern Valley")}
                        aria-pressed={selectedLocation === "Fern Valley"}
                        className={`absolute left-[20%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl p-2 transition-all hover:scale-110 ${selectedLocation === "Fern Valley"
                            ? "bg-green-800 ring-2 ring-yellow-300"
                            : "bg-black/60 hover:bg-green-900/90"
                            }`}
                    >
                        <span className="text-2xl">🌿</span>
                        <span className="text-xs font-bold whitespace-nowrap">Fern Valley</span>
                    </button>

                    {/* MUSHROOM HOLLOW */}
                    <button
                        type="button"
                        onClick={() => setSelectedLocation("Mushroom Hollow")}
                        aria-pressed={selectedLocation === "Mushroom Hollow"}
                        className={`absolute left-[80%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl p-2 transition-all hover:scale-110 ${selectedLocation === "Mushroom Hollow"
                            ? "bg-green-800 ring-2 ring-yellow-300"
                            : "bg-black/60 hover:bg-green-900/90"
                            }`}
                    >
                        <span className="text-2xl">🍄</span>
                        <span className="text-xs font-bold whitespace-nowrap">Mushroom Hollow</span>
                    </button>

                </div>

                {/* SELECTED LOCATION PANEL */}
                {selectedLocation && selectedDetails && (
                    <div
                        ref={panelRef}
                        className="mt-8 rounded-3xl border border-green-700/40 bg-linear-to-br from-green-950/80 to-[#17251d] p-6 md:p-10 shadow-xl"
                    >

                        {/* Location heading */}
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div>
                                <p className="uppercase tracking-widest text-green-400 text-xs mb-2">
                                    Welcome, Explorer!
                                </p>

                                <h3 className="text-2xl md:text-3xl font-bold text-green-300">
                                    <span className="mr-3">{selectedDetails.icon}</span>
                                    {selectedLocation}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedLocation(null)}
                                className="text-green-300 hover:text-white text-2xl"
                                aria-label="Close location information"
                            >
                                ×
                            </button>
                        </div>

                        {/* Introduction */}
                        <p className="text-neutral-200 leading-relaxed text-lg mb-8">
                            {selectedDetails.introduction}
                        </p>

                        {/* Scout's Tip */}
                        <div className="rounded-2xl bg-green-900/40 border border-green-700/30 p-5 mb-8">
                            <h4 className="text-lg font-bold text-green-300 mb-3">
                                💡 Scout&apos;s Tip
                            </h4>

                            <p className="text-neutral-200 leading-relaxed">
                                {selectedDetails.tip}
                            </p>
                        </div>

                        {/* Missions */}
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-green-300 mb-4">
                                🐾 Woodland Missions
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedDetails.missions.map((mission, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl bg-white/5 border border-white/10 p-5"
                                    >
                                        <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
                                            Mission {index + 1}
                                        </p>

                                        <p className="text-neutral-200 leading-relaxed">
                                            {mission}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discoveries */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                            <h4 className="text-lg font-bold text-green-300 mb-3">
                                🔎 Things to Discover
                            </h4>

                            <p className="text-neutral-300 leading-relaxed">
                                {selectedDetails.discoveries}
                            </p>
                        </div>

                    </div>
                )}



            </section>

            {/* MISSIONS */}
            <section id="missions" className="px-6 py-20 max-w-6xl mx-auto">

                <div className="text-center mb-14">
                    <p className="uppercase tracking-[0.35em] text-green-400 text-sm mb-4">
                        Adventure Starts Here
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Scout&apos;s Missions
                    </h2>

                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Ready to become a woodland explorer? Take on fun challenges,
                        discover nature and make memories together.
                    </p>
                </div>

                <div className="rounded-3xl border border-green-700/40 bg-linear-to-br from-green-950/70 to-[#17251d] p-8 md:p-12">

                    <div className="max-w-3xl">
                        <span className="inline-block bg-green-700/40 text-green-300 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            Coming Soon
                        </span>

                        <h3 className="text-3xl md:text-4xl font-bold mb-5">
                            The Great Woodland Adventure
                        </h3>

                        <p className="text-neutral-300 text-lg leading-relaxed mb-8">
                            Every explorer needs a mission! Scout is busy preparing
                            exciting challenges for families to enjoy together.
                            Keep your eyes open — adventure is on its way!
                        </p>

                    </div>

                </div>
            </section>

            {/* FUTURE ADVENTURES */}
            <section className="px-6 py-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="uppercase tracking-[0.35em] text-green-400 text-sm mb-4">
                        There&apos;s More to Discover
                    </p>

                    <h2 className="text-4xl font-bold">
                        Explore Scout&apos;s World
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {[
                        {
                            title: "Explore the Woodland",
                            description: "Discover magical woodland places and hidden secrets.",
                            icon: "🌳",
                        },
                        {
                            title: "Woodland Learning",
                            description: "Learn fascinating facts about wildlife and nature.",
                            icon: "🍄",
                        },
                        {
                            title: "Explorer Achievements",
                            description: "Collect badges and celebrate your adventures.",
                            icon: "🏅",
                        },
                        {
                            title: "Scout's Diary",
                            description: "Read stories and updates from Scout himself.",
                            icon: "📖",
                        },
                        {
                            title: "Seasonal Adventures",
                            description: "Discover something special in every season.",
                            icon: "🍂",
                        },
                        {
                            title: "Family Activities",
                            description: "Find fun ways to explore and learn together.",
                            icon: "🐾",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="text-4xl mb-5">{item.icon}</div>

                            <h3 className="text-xl font-bold mb-3">
                                {item.title}
                            </h3>

                            <p className="text-neutral-400 leading-relaxed">
                                {item.description}
                            </p>

                            <span className="inline-block mt-5 text-xs uppercase tracking-widest text-green-400">
                                Coming Soon
                            </span>
                        </div>
                    ))}

                </div>
            </section>

            {/* BACK HOME */}
            <section className="text-center px-6 py-20">
                <p className="text-neutral-400 mb-6">
                    Every great adventure starts with a little curiosity.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-green-600 text-green-400 hover:bg-green-900/40 transition-all duration-300"
                >
                    ← Back to Little Wolf Pack
                </Link>
            </section>

        </main>
    );
}
