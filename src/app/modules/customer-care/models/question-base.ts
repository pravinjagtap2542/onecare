export class QuestionBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  pattern:string;
  filterId: number;
  controlType: string;
  qcontext: string;
  defaulttoken: string;
  appendtotitle: string;
  preSelectedDropDownValue: string;
  isEditable: boolean;
  isHidden: boolean;


  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      isEditable?: boolean;
      isHidden?:boolean;
      pattern?:string;
      filterId?: number;
      controlType?: string;
      placeHolder?: string;
      qcontext?: string;
      defaulttoken?: string;
      appendtotitle?: string;
      preSelectedDropDownValue?: string;

    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.isEditable = !!options.isEditable;
    this.isHidden = !!options.isHidden;
    this.pattern = options.pattern || '';
    this.filterId = options.filterId || null;
    this.controlType = options.controlType || '';
    this.qcontext = options.qcontext || null;
    this.defaulttoken =  options.defaulttoken || null;
    this.appendtotitle = options.appendtotitle || null;
    this.preSelectedDropDownValue = options.preSelectedDropDownValue || null;
  }
}
