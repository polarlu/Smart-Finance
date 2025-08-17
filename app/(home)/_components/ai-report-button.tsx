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
        {!haspremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório de AI</DialogTitle>
              <DialogDescription>
                Use inteligencia artificial para gerar relatórios detalhados
                sobre suas finanças.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="pross-h4:text-white prose max-h-[450px] text-white prose-h3:text-white prose-strong:text-white">
              <ReactMarkdown>{report ?? ""}</ReactMarkdown>
            </ScrollArea>
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
          <>
            <DialogHeader>
              <DialogTitle>Relatório de AI</DialogTitle>
              <DialogDescription>
                Você precisa ser um usuário premium para gerar relatórios AI.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription"> Assinar plano Premium </Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
