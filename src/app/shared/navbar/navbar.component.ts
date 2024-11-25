import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../services/search/search.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  searchControl = new FormControl('');

  constructor(private searchService: SearchService) {
    // Observa as mudanças no campo de entrada
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Aguarda 300ms entre digitações
        distinctUntilChanged() // Evita emitir valores repetidos
      )
      .subscribe((query) => {
        // Trata o valor 'null' ou 'undefined' e converte para uma string vazia
        const searchTerm = query || '';
        console.log('Query digitada:', searchTerm);
        this.searchService.setSearchTerm(searchTerm); // Atualiza o termo de pesquisa no serviço
      });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
