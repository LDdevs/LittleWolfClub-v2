
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type BasketRequestItem = {
    id: string;
    quantity: number;
};

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();

        if (
            !body ||
            typeof body !== "object" ||
            !("items" in body) ||
            !Array.isArray(body.items)
        ) {
            return NextResponse.json(
                { error: "Invalid basket data." },
                { status: 400 }
            );
        }

        const items = body.items as BasketRequestItem[];

        if (
            items.length === 0 ||
            items.length > 100 ||
            items.some(
                (item) =>
                    !item ||
                    typeof item.id !== "string" ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1
            )
        ) {
            return NextResponse.json(
                { error: "Your basket is empty or contains invalid quantities." },
                { status: 400 }
            );
        }

        const uniqueIds = new Set(items.map((item) => item.id));

        if (uniqueIds.size !== items.length) {
            return NextResponse.json(
                { error: "Your basket contains duplicate products." },
                { status: 400 }
            );
        }

        const { data: products, error } = await supabaseAdmin
            .from("products")
            .select(
                "id, name, slug, product_type, price_pence, image_url, stock_quantity, is_published"
            )
            .in("id", items.map((item) => item.id));

        if (error) {
            console.error("Basket validation failed:", error);

            return NextResponse.json(
                { error: "We couldn't verify your basket. Please try again." },
                { status: 500 }
            );
        }

        const productMap = new Map(
            (products ?? []).map((product) => [product.id, product])
        );

        const validatedItems = [];

        for (const requestedItem of items) {
            const product = productMap.get(requestedItem.id);

            if (!product || !product.is_published) {
                return NextResponse.json(
                    { error: "A product in your basket is no longer available." },
                    { status: 409 }
                );
            }

            if (
                product.product_type === "physical" &&
                product.stock_quantity !== null &&
                requestedItem.quantity > product.stock_quantity
            ) {
                return NextResponse.json(
                    {
                        error: `There isn't enough stock available for ${product.name}. Please update its quantity.`,
                        product_id: product.id,
                        available_stock: product.stock_quantity,
                    },
                    { status: 409 }
                );
            }

            validatedItems.push({
                id: product.id,
                name: product.name,
                slug: product.slug,
                product_type: product.product_type,
                price_pence: product.price_pence,
                image_url: product.image_url,
                stock_quantity: product.stock_quantity,
                quantity: requestedItem.quantity,
            });
        }

        const total_pence = validatedItems.reduce(
            (total, item) => total + item.price_pence * item.quantity,
            0
        );

        return NextResponse.json({
            items: validatedItems,
            total_pence,
        });
    } catch {
        return NextResponse.json(
            { error: "We couldn't verify your basket. Please try again." },
            { status: 400 }
        );
    }
}
