import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { env } from "~/env.mjs";

declare const global: Global & { bedrock?: AnthropicBedrock };

export let bedrock: AnthropicBedrock;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    bedrock = new AnthropicBedrock({
      awsAccessKey: env.AWS_ACCESS_KEY_ID,
      awsSecretKey: env.AWS_SECRET_ACCESS_KEY,
      awsRegion: env.AWS_REGION,
    });
  } else {
    if (!global.bedrock) {
      global.bedrock = new AnthropicBedrock({
        awsAccessKey: env.AWS_ACCESS_KEY_ID,
        awsSecretKey: env.AWS_SECRET_ACCESS_KEY,
        awsRegion: env.AWS_REGION,
      });
    }
    bedrock = global.bedrock;
  }
}
