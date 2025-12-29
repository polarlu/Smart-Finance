"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: "#55B02E",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#E93030",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: "#FFFFFF",
    },
  ];

  const total = depositsTotal + expensesTotal + investmentsTotal;

  const incomePercentage =
    total === 0 ? 0 : Number(((depositsTotal / total) * 100).toFixed(2));

  const expensePercentage =
    total === 0 ? 0 : Number(((expensesTotal / total) * 100).toFixed(2));

  const investmentPercentage =
    total === 0 ? 0 : Number(((investmentsTotal / total) * 100).toFixed(2));

  return (
    <Card>
      <ScrollArea className="col-span-2 flex h-full flex-col rounded-md border p-5 pb-6">
        <CardTitle className="font-bold">Resumo por Gráfico</CardTitle>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>

          <div className="space-y-3">
            <PercentageItem
              icon={<TrendingUpIcon size={16} className="text-primary" />}
              title="Receita"
              value={incomePercentage}
            />
            <PercentageItem
              icon={<TrendingDownIcon size={16} className="text-red-500" />}
              title="Despesas"
              value={expensePercentage}
            />
            <PercentageItem
              icon={<PiggyBankIcon size={16} />}
              title="Investido"
              value={investmentPercentage}
            />
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default TransactionsPieChart;
