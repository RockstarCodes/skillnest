"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";

type Video = {
  id: number;
  title: string;
  youtube_url: string;
};

type Section = {
  id: number;
  title: string;
  videos: Video[];
};

export default function SubjectPage({ params }: any) {
  const { subjectId } = params;

  const [sections, setSections] = useState<Section[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch(`https://skillnest-api.onrender.com/api/subjects/${subjectId}/tree`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections);

        if (data.sections?.[0]?.videos?.[0]) {
          setCurrentVideo(data.sections[0].videos[0]);
        }
      });
  }, [subjectId]);

  return (
    <div className="max-w-6xl mx-auto py-10 flex gap-8">

      {/* Sidebar */}
      <div className="w-64 border rounded-lg p-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            {section.videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className="cursor-pointer text-sm mb-2 hover:underline"
              >
                {video.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Video Area */}
      <div className="flex-1">
        {currentVideo && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {currentVideo.title}
            </h2>

            <VideoPlayer youtubeUrl={currentVideo.youtube_url} />
          </>
        )}
      </div>
    </div>
  );
}