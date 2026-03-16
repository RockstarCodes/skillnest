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
  const [sections, setSections] = useState<Section[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch(
      `https://skillnest-api.onrender.com/api/subjects/${params.subjectId}/tree`
    )
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections);

        if (data.sections[0]?.videos[0]) {
          setCurrentVideo(data.sections[0].videos[0]);
        }
      });
  }, [params.subjectId]);

  return (
    <div className="flex max-w-6xl mx-auto py-10 gap-8">
      {/* Sidebar */}
      <div className="w-64 border rounded p-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            {section.videos.map((video) => (
              <div
                key={video.id}
                className="cursor-pointer text-sm mb-1 hover:underline"
                onClick={() => setCurrentVideo(video)}
              >
                {video.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Video Player */}
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