import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTermSubject = new BehaviorSubject<string>(''); // Inicializa com valor vazio
  searchTerm$ = this.searchTermSubject.asObservable(); // Torna o observable acessível

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term); // Atualiza o termo de pesquisa
  }
}
