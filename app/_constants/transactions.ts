// app/_constants/transactions.ts
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.CREDIT_CARD]: "credit-card.svg",
  [TransactionPaymentMethod.DEBIT_CARD]: "debit-card.svg",
  [TransactionPaymentMethod.BANK_TRANSFER]: "bank-transfer.svg",
  [TransactionPaymentMethod.BANK_SLIP]: "bank-slip.svg",
  [TransactionPaymentMethod.CASH]: "money.svg",
  [TransactionPaymentMethod.PIX]: "pix.svg",
  [TransactionPaymentMethod.OTHER]: "other.svg",
};

// ✅ Remova a dependência de TransactionCategory enum
export const TRANSACTION_CATEGORY_LABELS = {
  EDUCATION: "Educação",
  ENTERTAINMENT: "Entretenimento",
  FOOD: "Alimentação",
  HEALTH: "Saúde",
  HOUSING: "Moradia",
  OTHER: "Outros",
  SALARY: "Salário",
  TRANSPORTATION: "Transporte",
  UTILITY: "Utilidades",
};

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: "Transferência Bancária",
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  OTHER: "Outros",
  PIX: "Pix",
};

export const TRANSACTION_TYPE_OPTIONS = [
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
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.BANK_TRANSFER],
  },
  {
    value: TransactionPaymentMethod.BANK_SLIP,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.BANK_SLIP],
  },
  {
    value: TransactionPaymentMethod.CASH,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.CASH],
  },
  {
    value: TransactionPaymentMethod.CREDIT_CARD,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.CREDIT_CARD],
  },
  {
    value: TransactionPaymentMethod.DEBIT_CARD,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.DEBIT_CARD],
  },
  {
    value: TransactionPaymentMethod.OTHER,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.OTHER],
  },
  {
    value: TransactionPaymentMethod.PIX,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.PIX],
  },
];

// ✅ CORRIGIDO - Sem importar TransactionCategory
export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: "EDUCATION",
    label: TRANSACTION_CATEGORY_LABELS.EDUCATION,
  },
  {
    value: "ENTERTAINMENT",
    label: TRANSACTION_CATEGORY_LABELS.ENTERTAINMENT,
  },
  {
    value: "FOOD",
    label: TRANSACTION_CATEGORY_LABELS.FOOD,
  },
  {
    value: "HEALTH",
    label: TRANSACTION_CATEGORY_LABELS.HEALTH,
  },
  {
    value: "HOUSING",
    label: TRANSACTION_CATEGORY_LABELS.HOUSING,
  },
  {
    value: "OTHER",
    label: TRANSACTION_CATEGORY_LABELS.OTHER,
  },
  {
    value: "SALARY",
    label: TRANSACTION_CATEGORY_LABELS.SALARY,
  },
  {
    value: "TRANSPORTATION",
    label: TRANSACTION_CATEGORY_LABELS.TRANSPORTATION,
  },
  {
    value: "UTILITY",
    label: TRANSACTION_CATEGORY_LABELS.UTILITY,
  },
];

/**
 * Carrega categorias customizadas do localStorage
 */
export const getCustomCategories = (): Array<{
  value: string;
  label: string;
}> => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("customCategories");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error loading custom categories:", error);
      return [];
    }
  }
  return [];
};

/**
 * Retorna TODAS as categorias: padrão + customizadas
 */
export const getAllCategoryOptions = (): Array<{
  value: string;
  label: string;
}> => {
  return [...TRANSACTION_CATEGORY_OPTIONS, ...getCustomCategories()];
};

/**
 * Obtém o label de uma categoria (padrão ou customizada)
 */
export const getCategoryLabel = (category: string): string => {
  // Primeiro tenta pegar das categorias padrão
  if (
    TRANSACTION_CATEGORY_LABELS[
      category as keyof typeof TRANSACTION_CATEGORY_LABELS
    ]
  ) {
    return TRANSACTION_CATEGORY_LABELS[
      category as keyof typeof TRANSACTION_CATEGORY_LABELS
    ];
  }

  // Se não encontrar, busca nas categorias customizadas
  const customCategories = getCustomCategories();
  const custom = customCategories.find((cat) => cat.value === category);

  if (custom) {
    return `⭐ ${custom.label}`;
  }

  // Se não encontrar em nenhum lugar, retorna o próprio valor
  return category;
};

/**
 * Verifica se uma categoria é customizada
 */
export const isCustomCategory = (category: string): boolean => {
  return category.startsWith("CUSTOM_");
};
