import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoHelperService {

  convertToEmbedUrl(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  private extractVideoId(url: string): string {
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : '';
  }
}
