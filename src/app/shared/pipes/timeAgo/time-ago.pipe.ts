import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';
    const parsedDate = new Date(value);
    let formattedTime = formatDistanceToNow(parsedDate, {
      addSuffix: true,
      locale: ptBR
    });
    formattedTime = formattedTime
      .replace('cerca de ', '')
      .replace('mais de ', '')
      .replace('quase ', '');
    return formattedTime;
  }

}
