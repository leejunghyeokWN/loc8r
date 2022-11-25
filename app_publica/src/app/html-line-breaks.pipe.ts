import { Pipe, PipeTransform } from '@angular/core';
import { text } from 'express';

@Pipe({
  name: 'htmlLineBreaks'
})
export class HtmlLineBreaksPipe implements PipeTransform {

  transform(text: string): string {
    return text.replace(/\n/g, '<br />');
  }

}
