import { SQS } from "aws-sdk";
import { env } from "~/env.mjs";

export const queueUserIdsToProcessing = async (userIds: string[]) => {
  const sqsClient = new SQS({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  for (const userId of userIds) {
    try {
      await sqsClient
        .sendMessage({
          QueueUrl: env.SQS_SHORTS_PROCESSOR_QUEUE_URL,
          MessageBody: JSON.stringify({
            userId: userId,
          }),
        })
        .promise();
    } catch (error) {
      console.error(`Failed to send message for user ${userId}:`, error);
    }
  }
};
