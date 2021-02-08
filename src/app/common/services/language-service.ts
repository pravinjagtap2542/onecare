import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Subject } from 'rxjs';
import { UIBaseService } from './uibase.service';
@Injectable()
export class LanguageService {
   lang: string = 'en';
  localInfo:any;
    uiB: any;
  localCode:string="/en";
  constructor(uiB: UIBaseService){
      this.localInfo = uiB.getDataFromVar("localeInfo");
      if(window.location.href.indexOf('customercare') > -1){
        let index = window.location.href.indexOf("customercare/");
        this.localCode = window.location.href.slice(index+12, index+15);
        //console.log("this.localcode",this.localCode);
      }
      
  }
  public setLanguage(translate: TranslateService) {
    translate.use(this.lang);
  }

  static LanguageChangeEvent = new Subject<any>();
  reportParms$ = LanguageService.LanguageChangeEvent.asObservable();

  public setDefaultLanguage(translator: TranslateService) {
    translator.use(this.lang);
    LanguageService.LanguageChangeEvent.next(translator);
  }

}
