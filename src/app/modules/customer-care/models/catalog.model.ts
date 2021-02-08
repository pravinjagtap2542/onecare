import { LinkElement } from '../../../common/models/element.link.model';

export interface Catalog {
  id:             string;
  title:          string;
  description:    string;
  CTALabel:       string;
  CTALink:        string;
  categoryassocs: Categoryassoc[];
  kbtitle:        string;
  kbdescription:  string;
  displayinportal: string;
  tileicon: string;
  view:string;
}

export interface Views {
  id:             string;
  title:          string;
  defaultview:    string;
}

export interface Categoryassoc {
  id:          string;
  title:       string;
  context1key:    string;
  context2key:    string;
  context4key:    string;
  context3key:    string;
  context5key:    string;
  context1value:    string;
  context2value:    string;
  context4value:    string;
  context3value:    string;
  context5value:    string;
  description: string;
  destination: string;
  kblinks:     LinkElement[];
  kbtitle:     string;
  kbdescription: string;
  questionsassoc: string;
  chatURL: string;
  showattachment: any;
  FilesExclude: any;
  FilesInclude: any;
  AttachmentSize: any;
}

export interface CmQuestion {
  title: string;
  description: string;
  qorder: string;
  variant: string;
  valuelabel: string[];
  repointto: string[];
  CCOverrideTarget: string;
  CCOverrideContent: string;
  ansvalidation: {} | AnsValidation;
  qcontext: string;
  qatype: string;
  defaulttoken: string;
  context1override: string;
  context2override: string;
  context3override: string;
  context4override: string;
  context5override: string;
  appendtotitle: string;
  showfileattach: string[];
  showsubmitticket: string[];
  showchat: string[];
  preSelectedDropDownValue: string;
  internalValuesType:string;
  restmetadata:any;
  kblinks:     LinkElement[];
  kbtitle:     string;
  kbdescription: string;
  showattachment: boolean;
}

export interface KbLinks{
  kblinks:     LinkElement[];
  kbtitle:     string;
  kbdescription: string;
}

export interface AnsValidation {
  isRequired: boolean;
  minLength: number;
  minDate: number;
  maxDate: number;
  isEditable:boolean;
  isHidden:boolean;
}


export interface Deligation {
  Status: string;
}