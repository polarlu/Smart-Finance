// app/(home)/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../data/get-dashboard";
import ExpencesPerCategory from "./_components/expences-per-category";
import TimeSelect from "./_components/time-select";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams?: {
    month?: string;
  };
}

export const dynamic = "force-dynamic"; // força execução dinâmica (evita coleta de dados no build)

const Home = async ({ searchParams }: HomeProps) => {
  // lê mês dos query params; normaliza para 'MM' (01..12)
  const rawMonth = (searchParams?.month ?? "").toString();
  const parsedMonth = Number(rawMonth);
  const monthNumber =
    !rawMonth || Number.isNaN(parsedMonth)
      ? new Date().getMonth() + 1
      : parsedMonth;
  // garante string com 1..12 (se inválido, usa mês atual)
  const month = String(
    monthNumber >= 1 && monthNumber <= 12
      ? monthNumber
      : new Date().getMonth() + 1,
  ).padStart(2, "0");

  // autenticação
  const { userId } = await auth();
  if (!userId) {
    // se não estiver logado, redireciona para login
    redirect("/login");
  }

  // busca dados do dashboard (getDashboard já trata usuário ausente durante o build)
  const dashboard = await getDashboard(month);

  // verifica se o usuário pode adicionar transação
  const userCanAddTransaction = await canUserAddTransaction();

  // pega info do usuário (currentUser é preferível para Server Components)
  const user = await currentUser();

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <AiReportButton
              month={month}
              haspremiumPlan={
                user?.publicMetadata?.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>

        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />

            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpencesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>

          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
