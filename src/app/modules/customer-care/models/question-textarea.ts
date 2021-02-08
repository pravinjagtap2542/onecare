import { QuestionBase } from './question-base';

export class TextAreaQuestion extends QuestionBase<string> {
  controlType = 'longtext';
  minLength: number;
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.minLength = options['minLength'] || 0;
    this.value = options['value'] || '';
  }
}
