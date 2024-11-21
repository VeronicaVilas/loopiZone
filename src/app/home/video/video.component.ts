import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {

}
