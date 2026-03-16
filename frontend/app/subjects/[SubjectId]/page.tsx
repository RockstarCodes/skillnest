"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subjectId;

  const [sections, setSections] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    if (!subjectId) return;

    fetch(`https://skillnest-api.onrender.com/api/subjects/${subjectId}/tree`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);

        if (data.sections?.[0]?.videos?.[0]) {
          setCurrentVideo(data.sections[0].videos[0]);
        }
      });
  }, [subjectId]);

  return (
    <div className="max-w-6xl mx-auto py-10 flex gap-8">

      <div className="w-64 border rounded-lg p-4">
        {sections.map((section) => (
          <div key={section.id}>
            <h3 className="font-semibold">{section.title}</h3>

            {section.videos?.map((video) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className="cursor-pointer text-sm hover:underline"
              >
                {video.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex-1">
        {currentVideo ? (
          <VideoPlayer youtubeUrl={currentVideo.youtube_url} />
        ) : (
          <p>Select a lesson</p>
        )}
      </div>

    </div>
  );
}