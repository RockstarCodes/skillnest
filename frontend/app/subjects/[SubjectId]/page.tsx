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

export default function Page({
  params,
}: {
  params: { subjectId: string };
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch(
      `https://skillnest-api.onrender.com/api/subjects/${params.subjectId}/tree`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.sections || data.sections.length === 0) {
          console.warn("No sections returned");
          return;
        }

        setSections(data.sections);

        const firstSection = data.sections[0];

        if (firstSection.videos && firstSection.videos.length > 0) {
          setCurrentVideo(firstSection.videos[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load subject:", err);
      });
  }, [params.subjectId]);

  return (
    <div className="max-w-6xl mx-auto py-10 flex gap-8">
      
      {/* Sidebar */}
      <div className="w-64 border rounded-lg p-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            {section.videos?.map((video) => (
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
        {currentVideo ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {currentVideo.title}
            </h2>

            <VideoPlayer youtubeUrl={currentVideo.youtube_url} />
          </>
        ) : (
          <p>Select a lesson to begin.</p>
        )}
      </div>
    </div>
  );
}