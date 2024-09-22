import { redirect } from "next/navigation";

export const serverRedirectWithMessage = (
  type: "success" | "error",
  message: string,
  redirectTo?: string,
) => {
  if (type === "success") {
    redirect(
      (redirectTo ?? "/dashboard") +
        "?success=true&message=" +
        encodeURIComponent(message),
    );
  } else if (type === "error") {
    redirect(
      (redirectTo ?? "/dashboard") +
        "?error=true&message=" +
        encodeURIComponent(message),
    );
  }
};
