import { Injectable } from '@angular/core';

import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';
import { DataService } from '../../../common/services/data.service';
import { CmQuestion } from '../models/catalog.model';
import { QuestionBase } from '../models/question-base';
import { DateQuestion } from '../models/question-date';
import { TextAreaQuestion } from '../models/question-textarea';
import { NumberboxQuestion } from '../models/question-number';
import { ReadOnlyQuestion } from '../models/question-readonly';

@Injectable()
export class QuestionService {

  constructor(private ds: DataService) { }

  getQuestions(url: string) {
    return this.ds.getData(url);
  }

  private getOptions(keys: string[], values: string[]) {
    const options: { key: string, value: string }[] = [];

    if (keys) {
      keys.forEach((item, index) =>
        options.push({ key: item, value: values[index] }));
    }
    return options;
  }

  convert(data: CmQuestion | CmQuestion[]): QuestionBase<any> | QuestionBase<any>[] {
    let returnValue: any;

    if (Array.isArray(data)) {
      returnValue = [];
      data.forEach(cmq => returnValue.push(this.toQuestion(cmq)));
      return <QuestionBase<any>[]>returnValue;
    } else {
      returnValue = this.toQuestion(data);
      return [<QuestionBase<any>>returnValue];
    }
  }

  private getDate(inDays: number, plusMinus?: number) {
    const today = new Date();
    return new Date(today.getFullYear(),
      today.getMonth(),
      today.getDate() + (inDays * plusMinus));
  }

  private toQuestion(cmQuestion: CmQuestion): QuestionBase<any> {
    if (cmQuestion.qatype) {
      switch (cmQuestion.qatype.toLowerCase()) {
        case 'values':
          return new DropdownQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            options: this.getOptions(cmQuestion.valuelabel, cmQuestion.valuelabel),
            filterId: cmQuestion.variant,
            required: true,
            qcontext: cmQuestion.qcontext,
            appendtotitle: cmQuestion.appendtotitle
          });

        case 'externalValues':
          return new DropdownQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            options: this.getOptions(cmQuestion.valuelabel, cmQuestion.valuelabel),
            filterId: cmQuestion.variant,
            required: true,
            qcontext: cmQuestion.qcontext,
            appendtotitle: cmQuestion.appendtotitle
          });

        case 'date':
          return new DateQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            value: '',
            required: cmQuestion.ansvalidation['isRequired'],
            minDate: this.getDate(cmQuestion.ansvalidation['minDate'], -1),
            maxDate: this.getDate(cmQuestion.ansvalidation['maxDate'], 1),
            appendtotitle: cmQuestion.appendtotitle,
            qcontext: cmQuestion.qcontext,
          });

        case 'longtext':
          return new TextAreaQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            value: cmQuestion.valuelabel,
            required: cmQuestion.ansvalidation['isRequired'],
            minLength: cmQuestion.ansvalidation['minLength'],
            pattern :cmQuestion.ansvalidation['isRegExp'],
            defaulttoken: cmQuestion.defaulttoken,
            qcontext: cmQuestion.qcontext,
            appendtotitle: cmQuestion.appendtotitle
          });

        case 'number':
          return new NumberboxQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            required: cmQuestion.ansvalidation['isRequired'],
            pattern :cmQuestion.ansvalidation['isRegExp'],
            minNumber: cmQuestion.ansvalidation['minNumber'],
            maxNumber: cmQuestion.ansvalidation['maxNumber'],
            appendtotitle: cmQuestion.appendtotitle
          });
        case 'readonly':
          return new ReadOnlyQuestion({
            key: cmQuestion.title,
            label: cmQuestion.title,
            value: cmQuestion.valuelabel,
            required: cmQuestion.ansvalidation['isRequired'],
            minLength: cmQuestion.ansvalidation['minLength'],
            defaulttoken: cmQuestion.defaulttoken,
            qcontext: cmQuestion.qcontext
          });
        default:
          break;
      }
    }

    // Default return, if non of above return execute
    return new TextboxQuestion({
      key: cmQuestion.title,
      label: cmQuestion.title,
      value: cmQuestion.valuelabel,
      required: cmQuestion.ansvalidation['isRequired'],
      minLength: cmQuestion.ansvalidation['minLength'],
      pattern :cmQuestion.ansvalidation['isRegExp'],
      isEditable:cmQuestion.ansvalidation['isEditable'],
      isHidden:cmQuestion.ansvalidation['isHidden'],
      defaulttoken: cmQuestion.defaulttoken,
      qcontext: cmQuestion.qcontext,
      appendtotitle: cmQuestion.appendtotitle
    });
  }
}
