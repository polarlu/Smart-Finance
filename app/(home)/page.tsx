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
import { ScrollArea } from "../_components/ui/scroll-area";

interface HomeProps {
  searchParams?: {
    month?: string;
  };
}

export const dynamic = "force-dynamic";

const Home = async ({ searchParams }: HomeProps) => {
  const rawMonth = (searchParams?.month ?? "").toString();
  const parsedMonth = Number(rawMonth);
  const monthNumber =
    !rawMonth || Number.isNaN(parsedMonth)
      ? new Date().getMonth() + 1
      : parsedMonth;
  const month = String(
    monthNumber >= 1 && monthNumber <= 12
      ? monthNumber
      : new Date().getMonth() + 1,
  ).padStart(2, "0");

  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const dashboard = await getDashboard({ month });
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await currentUser();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
          {/* Header Section - Layout Diferente para Mobile */}
          <div className="space-y-3 sm:space-y-0">
            {/* Mobile: Dashboard + TimeSelect na mesma linha */}
            <div className="flex items-center justify-between sm:hidden">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <TimeSelect />
            </div>

            {/* Mobile: AiReportButton abaixo */}
            <div className="sm:hidden">
              <AiReportButton
                month={month}
                haspremiumPlan={
                  user?.publicMetadata?.subscriptionPlan === "premium"
                }
              />
            </div>

            {/* Desktop/Tablet: Layout Original */}
            <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold lg:text-3xl">Dashboard</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <AiReportButton
                  month={month}
                  haspremiumPlan={
                    user?.publicMetadata?.subscriptionPlan === "premium"
                  }
                />
                <TimeSelect />
              </div>
            </div>
          </div>

          {/* Layout Mobile-First com Grid Responsivo */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Coluna Principal */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Summary Cards */}
              <SummaryCards
                month={month}
                {...dashboard}
                userCanAddTransaction={userCanAddTransaction}
              />

              {/* Grid de Gráficos - Mobile: empilhado, Tablet: 2 cols, Desktop: 3 cols */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                <TransactionsPieChart
                  typesPercentage={dashboard.transactionCountByType}
                  depositsTotal={dashboard.depositsTotal}
                  investmentsTotal={dashboard.investmentsTotal}
                  expensesTotal={dashboard.expensesTotal}
                />
                <div className="sm:col-span-2 lg:col-span-2">
                  <ExpencesPerCategory
                    expensesPerCategory={dashboard.totalExpensePerCategory}
                  />
                </div>
              </div>
            </div>

            {/* Coluna de Transações - Mobile: abaixo, Desktop: lateral */}
            <div className="order-last lg:order-none">
              <LastTransactions lastTransactions={dashboard.lastTransactions} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Home;
