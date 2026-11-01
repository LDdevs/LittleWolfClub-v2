
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
    try {
        const isAdmin = await verifyAdminSession();

        if (!isAdmin) {
            return NextResponse.json(
                { error: "You are not authorised to upload files." },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Please select a file to upload." },
                { status: 400 }
            );
        }

        const allowedExtensions = [
            "pdf",
            "zip",
            "docx",
            "pptx",
            "xlsx",
            "txt",
        ];

        const extension = file.name
            .split(".")
            .pop()
            ?.toLowerCase();

        if (!extension || !allowedExtensions.includes(extension)) {
            return NextResponse.json(
                {
                    error: "Please upload a PDF, ZIP, DOCX, PPTX, XLSX or TXT file.",
                },
                { status: 400 }
            );
        }

        const maxSize = 50 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Digital files must be no larger than 50 MB." },
                { status: 400 }
            );
        }

        if (file.size === 0) {
            return NextResponse.json(
                { error: "The selected file is empty." },
                { status: 400 }
            );
        }

        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from("digital-downloads")
            .upload(filePath, file, {
                contentType: file.type || "application/octet-stream",
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Digital file upload failed:", uploadError);

            return NextResponse.json(
                { error: "The digital file could not be uploaded." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            file_path: filePath,
            file_name: file.name,
        });
    } catch (error) {
        console.error("Digital upload error:", error);

        return NextResponse.json(
            { error: "Something went wrong while uploading the digital file." },
            { status: 500 }
        );
    }
}
