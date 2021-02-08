import { NgModule, Inject, NgZone } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule ,HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { WindowRef } from '../../common/services/core/window-ref.service';
import { UIBaseService } from '../../common/services/uibase.service';

import { CustomerCareRoutingModule } from './customer-care-routing.module';
import { HeroComponent } from './components/hero/hero.component';
import { MyActivitiesComponent } from './components/my-activities/my-activities.component';
import { RequestsListComponent } from './components/requests-list/requests-list.component'; 
import { ServicenowTicketsListComponent } from './components/servicenow-tickets-list/servicenow-tickets-list.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { OutageListComponent} from './components/outage-list/outage-list.component';
import { ActionCardComponent } from './components/action-card/action-card.component';
import { ActionCardsComponent } from './components/action-cards/action-cards.component';
import { MainComponent } from './components/main/main.component';

import { CCMaterialModule } from './cc-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionService } from './services/question.service';
import { QuestionControlService } from './services/question-control.service';
import { ProcessProvider } from './services/process.service';
import { ActionModalComponent } from './components/action-modal/action-modal.component';
import { ModifyTicketComponent } from './components/modify-ticket/modify-ticket.component';
import { UpdateSummaryPipe } from './pipes/UpdSummary.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { FileSizePipe } from './pipes/file-size.pipe';
import { SafeHTMLPipe,SafeResourcePipe} from './pipes/trustasHTML.pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { FormComponent } from './components/form/form.component';
import { TicketsService } from './services/tickets.service';
import { DelegationComponent } from './components/delegation/delegation.component';
import { RecaptchaModule ,RECAPTCHA_LANGUAGE, RecaptchaLoaderService } from 'ng-recaptcha';

import {TranslateModule, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler, TranslateService, MissingTranslationHandlerParams} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageService } from '../../common/services/language-service';
import {RecaptchaDynamicLanguageLoaderService} from '../../common/services/dynamic-lang-change.service';
import {NewsSectionComponent} from './components/news-section/news-section.component';
import {SelectDropDownModule} from 'ngx-select-dropdown';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return 'Translate me!';
  }
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/cs/cop/assets/i18n/', '.json');
}


@NgModule({
  imports: [
    CommonModule,
    CCMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CustomerCareRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FileUploadModule,
    SelectDropDownModule,
    RecaptchaModule.forRoot(),
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      isolate: true
    }),
  ],
  declarations: [
    HeroComponent,
    MyActivitiesComponent,
    RequestsListComponent,
    HistoryListComponent,
    ActionCardComponent,
    ActionCardsComponent,
    MainComponent,
    ActionModalComponent,
    ModifyTicketComponent,
    UpdateSummaryPipe,
    FileSizePipe,
    SafeHTMLPipe,
    SafeResourcePipe,
    FormComponent,
    OutageListComponent,
    DelegationComponent,
    NewsSectionComponent,
    ServicenowTicketsListComponent
  ],
  entryComponents: [
    ActionModalComponent,
    HeroComponent,
    MyActivitiesComponent,
    ActionCardsComponent,
    ModifyTicketComponent
  ],
  exports: [
    MainComponent
  ],
  providers: [
    WindowRef,
    UIBaseService,
    QuestionService,
    QuestionControlService,
    ProcessProvider,
    TicketsService,
    {
      provide: RecaptchaLoaderService,
      useClass: RecaptchaDynamicLanguageLoaderService,
    },
   
  ]
})
export class CustomerCareModule { 
  localInfo: any; 
  constructor(translate: TranslateService, uiB: UIBaseService,@Inject(DOCUMENT) private _document: Document,
  @Inject(RecaptchaLoaderService)private loader: RecaptchaDynamicLanguageLoaderService,
  private zone: NgZone){
    //translate.use("fr");
    var lang;
    this.localInfo = uiB.getDataFromVar("localeInfo");
    if(this.localInfo.locale){
  lang = this.localInfo.locale.substr(0, this.localInfo.locale.indexOf('_')); 
    }
  //alert(lang);
    translate.setDefaultLang(lang);
    translate.use(lang);
    this.loader.updateLanguage(lang);
  //   var recaptach = this._document.querySelector('.recaptcha');
  //   if(recaptach){
  //   recaptach.innerHTML = '';
  //   }
      
  //     var script = this._document.createElement('script');
  //     script.src = 'https://www.google.com/recaptcha/api.js?hl=' + lang;
  //     script.async = true;
  //     script.defer = true;
  //     this._document.querySelector('head').appendChild(script);
   
  // }

  
  }
}
