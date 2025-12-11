"use client";

import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transactions-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: transaction } }) => (
      <span className="block max-w-[80px] truncate sm:max-w-[120px] md:max-w-none">
        {transaction.name}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    header: "Categoria",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_CATEGORY_LABELS[
        transaction.category as keyof typeof TRANSACTION_CATEGORY_LABELS
      ],
    meta: {
      hideOnMobile: true,
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
    meta: {
      hideOnMobile: true,
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    meta: {
      hideOnMobile: true,
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) => (
      <span className="block text-[10px] font-semibold sm:text-xs md:text-sm">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(transaction.amount))}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="flex items-center gap-0.5 sm:gap-1">
          <EditTransactionButton transaction={transaction} />
          <DeleteTransactionButton transactionId={transaction.id} />
        </div>
      );
    },
  },
];
