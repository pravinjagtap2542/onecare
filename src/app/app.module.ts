import { NgModule, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { CustomerCareModule } from './modules/customer-care/customer-care.module';
import { ChatComponent } from './common/components/chat/chat.component';

import { NgIdleModule } from '@ng-idle/core';
import { DomService } from './common/services/dom.service';
import { ModalService } from './common/services/modal.service';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './app.customUrlSerializer';
import { CarouselComponent, CarouselItemElement } from './common/components/carousel/carousel.component';
import { SearchComponent } from './common/components/search/search.component';
import { ContainerComponent } from './common/components/container/container.component';
import { CarouselItemDirective } from './common/components/carousel/carousel-item.directive';
import { TutorialsComponent } from './common/components/tutorials/tutorials.component';
import { ResourcesComponent } from './common/components/resources/resources.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng4-click-outside';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from './common/services/search.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatListModule,MatExpansionModule } from '@angular/material';
import { PublicComponent } from './common/components/public-page/public/public.component';
import { PublicHeaderComponent } from './common/components/public-page/public-header/public-header.component';
import { PublicFooterComponent } from './common/components/public-page/public-footer/public-footer.component';
import {SearchPageComponent}  from './common/components/search-page/search-page.component';
import {TranslateModule, TranslateService, TranslateLoader} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 import { LanguageService } from './common/services/language-service';
import { UIBaseService } from './common/services/uibase.service';
import { DOCUMENT } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

//import {NgxSelectModule} from 'ngx-select-ex';
import { from } from 'rxjs';
import { NgScrollbarModule } from 'ngx-scrollbar';
// import { WelcomeComponent } from './common/components/welcome/welcome.component';
// import { WelcomeHeaderComponent } from './common/components/welcome/welcome-header/welcome-header.component';
// import { WelcomeFooterComponent } from './common/components/welcome/welcome-footer/welcome-footer.component';
 import { DropdownDirective,SubDropdownDirective,ProfileDropdownDirective } from './common/directives/dropdown.directive';
import { SearchpageHeaderComponent } from './common/components/search-page/searchpage-Header/searchpage-header.component';
export function createTranslateLoader(httpClient: HttpClient) {
  
      return new TranslateHttpLoader(httpClient, '/cs/cop/assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    SearchComponent,
    ContainerComponent,
    CarouselItemDirective,
    CarouselItemElement,
    TutorialsComponent,
    ResourcesComponent,
    ChatComponent,
    SearchResultsComponent,
    PublicComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    DropdownDirective,
    SubDropdownDirective,
    ProfileDropdownDirective,
    SearchPageComponent,
    SearchpageHeaderComponent

  ],
  imports: [
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    AngularFontAwesomeModule,
    //sNgxSelectModule,
    BrowserModule,
    NgScrollbarModule,
    AppRoutingModule,
    CustomerCareModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader, 
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },

      isolate: true
    }),
    NgIdleModule.forRoot(),
    FormsModule,
    ClickOutsideModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  providers: [
    ModalService,
    DomService,
    SearchService,
    LanguageService,
   { provide: UrlSerializer, useClass: CustomUrlSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  localInfo: any; 

  constructor(translate: TranslateService , uiB: UIBaseService,language:LanguageService, @Inject(DOCUMENT) private _document: Document) {
   
    //translate.setDefaultLang("fr");
    //translate.use("fr");
    var lang;
    this.localInfo = uiB.getDataFromVar("localeInfo");
    if(this.localInfo.locale){
  lang = this.localInfo.locale.substr(0, this.localInfo.locale.indexOf('_')); 
    }
  //alert(lang);
  language.lang = lang;
    translate.setDefaultLang(lang);
    translate.use(lang);
 
  }
}
