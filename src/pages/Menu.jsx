import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useProducts, useCreateCategory, useUpdateCategory, useDeleteCategory, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";

// ── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({ category, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex flex-col items-start justify-between w-36 h-28 rounded-xl p-4 border transition-colors text-left ${
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-card-foreground border-border hover:border-primary/50"
      }`}
    >
      <UtensilsCrossed size={22} className="opacity-70" />
      <div>
        <p className="font-semibold text-sm">{category.name}</p>
        <p className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {category.count ?? 0} items
        </p>
      </div>
    </button>
  );
}

// ── Category Modal ────────────────────────────────────────────────────────────

function CategoryModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(name.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Reset on open
  useState(() => { setName(initial?.name ?? ""); }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Product Modal ─────────────────────────────────────────────────────────────

function ProductModal({ open, onClose, onSave, initial, categories }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial?.price ?? "",
    image: initial?.image ?? "",
    categoryId: initial?.categoryId ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    setSaving(true);
    try {
      await onSave({ ...form, price: Number(form.price) });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.name.trim() && form.price && form.categoryId;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Product" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Product Name</Label>
            <Input placeholder="e.g. Chicken Parmesan" value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Price ($)</Label>
            <Input type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={set("price")} />
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input placeholder="https://..." value={form.image} onChange={set("image")} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.categoryId ? String(form.categoryId) : ""}
              onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !isValid}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteDialog({ open, onClose, onConfirm, label }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const { data: categoriesRaw, refetch: refetchCategories } = useCategories();
  const { data: productsRaw, refetch: refetchProducts } = useProducts();

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [catModal, setCatModal] = useState({ open: false, initial: null });
  const [productModal, setProductModal] = useState({ open: false, initial: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, item: null });

  // Enrich categories with item counts
  const categories = useMemo(() => {
    const cats = categoriesRaw ?? [];
    const products = productsRaw ?? [];
    return cats.map((c) => ({
      ...c,
      count: products.filter((p) => String(p.categoryId) === String(c.id)).length,
    }));
  }, [categoriesRaw, productsRaw]);

  const allCount = productsRaw?.length ?? 0;

  // Filter products by active category
  const filteredProducts = useMemo(() => {
    const products = productsRaw ?? [];
    if (activeCategoryId === "all") return products;
    return products.filter((p) => String(p.categoryId) === String(activeCategoryId));
  }, [productsRaw, activeCategoryId]);

  // Active category label for tabs
  const activeCategory = categories.find((c) => String(c.id) === String(activeCategoryId));

  // Selection helpers
  const allSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;
  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : filteredProducts.map((p) => p.id));
  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Category CRUD
  const handleSaveCategory = async (name) => {
    if (catModal.initial) {
      await updateCategory(catModal.initial.id, name);
    } else {
      await createCategory(name);
    }
    refetchCategories();
    refetchProducts();
  };

  const handleDeleteCategory = async () => {
    await deleteCategory(deleteDialog.item.id);
    refetchCategories();
    refetchProducts();
    if (String(activeCategoryId) === String(deleteDialog.item.id)) setActiveCategoryId("all");
  };

  // Product CRUD
  const handleSaveProduct = async (data) => {
    if (productModal.initial) {
      await updateProduct(productModal.initial.id, data);
    } else {
      await createProduct(data);
    }
    refetchProducts();
  };

  const handleDeleteProduct = async () => {
    await deleteProduct(deleteDialog.item.id);
    refetchProducts();
    setSelectedIds((prev) => prev.filter((x) => x !== deleteDialog.item.id));
  };

  const getCategoryName = (categoryId) =>
    categories.find((c) => String(c.id) === String(categoryId))?.name ?? "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu</h1>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Button onClick={() => setCatModal({ open: true, initial: null })}>
            <Plus size={16} className="mr-1.5" />
            Add New Category
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* All card */}
          <button
            onClick={() => setActiveCategoryId("all")}
            className={`shrink-0 flex flex-col items-start justify-between w-36 h-28 rounded-xl p-4 border transition-colors text-left ${
              activeCategoryId === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:border-primary/50"
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5 opacity-70">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm bg-current" />
              ))}
            </div>
            <div>
              <p className="font-semibold text-sm">All</p>
              <p className={`text-xs mt-0.5 ${activeCategoryId === "all" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {allCount} items
              </p>
            </div>
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="relative group shrink-0">
              <CategoryCard
                category={cat}
                isActive={String(activeCategoryId) === String(cat.id)}
                onClick={() => setActiveCategoryId(String(cat.id))}
              />
              {/* Edit/delete on hover */}
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setCatModal({ open: true, initial: cat }); }}
                  className="p-1 rounded bg-background/80 hover:bg-background text-foreground"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, type: "category", item: cat }); }}
                  className="p-1 rounded bg-background/80 hover:bg-destructive text-foreground hover:text-destructive-foreground"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Category tabs */}
            <button
              onClick={() => setActiveCategoryId("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategoryId === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(String(cat.id))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  String(activeCategoryId) === String(cat.id)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <Button onClick={() => setProductModal({ open: true, initial: null })}>
            <Plus size={16} className="mr-1.5" />
            Add Menu Item
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-10 px-4 py-3 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium w-16">Product</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Product Name</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Item ID</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Stock</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Category</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Price</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Availability</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                      i % 2 === 1 ? "bg-muted/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={() => toggleOne(product.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <UtensilsCrossed size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description ?? "No description"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      #{String(product.id).padStart(8, "0")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.stock ?? "—"} items
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        product.availability === false
                          ? "text-destructive"
                          : "text-primary"
                      }`}>
                        {product.availability === false ? "Out of Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProductModal({ open: true, initial: product })}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, type: "product", item: product })}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, initial: null })}
        onSave={handleSaveCategory}
        initial={catModal.initial}
      />

      {/* Product Modal */}
      <ProductModal
        open={productModal.open}
        onClose={() => setProductModal({ open: false, initial: null })}
        onSave={handleSaveProduct}
        initial={productModal.initial}
        categories={categories}
      />

      {/* Delete Confirm */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: null, item: null })}
        onConfirm={
          deleteDialog.type === "category" ? handleDeleteCategory : handleDeleteProduct
        }
        label={deleteDialog.item?.name ?? "item"}
      />
    </div>
  );
}