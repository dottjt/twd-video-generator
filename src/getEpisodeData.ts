import { EpisodeData } from "./symbolic/types/data";

export const getEpisodeData = (episodeData: EpisodeData): any => {
  const title = episodeData.title;
  const content = episodeData.content;
  const description = episodeData.description;
  const tags = episodeData.tags;
  return {
    title,
    content,
    description,
    tags
  }
}