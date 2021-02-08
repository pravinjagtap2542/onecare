import { QuestionBase } from './question-base';

export class DateQuestion extends QuestionBase<string> {
  controlType = 'date';
  type: string;
  default: string;
  minDate: Date;
  maxDate: Date;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.minDate = options['minDate'] || new Date(2001, 0, 1);
    this.maxDate = options['maxDate'] || new Date(2099, 11, 31);
  }
}
