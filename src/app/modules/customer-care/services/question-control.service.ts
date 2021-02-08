import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { QuestionBase } from '../models/question-base';

@Injectable()
export class QuestionControlService {
  private group: any; // Declare
  private form: FormGroup;

  constructor() {
    this.group = {}; // Initialize
   }

  createFormGroup(questions: QuestionBase<any> | QuestionBase<any>[]) {
    if(this.form) {
			for (var _i = 0, _a = Object.keys(this.form.controls); _i < _a.length; _i++) {
				var key = _a[_i];
				this.form.removeControl(key);
			}
		}
    if ( Array.isArray(questions) ) {
      questions.forEach(ques => this.addControl(ques));
    } else {
      this.addControl(questions);
    }
    this.form = new FormGroup(this.group);
    return this.form;
  }

  addToFormGroup(questions: QuestionBase<any> | QuestionBase<any>[]) {
    if ( Array.isArray(questions) ) {
      questions.forEach(question => this.addControl(question));
    } else {
      this.addControl(questions);
    }
    return this.group;
  }

  addToExistingFormGroup(inForm: FormGroup, questions: QuestionBase<any> | QuestionBase<any>[]) {
    if ( Array.isArray(questions) ) {
      questions.forEach(question => inForm.addControl(question.key, this.getControl(question)));
    } else {
      inForm.addControl(questions.key, this.getControl(questions));
    }
    return this.group;
  }

  // Populate the variable
  private addControl(question: QuestionBase<any>) {
    this.group[question.key] =
      (question.required || question['minLength'] || question['minNumber'] || question['maxNumber'])
        ? new FormControl(question.value || '', this.getValidators(question))
        : new FormControl(question.value || '');
  }

  private getControl(question: QuestionBase<any>) {
    return (question.required || question['minLength'] || question['minNumber'] || question['maxNumber'])
      ? new FormControl(question.value || '', this.getValidators(question))
      : new FormControl(question.value || '');
  }

  private getValidators(question: QuestionBase<any>) {
    const validators = [];
    if ( question.required ) {
      validators.push(Validators.required);
    }
    if ( question['minLength'] ) {
      validators.push( Validators.minLength(question['minLength']) );
    }
    if ( question['type'] === 'number' ) {
      validators.push( Validators.min(question['minNumber']) );
      validators.push( Validators.max(question['maxNumber']) );
    }
    if(question.pattern){
      validators.push(Validators.pattern(question['pattern']));
    }
    return validators;
  }
}
