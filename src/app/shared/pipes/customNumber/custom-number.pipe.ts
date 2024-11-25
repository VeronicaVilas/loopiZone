import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumber',
  standalone: true
})
export class CustomNumberPipe implements PipeTransform {

  transform(value: number): string {
    return value.toLocaleString('pt-BR'); // Usa o formato com ponto como separador de milhar.
  }

}
