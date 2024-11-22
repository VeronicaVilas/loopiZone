import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-play-video',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './play-video.component.html',
  styleUrl: './play-video.component.css'
})
export class PlayVideoComponent {

}
