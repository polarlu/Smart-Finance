// app/_actions/upsert-transactions/index.ts
"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType, TransactionPaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string; // ✅ String, não enum
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // ✅ CORRIGIDO - Lista de categorias padrão como array de strings
  const STANDARD_CATEGORIES = [
    "EDUCATION",
    "ENTERTAINMENT",
    "FOOD",
    "HEALTH",
    "HOUSING",
    "OTHER",
    "SALARY",
    "TRANSPORTATION",
    "UTILITY",
  ];

  // Valida se é uma categoria válida (padrão ou customizada)
  const isStandardCategory = STANDARD_CATEGORIES.includes(params.category);
  const isCustomCategory = params.category.startsWith("CUSTOM_");

  if (!isStandardCategory && !isCustomCategory) {
    throw new Error("Invalid category");
  }

  // Se tem ID, atualiza
  if (params.id) {
    await db.transaction.update({
      where: {
        id: params.id,
        userId,
      },
      data: {
        name: params.name,
        amount: params.amount,
        type: params.type,
        category: params.category, // ✅ Agora é string
        paymentMethod: params.paymentMethod,
        date: params.date,
      },
    });
  } else {
    // Se não tem ID, cria
    await db.transaction.create({
      data: {
        name: params.name,
        amount: params.amount,
        type: params.type,
        category: params.category, // ✅ Agora é string
        paymentMethod: params.paymentMethod,
        date: params.date,
        userId,
      },
    });
  }

  revalidatePath("/transactions");
  revalidatePath("/");
};
