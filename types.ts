
export interface EpisodeData {
  id: string;
  title: string;
  type: 'Guest' | 'Solo';
  playCount: number;
  commentCount: number;
}

export type MetricType = 'playCount' | 'commentCount';
