import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export const userFromSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No session found");

  return session.user;
};
