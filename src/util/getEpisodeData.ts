import { EpisodeData } from '@dottjt/datareade';

export const getEpisodeData = (episodeData: EpisodeData): any => {
  const title = episodeData.title;
  const content = episodeData.content;
  const description = episodeData.description;
  const publishDate = episodeData.publishDate.replace('+', '.888+');
  const tags = episodeData.tags;
  return {
    title,
    content,
    description,
    publishDate,
    tags
  }
}