import { auth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentMounthTransactions } from "../get-current-mounth-transactions";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorizes");
  }
  const user = await clerkClient().users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan === "premium") {
    return true;
  }
  const currentmounthtransactions = await getCurrentMounthTransactions();
  if (currentmounthtransactions >= 10) {
    return false;
  }
  return true;
};
