import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UpdSummary'
})
export class UpdateSummaryPipe implements PipeTransform {
  transform(value: string | string[]) {
    if (!value) {
        return null;
    }

    let retValue = '';
    if ( Array.isArray(value) ) {
      value.forEach((item, index) => retValue += item === null ? '' : (index % 2) === 1 ? item + '\n\n' : item + '\n');
    } else {
      retValue = value + '\n';
    }
    return retValue;
  }
}
