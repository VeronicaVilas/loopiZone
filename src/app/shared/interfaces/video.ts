export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  views: number;
  type: string;
  category: string;
  channelIcon: string;
  channelName: string;
  uploadedAt: Date;
}
