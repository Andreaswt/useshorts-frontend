"use client";

export const ClientVideo = ({ url }: { url: string }) => {
  return (
    <video controls className="h-full w-full rounded-md object-cover">
      <source src={url ?? undefined} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
