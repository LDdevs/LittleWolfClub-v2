
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
    try {
        const isAdmin = await verifyAdminSession();

        if (!isAdmin) {
            return NextResponse.json(
                { error: "You are not authorised to upload images." },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Please select an image to upload." },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Please upload a JPG, PNG, WEBP or GIF image." },
                { status: 400 }
            );
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Images must be no larger than 5 MB." },
                { status: 400 }
            );
        }

        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from("product-images")
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Image upload failed:", uploadError);

            return NextResponse.json(
                { error: "The image could not be uploaded. Please try again." },
                { status: 500 }
            );
        }

        const { data } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(filePath);

        return NextResponse.json({
            success: true,
            image_url: data.publicUrl,
        });
    } catch (error) {
        console.error("Image upload error:", error);

        return NextResponse.json(
            { error: "Something went wrong while uploading the image." },
            { status: 500 }
        );
    }
}
