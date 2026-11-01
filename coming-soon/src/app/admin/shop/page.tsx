
"use client";

import { useCallback, useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    product_type: "physical" | "digital";
    price_pence: number;
    image_url: string | null;
    stock_quantity: number | null;
    digital_file_url: string | null;
    is_published: boolean;
    created_at: string;
};

const emptyForm = {
    name: "",
    description: "",
    product_type: "physical" as "physical" | "digital",
    price: "",
    image_url: "",
    stock_quantity: "0",
    digital_file_url: "",
};

export default function ShopManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [publish, setPublish] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [digitalUploading, setDigitalUploading] = useState(false);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin-products");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not load products.");
            }

            setProducts(result.products ?? []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not load products."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    function updateField(
        field: keyof typeof emptyForm,
        value: string
    ) {
        setForm((current) => ({ ...current, [field]: value }));
    }


    async function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setMessage("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG, PNG, WEBP or GIF image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Images must be no larger than 5 MB.");
            event.target.value = "";
            return;
        }

        setImageUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const response = await fetch("/api/admin-upload-image", {
                method: "POST",
                body: uploadData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Image upload failed.");
            }

            updateField("image_url", result.image_url);
            setMessage("Image uploaded successfully!");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Image upload failed."
            );
        } finally {
            setImageUploading(false);
            event.target.value = "";
        }
    }


    async function handleDigitalUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setMessage("");

        const allowedExtensions = [
            "pdf",
            "zip",
            "docx",
            "pptx",
            "xlsx",
            "txt",
        ];

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!extension || !allowedExtensions.includes(extension)) {
            setError("Please select a PDF, ZIP, DOCX, PPTX, XLSX or TXT file.");
            event.target.value = "";
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setError("Digital files must be no larger than 50 MB.");
            event.target.value = "";
            return;
        }

        setDigitalUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const response = await fetch("/api/admin-upload-digital", {
                method: "POST",
                body: uploadData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Digital file upload failed.");
            }

            updateField("digital_file_url", result.file_path);
            setMessage(`"${result.file_name}" uploaded successfully!`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Digital file upload failed."
            );
        } finally {
            setDigitalUploading(false);
            event.target.value = "";
        }
    }



    function handleEdit(product: Product) {
        setEditingId(product.id);
        setError("");
        setMessage("");

        setForm({
            name: product.name,
            description: product.description || "",
            product_type: product.product_type,
            price: (product.price_pence / 100).toFixed(2),
            image_url: product.image_url || "",
            stock_quantity:
                product.stock_quantity !== null
                    ? String(product.stock_quantity)
                    : "",
            digital_file_url: product.digital_file_url || "",
        });

        setPublish(product.is_published);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    async function handleDelete(product: Product) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin-products", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: product.id }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not delete product.");
            }

            if (editingId === product.id) {
                setEditingId(null);
                setForm(emptyForm);
                setPublish(false);
            }

            setMessage(`"${product.name}" was deleted successfully.`);
            await loadProducts();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not delete product."
            );
        }
    }



    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        const price = Number(form.price);

        if (!Number.isFinite(price) || price < 0) {
            setError("Please enter a valid price.");
            setSaving(false);
            return;
        }

        const slug = form.name
            .trim()
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        if (!slug) {
            setError("Please enter a product name.");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch("/api/admin-products", {
                method: editingId ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...(editingId ? { id: editingId } : {}),
                    name: form.name.trim(),
                    slug,
                    description: form.description.trim(),
                    product_type: form.product_type,
                    price_pence: Math.round(price * 100),
                    image_url: form.image_url.trim() || null,
                    stock_quantity:
                        form.product_type === "physical" &&
                            form.stock_quantity !== ""
                            ? Number(form.stock_quantity)
                            : null,
                    digital_file_url:
                        form.product_type === "digital"
                            ? form.digital_file_url.trim() || null
                            : null,
                    is_published: publish,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not save product.");
            }

            setMessage(
                editingId
                    ? "Product updated successfully!"
                    : publish
                        ? "Product published successfully!"
                        : "Draft saved successfully!"
            );

            setForm(emptyForm);
            setPublish(false);
            setEditingId(null);
            await loadProducts();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not save product."
            );
        } finally {
            setSaving(false);
        }
    }


    return (
        <div className="space-y-8">
            <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-green-400">
                    Shop Management
                </p>
                <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
                    Your Pack Shop
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-neutral-400">
                    Create and manage your physical products and digital downloads.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                >
                    {error}
                </div>
            )}

            {message && (
                <div
                    role="status"
                    className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300"
                >
                    {message}
                </div>
            )}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-bold">
                    {editingId ? "Edit product" : "Add a product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Product name *</span>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="e.g. Woodland Adventure Pack"
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Product type *</span>
                            <select
                                value={form.product_type}
                                onChange={(e) =>
                                    updateField("product_type", e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                            >
                                <option value="physical">Physical product</option>
                                <option value="digital">Digital download</option>
                            </select>
                        </label>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">Description</span>
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Tell customers what makes this product special..."
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                        />
                    </label>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Price (£) *</span>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => updateField("price", e.target.value)}
                                placeholder="4.99"
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                            />
                        </label>

                        {form.product_type === "physical" && (
                            <label className="block space-y-2">
                                <span className="text-sm font-medium">Stock quantity *</span>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.stock_quantity}
                                    onChange={(e) =>
                                        updateField("stock_quantity", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                                />
                            </label>
                        )}
                    </div>


                    <div className="space-y-4">
                        <div>
                            <label className="block space-y-2">
                                <span className="text-sm font-medium">
                                    Product image
                                </span>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    disabled={imageUploading}
                                    className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-green-400 file:px-4 file:py-2 file:font-bold file:text-black hover:file:bg-green-300 disabled:opacity-50"
                                />
                            </label>

                            <p className="mt-2 text-xs text-neutral-500">
                                JPG, PNG, WEBP or GIF. Maximum file size 5 MB.
                            </p>
                        </div>

                        {imageUploading && (
                            <p className="text-sm text-green-300">
                                Uploading your image... 🌿
                            </p>
                        )}

                        {form.image_url && (
                            <div className="max-w-xs space-y-2">
                                <p className="text-sm font-medium text-green-200">
                                    Image preview
                                </p>

                                <img
                                    src={form.image_url}
                                    alt="Product preview"
                                    className="aspect-square w-full rounded-2xl border border-green-300/20 object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => updateField("image_url", "")}
                                    className="text-sm text-red-300 transition hover:text-red-200"
                                >
                                    Remove image
                                </button>
                            </div>
                        )}

                        <label className="block space-y-2">
                            <span className="text-sm font-medium">
                                Or enter an image URL manually
                            </span>

                            <input
                                type="url"
                                value={form.image_url}
                                onChange={(e) => updateField("image_url", e.target.value)}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-green-400"
                            />
                        </label>
                    </div>



                    {form.product_type === "digital" && (
                        <div className="space-y-4 rounded-2xl border border-green-400/20 bg-green-950/10 p-5">
                            <div>
                                <h3 className="font-semibold text-green-200">
                                    Digital download file
                                </h3>
                                <p className="mt-1 text-sm text-neutral-400">
                                    Upload the file customers will receive after purchasing.
                                </p>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium">
                                    Choose your digital file
                                </span>

                                <input
                                    type="file"
                                    accept=".pdf,.zip,.docx,.pptx,.xlsx,.txt"
                                    onChange={handleDigitalUpload}
                                    disabled={digitalUploading}
                                    className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-green-400 file:px-4 file:py-2 file:font-bold file:text-black hover:file:bg-green-300 disabled:opacity-50"
                                />
                            </label>

                            <p className="text-xs text-neutral-500">
                                PDF, ZIP, DOCX, PPTX, XLSX or TXT. Maximum 50 MB.
                            </p>

                            {digitalUploading && (
                                <p className="text-sm text-green-300">
                                    Uploading your digital treasure... ✨
                                </p>
                            )}

                            {form.digital_file_url && (
                                <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-4">
                                    <p className="text-sm font-semibold text-green-200">
                                        ✓ Digital file uploaded
                                    </p>
                                    <p className="mt-2 break-all text-xs text-neutral-400">
                                        {form.digital_file_url}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => updateField("digital_file_url", "")}
                                        className="mt-3 text-sm text-red-300 hover:text-red-200"
                                    >
                                        Remove file from this product
                                    </button>
                                </div>
                            )}
                        </div>
                    )}


                    <label className="flex items-start gap-3 rounded-xl border border-white/10 p-4">
                        <input
                            type="checkbox"
                            checked={publish}
                            onChange={(e) => setPublish(e.target.checked)}
                            className="mt-1 accent-green-400"
                        />
                        <span>
                            <span className="block font-medium">Publish immediately</span>
                            <span className="mt-1 block text-sm text-neutral-400">
                                Leave unchecked to save this product as a draft.
                            </span>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-green-400 px-6 py-3 font-bold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update product"
                                : publish
                                    ? "Save & publish"
                                    : "Save draft"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                                setPublish(false);
                                setError("");
                                setMessage("");
                            }}
                            className="ml-3 rounded-xl border border-white/10 px-6 py-3 font-bold transition hover:bg-white/5"
                        >
                            Cancel editing
                        </button>
                    )}

                </form>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold">Your products</h2>
                        <p className="mt-1 text-sm text-neutral-400">
                            Products saved in your Supabase database.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void loadProducts()}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p className="text-neutral-400">Loading products...</p>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 p-8 text-center text-neutral-400">
                        No products yet. Add your first one above!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-bold">{product.name}</h3>
                                        <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-neutral-300">
                                            {product.is_published ? "Published" : "Draft"}
                                        </span>
                                        <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-neutral-400">
                                            {product.product_type === "physical"
                                                ? "Physical"
                                                : "Digital"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-400">
                                        £{(product.price_pence / 100).toFixed(2)}
                                        {product.product_type === "physical" &&
                                            ` · Stock: ${product.stock_quantity ?? 0}`}
                                    </p>
                                    {product.description && (
                                        <p className="mt-2 text-sm text-neutral-500">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(product)}
                                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/5"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(product)}
                                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
