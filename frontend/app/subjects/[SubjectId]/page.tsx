"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

export default function SubjectPage() {
  const params = useParams();

  const subjectIdRaw = params?.subjectId;

  const subjectId = Array.isArray(subjectIdRaw)
    ? subjectIdRaw[0]
    : subjectIdRaw;

  const [sections, setSections] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  useEffect(() => {
    if (!subjectId) return;

    console.log("Subject ID:", subjectId);

    fetch(`https://skillnest-api.onrender.com/api/subjects/${subjectId}/tree`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);

        if (!data.sections) return;

        setSections(data.sections);

        if (data.sections[0]?.videos?.[0]) {
          setCurrentVideo(data.sections[0].videos[0]);
        }
      })
      .catch(console.error);
  }, [subjectId]);

  return (
    <div className="max-w-6xl mx-auto py-10 flex gap-8">

      {/* Sidebar */}
      <div className="w-64 border rounded-lg p-4">
        {sections.length === 0 && <p>No lessons yet</p>}

        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            {section.videos?.map((video: any) => (
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

      {/* Video Player */}
      <div className="flex-1">
        {currentVideo ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {currentVideo.title}
            </h2>

            <VideoPlayer youtubeUrl={currentVideo.youtube_url} />
          </>
        ) : (
          <p>Select a lesson</p>
        )}
      </div>

    </div>
  );
}