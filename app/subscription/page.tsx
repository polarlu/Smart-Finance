import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMounthTransactions } from "../data/get-current-mounth-transactions";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const user = await (await clerkClient()).users.getUser(userId);
  const currentMounthTransactions = await getCurrentMounthTransactions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  return (
    <>
      <Navbar />
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">Assinatura</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Card Plano Básico */}
          <Card className="w-full sm:w-[450px]">
            <CardHeader className="border-b border-solid px-4 py-6 sm:py-8">
              <h2 className="text-center text-xl font-semibold sm:text-2xl">
                Plano Básico
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">R$</span>
                <span className="text-5xl font-semibold sm:text-6xl">0</span>
                <div className="text-xl text-muted-foreground sm:text-2xl">
                  /mês
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-6 sm:space-y-6 sm:py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                <p className="text-sm sm:text-base">
                  Apenas 10 transações por mês ({currentMounthTransactions}/10)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <p className="text-sm sm:text-base">Relatórios por IA</p>
              </div>
            </CardContent>
          </Card>

          {/* Card Plano Premium */}
          <Card className="w-full sm:w-[450px]">
            <CardHeader className="relative border-b border-solid px-4 py-6 sm:py-8">
              {hasPremiumPlan && (
                <Badge className="absolute left-3 top-3 bg-primary/10 text-xs text-primary sm:left-4 sm:top-12 sm:text-sm">
                  Ativo
                </Badge>
              )}
              <h2 className="text-center text-xl font-semibold sm:text-2xl">
                Plano Premium
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">R$</span>
                <span className="text-5xl font-semibold sm:text-6xl">19</span>
                <div className="text-xl text-muted-foreground sm:text-2xl">
                  /mês
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-6 sm:space-y-6 sm:py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                <p className="text-sm sm:text-base">Transações ilimitadas</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                <p className="text-sm sm:text-base">Relatórios por IA</p>
              </div>
              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
