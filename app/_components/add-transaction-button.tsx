"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ NOVO

  // ✅ Garante que componentes com Portal só renderizem no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar transação
              <ArrowDownUpIcon className="ml-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction ? (
              <p>
                Você atingiu o limite de transações. Atualize seu plano para
                criar transações ilimitadas.
              </p>
            ) : (
              <p>Adicionar nova transação</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* ✅ Dialog só renderiza após montar no cliente */}
      {isMounted && (
        <UpsertTransactionDialog
          isOpen={dialogIsOpen}
          setIsOpen={setDialogIsOpen}
        />
      )}
    </>
  );
};

export default AddTransactionButton;
