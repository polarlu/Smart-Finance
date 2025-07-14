import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.BANK_TRANSFER]: "bank-transfer",
  [TransactionPaymentMethod.CREDIT_CARD]: "credit-card",
  [TransactionPaymentMethod.BANK_SLIP]: "bank-slip",
  [TransactionPaymentMethod.CASH]: "cash",
  [TransactionPaymentMethod.PIX]: "pix",
  [TransactionPaymentMethod.DEBIT_CARD]: "debit-card",
  [TransactionPaymentMethod.OTHER]: "other",
};

export const TRANSACTION_CATEGORY_LABELS = {
  EDUCATION: "Educação",
  FOOD: "Alimentação",
  HEALTH: "Saúde",
  HOUSING: "Moradia",
  ENTERTAINMENT: "Entretenimento",
  TRANSPORTATION: "Transporte",
  UTILITY: "Utilidades",
  OUTHER: "Outros",
  SALARY: "Salário",
};

export const TRANSACTIONS_PAYMENT_METHODS_LABELS = {
  BANK_TRANSFER: "Transferência Bancária",
  CREDIT_CARD: "Cartão de Crédito",
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  PIX: "PIX",
  DEBIT_CARD: "Cartão de Débito",
  OTHER: "Outro",
};

export const TRANSACTIONS_TYPE_OPTIONS = [
  {
    value: TransactionType.EXPENSE,
    label: "Despesa",
  },
  {
    value: TransactionType.DEPOSIT,
    label: "Depósito",
  },
  {
    value: TransactionType.INVESTMENT,
    label: "Investimento",
  },
];

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
  {
    value: TransactionPaymentMethod.BANK_TRANSFER,
    label:
      TRANSACTIONS_PAYMENT_METHODS_LABELS[
        TransactionPaymentMethod.BANK_TRANSFER
      ],
  },
  {
    value: TransactionPaymentMethod.CREDIT_CARD,
    label:
      TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.CREDIT_CARD],
  },
  {
    value: TransactionPaymentMethod.BANK_SLIP,
    label:
      TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.BANK_SLIP],
  },
  {
    value: TransactionPaymentMethod.CASH,
    label: TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.CASH],
  },
  {
    value: TransactionPaymentMethod.PIX,
    label: TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.PIX],
  },
  {
    value: TransactionPaymentMethod.DEBIT_CARD,
    label:
      TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.DEBIT_CARD],
  },
  {
    value: TransactionPaymentMethod.OTHER,
    label: TRANSACTIONS_PAYMENT_METHODS_LABELS[TransactionPaymentMethod.OTHER],
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: TransactionCategory.EDUCATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.EDUCATION],
  },
  {
    value: TransactionCategory.ENTERTAINMENT,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ENTERTAINMENT],
  },
  {
    value: TransactionCategory.FOOD,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.FOOD],
  },
  {
    value: TransactionCategory.HEALTH,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HEALTH],
  },
  {
    value: TransactionCategory.HOUSING,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HOUSING],
  },
  {
    value: TransactionCategory.SALARY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.SALARY],
  },
  {
    value: TransactionCategory.TRANSPORTATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.TRANSPORTATION],
  },
  {
    value: TransactionCategory.UTILITY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.UTILITY],
  },
];
