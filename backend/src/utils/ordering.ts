export type OrderedSection = {
  id: number;
  order_index: number;
  videos: Array<{ id: number; order_index: number }>;
};

export type OrderedTree = {
  subjectId: number;
  sections: OrderedSection[];
};

export type VideoNeighbors = {
  previous_video_id: number | null;
  next_video_id: number | null;
};

/**
 * Deterministically computes neighbors based on:
 * - sections.order_index (ascending)
 * - videos.order_index (ascending)
 * - stable id tiebreakers
 */
export function computeVideoNeighbors(tree: OrderedTree, videoId: number): VideoNeighbors {
  const flattened = tree.sections
    .slice()
    .sort((a, b) => a.order_index - b.order_index || a.id - b.id)
    .flatMap((section) =>
      section.videos
        .slice()
        .sort((a, b) => a.order_index - b.order_index || a.id - b.id)
        .map((v) => v.id)
    );

  const idx = flattened.indexOf(videoId);
  if (idx === -1) {
    return { previous_video_id: null, next_video_id: null };
  }

  return {
    previous_video_id: idx > 0 ? flattened[idx - 1] : null,
    next_video_id: idx < flattened.length - 1 ? flattened[idx + 1] : null
  };
}

