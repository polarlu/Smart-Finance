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
import { BotIcon, SparklesIcon } from "lucide-react";

const AiReportButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-primary/40 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 px-4 py-2 text-xs font-semibold text-primary shadow-sm transition hover:from-primary/20 hover:to-primary/20 hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <BotIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Relatório com IA
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/80 sm:text-[11px]">
            Em breve
            <SparklesIcon className="h-3 w-3" />
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[520px] border border-white/5 bg-gradient-to-b from-zinc-950/95 via-zinc-950 to-zinc-950/95 px-5 py-6 shadow-xl shadow-black/40 sm:px-7 sm:py-7">
        <DialogHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
            <SparklesIcon className="h-3.5 w-3.5" />
            Novidade em breve
          </div>

          <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Relatórios inteligentes com IA
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed text-zinc-400">
            Em breve, você poderá gerar um resumo inteligente das suas finanças
            com apenas um clique. A IA vai analisar suas transações e criar um
            relatório claro, visual e fácil de entender.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            O que você poderá fazer
          </p>

          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              <span>
                Receber um resumo automático das suas receitas, despesas e saldo
                do mês.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400/80" />
              <span>
                Ver insights sobre categorias com maior impacto no seu
                orçamento.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400/80" />
              <span>
                Receber recomendações personalizadas para organizar melhor suas
                finanças.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs text-zinc-400 sm:text-sm">
          No momento, essa funcionalidade está em desenvolvimento. Assim que
          estiver disponível, você poderá acessá-la diretamente aqui, sem
          precisar configurar nada.
        </div>

        <DialogFooter className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full rounded-full border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 sm:w-auto"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
