export interface SubtitleCue {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  duration: number; // in seconds
  videoUrl: string;
  thumbnailUrl?: string;
  isLocked?: boolean;
  requiredCoins?: number;
  subtitles?: {
    en: SubtitleCue[];
    es: SubtitleCue[];
    zh: SubtitleCue[];
  };
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
}

export interface Drama {
  id: string;
  title: string;
  originalTitle?: string;
  coverImage: string;
  backdropImage?: string;
  category: 'Billionaire' | 'Romance' | 'Werewolf' | 'Revenge' | 'Action' | 'Historical' | 'Suspense';
  tags: string[];
  totalEpisodes: number;
  rating: number; // e.g. 9.8
  views: string; // e.g. "14.2M"
  synopsis: string;
  cast: string[];
  releaseYear: number;
  status: 'Completed' | 'Updating';
  isTrending?: boolean;
  rank?: number;
  episodes: Episode[];
  comments: Comment[];
  likesCount: number;
  sharesCount: number;
  isFavorite?: boolean;
  isLiked?: boolean;
}

export interface UserHistoryItem {
  dramaId: string;
  episodeId: number;
  episodeNumber: number;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}
