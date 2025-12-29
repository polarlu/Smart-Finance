import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/data/get-dashboard/types";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  return (
    <ScrollArea className="col-span-2 h-full rounded-xl border border-zinc-800 bg-zinc-950/60 pb-6">
      <CardHeader className="border-b border-zinc-800 pb-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-zinc-100">
          Gastos por categoria
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {expensesPerCategory.length === 0 && (
          <p className="text-sm text-zinc-500">
            Ainda não há despesas registradas neste período.
          </p>
        )}

        {expensesPerCategory.map((category) => {
          const label =
            TRANSACTION_CATEGORY_LABELS[
              category.category as keyof typeof TRANSACTION_CATEGORY_LABELS
            ] ?? category.category; // fallback para categorias customizadas

          return (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {label}
                </p>

                <p className="text-xs font-semibold text-zinc-400">
                  {category.percentageOfTotal.toFixed(1).replace(".", ",")}%
                </p>
              </div>

              <Progress
                value={category.percentageOfTotal}
                className="h-2 overflow-hidden rounded-full bg-zinc-900"
              />
            </div>
          );
        })}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpensesPerCategory;
