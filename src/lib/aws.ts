import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../env.mjs";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export const getFileUrl = (key: string) => {
  return `https://${env.SHORTS_AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

export const getS3Client = () => {
  return new S3Client({
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    region: env.AWS_REGION,
  });
};

const getUserIdClips = async (userId: string) => {
  const s3Client = getS3Client();
  const bucketName = env.SHORTS_AWS_BUCKET_NAME;
  const prefix = `useshorts-clips/${userId}/`;

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });
    const response = await s3Client.send(command);

    if (response.Contents) {
      const validClips = response.Contents.filter(
        (clip) => clip.LastModified && clip.Key,
      );

      const sortedClips = validClips.sort(
        (a, b) => b.LastModified!.getTime() - a.LastModified!.getTime(),
      );

      const lastTenClips = sortedClips.slice(0, 10);

      const clipUrls = lastTenClips.map((clip) => getFileUrl(clip.Key!));

      return clipUrls;
    }

    return [];
  } catch (error) {
    console.error("Error fetching user clips:", error);
    return [];
  }
};
