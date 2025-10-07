import { z } from "zod";

export const DeleteTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export type DeleteTransactionSchema = z.infer<typeof DeleteTransactionSchema>;
