import { TransactionType } from "@prisma/client";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";

export type TransactionPercentagePerType = {
  [key in TransactionType]: number;
};

export interface TotalExpensePerCategory {
  category: keyof typeof TRANSACTION_CATEGORY_LABELS; // ✅ tipo correto
  totalAmount: number;
  percentageOfTotal: number;
}
