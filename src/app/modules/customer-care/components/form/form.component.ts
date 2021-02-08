import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, ValidationErrors, Validators, AbstractControl } from '@angular/forms';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material';
import { of, Subscription, Subject, from } from 'rxjs';
import { map, catchError, switchMap, takeUntil, finalize,startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { QuestionService } from '../../services/question.service';
import { Categoryassoc, CmQuestion, Catalog, KbLinks } from '../../models/catalog.model';
import { QuestionBase } from '../../models/question-base';
import { TableGrid, DataService } from '../../../../common/services/data.service';
import { QuestionControlService } from '../../services/question-control.service';
import { HPSMTicket, HPSMTicketResp, Attachment, SiebelTicketResp, SiebelTicket, HPSMCatalogItem ,SNOWTicket} from '../../models/ticket.model';

import { UIBaseService } from '../../../../common/services/uibase.service';
import { environment } from '../../../../../environments/environment';
import { UIDataService } from '../../services/uidata.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { element } from 'protractor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../common/services/language-service';
//import { NgxSelectComponent } from 'ngx-select-ex';



@Component({
  selector: 'cop-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() card: { id: string, function: string, title: string, description: string, displayinportal: string, tileicon: string, isPublic: boolean };
  questions: QuestionBase<any>[];
  refQuestions: CmQuestion[];
  kbLinks: any;
  KBData: any;
  newTicketId: string;
  catalog: Catalog;
  selectedCategory: number;
  selectedCategoryAssoc: Categoryassoc;
  subscriptions: Subscription[] = [];
  selectedTabs = false;
  addAttachments = false;
  ticketCreateMethod: string;
  isClickedOnce = false;
  form: FormGroup;
  origin: string;
  isLoadingResults: boolean = false;
  selectedFiles: File[] = [];
  innerWidthCopForm: number;
  showfileattach: boolean = true;
  publicShowfileattach: any = true;
  showsubmitticket: boolean = true;
  showchat: boolean = false;
  modeParam: string = "";
  openChat: boolean = false;
  hpsmCartItemErrorMsg: string = "";
  pipeArray = [];
  siebelProduct: string = "";
  siebelSubscription: string = "";
  siebelAccount: string;
  siebelMagentoResponse: string;
  ignoreError: boolean = false;
  ignoreErrorInput: boolean = false;
  siebelSubscriptionValidation: boolean = false;
  siebelProductValidation: boolean = false;
  siebelSortedProducts: any;
  siebelMagentoQuestions: any;
  initialUserSelected: boolean = false;
  isSafari: any;
  ios: any;
  isInitMode: Boolean = true;
  isSelect: boolean = false;
  countCheck: number = 0;
  checkNoValueSubPro: string = "notNull";
  checkforNoValueSubProValidation: boolean = false;
  srTypeCheck = false;
  SubmitMessage: string = '';
  isUploadValid: boolean = false;
  uploadValidation: boolean = false;
  listOfExclude = ["ade", "adp", "app", "asp", "bas", "bat", "cer", "cmd", "com", "cpl", "crt", "csh", "der", "exe", "fxp", "gadget", "hlp", "hta", "inf", "ins", "isp", "its", "js", "jse", "ksh", "lnk", "mad", "maf", "mag", "mam", "maq", "mar", "mas", "mat", "mau", "mav", "maw", "mda", "mdb", "mde", "mdt", "mdw", "mdz", "msc", "msh", "msh1", "msh1xml", "msh2", "msh2xml", "mshxml", "msi", "msp", "mst", "ops", "pcd", "plg", "prf", "prg", "ps1", "ps1xml", "ps2", "ps2xml", "psc1", "psc2", "pst", "reg", "scf", "scr", "sct", "shb", "shs", "vb", "vbe", "vbs", "vsmacros", "vsw", "ws", "wsc", "wsf", "wsh", "xnk"];
  checkSelectedIndex = 0;
  showButtononUpload: boolean = true;
  mandatoryUpload = true;
  listOfInclude :any;
  attachmentSize: any;
  checkMandatory = 0;
  captchaKey: any;
  userInfo:any;
  usedVariant:string ='';
  usedEmail:string ='public';
  userVariantFound:boolean =false;
  isDirectModeUrl:boolean = false;
  private unsubscribe$ = new Subject();

  snackBarConfig = <MatSnackBarConfig>environment.snackBarConfig;
  publicPage = true;
  captchaSucces: boolean = false;
  uploadData: any;
  chatButtonDisable: any;
  isAcoView:boolean =false;
  acoUrl: string;
  public deviceType;
  filteredQuestion: Observable<string[]>;
  selectedIndexDropdown = 0;
  control = new FormControl();
  attachmentSizeErrorExceed:boolean =false;
  attachmentSizeErrorBelow:boolean = false;
  isErrorShownOnSelect:boolean = false;
  isErrorShownOnRemove:boolean = false;
  attachmentNumberError:boolean = false;
  duplicateFileName:boolean = false;
  errorVirusMessage:string = "";
  validFileScan:string = "";
  isFileScanProgress:boolean = false;
  files:any;
  fileNameinMessage:string;
  isTicketSubmitted:boolean = false;
  attachmentNumberCount = 5 ;

  createdSuccessfullyMessage :string;
  ticketMessage:string;
  incidentMessage:string;
  changeRequestMessage:string;
  errorCreatingTicketMessage:string;
  dismissMessage: string;
  ringSSoSession: any;
  hpsmErrorMessageContact: string;
  hpsmTicketUpdateInProcess: string;
  emailSuccessMessage: string;
  emailFailureMessage: string;
  siebelTechnicalDifficulties: string;
  somethingWentWrong: string;
  hideFormField: boolean = false;
  readOnlyFormField: boolean = false;
  snackBarRef: any;
  isErrorCreatingTicket: boolean;
  constructor(
    private service: QuestionService,
    private ds: DataService,
    private qc: QuestionControlService,
    private snackBar: MatSnackBar,
    
    private route: ActivatedRoute,
    private uiB: UIBaseService,
    private uiDS: UIDataService,
    private router: Router,private translator: TranslateService ,private langService:LanguageService) { }

    config = {
      displayKey:'value', //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: '250px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'value', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true, // clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr' // the direction of the search input can be rtl or ltr(default)
  }

  ngOnInit() {
    //this.initialUserSelected = false;
    this.uploadData = this.uiDS.getUIData("TicketCatalogComponent", "TicketCatalogComponent1378121271914");

    this.userInfo = this.uiB.getDataFromVar("userInfo");
    this.captchaKey = environment.captchaKey;
    this.detectDeviceType();
    this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    this.form = new FormGroup({});
    this.innerWidthCopForm = window.innerWidth;
    this.subscriptions.push(
      this.route.queryParamMap
        .subscribe(params => {
          this.modeParam = params.get('mode');
          if(this.modeParam == "direct"){
            this.isDirectModeUrl = true;
          }
          this.catalog = this.uiDS.getUIData('TicketCatalogComponent')
            .find(item => item.id === params.get('function'));
          if (this.catalog && this.catalog.categoryassocs.length == 1) {
            this.selectFunction(params.get('category'), null);
          } else if (!!this.route.snapshot.queryParamMap.get('link')) {
            this.selectFunction(params.get('category'), null);
          }else if(this.isDirectModeUrl && this.route.snapshot.queryParamMap.get('category')){
            this.selectFunction(params.get('category'), null);
            
          }

        
          this.origin = params.get('origin') || this.langService.localCode+'/requests';
        })
    );
    this.onChanges();
    if (window.location.href.indexOf('public') > -1) {
      this.publicPage = true;
    } else {
      this.publicPage = false;
    }
    if (window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAcoView = true;
      this.acoUrl = window.location.href;

      var index = this.acoUrl.indexOf('?');
      //var arr = [this.acoUrl.slice(0, index), this.acoUrl.slice(index + 1)];
      this.acoUrl = this.acoUrl.slice(0, index) + "?view=AvayaCloudOffice";
      // console.log("this.acoUrl",this.acoUrl);
    }
  
  if(this.questions){
    this.questions.forEach(question =>{
      if(question.controlType == 'dropdown'){
        // this.filteredQuestion = this.control.valueChanges.pipe(
        //   startWith(''),
        //   map(value => value ? this._filter(value,question['options']) : question['options'].slice())
        // );
      }
    })
  }

  this.ds.ringSso.subscribe(profile =>{
    this.ringSSoSession = profile;
  });


  }

  filterTextChange(event,question){
    this.filteredQuestion = this.control.valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filter(value,question['options']) : question['options'].slice())
    );
  }
  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.form.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
          });
        }
      });
    });
  }
  navigateToAvayaCloudOffice() {
    setTimeout(() => {
      window.location.href = this.acoUrl;
     }, 1000);
    
  }
  private _filter(value: string ,questions:any): string[] {
    //("Inside filter function questions ",questions)
    const filterValue = this._normalizeValue(value);
    return questions.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  detectDeviceType() {
    var objappVersion = navigator.appVersion; var objAgent = navigator.userAgent; var objbrowserName = navigator.appName;
    var objfullVersion = '' + parseFloat(navigator.appVersion); var objBrMajorVersion = parseInt(navigator.appVersion, 10);
    var objOffsetName, objOffsetVersion, ix; // In Chrome 
    if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) { objbrowserName = "Chrome"; objfullVersion = objAgent.substring(objOffsetVersion + 7); } // In Microsoft internet explorer
    else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) { objbrowserName = "Microsoft Internet Explorer"; objfullVersion = objAgent.substring(objOffsetVersion + 5); }
    // In Firefox 
    else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) { objbrowserName = "Firefox"; }
    // In Safari 
    else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
      objbrowserName = "Safari"; objfullVersion = objAgent.substring(objOffsetVersion + 7);
      if ((objOffsetVersion = objAgent.indexOf("Version")) != -1) objfullVersion = objAgent.substring(objOffsetVersion + 8);
    } // For other browser "name/version" is at the end of userAgent
    else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) < (objOffsetVersion = objAgent.lastIndexOf('/'))) {
      objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion); objfullVersion = objAgent.substring(objOffsetVersion + 1);
      if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) { objbrowserName = navigator.appName; }
    } // trimming the fullVersion string at semicolon/space if present 
    if ((ix = objfullVersion.indexOf(";")) != -1)
      objfullVersion = objfullVersion.substring(0, ix);
    if ((ix = objfullVersion.indexOf(" ")) != -1)
      objfullVersion = objfullVersion.substring(0, ix);
    objBrMajorVersion = parseInt('' + objfullVersion, 10);
    if (isNaN(objBrMajorVersion)) {
      objfullVersion = '' + parseFloat(navigator.appVersion);
      objBrMajorVersion = parseInt(navigator.appVersion, 10);
    }


    var isMobilee = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function () {
        return (isMobilee.Android() || isMobilee.BlackBerry() || isMobilee.iOS() || isMobilee.Opera() || isMobilee.Windows());
      }
    };
    if (isMobilee.any()) {
      this.deviceType = this.deviceType + " Mobile";
    }
    if (isMobilee.iOS()) {
      this.deviceType = this.deviceType + " ios";
    }
    if (isMobilee.Android()) {
      this.deviceType = this.deviceType + " Android";
    }
    if (isMobilee.BlackBerry()) {
      this.deviceType = this.deviceType + " BlackBerry";
    }
    if (isMobilee.Windows()) {
      this.deviceType = this.deviceType + " Windows";
    }
    if (isMobilee.Opera()) {
      this.deviceType = this.deviceType + " Opera";
    } else {
      this.deviceType = "" + " Desktop";
    }
    this.deviceType = this.deviceType + " " + objbrowserName;
    this.deviceType = this.deviceType + " " + objBrMajorVersion;
  }
  onChecked(event) {
    if (event.target.checked) {
      this.openChat = true;
    } else {
      this.openChat = false;
    }
  }

  populateQuestions(url: string): void {
    this.selectedTabs = true;
    // this.chatButtonDisable = false;
    for (const key of Object.keys(this.form.controls)) {
      this.form.removeControl(key);
      
    }
    for (const valueKey of Object.keys(this.form.value)) {
      this.form.removeControl(valueKey);
    }

    this.subscriptions.push(
      this.service
        .getQuestions(url)
        .pipe(
          catchError(() => {
            this.isLoadingResults = false;
            return of([]);
          })
        )
        .subscribe(data => {
          this.questions = null;
          this.refQuestions = <CmQuestion[]>data;


          const userProperties = this.uiB.userInfo;

          ///////////////////////////////////////// Default Token Implementation ///////////////////////////////////////////////////////
          let defaulttokenKey = [];
          let prePopulateString = "";
          for (let i in this.refQuestions) {
            if ((this.refQuestions[i].qatype != "values" || this.refQuestions[i].qatype != "externalValues") && this.refQuestions[i].defaulttoken && this.refQuestions[i].defaulttoken != "null") {

              let valueLabel: any = "";
              // if(this.refQuestions[i].defaulttoken && this.refQuestions[i].defaulttoken !="null"){
              defaulttokenKey = this.refQuestions[i].defaulttoken.split(',');
              if (defaulttokenKey.length > 1) {
                for (let j in defaulttokenKey) {
                  if (userProperties.hasOwnProperty(defaulttokenKey[j])) {
                    valueLabel += userProperties[defaulttokenKey[j]] + " ";
                  }
                }
              } else {
                if (userProperties.hasOwnProperty(defaulttokenKey[0])) {
                  valueLabel = userProperties[defaulttokenKey[0]];
                }
              }
              // }
              this.refQuestions[i].valuelabel = valueLabel;
            }
            else if (this.refQuestions[i].qatype == "values" || this.refQuestions[i].qatype == "externalValues") {
              // showing the value before the pipe symbol
              if (this.refQuestions[i].valuelabel && this.refQuestions[i].valuelabel.length > 0) {
                for (let p in this.refQuestions[i].valuelabel) {
                  if (this.refQuestions[i].valuelabel[p].includes("|")) {
                    this.pipeArray.push(this.refQuestions[i].valuelabel[p])
                  }
                  this.refQuestions[i].valuelabel[p] = this.refQuestions[i].valuelabel[p].split("|").pop();
                }
              }
              // for (let mk in this.pipeArray){
              //   if(this.pipeArray[mk].includes("eee")){
              //     let nsrTypeValue = this.pipeArray[mk].split('|')[0];
              //     console.log("nsrTypeValue",nsrTypeValue);
              //   }
              // }
              let dropDownValue: any = "";
              let defaulttoValue = this.refQuestions[i].defaulttoken;
              if (userProperties.hasOwnProperty(defaulttoValue)) {
                dropDownValue = userProperties[defaulttoValue];
              }
              for (let j in this.refQuestions) {
                for (let i in this.refQuestions[j].valuelabel) {
                  if (this.refQuestions[j].valuelabel[i] == dropDownValue) {
                    this.refQuestions[j].preSelectedDropDownValue = dropDownValue
                  }
                }
              }
            } 
            // else if ( this.refQuestions[i].internalValuesType == "secondary"){
            //   this.refQuestions[i].valuelabel = [];
            // }
          }


          /////////////////////////////////////////////////////////////////////////////////////////////////////////////

          if (this.refQuestions[0] && this.refQuestions[0].variant && this.refQuestions[0].variant.length > 0 && Object.values(this.refQuestions[0].variant).indexOf("0") >= 0) {
            this.questions = <QuestionBase<any>[]>this.service.convert(this.refQuestions[0]);
            if (this.refQuestions[0].preSelectedDropDownValue) {
              this.questions[0].preSelectedDropDownValue = this.refQuestions[0].preSelectedDropDownValue;
            }
            this.form = this.qc.createFormGroup(<QuestionBase<any>>this.service.convert(this.refQuestions[0]));
            this.isLoadingResults = false;
          } else {
            this.questions = <QuestionBase<any>[]>this.service.convert(this.refQuestions);
            for (let i in this.refQuestions) {
              if (this.refQuestions[i].preSelectedDropDownValue) {
                this.questions[i].preSelectedDropDownValue = this.refQuestions[i].preSelectedDropDownValue;
                // this.form = new FormGroup({
                //   dropDownSelect: [this.questions[i].preSelectedDropDownValue,[]]
                // });
              }
            }
            this.form = this.qc.createFormGroup(<QuestionBase<any>[]>this.service.convert(this.refQuestions));
            this.isLoadingResults = false;
          }






          /* START - Section coded for Seibel */
          // userProperties.forEach(item => {
          //   const foundQuestion = this.questions.find(question => question.label === item.label);
          //   const dummy = foundQuestion ? foundQuestion.value = item.value : null;
          // });
          /* END - Section coded for Seibel */

          if((this.ticketCreateMethod == 'servicenow' || this.ticketCreateMethod == 'email' || this.ticketCreateMethod == 'none') && this.ringSSoSession && this.questions ){

            this.questions.forEach(item => {
              const qContxt = this.refQuestions.find(refItem =>
                item.key === refItem.title && !!refItem.qcontext);
        
              if (qContxt) {
               
               // snowTicket[qContxt.qcontext] = this.form.get(item.key).value;
      
               //this.form[item.key].value = 
               if(qContxt.qcontext == 'First_Name'){
                 
                item.value = this.ringSSoSession.firstName;
               // console.log("disable" ,item.qcontext ,item.isEditable);
                if(item.isEditable){
                  //console.log("disable" ,item.qcontext ,item.isEditable);
                  
                   //this.form.controls[item.key].disable();
                   this.readOnlyFormField = true;
                  // this.form.controls[item.key].markAsDirty();
                }
               // this.form.setValue({[item.key]: this.ringSSoSession.firstName});
               // this.form.value[item.key] = this.ringSSoSession.firstName;
                //this.form.controls[item.key].patchValue(this.ringSSoSession.firstName);
               }else if(qContxt.qcontext == 'Last_Name'){
                 item.value = this.ringSSoSession.lastName;
               //  console.log("disable" ,item.qcontext ,item.isEditable);
                 if(item.isEditable){
                 // this.form.controls[item.key].disable();
                  this.readOnlyFormField = true;
                 // this.form.controls[item.key].markAsDirty();
                  }
               }else if(qContxt.qcontext == 'E_Mail'){
               // console.log("disable" ,item.qcontext ,item.isEditable);
                 item.value = this.ringSSoSession.emailId;
                 if(item.isEditable){
                  //this.form.controls[item.key].markAsDirty();
                  this.readOnlyFormField = true;
                  //this.form.controls[item.key].disable();
                  }
               }else if(qContxt.qcontext == 'Phone_Num'){
               // console.log("disable" ,item.qcontext ,item.isEditable);
                item.value = this.ringSSoSession.phoneNumber;
                if(item.isEditable){
                 // this.form.controls[item.key].markAsDirty();
                  this.readOnlyFormField = true;
                  //this.form.controls[item.key].disable();
                  }
              }else if(qContxt.qcontext == 'Company_Id'){
               // console.log("disable" ,item.qcontext ,item.isEditable);
                item.value = this.ringSSoSession.companyId;
                if(item.isHidden){
                  this.hideFormField = true;
                 // this.form.controls[item.key].disable();
                  //this.form.controls[item.key].markAsDirty();
                  }
              }

      
               //console.log("ringsso qcontext" , qContxt.qcontext)
              }
            });
          }
        })
    );

    if (this.ticketCreateMethod == 'siebel' && this.selectedCategoryAssoc.id == '1397215135581') {
      this.siebelSubscriptionValidation = true;
      this.siebelProductValidation = true;
      this.ds.getDataOf('magento/getsubscriptions/')
        .pipe(
          // map((siebelData: Response) => {
          //   // if(siebelData && siebelData.status == 200){
          //   //   this.siebelMagentoResponse = 'success';
          //   // }else{
          //   //   this.siebelMagentoResponse = 'fail';
          //   // }
          // }),
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
          this.siebelMagentoQuestions = resp;
          // if ((!Array.isArray(this.siebelMagentoQuestions) || this.siebelMagentoQuestions.length == 0) && this.catalog.id === '1397215135581') {
          if (!Array.isArray(this.siebelMagentoQuestions) || this.siebelMagentoQuestions.length == 0) {
            this.siebelSubscriptionValidation = true;
            this.siebelProductValidation = true;
            this.checkNoValueSubPro = "null";
          } else {
            this.checkNoValueSubPro = "notNull";
            this.siebelMagentoQuestions = this.siebelMagentoQuestions.filter((v, i) => this.siebelMagentoQuestions.findIndex(item => item.subscription == v.subscription) === i);
          }

        });
    }



  }



  resolved(captchaResponse: string) {
    if (`!${captchaResponse}`) {
      this.captchaSucces = false;
    }
    this.captchaSucces = true;
  }

  isMandaryUpload(){
    if(this.selectedFiles.length == 0 && this.checkMandatory === 3){
      return true;
    }

    return false;
  }

  selectFunction(id: string, links: any) {
    this.resetFileAttachment();
    this.isInitMode = true;
    this.isLoadingResults = true;
    this.showfileattach = true;
    this.showsubmitticket = true;
    this.showchat = true;
    this.isClickedOnce = false;
    this.checkSelectedIndex = 0;
    this.checkMandatory = 0;
    this.showButtononUpload = true;
    this.mandatoryUpload = true;
    //this.initialUserSelected = false;
    this.innerWidthCopForm = window.innerWidth;
    if (!this.catalog) { }
    const idx = this.catalog.categoryassocs.findIndex(tabItem => tabItem.id === id);
    this.selectedCategory = idx >= 0 ? idx : 0;
    this.selectedCategoryAssoc = this.catalog.categoryassocs[this.selectedCategory];
    // this.listOfExclude = this.selectedCategoryAssoc.FilesExclude;
    this.listOfInclude = this.selectedCategoryAssoc.FilesInclude.toLowerCase();
    if(this.selectedCategoryAssoc.FilesExclude){
       this.listOfExclude = this.selectedCategoryAssoc.FilesExclude.toLowerCase();
    }

    this.attachmentSize = this.selectedCategoryAssoc.AttachmentSize;
    if (this.selectedCategoryAssoc.AttachmentSize) {
      this.attachmentSize = Math.round((this.selectedCategoryAssoc.AttachmentSize * 1024) * 1024);
    } else {
      this.attachmentSize = Math.round(((10 * 2014) * 1024));
    }
    this.ticketCreateMethod = this.selectedCategoryAssoc.destination.toLowerCase();
    if (links != null) {
      this.kbLinks = links;
    } else {
      let kbLinksUrl = "";
      kbLinksUrl = this.selectedCategoryAssoc.questionsassoc + "&getKb=true";
      this.ds.getData(kbLinksUrl)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
          this.kbLinks = resp[0];
        });
    }
    // if(this.ticketCreateMethod === 'hpsm catalog item'){
    //   this.showfileattach = false;
    // }
    this.populateQuestions(this.selectedCategoryAssoc.questionsassoc);

    if (this.selectedCategoryAssoc.showattachment == 'hide' || this.selectedCategoryAssoc.showattachment == 'false') {
      this.publicShowfileattach = false;
    } else if (this.selectedCategoryAssoc.showattachment == 'mandatory') {
      this.publicShowfileattach = true;
    // this.showfileattach = true;
       this.showButtononUpload = false;
      this.checkMandatory = 3;
    } else {
      this.publicShowfileattach = true;
    }
  }

  resetFileAttachment(){
    this.selectedFiles = [];
    this.uploadValidation = false;
    this.attachmentSizeErrorBelow = false;
    this.attachmentSizeErrorExceed = false;
    this.attachmentNumberError = false;
    this.mandatoryUpload = true;
    this.duplicateFileName = false;
    this.captchaSucces = false;
    if((<HTMLInputElement>document.getElementById("file-upload"))){
       (<HTMLInputElement>document.getElementById("file-upload")).value = "";
    }
  }

  userSelected(value: any, index: number,  filter: any, isRequiredValue: any, referredQuestion: any,options:any) {
    //console.log("options",options);
    var selectedIndex = options.indexOf(value.value);
    //console.log("value", value.value);
    //console.log("index", index);
    //console.log("selectedIndex",selectedIndex);
    //console.log("filter", filter);
    //console.log("isRequiredValue", isRequiredValue);
    //console.log("referredQuestion", referredQuestion);
    this.form.controls[referredQuestion.key].setValue(value.value.key, {onlySelf: true});
    referredQuestion.preSelectedDropDownValue = value.value.key;
    this.refQuestions[index].preSelectedDropDownValue = value.value.key;
    this.showButtononUpload = true;
    this.mandatoryUpload = true;
    // this.listOfExclude = this.selectedCategoryAssoc.FilesExclude;
   this.selectedIndexDropdown = index;

      if(this.questions[0].controlType == 'dropdown' && !this.userVariantFound){
        this.userVariantFound = true;
        this.usedVariant = value.value.key;
      }
      if(this.questions[0].controlType == 'dropdown' && index === 0){
       
       this.resetFileAttachment();
      }
        


    //    code for the safari on showing the select.. for drop down
    if (this.isSafari) {
      if (index === 0 && filter && filter[0] == 0) {
        selectedIndex = selectedIndex - 1;
        if (selectedIndex == -1) {
          this.showchat = false;
          this.showsubmitticket = false;
          this.showfileattach = false;
          this.isSelect = true;
        } else {
          this.isSelect = false;
        }
      } else {
        if (selectedIndex === 0 && isRequiredValue === true) {
          this.isSelect = true;
        } else if (selectedIndex === 0) {
          this.isSelect = false;
        } else {
          // CHeck all secondvel dropdowns isrequired adn then do this
          if (this.form) {

            this.countCheck = 0;

            for (var _i = 0, _a = Object.keys(this.form.controls); _i < _a.length; _i++) {
              var key = _a[_i];
              const validator = this.form.get(key).validator({} as AbstractControl);
              //console.log("check the required firld",validator);

              if (validator && validator.required) {
                if (this.form.get(key).value == "SelectDropDown" || this.form.get(key).value == "undefined") {
                  this.countCheck++;
                }
              }
            }

            if (this.countCheck == 0) {
              this.isSelect = false;
            } else {
              this.isSelect = true;
            }
          }
          //this.isSelect = false;
        }
      }
    } else {
      this.isSelect = false;
    }

    this.isInitMode = false;
    this.isClickedOnce = false;
    if (index === 0 && this.refQuestions[0].variant && this.refQuestions[0].variant.length > 0 && Object.values(this.refQuestions[0].variant).indexOf("0") >= 0) {
      // Identify questions to be deleted
      const itemsToRemove = this.questions.slice(1);
      // Remove respective Form Controls from Form
      itemsToRemove.forEach(question => this.form.removeControl(question.key));

      this.questions.splice(1);
      const variant = this.getFilterId(value.value.key);
      const revisedQs = this.refQuestions.filter(question => question.variant.includes(variant));
      const revisedQuestions = <QuestionBase<any>[]>this.service.convert(revisedQs);
      this.qc.addToExistingFormGroup(this.form, revisedQuestions);
      this.questions.push(...revisedQuestions);
      // for(let i in this.questions){
      //   if(this.questions[i].value){
      //     // var p = document.createElement('p');
      //     // p.innerHTML = this.questions[i].value;
      //     this.questions[i].value = $sce.trustAsHtml(this.questions[i].value);
      //     // this.questions[i].value = document.createElement( 'p' ).appendChild(
      //     //   document.createTextNode( this.questions[i].value) ).parentNode.innerHTML;
      //   }
      // }
    }

    if(index === 0){
      this.checkMandatory = 0;
    }

    if (index === 0 && (this.refQuestions[0].showfileattach)) {
        if (this.refQuestions[0].showfileattach[selectedIndex] == '0') {
          this.publicShowfileattach = false;
          this.showfileattach = false;
         // this.checkMandatory = 0;
        } else if (this.refQuestions[0].showfileattach[selectedIndex] == '2') {
          this.showfileattach = true;
          this.publicShowfileattach = true;
          this.checkMandatory = 3;
          //this.showButtononUpload = false;
        } else if(this.refQuestions[0].showfileattach[selectedIndex] == '1'){
          this.showfileattach = true;
          this.publicShowfileattach = true;
         // this.checkMandatory = 0;
        }else if (this.selectedCategoryAssoc.showattachment == "hide" && this.refQuestions[0].showfileattach[selectedIndex] == " ") {
          this.showfileattach = false;
          this.publicShowfileattach = false;
         
        } else if (this.selectedCategoryAssoc.showattachment == "show" && this.refQuestions[0].showfileattach[selectedIndex] == " ") {
          this.showfileattach = true;
          this.publicShowfileattach = true;
        } else if (this.selectedCategoryAssoc.showattachment == "mandatory" && this.refQuestions[0].showfileattach[selectedIndex] == " ") {
          this.showfileattach = true;
          this.publicShowfileattach = true;
          this.checkMandatory = 3;
        }
       
       else {
        this.publicShowfileattach = true;
        this.showfileattach = true;
       
      }
    } 
    else {
      if (index === 0 && this.selectedCategoryAssoc.showattachment == 'mandatory') {
        this.publicShowfileattach = true;
        this.showfileattach = true;
        this.checkMandatory = 3;
       // this.showButtononUpload = false;
      } else if (index === 0 && this.selectedCategoryAssoc.showattachment == 'show') {
        this.publicShowfileattach = true;
        this.showfileattach = true;
        //this.checkMandatory = 0;
      } else if(index === 0 && this.selectedCategoryAssoc.showattachment == 'hide') {
        this.publicShowfileattach = false;
        this.showfileattach = false;
       
        
      }
    }
    
    if (index === 0 && (this.refQuestions[0].showsubmitticket)) {
      if (this.refQuestions[0].showsubmitticket[selectedIndex] == "0") {
        this.showsubmitticket = false;
        this.publicShowfileattach = false;
        this.showfileattach =false;
        
      } else {
        this.showsubmitticket = true;
        this.publicShowfileattach = true;
      }
    }

    if (index === 0 && this.refQuestions[0].showchat) {
      if (this.refQuestions[0].showchat[selectedIndex] == "0") {
        this.showchat = false;
      } else {
        this.showchat = true;
      }
    }
//console.log("reffered questions array",this.refQuestions);
     if (this.refQuestions[index].internalValuesType == "Primary"){
      this.getSecondaryDropdownValues(this.refQuestions[index],value.value.key);
    }

    // this.refQuestions.forEach(element => {
    //   console.log("element",element)
    //   if(element && element.internalValuesType == "Primary"){
    //     this.getSecondaryDropdownValues(element,value);
    //   }
    // });
  }

  private getFilterId(value: string) {
    const valueIndex = this.refQuestions[0].valuelabel.findIndex(label => label === value);
    return this.refQuestions[0].repointto[valueIndex];
  }

  onSubmitClick() {
    let checkdata = { "srticketid": "1-2733461603" };
    this.ds.getDataOf('srticketdetails/1-2733461603')
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`)))
      .subscribe(resp => {
        const response = resp;
      });
  }

  onChatSubmit() {
    // let subChat = this.selectedCategoryAssoc.chatURL.substring(0, this.selectedCategoryAssoc.chatURL.indexOf('agent') + 5);
    let subChat = this.selectedCategoryAssoc.chatURL;
    var url = new URL(subChat);
    var query_string = url.search;
    var search_params = new URLSearchParams(query_string);
    if (search_params.has('fullname')) {
      search_params.set('fullname', this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name);
    }
    if (search_params.has('email')) {
      search_params.set('email', this.uiB.userInfo["E-mail"]);
    }
    if (search_params.has('emailaddress')) {
      this.questions.forEach(elem => {
        if (elem.qcontext == 'Email' || elem.qcontext == 'E_Mail') {
          search_params.set('emailaddress', elem.value);
        }
      })
    } 
    if (search_params.has('interactionId')) {
      search_params.set('interactionId', this.newTicketId);
    }
    if (search_params.has('handle')) {
      search_params.set('handle', this.uiB.userInfo.uid);
    }
    url.search = search_params.toString();
    var new_url = url.toString();
    // let chatUrl = subChat + '&fullname=' + this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name + '&email=' + this.uiB.userInfo["E-mail"] + '&handle=' + this.uiB.userInfo.uid;
    //this.chatmonitortickets();
  
    if(this.myself('Email Address')){
      this.usedEmail  = this.myself('Email Address').value;
    }else if(this.myself('Email Id')){
      this.usedEmail  =  this.myself('Email Id').value;
    }
    this.monitortickets('chat');
    window.open(new_url);
    if (window.location.href.indexOf('public') > -1) {
      // if(this.isAcoView){
        //this.navigateToAvayaCloudOffice();
      // }else{
        //this.router.navigate(['en/public']);
        this.navigateToPublicView();
      // }
    } else {
      this.closeModal(this.origin);
    }
    
  }

  removeUploadFile(i) {
    this.selectedFiles.splice(i, 1);	
    this.attachmentNumberError = false;
  //  if (window.location.href.indexOf('public') > -1) {	
      this.selectedFiles.forEach(elem => {	
        let fileNameSplice = elem.name.substr(elem.name.lastIndexOf('.') + 1).toLowerCase();	
       
        if(this.listOfInclude && !this.isErrorShownOnRemove) {
          if(this.listOfInclude.includes(fileNameSplice)){
            this.isUploadValid = false;	
            this.uploadValidation = false;
            this.isErrorShownOnRemove = false;
          }else{
            this.isUploadValid = true;	
            this.uploadValidation = true;
            this.isErrorShownOnRemove = true;
            this.fileNameinMessage = elem.name;
          }
        }
        if(this.listOfExclude && !this.isErrorShownOnRemove){
          if(!this.listOfExclude.includes(fileNameSplice)){
            this.isUploadValid = false;	
            this.uploadValidation = false;
            this.isErrorShownOnRemove = false;
          }else{
            this.isUploadValid = true;	
            this.uploadValidation = true;
            this.isErrorShownOnRemove = true;
            this.fileNameinMessage = elem.name;
          }
        }
     
      })	

      if(this.isErrorShownOnSelect && !this.isErrorShownOnRemove){
        this.isErrorShownOnSelect = false;
      }
 
    if (this.selectedFiles.length <= 0) {	
      this.showButtononUpload = true;	
      this.isUploadValid = false;	
      this.uploadValidation = false;	
      this.isErrorShownOnRemove = false;
      this.isErrorShownOnSelect = false;
    }	
  }

  submitTicket(){
   //this.errorVirusMessage = this.errorVirusMessage + "- Invalid, not added to request"
   this.setLocalizationText();
   this.isTicketSubmitted = false;
    let title ;
    if(this.catalog && this.selectedCategoryAssoc ){
     title = this.catalog.title + ' - ' + this.selectedCategoryAssoc.title;
    }
    if(title && title !=""){
       title = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    let message;
    let checkForTitleSVRC: boolean = true;
    let appendToTitleCatalogue = "";

    for (let i in this.questions) {
      if (this.questions[i].appendtotitle == "true") {
        title = this.form.value[this.questions[i].key] + ' - ' + this.selectedCategoryAssoc.title;
        appendToTitleCatalogue = this.form.value[this.questions[i].key];
      }
    }

    if (this.ticketCreateMethod === 'hpsm') {
      // tslint:disable-next-line:prefer-const
     this.createHPSMTicket(title,message);
    }
    else if (this.ticketCreateMethod === 'hpsm catalog item') {
      this.createHPSMCatalogItem(title,message,appendToTitleCatalogue,checkForTitleSVRC);
    }
    else if ((this.ticketCreateMethod === 'email') || (this.ticketCreateMethod === 'siebel' && (this.myself('Subscription Type')) && (this.myself('Subscription Type').value) == "Avaya Cloud Contact Center")) {
     this.createEmailTicket(message);
    } else if (this.ticketCreateMethod === 'siebel') {
      this.createSiebelTicket(message);
     
    } else if (this.ticketCreateMethod === 'servicenow') {
      this.createServiceNowTicket(message);
     
  }
    this.refQuestions = [];
  }

  // onSubmit() {
  //   this.isClickedOnce = true;
  //   if (this.selectedFiles.length > 0) {
  //    this.isFileScanProgress = true;
  //    const formData = new FormData();
  //     this.selectedFiles.forEach((file ,index) => {  
  //       formData.append('attachFile', file ,file.name); 
  //     });
   
  //      this.ds.checkFileVirus("fileScan",formData)
  //    .pipe(
  //     catchError(val => of(`ERROR sending data ${val}`)),
  //   ).subscribe(resp => {
  //     console.log(resp);
  //     var response =resp['body'];
  //     console.log(response);
  //     response.forEach((responseKey,index) =>{
  //       for (const property in responseKey) {
  //         console.log(`${property}: ${responseKey[property]}`);
  //         if(responseKey[property]){
          
  //           this.isVirusFound = true;
  //           if(this.errorVirusMessage == ""){
  //             this.errorVirusMessage = property;
  //           }else{
  //             this.errorVirusMessage = this.errorVirusMessage + "," + property ;
  //           }
  //           if(this.selectedFiles.length == 1){
  //             this.selectedFiles = [];
  //           }else{
  //              this.selectedFiles.splice(index, 1);	
  //           }
            
  //         }else{
  //           if(this.validFileScan == ""){
  //             this.validFileScan = property;
  //           }else{
  //           this.validFileScan = this.validFileScan + "," + property;
  //           }
  //         }
  //         setTimeout(() => {
  //           this.submitTicket();
  //           this.isFileScanProgress = false;
  //         }, 5000);
  
  //       }
  //     })
   

  //     // if(response && response !=undefined && this.selectedFiles.length > 0 && index >= (this.selectedFiles.length -1) ){
  //     //   //this.errorVirusMessage =  this.errorVirusMessage ;
      
       
  //     // }

      
  //     // for (const property in response) {
  //     //   console.log(`${property}: ${object[property]}`);
  //     // }
      
      
  //    })
      
  //   }else{
  //    this.submitTicket();
  //   }
  //   // this.questions = [];
  //   // this.form.reset();
    

  // }

  onSubmit() {
    this.isClickedOnce = true;
    if (this.selectedFiles.length > 0) {
     this.isFileScanProgress = true;
     const formData = new FormData();
      this.selectedFiles.forEach((file ,index) => {  
        formData.append('files', file ,file.name); 
      });

    
    this.ds.checkFileScan(formData)
    .pipe(catchError (val => of(`ERROR sending data ${val}`)),
    takeUntil(this.unsubscribe$),
    catchError(val => of(`ERROR submitting ticket ${val}`)),
    finalize(() => {
      //this.snackBar.open("Something went wrong..", 'Dismiss', this.snackBarConfig);
       //this.closeModal(this.origin);
      //if(this.isAcoView){
        //this.navigateToAvayaCloudOffice();
    //   }else{
       // this.router.navigate(['en/public']);
     //  }
     
    }))
    .subscribe(resp => {
      var responseArray = resp['body'];
      //console.log("responseArray",responseArray)
      if(responseArray){
      responseArray.forEach((response,index)=>{
        //console.log("response",response);     
          if(response.status){
            
            if(this.errorVirusMessage == ""){
              this.errorVirusMessage = response.filename;
            }else{
              this.errorVirusMessage = this.errorVirusMessage + "," + response.filename ;
            }
            if(this.selectedFiles.length == 1){
              this.selectedFiles = [];
            }else{
                 
              this.selectedFiles.forEach(file =>{
                if(file.name === response.filename){
                  this.selectedFiles.splice(this.selectedFiles.indexOf(file) ,1);   
                }
              })
             
             // responseArray.splice(responseArray.indexOf(response),1)
              
            }
          }else{
            if(this.validFileScan == ""){
              this.validFileScan = response.filename;
            }else{
            this.validFileScan = this.validFileScan + "," + response.filename;
            }
          }
      

      });
     
                 
        setTimeout(() => {
          if(!this.isTicketSubmitted){
          this.submitTicket();
          this.isTicketSubmitted = true;
          }
        }, 8000);
             
        
    }
 
      // for (const property in responseArray) {
      //   console.log(`${property}: ${responseArray[property]}`);
      //           if(!responseArray[property]){
      //             this.isVirusFound = true;
      //             if(this.errorVirusMessage == ""){
      //               this.errorVirusMessage = property;
      //             }else{
      //               this.errorVirusMessage = this.errorVirusMessage + "," + property ;
      //             }
      //             if(this.selectedFiles.length == 1){
      //               this.selectedFiles = [];
      //             }else{
      //               this.selectedFiles.forEach(file =>{
      //                 if(file.name === "property"){
      //                   this.selectedFiles.splice(this.selectedFiles.indexOf(file), 1);	
      //                 }
      //               })           
      //             }
         
      //           }else{
      //             if(this.validFileScan == ""){
      //               this.validFileScan = property;
      //             }else{
      //             this.validFileScan = this.validFileScan + "," + property;
      //             }
      //           }
      //           if(responseArray && responseArray !=undefined && this.selectedFiles.length > 0 &&  ){
                 
      //             setTimeout(() => {
      //               this.submitTicket();
      //               this.isFileScanProgress = false;
      //             }, 8000);
                       
      //              }
                
      // }
      
    
     })
      
    }else{
     this.submitTicket();
    }
    // this.questions = [];
    // this.form.reset();
    

  }

  getSecondaryDropdownValues(question,value){
    var listUrl;
    
    for (let i in this.refQuestions) {
     // console.log("inside  function for",this.refQuestions[i])
      if (this.refQuestions[i].internalValuesType === "secondary" && this.refQuestions[i].restmetadata && this.refQuestions[i].restmetadata.parentkey == question.qcontext){
        listUrl = this.refQuestions[i].restmetadata.resturl+"&Override4ResponseValue="+value;
        //console.log("list url",listUrl);
         if(value || value !=""){
        //   const itemsToRemove = this.questions.slice(this.refQuestions.indexOf(this.refQuestions[i]));
        //   // Remove respective Form Controls from Form
        //   itemsToRemove.forEach(question => this.form.removeControl(question.key));
        //  // this.form.removeControl(this.refQuestions[i].key)
        //   this.questions.splice(this.refQuestions.indexOf(this.refQuestions[i]));
       const itemsToRemove = this.questions.find(item =>
            item.qcontext === this.refQuestions[i].qcontext );
           this.form.removeControl(itemsToRemove.key);
            this.questions.splice(this.refQuestions.indexOf(this.refQuestions[i]),1);
       
          this.ds.getData(listUrl)
          .pipe(
            catchError(val => of(`ERROR sending data ${val}`)))
          .subscribe((resp:any) => {
            //console.log("list response",resp);
          //  var drop =  this.refQuestions.find(item =>
          //     item.title === question.key);
          this.refQuestions[i].valuelabel = resp;
          //console.log("refQuestions", this.refQuestions[i]);
          //console.log("questions",this.questions);
         
          
          const revisedQuestions = <QuestionBase<any>[]>this.service.convert(this.refQuestions[i]);
          this.qc.addToExistingFormGroup(this.form, revisedQuestions);
          this.questions.splice(this.refQuestions.indexOf(this.refQuestions[i]), 0, ...revisedQuestions);
          //this.questions.push(...revisedQuestions);
          //this.refQuestions.splice(1)
          //this.qc.addToExistingFormGroup(this.form,<QuestionBase<any>[]>this.service.convert(this.refQuestions[i]));
          });
         }
      }
    }

  }
  prepareMessageFileScan():string{
      var message = "";
      if(this.validFileScan)
         message = "Attachments:"+ this.validFileScan  + " ";
      if(this.errorVirusMessage){
        message = message + "File Scan Failure:"+ this.errorVirusMessage;
      }

    return message;
  }

  createHPSMTicket(title,message){
    let subTicket = <HPSMTicket>{};
    subTicket[this.selectedCategoryAssoc.context5key] = this.selectedCategoryAssoc.context5value;
    if (subTicket[this.selectedCategoryAssoc.context5key] === '') {
      subTicket[this.selectedCategoryAssoc.context5key] = this.catalog.title;
    }
    subTicket.PrimaryContact = '';
    subTicket.ServiceRecipient = '';
    subTicket.Medium = 'ESS';
    subTicket[this.selectedCategoryAssoc.context2key] = this.selectedCategoryAssoc.context2value;
    subTicket[this.selectedCategoryAssoc.context1key] = this.selectedCategoryAssoc.context1value;
    subTicket.Title = title;
    if (this.openChat) {
      subTicket.Medium = 'Chat';
    }
    var description;
    

    subTicket.Description = this.objectToStringArray(this.form.value);
   
    subTicket.Description = subTicket.Description.filter(word => !word.includes("<span"));
    subTicket.Description = subTicket.Description.filter(word => !word.includes("</p"));
    subTicket.Description.push(this.prepareMessageFileScan());
   
    subTicket[this.selectedCategoryAssoc.context3key] = this.selectedCategoryAssoc.context3value;
    subTicket[this.selectedCategoryAssoc.context4key] = this.selectedCategoryAssoc.context4value;

    // Pass Question Context to HPSM -> CCOverrideTarget with selected CCOverrideContent
    this.questions.forEach(tQues => {
      if (tQues.filterId) {
       
        const overrideBy = this.refQuestions.find(item =>
          item.title === tQues.key && item.variant[0] == tQues.filterId[0] && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));

         // console.log("overrideby",overrideBy);
        if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {

          const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);

          if (overrideBy.context1override) {
            subTicket[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context2override) {
            subTicket[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context3override) {
            subTicket[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context4override) {
            subTicket[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context5override) {
            subTicket[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
          };
        }
      } else {
        const overrideBy = this.refQuestions.find(item =>
          item.title === tQues.key && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
          //console.log("overrideby 2",overrideBy);
        if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {

          const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);
          if (overrideBy.context1override) {
            subTicket[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context2override) {
            subTicket[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context3override) {
            subTicket[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context4override) {
            subTicket[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context5override) {
            subTicket[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
          };
        }
      }
    });

    // Add Question Contexts
    this.questions.forEach(item => {
      const qContxt = this.refQuestions.find(refItem =>
        item.key === refItem.title && !!refItem.qcontext);

      if (qContxt) {
       
        subTicket[qContxt.qcontext] = this.form.get(item.key).value;
      }
    });

    if (window.location.href.indexOf('public') > -1) {
      // this.ds.publicPostData('srcreateticket', dataForm)
      this.ds.publicPostData('createticket', subTicket)
        .pipe(
          switchMap(resp => {
            const response = <HPSMTicketResp>resp;

            if (+response.ReturnCode === 0) { // Success
              this.newTicketId = response.CustOpsInteraction.InteractionID;
              this.isErrorCreatingTicket = true;
              message = `${this.ticketMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
              this.monitortickets('ticket');
              this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });

              if (this.selectedFiles.length > 0) {
                const formData = new FormData();
                this.selectedFiles.forEach(file => formData.append('attachFile', file, file.name));
                return this.ds.sendAttachments(this.newTicketId, formData);
              }

              if (this.openChat && this.selectedCategoryAssoc.chatURL) {
                let changedParameter = this.selectedCategoryAssoc.chatURL;
                // let updatedPara = new URLSearchParams(changedParameter);
                var url = new URL(changedParameter);
                var query_string = url.search;
                var search_params = new URLSearchParams(query_string);
                if (search_params.has('fullname')) {
                  search_params.set('fullname', this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name);
                }
                if (search_params.has('email')) {
                  search_params.set('email', this.uiB.userInfo["E-mail"]);
                }
                if (search_params.has('interactionId')) {
                  search_params.set('interactionId', this.newTicketId.replace(' ', ''));
                }
                if (search_params.has('handle')) {
                  search_params.set('handle', this.uiB.userInfo.uid);
                }
                url.search = search_params.toString();
                var new_url = url.toString();
                //this.monitortickets('chat');
                // let chatUrl = this.selectedCategoryAssoc.chatURL + '&fullname=' + this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name + '&email=' + this.uiB.userInfo["E-mail"] + '&interactionId=' + this.newTicketId + '&handle=' + this.uiB.userInfo.uid;
                window.open(new_url);
              }

            } else if (+response.ReturnCode === 71) {
              if (response.Messages[0].includes("is not a valid Contact Name in the contacts file")) {
                message = `${this.hpsmErrorMessageContact}`;
              } else {
                //message = `There was an error creating ticket - ${response.Messages[0].toString()}`;
                message = `${this.errorCreatingTicketMessage} - ${response.Messages[0].toString()}`;
              }
              this.hpsmCartItemErrorMsg = message;
            } else if (+response.ReturnCode === 3) {
              message = `${this.hpsmTicketUpdateInProcess}`;
              this.hpsmCartItemErrorMsg = message;
            }
            return of(resp);
          }),
          takeUntil(this.unsubscribe$),
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          finalize(() => {
            this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
            if(this.isErrorCreatingTicket){
              this.navigateToPublicView();
            }
          }))
        .subscribe((response:any) => {
        });
    } else {
      this.ds.createData('createticket', subTicket)
        .pipe(
          switchMap(resp => {
            const response = <HPSMTicketResp>resp;

            if (+response.ReturnCode === 0) { // Success
              this.newTicketId = response.CustOpsInteraction.InteractionID;
              message = `${this.ticketMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
              this.isErrorCreatingTicket = true;
              this.monitortickets('ticket');
              this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });
              if (this.openChat && this.selectedCategoryAssoc.chatURL) {
                let changedParameter = this.selectedCategoryAssoc.chatURL;
                // let updatedPara = new URLSearchParams(changedParameter);
                var url = new URL(changedParameter);
                var query_string = url.search;
                var search_params = new URLSearchParams(query_string);
                if (search_params.has('fullname')) {
                  search_params.set('fullname', this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name);
                }
                if (search_params.has('email')) {
                  search_params.set('email', this.uiB.userInfo["E-mail"]);
                }
                if (search_params.has('interactionId')) {
                  search_params.set('interactionId', this.newTicketId.replace(' ', ''));
                }
                if (search_params.has('handle')) {
                  search_params.set('handle', this.uiB.userInfo.uid);
                }
                url.search = search_params.toString();
                var new_url = url.toString();
               // this.monitortickets('chat');
                // let chatUrl = this.selectedCategoryAssoc.chatURL + '&fullname=' + this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name + '&email=' + this.uiB.userInfo["E-mail"] + '&interactionId=' + this.newTicketId + '&handle=' + this.uiB.userInfo.uid;
                window.open(new_url);
              }

              if (this.selectedFiles.length > 0) {
                const formData = new FormData();
                this.selectedFiles.forEach(file => {

                  formData.append('attachFile', file, file.name)

                });
                return this.ds.sendAttachments(this.newTicketId, formData);
              }

            } else if (+response.ReturnCode === 71) {
              if (response.Messages[0].includes("is not a valid Contact Name in the contacts file")) {
                message = `${this.hpsmErrorMessageContact}`;
              } else {
               // message = `There was an error creating ticket - ${response.Messages[0].toString()}`;
               message = `${this.errorCreatingTicketMessage} - ${response.Messages[0].toString()}`;
              }
              this.hpsmCartItemErrorMsg = message;
            } else if (+response.ReturnCode === 3) {
              message = `${this.hpsmTicketUpdateInProcess}`;
              this.hpsmCartItemErrorMsg = message;
            }
            return of(resp);
          }),
          takeUntil(this.unsubscribe$),
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          finalize(() => {
            this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
            //this.closeModal(this.origin);
            if(this.isErrorCreatingTicket){
              this.closeModal(this.origin)
            }
            
          }))
        .subscribe((response:any)=> {
         });
    }
  }

  createHPSMCatalogItem(title,message, appendToTitleCatalogue,checkForTitleSVRC){
    let hpsmCatalogTicket1 = "";
    let hpsmCatalogTicket2 = "";
    let hpsmCatalogTicket3 = "";
    let hpsmCatalogTicket4 = "";
    let hpsmCatalogTicket5 = "";
    let hpsmCatalogTicketChat = '';
    let hpsmCatalogTicketNotRequestedFor = "";
    let hpsmCatalogTicket = "";
    let hpsmCatalogItemQuestion = "";
    let titleForSVRC = "";
    let nullTitle = "";
    let hpsmCatalogTicketNotRequestedForNullTitle = "";
    //title = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    appendToTitleCatalogue = appendToTitleCatalogue.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    let hciTicket = <HPSMCatalogItem>{};

    if ((this.selectedCategoryAssoc.context1key != "CatalogItemName") &&
      (this.selectedCategoryAssoc.context2key != "CatalogItemName") &&
      (this.selectedCategoryAssoc.context3key != "CatalogItemName") &&
      (this.selectedCategoryAssoc.context4key != "CatalogItemName") &&
      (this.selectedCategoryAssoc.context5key != "CatalogItemName")) {

      this.snackBar.open(message, 'No CatalogItemName', this.snackBarConfig);
      this.closeModal(this.origin);
    }
    else {
      if (this.selectedCategoryAssoc.context1key && this.selectedCategoryAssoc.context1value) {
        if (this.selectedCategoryAssoc.context1key == "CatalogItemName") {
          hciTicket.CatalogItemName = this.selectedCategoryAssoc.context1value;
        } else {
          hpsmCatalogTicket1 = "<text id=" + '"' + this.selectedCategoryAssoc.context1key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context1key + '"' + ">" + this.selectedCategoryAssoc.context1value + "</text>";
        }
      }
      if (this.selectedCategoryAssoc.context2key && this.selectedCategoryAssoc.context2value) {
        if (this.selectedCategoryAssoc.context2key == "CatalogItemName") {
          hciTicket.CatalogItemName = this.selectedCategoryAssoc.context2value;
        } else {
          hpsmCatalogTicket2 = "<text id=" + '"' + this.selectedCategoryAssoc.context2key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context2key + '"' + ">" + this.selectedCategoryAssoc.context2value + "</text>";
        }
      }
      if (this.selectedCategoryAssoc.context3key && this.selectedCategoryAssoc.context3value) {
        if (this.selectedCategoryAssoc.context3key == "CatalogItemName") {
          hciTicket.CatalogItemName = this.selectedCategoryAssoc.context3value;
        } else {
          hpsmCatalogTicket3 = "<text id=" + '"' + this.selectedCategoryAssoc.context3key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context3key + '"' + ">" + this.selectedCategoryAssoc.context3value + "</text>";
        }
      }
      if (this.selectedCategoryAssoc.context4key && this.selectedCategoryAssoc.context4value) {
        if (this.selectedCategoryAssoc.context4key == "CatalogItemName") {
          hciTicket.CatalogItemName = this.selectedCategoryAssoc.context4value;
        } else {
          hpsmCatalogTicket4 = "<text id=" + '"' + this.selectedCategoryAssoc.context4key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context4key + '"' + ">" + this.selectedCategoryAssoc.context4value + "</text>";
        }
      }
      if (this.selectedCategoryAssoc.context5key && this.selectedCategoryAssoc.context5value) {
        if (this.selectedCategoryAssoc.context5key == "CatalogItemName") {
          hciTicket.CatalogItemName = this.selectedCategoryAssoc.context5value;
        } else {
          hpsmCatalogTicket5 = "<text id=" + '"' + this.selectedCategoryAssoc.context5key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context5key + '"' + ">" + this.selectedCategoryAssoc.context5value + "</text>";
        }
      }
      if (this.openChat) {
        hpsmCatalogTicketChat = "<text id=\"avaya.svc.it.medium\" label=\"Medium\">Chat</text>";
      }
    }

 
    for (let kk in this.questions) {

      if(this.questions[kk].filterId){
      let checkOverrideBy = this.refQuestions.find(item =>
     //let checkOverrideByList = this.refQuestions.filter(item =>
        item.title === this.questions[kk].key && item.variant[0] == this.questions[kk].filterId[0] &&  (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
       
        
      let a = "";
      let b = "";
      let c = "";
      let q = "";


        //checkOverrideByList.forEach(checkOverrideBy =>{
          //console.log("overrideby 3",checkOverrideBy);
         // console.log("overrideby 3",checkOverrideBy , "item.title", this.questions[kk].key);
          if( this.questions[kk].preSelectedDropDownValue){
            this.questions[kk].preSelectedDropDownValue = this.questions[kk].preSelectedDropDownValue.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
          }
          if( this.questions[kk].value){
           this.questions[kk].value = this.questions[kk].value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
          }
         // console.log("question object",this.questions[kk])
          if (checkOverrideBy.context1override == null && checkOverrideBy.context2override == null && checkOverrideBy.context3override == null && checkOverrideBy.context4override == null && checkOverrideBy.context5override == null) {

           // console.log("preselected dropdown",this.questions[kk].preSelectedDropDownValue)
            if (this.questions[kk].qcontext != null && this.questions[kk].qcontext != "avaya.svc.itsr.title" && this.questions[kk].preSelectedDropDownValue != null) {
              a = "<text id=" + '"' + this.questions[kk].qcontext + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].preSelectedDropDownValue + "</text>";
              hpsmCatalogItemQuestion += a;
            } else if (this.questions[kk].qcontext == null && this.questions[kk].preSelectedDropDownValue != null) {
              b = "<text id=" + '"' + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].preSelectedDropDownValue + "</text>";
              hpsmCatalogItemQuestion += b;
            } else if (this.questions[kk].qcontext != null && this.questions[kk].qcontext != "avaya.svc.itsr.title" && this.questions[kk].preSelectedDropDownValue == null) {
              c = "<text id=" + '"' + this.questions[kk].qcontext + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].value + "</text>";
              hpsmCatalogItemQuestion += c;
            } else if (this.questions[kk].qcontext == null && this.questions[kk].preSelectedDropDownValue == null) {
              q = "<text id=" + '"' + this.selectedCategoryAssoc.context1key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context1key + '"' + ">" + this.questions[kk].value + "</text>";
            }
          }
        }else{
          let checkOverrideBy = this.refQuestions.find(item =>
            //let checkOverrideByList = this.refQuestions.filter(item =>
               item.title === this.questions[kk].key  &&  (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
              
               
             let a = "";
             let b = "";
             let c = "";
             let q = "";
       
       
               //checkOverrideByList.forEach(checkOverrideBy =>{
                 //console.log("overrideby 3",checkOverrideBy);
                // console.log("overrideby 3",checkOverrideBy , "item.title", this.questions[kk].key);
                 if( this.questions[kk].preSelectedDropDownValue){
                   this.questions[kk].preSelectedDropDownValue = this.questions[kk].preSelectedDropDownValue.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
                 }
                 if( this.questions[kk].value){
                  this.questions[kk].value = this.questions[kk].value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
                 }
                // console.log("question object",this.questions[kk])
                 if (checkOverrideBy.context1override == null && checkOverrideBy.context2override == null && checkOverrideBy.context3override == null && checkOverrideBy.context4override == null && checkOverrideBy.context5override == null) {
       
                 //  console.log("preselected dropdown",this.questions[kk].preSelectedDropDownValue)
                   if (this.questions[kk].qcontext != null && this.questions[kk].qcontext != "avaya.svc.itsr.title" && this.questions[kk].preSelectedDropDownValue != null) {
                     a = "<text id=" + '"' + this.questions[kk].qcontext + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].preSelectedDropDownValue + "</text>";
                     hpsmCatalogItemQuestion += a;
                   } else if (this.questions[kk].qcontext == null && this.questions[kk].preSelectedDropDownValue != null) {
                     b = "<text id=" + '"' + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].preSelectedDropDownValue + "</text>";
                     hpsmCatalogItemQuestion += b;
                   } else if (this.questions[kk].qcontext != null && this.questions[kk].qcontext != "avaya.svc.itsr.title" && this.questions[kk].preSelectedDropDownValue == null) {
                     c = "<text id=" + '"' + this.questions[kk].qcontext + '"' + " label=" + '"' + this.questions[kk].label + '"' + ">" + this.questions[kk].value + "</text>";
                     hpsmCatalogItemQuestion += c;
                   } else if (this.questions[kk].qcontext == null && this.questions[kk].preSelectedDropDownValue == null) {
                     q = "<text id=" + '"' + this.selectedCategoryAssoc.context1key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context1key + '"' + ">" + this.questions[kk].value + "</text>";
                   }
                 }
        }
    //})
   //console.log("hpsmCatalogItemQuestion",hpsmCatalogItemQuestion);
      
    }

    hciTicket.RequestedBy = this.uiB.userInfo.First_Name;

    if (this.selectedCategoryAssoc.context1key == "RequestedFor") {
      hciTicket.RequestedFor = this.selectedCategoryAssoc.context1value;
    } else if (this.selectedCategoryAssoc.context2key == "RequestedFor") {
      hciTicket.RequestedFor = this.selectedCategoryAssoc.context2value;
    } else if (this.selectedCategoryAssoc.context3key == "RequestedFor") {
      hciTicket.RequestedFor = this.selectedCategoryAssoc.context3value;
    } else if (this.selectedCategoryAssoc.context4key == "RequestedFor") {
      hciTicket.RequestedFor = this.selectedCategoryAssoc.context4value;
    } else if (this.selectedCategoryAssoc.context5key == "RequestedFor") {
      hciTicket.RequestedFor = this.selectedCategoryAssoc.context5value;
    } else {
      hciTicket.RequestedFor = "";
    }

    for (let j in this.refQuestions) {
      if (this.refQuestions[j].qcontext == "avaya.svc.itsr.title") {
        checkForTitleSVRC = false;
      }
    }

    if (checkForTitleSVRC) {
      let titleForcartItem = 'avaya.svc.itsr.title';
      if(title){
         title = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      }
      titleForSVRC = "<text id=" + '"' + titleForcartItem + '"' + " label=" + '"' + titleForcartItem + '"' + ">" + title + "</text>";
    }

    for (let i in this.refQuestions) {
      if (this.refQuestions[i].qcontext == "RequestedFor") {
        for (let ms in this.questions) {
          if (this.questions[ms].label == this.refQuestions[i].title) {
            // if(this.questions[ms].value){
            //  this.questions[ms].value = this.questions[ms].value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
            // }
            hciTicket.RequestedFor = this.questions[ms].value;
          }
        }

      } else if (this.refQuestions[i].qcontext == "avaya.svc.itsr.title") {
        for (let ji in this.questions) {
          if (this.questions[ji].label == this.refQuestions[i].title) {
            this.refQuestions[i].title = this.refQuestions[i].title.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
            if ((this.questions[ji].value == null || this.questions[ji].value == undefined) && this.questions[ji].controlType != "dropdown") {
              hpsmCatalogTicketNotRequestedForNullTitle = "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + title + "</text>";
            } else if (this.questions[ji].controlType == "dropdown") {
              if (this.questions[ji].preSelectedDropDownValue != null) {
                this.questions[ji].preSelectedDropDownValue =  this.questions[ji].preSelectedDropDownValue.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
                if (appendToTitleCatalogue != '') {
                  hpsmCatalogTicketNotRequestedForNullTitle = "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + appendToTitleCatalogue + ' - ' + this.questions[ji].preSelectedDropDownValue + "</text>";
                } else {
                  hpsmCatalogTicketNotRequestedForNullTitle = "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + this.questions[ji].preSelectedDropDownValue + "</text>";
                }
              }
            } else {
              this.questions[ji].value = this.questions[ji].value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
              if (appendToTitleCatalogue != '') {
                hpsmCatalogTicketNotRequestedForNullTitle = "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + appendToTitleCatalogue + ' - ' + this.questions[ji].value + "</text>";
              } else {
                hpsmCatalogTicketNotRequestedForNullTitle = "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + this.questions[ji].value + "</text>";
              }

            }
          }
        }
      } else {
        this.refQuestions[i].title = this.refQuestions[i].title.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        // if(this.form.value[this.refQuestions[i].title]){
        //    this.form.value[this.refQuestions[i].title] = this.form.value[this.refQuestions[i].title].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        // }
        hpsmCatalogTicketNotRequestedFor += "<text id=" + '"' + this.refQuestions[i].qcontext + '"' + " label=" + '"' + this.refQuestions[i].title + '"' + ">" + this.form.value[this.refQuestions[i].title] + "</text>";
      }
    }

    // for(let ij in this.refQuestions){
    //   if(this.refQuestions[ij].qcontext == "avaya.svc.itsr.title"){
    //     for(let ji in this.questions){
    //       if(this.questions[ji].label == this.refQuestions[ij].title){
    //         if(this.questions[ji].value == null || this.questions[ji].value == undefined){
    //           hpsmCatalogTicketNotRequestedFor += "<text id="+'"'+ this.refQuestions[ij].qcontext + '"'+ " label=" +'"' +  this.refQuestions[ij].title +'"'+">"+title+"</text>";
    //         }
    //       }
    //     }
    //   }
    // }

    this.questions.forEach(tQues => {
      //const overrideByList = this.refQuestions.filter(item =>
      const overrideBy = this.refQuestions.find(item =>
        item.title === tQues.key && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));

        //console.log("overrideby 4");
       // overrideByList.forEach(overrideBy =>{
         // console.log("overrideby 4",overrideBy);
          if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {
            const repIndexHPSMCartItem = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);
  
            if (overrideBy.context1override) {
              if (this.selectedCategoryAssoc.context1key == "CatalogItemName") {
                hciTicket.CatalogItemName = overrideBy.context1override.split(',')[repIndexHPSMCartItem];
              } 
              else {
                overrideBy.context1override = overrideBy.context1override.split(',')[repIndexHPSMCartItem];
                hpsmCatalogTicket1 = "<text id=" + '"' + this.selectedCategoryAssoc.context1key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context1key + '"' + ">" + overrideBy.context1override + "</text>";
              }
            };
            if (overrideBy.context2override) {
              if (this.selectedCategoryAssoc.context2key == "CatalogItemName") {
                hciTicket.CatalogItemName = overrideBy.context2override.split(',')[repIndexHPSMCartItem];
              }
              else {
                overrideBy.context2override = overrideBy.context2override.split(',')[repIndexHPSMCartItem];
                hpsmCatalogTicket2 = "<text id=" + '"' + this.selectedCategoryAssoc.context2key + '"' + " label=" + '"' +  this.selectedCategoryAssoc.context2key + '"' + ">" + overrideBy.context2override + "</text>";
              }
            };
            if (overrideBy.context3override) {
              if (this.selectedCategoryAssoc.context3key == "CatalogItemName") {
                hciTicket.CatalogItemName = overrideBy.context3override.split(',')[repIndexHPSMCartItem];
              }
              else {
                overrideBy.context3override = overrideBy.context3override.split(',')[repIndexHPSMCartItem];
                hpsmCatalogTicket3 = "<text id=" + '"' + this.selectedCategoryAssoc.context3key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context3key + '"' + ">" + overrideBy.context3override + "</text>";
              }
            };
            if (overrideBy.context4override) {
              if (this.selectedCategoryAssoc.context4key == "CatalogItemName") {
                hciTicket.CatalogItemName = overrideBy.context4override.split(',')[repIndexHPSMCartItem];
              }
              else {
                overrideBy.context4override = overrideBy.context4override.split(',')[repIndexHPSMCartItem];
                hpsmCatalogTicket4 = "<text id=" + '"' + this.selectedCategoryAssoc.context4key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context4key + '"' + ">" + overrideBy.context4override + "</text>";
              }
            };
            if (overrideBy.context5override) {
              if (this.selectedCategoryAssoc.context5key == "CatalogItemName") {
                hciTicket.CatalogItemName = overrideBy.context5override.split(',')[repIndexHPSMCartItem];
              }
              else {
                overrideBy.context5override = overrideBy.context5override.split(',')[repIndexHPSMCartItem];
                hpsmCatalogTicket5 = "<text id=" + '"' + this.selectedCategoryAssoc.context5key + '"' + " label=" + '"' + this.selectedCategoryAssoc.context5key + '"' + ">" + overrideBy.context5override + "</text>";
              }
            };
          }


       // })
   
    });

    let descFormHPSMCartItem = this.objectToStringArray(this.form.value);
    descFormHPSMCartItem = descFormHPSMCartItem.filter(word => !word.includes("<span"));
    descFormHPSMCartItem = descFormHPSMCartItem.filter(word => !word.includes("</p"));
    for (let df in descFormHPSMCartItem) {
      descFormHPSMCartItem[df] = descFormHPSMCartItem[df].toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      descFormHPSMCartItem[df] = " " + descFormHPSMCartItem[df];
    }

    let descForcartItem = 'avaya.svc.itsr.description';
    let filesDesc ="";
    filesDesc = this.prepareMessageFileScan();
    let descriptionForHPSMCartItem = "<text id=" + '"' + descForcartItem + '"' + " label=" + '"' + descForcartItem + '"' + ">" + descFormHPSMCartItem + filesDesc +"</text>";

    //  hpsmCatalogTicket = hpsmCatalogTicket1 + hpsmCatalogTicket2 + hpsmCatalogTicket3 + hpsmCatalogTicket4 + hpsmCatalogTicket5 + hpsmCatalogTicketNotRequestedFor;
    hpsmCatalogTicket = hpsmCatalogTicket1 + hpsmCatalogTicket2 + hpsmCatalogTicket3 + hpsmCatalogTicket4 + hpsmCatalogTicket5 + hpsmCatalogTicketChat + hpsmCatalogItemQuestion + titleForSVRC + hpsmCatalogTicketNotRequestedForNullTitle + descriptionForHPSMCartItem;

    hciTicket.Options = "<form>" + hpsmCatalogTicket + "</form>";

    if (window.location.href.indexOf('public') > -1) {
      // this.ds.publicPostData('srcreateticket', dataForm)
      this.ds.publicPostData('createhpsmcart', hciTicket)
        .pipe(
          switchMap(resp => {
            const response = <HPSMTicketResp>resp;

            if (+response.ReturnCode === 0) { // Success
              this.newTicketId = response.Messages[1].toString();
              this.newTicketId = this.newTicketId.split("=").pop();
              message = `${this.ticketMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
              this.monitortickets('ticket');
              this.isErrorCreatingTicket = true;
              this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });
              // let chatURLPramterObjects = [{'fullname': this.uiB.userInfo.First_Name }, { '': this.uiB.userInfo.Last_Name }, 
              //   { 'email': this.uiB.userInfo["E-mail"] }, {'interactionId': this.newTicketId }, {'handle': this.uiB.userInfo.uid}]
              if (this.openChat && this.selectedCategoryAssoc.chatURL) {
                let chatUrlResp = this.selectedCategoryAssoc.chatURL;
                // let chatUrlSubstring = chatUrlResp.substring(0, chatUrlResp.indexOf('agent')+5);
                var url = new URL(chatUrlResp);
                var query_string = url.search;
                var search_params = new URLSearchParams(query_string);
                if (search_params.has('fullname')) {
                  search_params.set('fullname', this.uiB.userInfo.First_Name);
                }
                if (search_params.has('')) {
                  search_params.set('', this.uiB.userInfo.Last_Name);
                }
                if (search_params.has('email')) {
                  search_params.set('email', this.uiB.userInfo["E-mail"]);
                }
                if (search_params.has('interactionId')) {
                  search_params.set('interactionId', this.newTicketId.replace(' ', ''));
                }
                if (search_params.has('handle')) {
                  search_params.set('handle', this.uiB.userInfo.uid);
                }
                url.search = search_params.toString();
                var new_url = url.toString();
                
                if(this.myself('Email Address')){
                  this.usedEmail  = this.myself('Email Address').value;
                }else if(this.myself('Email Id')){
                  this.usedEmail  =  this.myself('Email Id').value;
                } 
                this.monitortickets('chat');
                // let chatUrl = this.selectedCategoryAssoc.chatURL + '&fullname=' + this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name + '&email=' + this.uiB.userInfo["E-mail"] + '&interactionId=' + this.newTicketId + '&handle=' + this.uiB.userInfo.uid;
                // let chatUrl = changedParameter.toString();
                window.open(new_url);
              }

              if (this.selectedFiles.length > 0) {
                const hpsmformData = new FormData();
                this.selectedFiles.forEach(file => hpsmformData.append('attachFile', file, file.name));
                return this.ds.sendAttachments(this.newTicketId.trim(), hpsmformData);
              }
              //this.closeModal(this.origin);
            } else if (+response.ReturnCode === 71) {
              if (response.Messages[0].includes("is not a valid Contact Name in the contacts file")) {
                message = `${this.hpsmErrorMessageContact}`;
              } else {
                //message = `There was an error creating ticket - ${response.Messages[0].toString()}`;
                message = `${this.errorCreatingTicketMessage} - ${response.Messages[0].toString()}`;
              }
              this.hpsmCartItemErrorMsg = message;
            }
            else if (+response.ReturnCode === 3) {
              message = `${this.hpsmTicketUpdateInProcess}`;
              this.isErrorCreatingTicket = true;
              this.hpsmCartItemErrorMsg = message;
            }
            return of(resp);
          }),
          takeUntil(this.unsubscribe$),
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          finalize(() => {
            this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
            //this.navigateToPublicView();
            if(this.isErrorCreatingTicket){
              this.navigateToPublicView();
            }
           
          }))
        .subscribe((response:any) => { 
        
        });
    } else {
      this.ds.createData('createhpsmcart', hciTicket)
        .pipe(
          switchMap(resp => {
            const response = <HPSMTicketResp>resp;

            if (+response.ReturnCode === 0) { // Success
              this.newTicketId = response.Messages[1].toString();
              this.newTicketId = this.newTicketId.split("=").pop();
              message = `${this.ticketMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
              this.isErrorCreatingTicket = true;
              this.monitortickets('ticket');
              this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });
              // let chatURLPramterObjects = [{'fullname': this.uiB.userInfo.First_Name }, { '': this.uiB.userInfo.Last_Name }, 
              //   { 'email': this.uiB.userInfo["E-mail"] }, {'interactionId': this.newTicketId }, {'handle': this.uiB.userInfo.uid}]
              if (this.openChat && this.selectedCategoryAssoc.chatURL) {
                let chatUrlResp = this.selectedCategoryAssoc.chatURL;
                // let chatUrlSubstring = chatUrlResp.substring(0, chatUrlResp.indexOf('agent')+5);
                var url = new URL(chatUrlResp);
                var query_string = url.search;
                var search_params = new URLSearchParams(query_string);
                if (search_params.has('fullname')) {
                  search_params.set('fullname', this.uiB.userInfo.First_Name);
                }
                if (search_params.has('')) {
                  search_params.set('', this.uiB.userInfo.Last_Name);
                }
                if (search_params.has('email')) {
                  search_params.set('email', this.uiB.userInfo["E-mail"]);
                }
                if (search_params.has('interactionId')) {
                  search_params.set('interactionId', this.newTicketId.replace(' ', ''));
                }
                if (search_params.has('handle')) {
                  search_params.set('handle', this.uiB.userInfo.uid);
                }
                url.search = search_params.toString();
                var new_url = url.toString();
                            
              if(this.myself('Email Address')){
                this.usedEmail  = this.myself('Email Address').value;
              }else if(this.myself('Email Id')){
                this.usedEmail  =  this.myself('Email Id').value;
              }
                this.monitortickets('chat');
                // let chatUrl = this.selectedCategoryAssoc.chatURL + '&fullname=' + this.uiB.userInfo.First_Name + ' ' + this.uiB.userInfo.Last_Name + '&email=' + this.uiB.userInfo["E-mail"] + '&interactionId=' + this.newTicketId + '&handle=' + this.uiB.userInfo.uid;
                // let chatUrl = changedParameter.toString();
                window.open(new_url);
              }

              if (this.selectedFiles.length > 0) {
                const hpsmformData = new FormData();
                this.selectedFiles.forEach(file => hpsmformData.append('attachFile', file, file.name));
                return this.ds.sendAttachments(this.newTicketId.trim(), hpsmformData);
              }
              this.closeModal(this.origin);
            } else if (+response.ReturnCode === 71) {
              if (response.Messages[0].includes("is not a valid Contact Name in the contacts file")) {
                message = `${this.hpsmErrorMessageContact}`;
              } else {
                //message = `There was an error creating ticket - ${response.Messages[0].toString()}`;
                message = `${this.errorCreatingTicketMessage} - ${response.Messages[0].toString()}`;
              }
              this.hpsmCartItemErrorMsg = message;
            }
            else if (+response.ReturnCode === 3) {
              this.isErrorCreatingTicket = true;
              message = `${this.hpsmTicketUpdateInProcess}`;
              this.hpsmCartItemErrorMsg = message;
            }
            return of(resp);
          }),
          takeUntil(this.unsubscribe$),
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          finalize(() => {
            this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
            //this.closeModal(this.origin);
            if(this.isErrorCreatingTicket){
              this.closeModal(this.origin);
            }
            
          }))
        .subscribe((response:any) => {
        
         });
    }
  }

  createEmailTicket(message){
    let emailReceiver = this.selectedCategoryAssoc.context1value;

    let emailTitle = "";
    if ((this.ticketCreateMethod === 'siebel' && (this.myself('Subscription Type').value) == "Avaya Cloud Contact Center")) {
      emailTitle = 'CCP - ' + `${this.catalog.title} - ${this.selectedCategoryAssoc.title}`;
    } else {
      emailTitle = `${this.catalog.title} - ${this.selectedCategoryAssoc.title}`;
    }
    let context2: string = this.selectedCategoryAssoc.context2value;
    let context3: string = this.selectedCategoryAssoc.context3value;
    let context4: string = this.selectedCategoryAssoc.context4value;
    let context5: string = this.selectedCategoryAssoc.context5value;

    // Pass Question Context to HPSM -> CCOverrideTarget with selected CCOverrideContent
    this.questions.forEach(tQues => {
      const overrideBy = this.refQuestions.find(item =>
        item.title === tQues.key && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
        //console.log("overrideby 5",overrideBy);
      if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {
        const repIndex = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);
        if (overrideBy.context1override) {
          emailReceiver = overrideBy.context1override.split(',')[repIndex];
          this.selectedCategoryAssoc.context1value = overrideBy.context1override.split(',')[repIndex];
        };
        if (overrideBy.context2override) {
          context2 = overrideBy.context2override.split(',')[repIndex];
          this.selectedCategoryAssoc.context2value = overrideBy.context2override.split(',')[repIndex];
        };
        if (overrideBy.context3override) {
          context3 = overrideBy.context3override.split(',')[repIndex];
          this.selectedCategoryAssoc.context3value = overrideBy.context3override.split(',')[repIndex];
        };
        if (overrideBy.context4override) {
          context4 = overrideBy.context4override.split(',')[repIndex];
          this.selectedCategoryAssoc.context4value = overrideBy.context4override.split(',')[repIndex];
        };
        if (overrideBy.context5override) {
          context5 = overrideBy.context5override.split(',')[repIndex];
          this.selectedCategoryAssoc.context5value = overrideBy.context5override.split(',')[repIndex];
        };
      }


    });

    // emailTitle += context2 ? ` - ${context2}` : this.selectedCategoryAssoc.context2value ? ` - ${this.selectedCategoryAssoc.context2value}` : '';
    // if (context3 || this.selectedCategoryAssoc.context3value) {
    //   emailTitle += context3 ? `,${context3}` : `,${this.selectedCategoryAssoc.context3value}`;
    // }
    // if (context4 || this.selectedCategoryAssoc.context4value) {
    //   emailTitle += context4 ? `,${context4}` : `,${this.selectedCategoryAssoc.context4value}`;
    // }
    // if (context5 || this.selectedCategoryAssoc.context5value) {
    //   emailTitle += context5 ? `,${context5}` : `,${this.selectedCategoryAssoc.context5value}`;
    // }
    if (this.selectedCategoryAssoc.context2key == 'SubmitMessage') {
      this.SubmitMessage = this.selectedCategoryAssoc.context2value;
    }
    if (this.selectedCategoryAssoc.context1key == 'SubmitMessage') {
      this.SubmitMessage = this.selectedCategoryAssoc.context1value;
    }
    if (this.selectedCategoryAssoc.context3key == 'SubmitMessage') {
      this.SubmitMessage = this.selectedCategoryAssoc.context3value;
    }
    if (this.selectedCategoryAssoc.context4key == 'SubmitMessage') {
      this.SubmitMessage = this.selectedCategoryAssoc.context4value;
    }
    if (this.selectedCategoryAssoc.context5key == 'SubmitMessage') {
      this.SubmitMessage = this.selectedCategoryAssoc.context5value;
    }
    const formData = new FormData();

    formData.append('title', emailTitle);
    formData.append('email', emailReceiver);
    var description = this.objectToDelimitedString(this.form.value, '~~').toString() + '~~'+ this.prepareMessageFileScan();
    formData.append('description', description);
    formData.append('destination', this.ticketCreateMethod);
    formData.append('Product', this.siebelProduct);
    formData.append('Subscription', this.siebelSubscription);
     
    if(this.myself('Email Address')){
      this.usedEmail  = this.myself('Email Address').value;
    }else if(this.myself('Email Id')){
      this.usedEmail  =  this.myself('Email Id').value;
    }
    /* Added context parameters to email */
    formData.append(this.selectedCategoryAssoc.context2key, this.selectedCategoryAssoc.context2value);
    formData.append(this.selectedCategoryAssoc.context1key, this.selectedCategoryAssoc.context1value);
    formData.append(this.selectedCategoryAssoc.context3key, this.selectedCategoryAssoc.context3value);
    formData.append(this.selectedCategoryAssoc.context4key, this.selectedCategoryAssoc.context4value);
    formData.append(this.selectedCategoryAssoc.context5key, this.selectedCategoryAssoc.context5value);
    /* Ended context parameters to email */



    if(this.ticketCreateMethod === 'email' && this.selectedFiles.length > 0){
      this.selectedFiles.forEach(file => formData.append('attachFile', file, file.name));
    }



    this.ds.sendEmail(formData)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(val => of(`ERROR submitting ticket ${val}`)))
      .subscribe(response => {
        if (typeof response !== 'string') {
          const resp = <HPSMTicketResp>response;
          if (+resp.ReturnCode === 0) {
            this.monitortickets('email');
            this.isErrorCreatingTicket = true;
            if (this.SubmitMessage != '') {
              message = this.SubmitMessage;
            } else {

              message = `${this.emailSuccessMessage}`;
             
            }
          } else if (+resp.ReturnCode === 71) {
            message = `${this.errorCreatingTicketMessage} - ${resp.Messages[0].toString()}`;
          } else {
            message = `${this.emailFailureMessage}`;
          }
          // message = +resp.ReturnCode === 0 ?
          //   'Emailed your query to Support Team. Please wait for their response.' :
          //   'Error sending email to the Support Team. Please try again in an hour.';
        } else {
          message = response;
        }
    
        this.snackBar.open(message,this.dismissMessage, this.snackBarConfig);
        if (window.location.href.indexOf('public') > -1 && this.isErrorCreatingTicket) {
          if(this.isAcoView){ 
              this.navigateToAvayaCloudOffice(); 
           }else{
            //this.router.navigate(['en/public']);
            this.navigateToPublicView();
           }
        }else{
          if(this.isErrorCreatingTicket){
             this.closeModal(this.origin);
          } 
        }
      });
  }
  createSiebelTicket(message){
 // tslint:disable-next-line:prefer-const
 let dataForm = new FormData();
 let srTypeValue = '';
 let otherData: any = "";

 if (this.myself('Subscription Type') && this.myself('Subscription Type').value != "Avaya Cloud Contact Center") {
   for (let m in this.pipeArray) {
     if (this.pipeArray[m].includes(this.myself('Assistance Type').value)) {
       srTypeValue = this.pipeArray[m].split('|')[0];
     }
   }

   if (!this.myself('Assistance Type') || !this.myself('Severity') || !this.myself('Description') || this.myself('Subscription Type')) {
     otherData = this.objectToStringArray(this.form.value);
   }
 }



 if (this.selectedCategoryAssoc.context1key == 'srType') {
   srTypeValue = this.selectedCategoryAssoc.context1value;
 } else if (this.selectedCategoryAssoc.context2key == 'srType') {
   srTypeValue = this.selectedCategoryAssoc.context2value;
 } else if (this.selectedCategoryAssoc.context3key == 'srType') {
   srTypeValue = this.selectedCategoryAssoc.context3value;
 } else if (this.selectedCategoryAssoc.context4key == 'srType') {
   srTypeValue = this.selectedCategoryAssoc.context4value;
 } else if (this.selectedCategoryAssoc.context5key == 'srType') {
   srTypeValue = this.selectedCategoryAssoc.context5value;
 }

 // let fstName = this.myself('First Name') ? this.myself('First Name').value : this.uiB.userInfo.First_Name;
 // let lname = this.myself('Last Name') ? this.myself('Last Name').value : this.uiB.userInfo.Last_Name;
 // let email = this.myself('Email Id') ? this.myself('Email Id').value : this.uiB.userInfo["E-mail"];
 // let phoneNum = this.myself('Phone Number') ? this.myself('Phone Number').value : this.uiB.userInfo.Phone_Number;
 // let mergedData = this.objectToStringArray(this.form.value);
 // let mergeAlldata = "";
 let fstName;
 let lname;
 let email;
 let phoneNum;
 let siebelAccount;
 let mergeAlldata = "";
 // (mergedData).forEach(element => {
 //   mergeAlldata += element + '||';
 // });

 let contenetMerge = "";
 if (window.location.href.indexOf('public') > -1) {
   fstName = '';
   lname = '';
   phoneNum = '';
   email = '';
   siebelAccount = '';
   let mergedData = this.objectToStringArray(this.form.value);
   (mergedData).forEach(element => {
     mergeAlldata += element + '||';
   });
   contenetMerge = mergeAlldata;
 } else {
   fstName = this.myself('First Name') ? this.myself('First Name').value : this.uiB.userInfo.First_Name;
   lname = this.myself('Last Name') ? this.myself('Last Name').value : this.uiB.userInfo.Last_Name;
   email = this.myself('Email Id') ? this.myself('Email Id').value : this.uiB.userInfo["E-mail"];
   phoneNum = this.myself('Phone Number') ? this.myself('Phone Number').value : this.uiB.userInfo.Phone_Number;
   siebelAccount = this.siebelAccount;
   let mergedData = this.objectToStringArray(this.form.value);
   (mergedData).forEach(element => {
     mergeAlldata += element + '||';
   });
   contenetMerge = fstName + ' ' + lname + ' ' + email + ' ' + phoneNum + ' ' + otherData + ',' + mergeAlldata;
 }

 
 contenetMerge = contenetMerge + this.prepareMessageFileScan();
 
 this.usedEmail =  this.myself('Email Id') ? this.myself('Email Id').value : this.uiB.userInfo["E-mail"];
 const submitData = <SiebelTicket>{
   // comment: this.myself('First Name').value + ' ' + this.myself('Last Name').value + ' ' + this.myself('Email Id').value + ' ' + this.myself('Phone Number').value + ' ' + otherData,
   // createdBy: this.myself('First Name').value + ' ' + this.myself('Last Name').value,
   // severity: this.myself('Severity') ? this.myself('Severity').value: '',
   //comment: fstName + ' ' + lname + ' ' + email + ' ' + phoneNum + ' ' + otherData + ',' + mergeAlldata,
   comment:contenetMerge,
   createdBy: fstName + ' ' + lname,
   severity: this.myself('Severity') ? this.myself('Severity').value : this.myself('Severity'),
   description: this.catalog.title + ' - ' + this.selectedCategoryAssoc.title,
   subscription: this.myself('Subscription Type') ? this.myself('Subscription Type').value : '',
   product: this.siebelProduct,
   subscriptionId: this.siebelSubscription,
   account: siebelAccount,
   srType: srTypeValue,
 };


 // submitData.Description = this.objectToStringArray(this.form.value); 
 // this.myself('Description') ? this.myself('Description').value : this.form.value["Describe your request/issue in detail"]
 // submitData.Title = title;
 submitData[this.selectedCategoryAssoc.context1key] = this.selectedCategoryAssoc.context1value;
 submitData[this.selectedCategoryAssoc.context2key] = this.selectedCategoryAssoc.context2value;
 submitData[this.selectedCategoryAssoc.context3key] = this.selectedCategoryAssoc.context3value;
 submitData[this.selectedCategoryAssoc.context4key] = this.selectedCategoryAssoc.context4value;
 submitData[this.selectedCategoryAssoc.context5key] = this.selectedCategoryAssoc.context5value;


 if (this.selectedCategoryAssoc.context1key != 'srType') {
   submitData[this.selectedCategoryAssoc.context1key] = this.selectedCategoryAssoc.context1value;
 } else if (this.selectedCategoryAssoc.context2key != 'srType') {
   submitData[this.selectedCategoryAssoc.context2key] = this.selectedCategoryAssoc.context2value;
 } else if (this.selectedCategoryAssoc.context3key != 'srType') {
   submitData[this.selectedCategoryAssoc.context3key] = this.selectedCategoryAssoc.context3value;
 } else if (this.selectedCategoryAssoc.context4key != 'srType') {
   submitData[this.selectedCategoryAssoc.context4key] = this.selectedCategoryAssoc.context4value;
 } else if (this.selectedCategoryAssoc.context5key != 'srType') {
   submitData[this.selectedCategoryAssoc.context5key] = this.selectedCategoryAssoc.context5value;
 }

 this.questions.forEach(tQues => {
   if (tQues.filterId) {
     const overrideBy = this.refQuestions.find(item =>
       item.title === tQues.key && item.variant[0] == tQues.filterId[0] && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
       //console.log("overrideby 6",overrideBy);
     if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {

       const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);

       if (overrideBy.context1override) {
         submitData[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context2override) {
         submitData[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context3override) {
         submitData[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context4override) {
         submitData[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context5override) {
         submitData[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
       };
     }
   } else {
     const overrideBy = this.refQuestions.find(item =>
       item.title === tQues.key && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
      // console.log("overrideby 7",overrideBy);
     if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {

       const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);

       if (overrideBy.context1override) {
         submitData[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context2override) {
         submitData[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context3override) {
         submitData[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context4override) {
         submitData[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
       };
       if (overrideBy.context5override) {
         submitData[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
       };
     }
   }
 });

 this.questions.forEach(item => {
   const qContxt = this.refQuestions.find(refItem =>
     item.key === refItem.title && !!refItem.qcontext);

   if (qContxt) {
     submitData[qContxt.qcontext] = this.form.get(item.key).value;
   }
 });


 for (const key of Object.keys(submitData)) {
   dataForm.append(key, submitData[key]);
 }

 if (this.selectedFiles.length > 0) {
   this.selectedFiles.forEach(file => dataForm.append('attachFile', file, file.name));
 }
 // if(this.openChat) {
 //   dataForm.append('owner', 'AVACHAT');
 //   dataForm.append('source', 'Chat');
 //   dataForm.append('status', 'New');
 //   dataForm.append('ownsubStatus', 'Customer');
 // }
 let chatUrl = this.selectedCategoryAssoc.chatURL;

 if (window.location.href.indexOf('public') > -1) {
   this.ds.publicPostData('srcreateticket', dataForm)
     .pipe(
       takeUntil(this.unsubscribe$),
       finalize(() => {
         this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
     if(this.isErrorCreatingTicket){
          this.navigateToPublicView();
     } 
         this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });
       }),
       catchError(val => of(`ERROR submitting ticket ${val}`)))
     .subscribe(resp => {

       message = !resp['seibelResponse']
         ? `${this.siebelTechnicalDifficulties}`
         : `${this.ticketMessage} ${resp['seibelResponse']} ${this.createdSuccessfullyMessage}`; 
       this.newTicketId = resp['seibelResponse'];
       this.monitortickets('ticket');
       if(resp['seibelResponse']){
        this.isErrorCreatingTicket = true;
      }

       if (this.openChat && this.selectedCategoryAssoc.chatURL) {
         let changedParameter = this.selectedCategoryAssoc.chatURL;
         var url = new URL(changedParameter);
         var query_string = url.search;
         var search_params = new URLSearchParams(query_string);
         if (search_params.has('fullname')) {
           search_params.set('fullname', this.uiB.userInfo.First_Name + '' + this.uiB.userInfo.Last_Name);
         }
         if (search_params.has('emailAddress')) {
           search_params.set('emailAddress', this.uiB.userInfo["E-mail"]);
         }
         if (search_params.has('userID')) {
           search_params.set('userID', this.uiB.userInfo.uid);
         }
         if (search_params.has('consultSRNo')) {
           search_params.set('consultSRNo', `${resp['seibelResponse']}`);
         }
         if (search_params.has('fromSpace')) {
           search_params.set('fromSpace', 'cpp_cloud');
         }
         url.search = search_params.toString();
         var new_url = url.toString();
          
        if(this.myself('Email Address')){
          this.usedEmail  = this.myself('Email Address').value;
        }else if(this.myself('Email Id')){
          this.usedEmail  =  this.myself('Email Id').value;
        }
         this.monitortickets('chat');
         window.open(new_url);
       }
     });
 } else {
   this.ds.postData('srcreateticket', dataForm)
     .pipe(
       takeUntil(this.unsubscribe$),
       finalize(() => {
         this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
         if(this.isErrorCreatingTicket){
          this.closeModal(this.origin);
          this.ds.refreshDataOf(<TableGrid>{ name: 'currentList', state: true });
         }
       }),
       catchError(val => of(`ERROR submitting ticket ${val}`)))
     .subscribe(resp => {

       message = !resp['seibelResponse']
         ? `${this.siebelTechnicalDifficulties}`
         : `${this.ticketMessage} ${resp['seibelResponse']} ${this.createdSuccessfullyMessage}`;
       this.newTicketId = resp['seibelResponse'];
       this.monitortickets('ticket');
       if(resp['seibelResponse']){
        this.isErrorCreatingTicket = true;
      }

       if (this.openChat && this.selectedCategoryAssoc.chatURL) {
         let changedParameter = this.selectedCategoryAssoc.chatURL;
         var url = new URL(changedParameter);
         var query_string = url.search;
         var search_params = new URLSearchParams(query_string);
         if (search_params.has('fullname')) {
           search_params.set('fullname', this.uiB.userInfo.First_Name + '' + this.uiB.userInfo.Last_Name);
         }
         if (search_params.has('emailAddress')) {
           search_params.set('emailAddress', this.uiB.userInfo["E-mail"]);
         }
         if (search_params.has('userID')) {
           search_params.set('userID', this.uiB.userInfo.uid);
         }
         if (search_params.has('consultSRNo')) {
           search_params.set('consultSRNo', `${resp['seibelResponse']}`);
         }
         if (search_params.has('fromSpace')) {
           search_params.set('fromSpace', 'cpp_cloud');
         }
         url.search = search_params.toString();
         var new_url = url.toString();
         
      if(this.myself('Email Address')){
        this.usedEmail  = this.myself('Email Address').value;
      }else if(this.myself('Email Id')){
        this.usedEmail  =  this.myself('Email Id').value;
      }
         this.monitortickets('chat');
         window.open(new_url);

       }
     });
 }
  }

  createServiceNowTicket(message){
    let snowTicket = <SNOWTicket>{};
    //console.log("selectedcategoryassoc",this.selectedCategoryAssoc);
  
  //   snowTicket.u_first_name = this.myself('First Name') ? this.myself('First Name').value : "";
  //   snowTicket.u_last_name = this.myself('Last Name') ? this.myself('Last Name').value : "";
  //   snowTicket.u_email_id = this.myself('Email Address') ? this.myself('Email Address').value : "";
  //   snowTicket.u_short_description = this.myself('Short Description') ? this.myself('Short Description').value : "";
  //   if(this.myself('Company ID / User ID')){
  //      snowTicket.u_company_id = this.myself('Company ID / User ID').value;
  //   }else if(this.myself('Subscription ID')){
  //     snowTicket.u_company_id = this.myself('Subscription ID').value;
  //   }
  //   snowTicket.u_entitlement = this.myself('Select your type of request') ? this.myself('Select your type of request').value:'';
     
  //   snowTicket.u_phone_num = this.myself('Phone Number') ? this.myself('Phone Number').value : "";
  //   if(this.myself('Describe your request/issue in detail')){
  //     snowTicket.u_description = this.myself('Describe your request/issue in detail').value;
  //  }else if(this.myself('Description')){
  //    snowTicket.u_description = this.myself('Description').value;
  //  }
    //snowTicket.u_description =this.myself('Describe your request/issue in detail') ? this.myself('Describe your request/issue in detail').value:'';
    //snowTicket.u_description = snowTicket.u_description + this.prepareMessageFileScan();
    snowTicket[this.selectedCategoryAssoc.context3key] = this.selectedCategoryAssoc.context3value;
    snowTicket[this.selectedCategoryAssoc.context1key] = this.selectedCategoryAssoc.context1value;
    snowTicket[this.selectedCategoryAssoc.context2key] = this.selectedCategoryAssoc.context2value;
    

    //this.usedEmail = snowTicket.u_email_id;

    this.questions.forEach(item => {
      const qContxt = this.refQuestions.find(refItem =>
        item.key === refItem.title && !!refItem.qcontext);

      if (qContxt) {
       
        snowTicket[qContxt.qcontext] = this.form.get(item.key).value;
      }
    });

   // console.log("description1",snowTicket.Description);
   
    this.questions.forEach(tQues => {
      if (tQues.filterId) {
       
        const overrideBy = this.refQuestions.find(item =>
          item.title === tQues.key && item.variant[0] == tQues.filterId[0] && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));
        if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {

          const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);

          if (overrideBy.context1override) {
            snowTicket[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context2override) {
            snowTicket[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context3override) {
            snowTicket[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context4override) {
            snowTicket[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
          };
          if (overrideBy.context5override) {
            snowTicket[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
          };
        }
      } else {
        const overrideByArray = this.refQuestions.filter(item =>
          item.title === tQues.key && (item.context1override != 'null' || item.context2override != 'null' || item.context3override != 'null' || item.context4override != 'null' || item.context5override != 'null'));

          overrideByArray.forEach(overrideBy =>{

         
            if (overrideBy && overrideBy.valuelabel && this.form.get(tQues.key)) {
  
              const repIndexHPSM = overrideBy.valuelabel.indexOf(this.form.get(tQues.key).value);
              if (overrideBy.context1override) {
                snowTicket[this.selectedCategoryAssoc.context1key] = overrideBy.context1override.split(',')[repIndexHPSM];
              };
              if (overrideBy.context2override) {
                snowTicket[this.selectedCategoryAssoc.context2key] = overrideBy.context2override.split(',')[repIndexHPSM];
              };
              if (overrideBy.context3override) {
                snowTicket[this.selectedCategoryAssoc.context3key] = overrideBy.context3override.split(',')[repIndexHPSM];
              };
              if (overrideBy.context4override) {
                snowTicket[this.selectedCategoryAssoc.context4key] = overrideBy.context4override.split(',')[repIndexHPSM];
              };
              if (overrideBy.context5override) {
                snowTicket[this.selectedCategoryAssoc.context5key] = overrideBy.context5override.split(',')[repIndexHPSM];
              };
            }
          });
         
      }
    });

        // Add Question Contexts
 

      // console.log("description2",snowTicket.Description);

    if(snowTicket.Short_Description.length > 100){
      var shortDesc = snowTicket.Short_Description;
      snowTicket.Short_Description = snowTicket.Short_Description.substring(0, 100)
      snowTicket.Description = shortDesc + " " + snowTicket.Description;
    }
    // if(this.isAcoView && this.ringSSoSession){
    //   snowTicket.Description = snowTicket.Description + " " + this.ringSSoSession.userRole;
     
    // }
     snowTicket.Description = snowTicket.Description + "\n"+ this.prepareMessageFileScan();
     this.usedEmail = snowTicket.E_Mail;
    const formData = new FormData();
    formData.append('First_Name', snowTicket.First_Name);
    formData.append('Last_Name', snowTicket.Last_Name);
    formData.append('E_Mail',snowTicket.E_Mail);
    formData.append('Short_Description', snowTicket.Short_Description);
    formData.append('Company_Id', snowTicket.Company_Id);
    formData.append('Phone_Num', snowTicket.Phone_Num);
    formData.append('Description', snowTicket.Description);
    formData.append(this.selectedCategoryAssoc.context1key,this.selectedCategoryAssoc.context1value);
    formData.append(this.selectedCategoryAssoc.context2key,this.selectedCategoryAssoc.context2value);
    formData.append("u_entitlement", snowTicket[this.selectedCategoryAssoc.context3key]);
    if(this.isAcoView && this.ringSSoSession){
      formData.append("User_Auth", "true");
    }else{
      formData.append("User_Auth","false")
    }
 
    
    if(this.selectedCategoryAssoc.context4key){
      formData.append(this.selectedCategoryAssoc.context4key,this.selectedCategoryAssoc.context4value);
    }
    if(this.selectedCategoryAssoc.context5key){
      formData.append(this.selectedCategoryAssoc.context5key,this.selectedCategoryAssoc.context5value);
    }
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => formData.append('attachFile', file, file.name));
    }
  
    if (window.location.href.indexOf('public') > -1) {
      // this.ds.publicPostData('srcreateticket', dataForm)
      this.ds.publicPostData('sncreateticket', formData)
        .pipe(
          switchMap(resp => {
            const response = <SNOWTicket>resp;
          // console.log("response",response,"message",response[0]["Messages"])
            if(response[0]["Ticket Number"] && response[0]["Ticket Number"]!=="Invalid Entitlement" && response[0]["Messages"]!=""){
             // console.log("ticket Number")
              if(response[0]["Messages"].indexOf("Change Request") > -1){
                this.newTicketId = response[0]["Ticket Number"].slice(23,response[0]["Ticket Number"].length);
                message = `${this.changeRequestMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
                this.monitortickets("ticket");
              }
              if(response[0]["Messages"].indexOf("Incident") > -1){
                this.newTicketId = response[0]["Ticket Number"].slice(17,response[0]["Ticket Number"].length);
                message = `${this.ticketMessage} ${this.newTicketId} ${this.createdSuccessfullyMessage}`;
                this.monitortickets("ticket");
              }
              if((response[0]["Ticket Number"].indexOf("Company doesn't exist") > -1)){
                message = `${response[0]["Ticket Number"]} ${response[0]["Messages"]}`;
              }
             

            } else if(response[0]["Ticket Number"]=="Invalid Entitlement" && response[0]["Messages"]==""){
              message = `${this.errorCreatingTicketMessage} - ${response[0]["Ticket Number"]}`;
            }

            return of(resp);
          }),
          takeUntil(this.unsubscribe$),
          catchError(val => of(`${this.errorCreatingTicketMessage} ${val}`)),
          finalize(() => {
            // if(message == "" || message == undefined || message == null){
            //   message = "Something went wrong"
            // }
            let snackBarRef =  this.snackBar.open(message, this.dismissMessage, this.snackBarConfig);
           // this.snackBarRef = snackBarRef;
            snackBarRef.afterDismissed().subscribe(() => {
             // console.log('The snack-bar was dismissed');
              if(this.isAcoView){
                this.navigateToAvayaCloudOffice();
              }
            });
            // this.closeModal(this.origin);
            if(this.isAcoView){
              //console.log("message",message);
               //this.navigateToAvayaCloudOffice();
            }else{
              this.navigateToPublicView();
             }
            //this.router.navigate(['en/public']);
          }))
        .subscribe(response => { });

  }
  }
  siebelUserSelected(value, typeSelected) {
    if (typeSelected == "product") {
      this.siebelProduct = value;
      this.siebelProductValidation = false;
    }
    if (typeSelected == "subscription") {
      this.siebelSubscription = value;
      this.siebelSubscriptionValidation = false;
      this.siebelSortedProducts = this.siebelMagentoQuestions.filter(pro => pro.subscription == this.siebelSubscription);
      if (this.siebelSortedProducts && Array.isArray(this.siebelSortedProducts)) {
        this.siebelProduct = this.siebelSortedProducts[0].product;
        this.siebelProductValidation = false;
      } else {
        this.siebelProduct = this.siebelSortedProducts.product;
        this.siebelProductValidation = false;
      }
    }
    if (typeSelected == "account") {
      this.siebelAccount = value;
    }
  }

  setLocalizationText(){
    this.translator.get('changeRequestMessage').subscribe((res: string) => {
      this.changeRequestMessage = res
    });
    this.translator.get('ticketMessage').subscribe((res: string) => {
      this.ticketMessage = res
    });
    this.translator.get('createdSuccessfullyMessage').subscribe((res: string) => {
      this.createdSuccessfullyMessage = res
    });
    this.translator.get('errorCreatingTicketMessage').subscribe((res: string) => {
      this.errorCreatingTicketMessage = res
    });
    this.translator.get('dismissMessage').subscribe((res: string) => {
      this.dismissMessage = res
    });
    this.translator.get('HpsmErrorMessageContact').subscribe((res: string) => {
      this.hpsmErrorMessageContact = res
    });
    this.translator.get('HpsmTicketUpdateInProcess').subscribe((res: string) => {
      this.hpsmTicketUpdateInProcess = res
    });
    this.translator.get('emailSuccessMessage').subscribe((res: string) => {
      this.emailSuccessMessage = res
    });
    this.translator.get('emailFailureMessage').subscribe((res: string) => {
      this.emailFailureMessage = res
    });
    this.translator.get('siebelTechnicalDifficulties').subscribe((res: string) => {
      this.siebelTechnicalDifficulties = res
    });
    this.translator.get('somethingWentWrong').subscribe((res: string) => {
      this.somethingWentWrong = res
    });
    
    
  }
  validateText(event, quest) {

    setTimeout(() => {
      if ((event.key == 'Delete' || event.key == 'Backspace') && quest.value.length == 0 && quest.required)  {
        this.ignoreError = true;
      } else {
        this.ignoreError = false;
      }
    }, 300)
  }
  validateInput(event, quest) {
    if ((event.key == 'Delete' || event.key == 'Backspace') && quest.value.length == 0 && quest.required) {
      this.ignoreErrorInput = true;
    } else {
      this.ignoreErrorInput = false;
    }
  }
  validateSiebelSubInput(event) {
    if ((event.key == 'Delete' || event.key == 'Backspace') && event.target.value == '') {
      this.siebelSubscriptionValidation = true;
    } else {
      this.siebelSubscription = event.target.value;
      this.siebelSubscriptionValidation = false;
    }
  }
  validateSiebelProInput(event) {
    if ((event.key == 'Delete' || event.key == 'Backspace') && event.target.value == '') {
      this.siebelProductValidation = true;
    } else {
      this.siebelProduct = event.target.value;
      this.siebelProductValidation = false;
    }
  }
  tabBackNav() {
    this.selectedTabs = false;
  }

  myself(name: string) {
    return this.form.get([name]);
  }

  closeModal(origin?: string) {
    if (window.location.href.indexOf('public') > -1) {
      const dummy = origin ? this.router.navigate([origin === 'public' ? 'requests' : origin]) : this.router.navigate(['public']);
    } else {
      const dummy = origin ? this.router.navigate([origin === 'home' ? 'requests' : origin]) : this.router.navigate(['requests']);
    }
  }

  onSelect(files) {
    this.attachmentSizeErrorExceed = false;
    this.attachmentSizeErrorBelow = false;
    this.duplicateFileName = false;
    for (const file of files) {
      if (this.ticketCreateMethod === 'hpsm' || this.ticketCreateMethod === 'hpsm catalog item' || this.ticketCreateMethod === 'email' || this.ticketCreateMethod ==='siebel' || this.ticketCreateMethod ==='servicenow') {
        let fileNameSplice = "";
        if(file.name.lastIndexOf('.') != -1){
          fileNameSplice = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        }
        
          if(this.attachmentSize){
            if(file.size == 0){
              this.attachmentSizeErrorBelow  = true;
            }else if(this.selectedFiles.length >=3 && this.ticketCreateMethod === 'servicenow'){
              this.attachmentNumberError = true;
              this.attachmentNumberCount = 3;
            }
            else if(this.selectedFiles.length >= 5 ){
              this.attachmentNumberError = true;
              this.attachmentNumberCount = 5;
            }
            else if (file.size > this.attachmentSize) {
              this.attachmentSizeErrorExceed  = true;      
            }else{
              this.selectedFiles.forEach(fileSelected =>{
                if(fileSelected.name === file.name){
                  this.duplicateFileName = true;
                }

              });
              if(!this.duplicateFileName){
                this.selectedFiles.push(file);
                this.processSelectedFile(file,fileNameSplice);
              }
       
          }
      }
    }

   
  }
}


processSelectedFile(file,fileNameSplice){
  if(this.listOfInclude && !this.isErrorShownOnSelect) {
    if(fileNameSplice !="" && this.listOfInclude.includes(fileNameSplice)){
      this.isUploadValid = false;	
      this.uploadValidation = false;
      this.mandatoryUpload = true;
    }else{
      this.isUploadValid = true;	
      this.uploadValidation = true;
      this.mandatoryUpload = true;
      this.isErrorShownOnSelect = true;
      this.fileNameinMessage = file.name;
    }
  }
  if(this.listOfExclude && !this.isErrorShownOnSelect){
    if(!this.listOfExclude.includes(fileNameSplice)){
      this.isUploadValid = false;	
      this.uploadValidation = false;
      this.mandatoryUpload = true;
    }else{
      this.isUploadValid = true;	
      this.uploadValidation = true;
      this.mandatoryUpload = true;
      this.fileNameinMessage = file.name;
      this.isErrorShownOnSelect  = true;
    }
  }
}

  monitortickets(type) {
    
    let url = 'logtickets'
    let dataForm = new FormData();
    if (this.ticketCreateMethod === 'email' || type === 'email') {
      dataForm.append('TickeitID', 'Email');
    } else if (type === 'chat') {
      dataForm.append('TickeitID', 'Chat');
    }
    else {
      dataForm.append('TickeitID', this.newTicketId);
    }


    if(this.isAcoView && this.ringSSoSession){
      dataForm.append('UserCommunity',"RingCentral")
      this.usedEmail = this.ringSSoSession.emailId;
    }else{
      dataForm.append('UserCommunity',this.userInfo.usertype);
    }
    dataForm.append('TileId', this.route.snapshot.queryParamMap.get('function'))
    dataForm.append('FormId', this.route.snapshot.queryParamMap.get('category'));
    dataForm.append('DeviceType', this.deviceType);
    dataForm.append('UserNetwork',this.userInfo.clientIP);
    dataForm.append('UsedVariant',this.usedVariant);
    dataForm.append('Locale',this.langService.localInfo.locale);
  
    if (window.location.href.indexOf('public') > -1) {
      dataForm.append('SM_UNIVERSALID', this.usedEmail);
      this.ds.publicPostData(url, dataForm)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`))
        )
        .subscribe(resp => { 
          this.isFileScanProgress = false;
        })
    } else {
      dataForm.append('SM_UNIVERSALID', this.uiB.userInfo.uid);
      this.ds.postData(url, dataForm)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`))
        )
        .subscribe(resp => { 
          this.isFileScanProgress = false;
        })
    }
  }

  checkUploadsForVirus(){



   }

   navigateToPublicView(){
     var locale;
    var lang;
    locale = this.uiB.getDataFromVar("localeInfo");
    if(locale.locale){
  lang = locale.locale.substr(0, locale.locale.indexOf('_')); 
    }
    if(lang == 'en'){
    this.router.navigate(['en/public']);
    }
    if(lang == 'fr'){
    this.router.navigate(['fr/public']);
    }

   }

  private getUser(item: string) {
    return this.uiB.userInfo[item];
  }

  private objectToStringArray(obj: any): string[] {
    const returnArray = [];

    for (const value of Object.keys(this.form.value)) {
      returnArray.push(value + ' : ' + obj[value] + '');
    }
    return returnArray;
  }

  private objectToDelimitedString(obj: any, delimiter?: string | ','): string {
    let ret = '';

    for (const value of Object.keys(this.form.value)) {
      ret += value + ' : ' + obj[value] + delimiter;
    }
    // Remove trailing delimiter
    ret = ret.substr(0, ret.length - delimiter.length);
    return ret;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

 
}
