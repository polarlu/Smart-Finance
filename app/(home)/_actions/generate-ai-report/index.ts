"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
// ✅ 1. Import da biblioteca oficial do Google
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

// Verificação da API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month }); // Validação do mês recebido
  const { userId } = auth(); // Removido 'await' pois auth() é síncrono no server-side
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to generate AI reports.");
  }

  // ✅ 2. Instanciando o cliente oficial do Gemini
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // Pegar as transações do mês recebido
  const year = new Date().getFullYear(); // Pega o ano atual dinamicamente
  const startDate = new Date(`${year}-${month}-01`);
  // Correção para pegar o último dia do mês corretamente
  const endDate = new Date(year, parseInt(month), 0);
  endDate.setHours(23, 59, 59, 999); // Garante que pegue todo o último dia

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId, // Boa prática: filtrar transações pelo userId também
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (transactions.length === 0) {
    return "Não foram encontradas transações para este mês. Impossível gerar um relatório.";
  }

  // mandar as transações para o gemini e pedir para ele gerar um relatorio com insights
  const promptContent = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira.
  As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA} - {VALOR} - {TIPO} - {CATEGORIA}. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount.toFixed(2)}-${transaction.type}-${transaction.category}`,
    )
    .join(";")}`;

  // ✅ 3. Chamada correta da API do Gemini
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a entenderem melhor suas finanças e a tomarem decisões financeiras mais informadas.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Entendido! Estou pronto para analisar os dados financeiros e fornecer insights valiosos.",
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(promptContent);
  const response = result.response;
  const text = response.text();

  // ✅ 4. Retornando o texto da resposta
  return text;
};
