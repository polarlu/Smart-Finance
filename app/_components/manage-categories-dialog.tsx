// app/_components/manage-categories-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PlusIcon, TrashIcon, SettingsIcon } from "lucide-react";
import { useCustomCategories } from "./manage-category";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface ManageCategoriesDialogProps {
  onCategoryAdded?: (value: string) => void;
}

export const ManageCategoriesDialog = ({
  onCategoryAdded,
}: ManageCategoriesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { customCategories, addCategory, removeCategory } =
    useCustomCategories();

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      toast.error("Digite o nome da categoria");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Nome da categoria deve ter pelo menos 2 caracteres");
      return;
    }

    const exists = customCategories.some(
      (cat) => cat.label.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (exists) {
      toast.error("Essa categoria já existe");
      return;
    }

    const value = addCategory(trimmedName);
    setNewCategoryName("");
    toast.success("Categoria adicionada com sucesso!");

    // A lista será atualizada automaticamente via useEffect no hook!
    if (onCategoryAdded) {
      onCategoryAdded(value);
    }
  };

  const handleRemoveCategory = (value: string, label: string) => {
    removeCategory(value);
    toast.success(`Categoria "${label}" removida`);
    // A lista será atualizada automaticamente via useEffect no hook!
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Gerenciar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription>
            Adicione ou remova categorias personalizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Adicionar Nova Categoria */}
          <div className="space-y-2">
            <Label htmlFor="new-category">Nova Categoria</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                placeholder="Ex: Freelance, Pet, Viagens..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="button"
                onClick={handleAddCategory}
                size="sm"
                className="gap-1.5 whitespace-nowrap"
              >
                <PlusIcon className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de Categorias Customizadas */}
          {customCategories.length > 0 && (
            <div className="space-y-2">
              <Label>
                Categorias Personalizadas ({customCategories.length})
              </Label>
              <ScrollArea className="h-[240px] rounded-md border p-3">
                <div className="space-y-2">
                  {customCategories.map((category) => (
                    <div
                      key={category.value}
                      className="flex items-center justify-between rounded-lg border bg-card p-2.5 transition-colors hover:bg-muted"
                    >
                      <Badge variant="secondary" className="font-normal">
                        {category.label}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveCategory(category.value, category.label)
                        }
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {customCategories.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria personalizada ainda.
                <br />
                Adicione uma acima para começar!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
