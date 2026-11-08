import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const { slug } = await params;

        const { data: product, error } = await supabaseAdmin
            .from("products")
            .select(
                "name, product_type, category, price_pence, digital_file_url, is_published"
            )
            .eq("slug", slug)
            .eq("is_published", true)
            .maybeSingle();

        if (error) {
            console.error("Free download lookup failed:", error.message);

            return NextResponse.json(
                { error: "Unable to find this download." },
                { status: 500 }
            );
        }

        if (!product) {
            return NextResponse.json(
                { error: "This download could not be found." },
                { status: 404 }
            );
        }

        if (
            product.product_type !== "digital" ||
            product.category !== "free_downloads" ||
            product.price_pence !== 0
        ) {
            return NextResponse.json(
                { error: "This product is not a free download." },
                { status: 403 }
            );
        }

        if (
            typeof product.digital_file_url !== "string" ||
            !product.digital_file_url.startsWith("products/")
        ) {
            return NextResponse.json(
                { error: "The download file is not available." },
                { status: 404 }
            );
        }

        const { data, error: signedUrlError } =
            await supabaseAdmin.storage
                .from("digital-downloads")
                .createSignedUrl(
                    product.digital_file_url,
                    60,
                    { download: true }
                );

        if (signedUrlError || !data?.signedUrl) {
            console.error(
                "Free download link creation failed:",
                signedUrlError?.message
            );

            return NextResponse.json(
                { error: "Unable to prepare this download." },
                { status: 500 }
            );
        }

        return NextResponse.redirect(data.signedUrl);
    } catch (error) {
        console.error("Free download error:", error);

        return NextResponse.json(
            { error: "Something went wrong preparing your download." },
            { status: 500 }
        );
    }
}