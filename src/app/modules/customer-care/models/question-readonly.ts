import { QuestionBase } from './question-base';

export class ReadOnlyQuestion extends QuestionBase<string> {
  controlType = 'readonly';

  constructor(options: {} = {}) {
    super(options);
    this.value = options['value'] || '';
  }
}
