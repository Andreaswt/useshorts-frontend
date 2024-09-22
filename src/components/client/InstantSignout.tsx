import { signOut } from "next-auth/react";
import { useEffect } from "react";

export const InstantSignout = () => {
  useEffect(() => {
    const run = async () => {
      await signOut({ callbackUrl: "/login" });
    };

    run();
  });

  return <></>;
};
