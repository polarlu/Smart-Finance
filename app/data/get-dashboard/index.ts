import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";
import type {
  TotalExpensePerCategory,
  TransactionPercentagePerType,
} from "./types";

interface GetDashboardParams {
  month: string;
}

export const getDashboard = async ({ month }: GetDashboardParams) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const year = new Date().getFullYear();
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(year, Number(month), 0);
  endDate.setHours(23, 59, 59, 999);

  const where = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )._sum.amount ?? 0,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )._sum.amount ?? 0,
  );

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )._sum.amount ?? 0,
  );

  const balance = depositsTotal - expensesTotal - investmentsTotal;

  const transactionCountByTypeRaw = await db.transaction.groupBy({
    by: ["type"],
    _count: { _all: true },
    where,
  });

  const transactionCountByType: TransactionPercentagePerType =
    TRANSACTION_TYPE_OPTIONS.reduce(
      (acc, option) => ({
        ...acc,
        [option.value]: 0,
      }),
      {} as TransactionPercentagePerType,
    );

  const totalTransactions = transactionCountByTypeRaw.reduce(
    (acc, item) => acc + item._count._all,
    0,
  );

  transactionCountByTypeRaw.forEach((item) => {
    const percentage =
      totalTransactions === 0
        ? 0
        : Number(((item._count._all / totalTransactions) * 100).toFixed(2));

    transactionCountByType[item.type] = percentage;
  });

  // ✅ Agora o percentual da categoria é calculado em relação à RECEITA TOTAL (depositsTotal)
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where: {
        ...where,
        type: "EXPENSE",
      },
    })
  ).map((item) => ({
    category: item.category as keyof typeof TRANSACTION_CATEGORY_LABELS,
    totalAmount: Number(item._sum.amount ?? 0),
    percentageOfTotal:
      depositsTotal === 0
        ? 0
        : Number(
            ((Number(item._sum.amount ?? 0) / depositsTotal) * 100).toFixed(2),
          ),
  }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    transactionCountByType,
    totalExpensePerCategory,
    lastTransactions,
  };
};
