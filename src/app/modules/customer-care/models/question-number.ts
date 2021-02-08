import { QuestionBase } from './question-base';

export class NumberboxQuestion extends QuestionBase<string> {
  controlType = 'number';
  type: string;
  minNumber: number;
  maxNumber: number;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || 'number';
    this.minNumber = options['minNumber'] || 0;
    this.maxNumber = options['maxNumber'] || 999999999999999;
  }
}
