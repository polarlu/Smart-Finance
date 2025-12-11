"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_BASE_URL =
  process.env.DEEPSEEK_API_BASE_URL ?? "https://api.deepseek.com/v1";

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not defined in environment variables.");
}

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  try {
    generateAiReportSchema.parse({ month });

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await clerkClient.users.getUser(userId);
    const hasPremiumPlan = user.publicMetadata?.subscriptionPlan === "premium";
    if (!hasPremiumPlan) {
      throw new Error(
        "Você precisa de um plano premium para gerar relatórios com IA.",
      );
    }

    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, Number(month), 0);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    if (transactions.length === 0) {
      return "Não foram encontradas transações para este mês. Adicione transações para gerar um relatório.";
    }

    const linhas = transactions.map((t) => {
      const data = t.date.toLocaleDateString("pt-BR");
      const valor = Number(t.amount).toFixed(2);
      return `📅 ${data} | 💰 R$ ${valor} | ${t.type} | ${t.category} | ${t.name}`;
    });

    const prompt = `
Você é um especialista em finanças pessoais. Analise as transações abaixo e gere um relatório completo em português do Brasil.

Transações do mês ${month}/${year}:
${linhas.join("\n")}

O relatório deve conter:
1. Resumo geral de receitas, despesas e saldo.
2. Análise por categorias.
3. Principais pontos de atenção.
4. Recomendações práticas para o próximo mês.
5. Sugestão de metas financeiras.

Formate a resposta em Markdown, usando títulos, listas e emojis.
`;

    // ✅ Chamada à API do DeepSeek (modelo de chat)
    const response = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em finanças pessoais que gera relatórios financeiros claros, detalhados e em português do Brasil.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek status:", response.status, response.statusText);
      console.error("DeepSeek raw body:", errorText);
      throw new Error("Falha ao chamar a API da DeepSeek.");
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("DeepSeek status:", response.status, response.statusText);
      console.error("DeepSeek body:", errorBody);
      throw new Error("Falha ao chamar a API da DeepSeek.");
    }

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      console.error("Erro DeepSeek:", err ?? response.statusText);
      throw new Error("Falha ao chamar a API da DeepSeek.");
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const text = data.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return "A IA não conseguiu gerar o relatório neste momento. Tente novamente em alguns instantes.";
    }

    return text;
  } catch (error: unknown) {
    console.error("Erro em generateAiReport (DeepSeek):", error);
    const msg = (error as { message?: string }).message ?? "erro desconhecido";
    return `Ocorreu um erro ao gerar o relatório com IA: ${msg}`;
  }
};
