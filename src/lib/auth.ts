import { currentUser } from "@clerk/nextjs/server";

export async function requirePremiumUser() {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  const isPremium = user.publicMetadata?.plan === "premium";

  if (!isPremium) {
    throw new Error("Premium required");
  }

  return user;
}
