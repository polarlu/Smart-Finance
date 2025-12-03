// app/transactions/page.tsx
import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../data/can-user-add-transaction";

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6">
          {/* TÍTULO E BOTÃO - RESPONSIVO */}
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <h1 className="text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
              Transações
            </h1>
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>

          {/* TABELA DESKTOP - Visível apenas em desktop */}
          <div className="block">
            <ScrollArea className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
              <DataTable
                columns={transactionsColumns}
                data={JSON.parse(JSON.stringify(transactions))}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
