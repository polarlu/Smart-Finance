import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/data/get-dashboard/types";
import { Progress } from "@radix-ui/react-progress";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ExpensesPerCategoryProps {
  expensesperCategory: TotalExpensePerCategory[];
}

const ExpencesPerCategory = ({
  expensesperCategory,
}: ExpensesPerCategoryProps) => {
  return (
    <ScrollArea className="col-span-2 h-full rounded-md border pb-6">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {expensesperCategory.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex w-full justify-between">
              <p className="text-sm font-bold">
                {TRANSACTION_CATEGORY_LABELS[category.category]}
              </p>
              <p className="text-sm font-bold">{category.percentageOfTotal}</p>
            </div>
            <Progress value={category.percentageOfTotal} />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpencesPerCategory;
