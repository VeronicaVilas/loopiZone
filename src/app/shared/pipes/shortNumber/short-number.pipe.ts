import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber',
  standalone: true
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: number, decimals: number = 1): string {
    if (!value) return '0';

    const suffixes = ['mil', 'mi', 'bi', 'tri'];
    const factor = Math.floor((value.toString().length - 1) / 3);

    if (factor === 0) return value.toString();

    const shortValue = (value / Math.pow(1000, factor)).toFixed(decimals);

    return `${shortValue} ${suffixes[factor - 1]}`;
  }
}
