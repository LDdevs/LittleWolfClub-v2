
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#17251d] text-white">

            {/* Woodland background */}
            <div className="absolute inset-0 bg-[url('/forest-bg.png')] bg-cover bg-center opacity-20" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-24">

                {/* Heading */}
                <div className="text-center mb-12">
                    <p className="text-green-400 uppercase tracking-[0.3em] text-sm mb-4">
                        Little Wolf Pack
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold text-green-200 mb-5">
                        Get in Touch
                    </h1>

                    <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Every great adventure starts with a little curiosity.
                        If you have a question about Little Wolf Pack, we&apos;d love
                        to hear from you!
                    </p>
                </div>

                {/* Contact card */}
                <div className="max-w-3xl mx-auto rounded-3xl border border-green-700/40 bg-linear-to-br from-green-950/90 to-[#17251d] p-8 md:p-12 shadow-2xl">

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">

                        <div className="shrink-0">
                            <Image
                                src="/Scout-Hero.svg"
                                alt="Scout the Wolf"
                                width={180}
                                height={180}
                                className="w-36 md:w-44 h-auto"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-green-300 mb-3">
                                A little message from Scout!
                            </h2>

                            <p className="text-neutral-300 leading-relaxed">
                                Hello, Explorer! I&apos;m always happy to hear from
                                our woodland friends. Whether you have a
                                question, an idea or simply want to say hello,
                                this is the place to start.
                            </p>
                        </div>

                    </div>

                    {/* Contact availability */}
                    <div className="rounded-2xl bg-green-900/40 border border-green-700/30 p-6 text-center">

                        <span className="text-4xl mb-4 block">🌿</span>

                        <h3 className="text-xl font-bold text-green-200 mb-3">
                            Our Contact Desk is Growing!
                        </h3>

                        <p className="text-neutral-300 leading-relaxed max-w-xl mx-auto">
                            We&apos;re busy getting everything ready for the
                            Little Wolf Pack adventure. Our dedicated contact
                            email and enquiry service will be available
                            before our shop officially opens.
                        </p>

                        <p className="text-green-300 text-sm mt-5 font-medium">
                            Thank you for your patience, Explorer!
                        </p>

                    </div>

                </div>

                {/* Back home */}
                <div className="text-center mt-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-green-600/50 px-7 py-3 text-green-200 hover:bg-green-800/40 hover:border-green-400 transition-all"
                    >
                        ← Back to the Woodland
                    </Link>
                </div>

            </div>
        </main>
    );
}
