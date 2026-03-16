"use client";

type Props = {
  youtubeUrl: string;
};

export default function VideoPlayer({ youtubeUrl }: Props) {
  const videoId = youtubeUrl.split("v=")[1];

  return (
    <div className="w-full aspect-video">
      <iframe
        className="w-full h-full rounded"
        src={`https://www.youtube.com/embed/${videoId}`}
        allowFullScreen
      />
    </div>
  );
}