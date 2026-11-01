
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error.message);

    return NextResponse.json(
      { error: "Could not load products" },
      { status: 500 }
    );
  }

  return NextResponse.json({ products: data });
}


export async function POST(req: Request) {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      product_type,
      price_pence,
      image_url,
      stock_quantity,
      digital_file_url,
      is_published,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      !["physical", "digital"].includes(product_type) ||
      !Number.isInteger(price_pence) ||
      price_pence < 0
    ) {
      return NextResponse.json(
        { error: "Please provide a valid name, slug, product type and price." },
        { status: 400 }
      );
    }

    if (
      image_url != null &&
      typeof image_url !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid image URL." },
        { status: 400 }
      );
    }

    if (
      digital_file_url != null &&
      typeof digital_file_url !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid digital download URL." },
        { status: 400 }
      );
    }

    if (
      product_type === "physical" &&
      stock_quantity != null &&
      (!Number.isInteger(stock_quantity) || stock_quantity < 0)
    ) {
      return NextResponse.json(
        { error: "Stock must be a whole number of zero or more." },
        { status: 400 }
      );
    }

    const product = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description:
        typeof description === "string" ? description.trim() : "",
      product_type,
      price_pence,
      image_url: image_url?.trim() || null,
      stock_quantity:
        product_type === "physical" ? stock_quantity ?? 0 : null,
      digital_file_url:
        product_type === "digital"
          ? digital_file_url?.trim() || null
          : null,
      is_published: is_published === true,
    };

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A product with that slug already exists." },
          { status: 409 }
        );
      }

      console.error("Failed to create product:", error.message);

      return NextResponse.json(
        { error: "Could not save the product." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { product: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation failed:", error);

    return NextResponse.json(
      { error: "Invalid request or could not save the product." },
      { status: 400 }
    );
  }
}


export async function PATCH(req: Request) {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "A valid product ID is required." },
        { status: 400 }
      );
    }

    const allowedFields = [
      "name",
      "slug",
      "description",
      "product_type",
      "price_pence",
      "image_url",
      "stock_quantity",
      "digital_file_url",
      "is_published",
    ];

    const safeUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        safeUpdates[field] = updates[field];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid product fields supplied." },
        { status: 400 }
      );
    }

    if (
      "name" in safeUpdates &&
      (typeof safeUpdates.name !== "string" ||
        !safeUpdates.name.trim())
    ) {
      return NextResponse.json(
        { error: "Product name cannot be empty." },
        { status: 400 }
      );
    }

    if (
      "slug" in safeUpdates &&
      (typeof safeUpdates.slug !== "string" ||
        !safeUpdates.slug.trim())
    ) {
      return NextResponse.json(
        { error: "Product slug cannot be empty." },
        { status: 400 }
      );
    }

    if (
      "product_type" in safeUpdates &&
      !["physical", "digital"].includes(
        safeUpdates.product_type as string
      )
    ) {
      return NextResponse.json(
        { error: "Invalid product type." },
        { status: 400 }
      );
    }

    if (
      "price_pence" in safeUpdates &&
      (!Number.isInteger(safeUpdates.price_pence) ||
        (safeUpdates.price_pence as number) < 0)
    ) {
      return NextResponse.json(
        { error: "Price must be a non-negative whole number of pence." },
        { status: 400 }
      );
    }

    if (
      "stock_quantity" in safeUpdates &&
      safeUpdates.stock_quantity !== null &&
      (!Number.isInteger(safeUpdates.stock_quantity) ||
        (safeUpdates.stock_quantity as number) < 0)
    ) {
      return NextResponse.json(
        { error: "Stock must be a non-negative whole number." },
        { status: 400 }
      );
    }

    if ("name" in safeUpdates) {
      safeUpdates.name = (safeUpdates.name as string).trim();
    }

    if ("slug" in safeUpdates) {
      safeUpdates.slug = (safeUpdates.slug as string)
        .trim()
        .toLowerCase();
    }

    if ("description" in safeUpdates) {
      if (typeof safeUpdates.description !== "string") {
        return NextResponse.json(
          { error: "Invalid description." },
          { status: 400 }
        );
      }

      safeUpdates.description = safeUpdates.description.trim();
    }

    safeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A product with that slug already exists." },
          { status: 409 }
        );
      }

      console.error("Failed to update product:", error.message);

      return NextResponse.json(
        { error: "Could not update product." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "A valid product ID is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to delete product:", error.message);

      return NextResponse.json(
        { error: "Could not delete product." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
