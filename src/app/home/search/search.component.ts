import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

}
