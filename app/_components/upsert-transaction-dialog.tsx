"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { DialogClose } from "@radix-ui/react-dialog";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertTransaction } from "../_actions/upsert-transactions";
import { useCustomCategories } from "../transactions/_actions/use-custom-categories";
import { useMemo, useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import {
  Dialog as AddCategoryDialog,
  DialogContent as AddCategoryDialogContent,
  DialogDescription as AddCategoryDialogDescription,
  DialogHeader as AddCategoryDialogHeader,
  DialogTitle as AddCategoryDialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  transactionId?: string;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: FormSchema;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório",
    })
    .positive({
      message: "Insira um valor",
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório",
  }),
  category: z.string().min(1, {
    message: "A categoria é obrigatória",
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório",
  }),
  date: z.date({
    required_error: "A data é obrigatória",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

interface CategoryOption {
  value: string;
  label: string;
  disabled?: boolean;
  isCustom?: boolean;
}

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  transactionId,
  defaultValues,
}: UpsertTransactionDialogProps) => {
  const { customCategories, addCategory, removeCategory } =
    useCustomCategories();
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      amount: 0,
      category: "OTHER",
      date: new Date(),
      name: "",
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertTransaction({ ...data, id: transactionId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

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
    setAddCategoryDialogOpen(false);
    toast.success("Categoria adicionada com sucesso!");

    form.setValue("category", value);
  };

  const handleDeleteCategory = (value: string, label: string) => {
    removeCategory(value);
    toast.success(`Categoria "${label}" removida`);

    if (form.getValues("category") === value) {
      form.setValue("category", "OTHER");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const isUpdate = Boolean(transactionId);

  const allCategories = useMemo((): CategoryOption[] => {
    const standardCategories: CategoryOption[] =
      TRANSACTION_CATEGORY_OPTIONS.map((cat) => ({
        value: cat.value,
        label: cat.label,
        disabled: false,
        isCustom: false,
      }));

    const customOptions: CategoryOption[] = customCategories.map((cat) => ({
      value: cat.value,
      label: cat.label,
      disabled: false,
      isCustom: true,
    }));

    return [...standardCategories, ...customOptions];
  }, [customCategories]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild />
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isUpdate ? "Atualizar" : "Criar"} Transação
            </DialogTitle>
            <DialogDescription>Insira as informações abaixo</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Digite o valor"
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um método de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* ✅ Lista unificada - categorias padrão e customizadas juntas */}
                        {allCategories.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-accent"
                            onClick={() => {
                              if (!option.isCustom) {
                                field.onChange(option.value);
                              }
                            }}
                          >
                            <SelectItem
                              value={option.value}
                              disabled={option.disabled}
                              className="flex-1 border-0 p-0"
                            >
                              {option.label}
                            </SelectItem>

                            {/* ✅ Botão de deletar apenas para customizadas */}
                            {option.isCustom && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteCategory(
                                    option.value,
                                    option.label,
                                  );
                                }}
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {/* Botão para adicionar nova categoria */}
                        <div className="sticky bottom-0 border-t bg-background p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start gap-2 text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.preventDefault();
                              setAddCategoryDialogOpen(true);
                            }}
                          >
                            <PlusIcon className="h-4 w-4" />
                            Adicionar nova categoria
                          </Button>
                        </div>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {isUpdate ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar categoria */}
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onOpenChange={setAddCategoryDialogOpen}
      >
        <AddCategoryDialogContent className="sm:max-w-md">
          <AddCategoryDialogHeader>
            <AddCategoryDialogTitle>Nova Categoria</AddCategoryDialogTitle>
            <AddCategoryDialogDescription>
              Adicione uma categoria personalizada
            </AddCategoryDialogDescription>
          </AddCategoryDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome da Categoria</Label>
              <Input
                id="category-name"
                placeholder="Ex: Freelance, Pet, Viagens..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddCategoryDialogOpen(false);
                  setNewCategoryName("");
                }}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddCategory}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </AddCategoryDialogContent>
      </AddCategoryDialog>
    </>
  );
};

export default UpsertTransactionDialog;
