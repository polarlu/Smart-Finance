"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-report";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface AiReportButtonProps {
  haspremiumPlan: boolean;
  month: string;
}

const AiReportButton = ({ month, haspremiumPlan }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setReportIsLoading(true);
      const aiReport = await generateAiReport({ month });
      setReport(aiReport);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          Relatório AI
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {/* ✅ CORRIGIDO - Se TEM premium, mostra o relatório */}
        {haspremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório de IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar relatórios detalhados
                sobre suas finanças.
              </DialogDescription>
            </DialogHeader>
            {report && (
              <ScrollArea className="max-h-[450px] max-w-full rounded-md border p-6">
                <div className="prose max-w-none prose-headings:text-white prose-p:text-gray-200 prose-strong:text-gray-100 prose-li:text-gray-200">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
              </ScrollArea>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleGenerateReport} disabled={reportIsLoading}>
                {reportIsLoading && <Loader2Icon className="animate-spin" />}
                Gerar Relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          // ✅ CORRIGIDO - Se NÃO tem premium, mostra mensagem para assinar
          <>
            <DialogHeader>
              <DialogTitle>Relatório de IA</DialogTitle>
              <DialogDescription>
                Você precisa ser um usuário premium para gerar relatórios com
                IA.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar plano Premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
