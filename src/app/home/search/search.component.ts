import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchType = ['Todos', 'Live', 'Video'];
  currentFilter: string = 'Todos';

  @Output() filterChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  onFilterClick(filter: string) {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }

  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(selectedCategory);
  }
}
