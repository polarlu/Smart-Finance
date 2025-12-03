"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  try {
    // 1. Validação do input
    generateAiReportSchema.parse({ month });

    // 2. Autenticação
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 3. Verifica plano premium
    const user = await clerkClient.users.getUser(userId);
    const hasPremiumPlan = user.publicMetadata?.subscriptionPlan === "premium";
    if (!hasPremiumPlan) {
      throw new Error(
        "Você precisa de um plano premium para gerar relatórios com IA.",
      );
    }

    // 4. Datas do mês
    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, Number(month), 0);
    endDate.setHours(23, 59, 59, 999);

    // 5. Buscar transações do usuário
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

    // 6. Montar prompt
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
2. Análise por categorias (quais mais gastam, quais mais recebem).
3. Principais pontos de atenção.
4. Recomendações práticas e personalizadas para o próximo mês.
5. Sugestão de metas financeiras.

Formate a resposta em Markdown, usando títulos, listas e emojis.
`;

    // 7. Chamar Gemini
    console.log("GEMINI_API_KEY definida?", !!GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // ✅ Use APENAS esse modelo por enquanto
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Resposta da IA (primeiros 100 chars):", text?.slice(0, 100));

    if (!text) {
      console.error(
        "Gemini retornou resposta vazia:",
        JSON.stringify(response, null, 2),
      );
      return "A IA não conseguiu gerar o relatório neste momento. Tente novamente em alguns instantes.";
    }

    return text;
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      status?: number;
      statusText?: string;
      errorDetails?: unknown;
    };

    console.error("Erro em generateAiReport (detalhado):", {
      message: err.message,
      status: err.status,
      statusText: err.statusText,
      errorDetails: err.errorDetails,
    });

    return `Ocorreu um erro ao gerar o relatório com IA: ${
      err.message ?? "erro desconhecido"
    }`;
  }
};
