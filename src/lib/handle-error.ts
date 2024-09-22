import { serverRedirectWithMessage } from "./server-redirect";

export const handleError = (
  logMessage: string,
  error: any,
  handle: "redirect" | "throw",
  customUserMessage?: string,
) => {
  if (handle === "redirect") {
    console.error(logMessage + ". Error" + JSON.stringify(error, null, 2));

    serverRedirectWithMessage(
      "error",
      customUserMessage ?? "Animation generation failed. Try again later.",
    );
  }
  if (handle === "throw") {
    throw new Error(logMessage + ". Error" + JSON.stringify(error, null, 2));
  }
};
