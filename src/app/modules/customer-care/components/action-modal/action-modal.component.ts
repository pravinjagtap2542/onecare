import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { QuestionService } from '../../services/question.service';

import { Categoryassoc, Catalog } from '../../models/catalog.model';
import { TableGrid, DataService } from '../../../../common/services/data.service';
import { UIDataService } from '../../services/uidata.service';
import { FormComponent } from '../form/form.component';
import { KbLinks } from '../../models/catalog.model';
import { map, catchError, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Category } from '../../models/ticket.model';
import { LanguageService } from '../../../../common/services/language-service';

@Component({
  selector: 'cop-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss']
})
export class ActionModalComponent
  implements OnInit,
  OnDestroy {
  @ViewChild(FormComponent, { static: true }) formComponent: FormComponent;
  catalog: Catalog;
  subscriptions: Subscription[] = [];
  origin: string;
  currFunction: string;
  selFunction: string;
  selectedCategoryAssoc: Categoryassoc;
  innerWidth: number;
  modeParam: string = "";
  KBLinks: any;
  originUrlPath: boolean = false;
  isAvayaCloudOffice: boolean = false;
  acoUrl: string;
  isAvayaCCass:boolean = false;
  // = [
  //  {
  //     "kbtitle":"Self-Help",
  //     "kbdescription":"Check-out the below FAQs",
  //     "kblinks":[
  //        {
  //           "title":"Global Password Change",
  //           "url":"https://PasswordChange.avaya.com",
  //           "alttext":"Global Password Change"
  //        },
  //        {
  //           "title":"&quot;ToolsA: Password reset",
  //           "url":"https://support.avaya.com/ext/index?page=content&id=ITKB104640",
  //           "alttext":"&quot;ToolsA: Password reset"
  //        },
  //        {
  //           "title":"&quot;Global Password Policies",
  //           "url":"https://support.avaya.com/ext/index?page=content&id=ITKB104596",
  //           "alttext":"&quot;Global Password Policies"
  //        },
  //        {
  //           "title":"&quot;Avaya Global Domain Overview",
  //           "url":"https://support.avaya.com/ext/index?page=content&id=ITKB104743",
  //           "alttext":"&quot;Avaya Global Domain Overview"
  //        },
  //        {
  //           "title":"&quot;Voicemail: password constantly locked",
  //           "url":"https://support.avaya.com/ext/index?page=content&id=ITKB104645",
  //           "alttext":"&quot;Voicemail: password constantly locked"
  //        }
  //     ]
  //  }];

  constructor(
    private service: QuestionService,
    private ds: DataService,
    private uiDS: UIDataService,
    private route: ActivatedRoute,
    private router: Router,
    private languageService:LanguageService) { }

  ngOnInit() {

    if (window.location.href.indexOf('public') > -1) {
      this.originUrlPath = true;
    } else {
      this.originUrlPath = false;
    }
    if (window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAvayaCloudOffice = true;
      this.acoUrl = window.location.href;

      var index = this.acoUrl.indexOf('?');
      //var arr = [this.acoUrl.slice(0, index), this.acoUrl.slice(index + 1)];
      this.acoUrl = this.acoUrl.slice(0, index) + "?" +  this.acoUrl.slice(this.acoUrl.indexOf('view='),this.acoUrl.length);
      // console.log("this.acoUrl",this.acoUrl);
    }
    if (window.location.href.indexOf("AvayaOneCloudCCaaS") > -1) {
      this.isAvayaCCass = true;
      this.acoUrl = window.location.href;

      var index = this.acoUrl.indexOf('?');
      //var arr = [this.acoUrl.slice(0, index), this.acoUrl.slice(index + 1)];
      this.acoUrl = this.acoUrl.slice(0, index) + "?" + this.acoUrl.slice(this.acoUrl.indexOf('view='),this.acoUrl.length);
      // console.log("this.acoUrl",this.acoUrl);
    }

    this.innerWidth = window.innerWidth;
this.origin = this.languageService.localCode+'/home';
    this.catalog = this.uiDS.getTicketCatalog()
      .find(item => item.id === this.route.snapshot.queryParams['function']);
    if (!!this.route.snapshot.queryParamMap.get('link')) { 
      this.catalog.categoryassocs = this.catalog.categoryassocs
        .filter(item => item.id === this.route.snapshot.queryParamMap.get('category'));
      if (this.catalog.categoryassocs.length == 1) {
        this.currFunction = this.catalog.categoryassocs[0].id;
      }
      this.selectedCategoryAssoc = this.catalog.categoryassocs[0];
      let kbLinksUrlInitLink = this.selectedCategoryAssoc.questionsassoc + "&getKb=true";
      this.ds.getData(kbLinksUrlInitLink)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
          this.KBLinks = resp[0];
        });
    } else {
      this.subscriptions.push(
        this.route.queryParamMap
          .subscribe(params => {
            if (this.catalog.categoryassocs.length == 1) {
              this.currFunction = params.get('category') || this.catalog.categoryassocs[0].id;
              this.selectedCategoryAssoc = this.catalog.categoryassocs.find(item => item.id === this.currFunction);
              let kbLinksUrlInit = this.selectedCategoryAssoc.questionsassoc + "&getKb=true";
              this.ds.getData(kbLinksUrlInit)
                .pipe(
                  catchError(val => of(`ERROR sending data ${val}`)))
                .subscribe(resp => {
                  this.KBLinks = resp[0];
                });
            } else if (this.catalog.categoryassocs.length > 1) {
              if (this.route.snapshot.queryParamMap.get('mode') == "direct") {
                this.catalog.categoryassocs.forEach(elem => {
                  if (elem.id == this.route.snapshot.queryParamMap.get('category')) {
                    this.selectFunction(elem.id);
                  }
                })
              }
            }
            //  console.log('--rite--', this.router.url);
            //  console.log('--rite--', this.route)
            //  console.log('--params---',params );
            this.origin = params.get('origin') || this.languageService.localCode+'/home';
          })
      );
    }

    this.catalog.view = this.route.snapshot.queryParamMap.get('view');
  }

  navigateToAvayaCloudOffice() {
    window.location.href = this.acoUrl;
  }
  selectFunction(id: string) {
    let kbLinksUrl = "";
    this.innerWidth = window.innerWidth;
    this.currFunction = id;
    this.selectedCategoryAssoc = this.catalog.categoryassocs.find(item => item.id === id);
    kbLinksUrl = this.selectedCategoryAssoc.questionsassoc + "&getKb=true";
    //kbLinksUrl = kbLinksUrl.replace("cops/itss//", "");
    this.ds.getData(kbLinksUrl)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`)))
      .subscribe(resp => {
        this.KBLinks = resp[0];
        if (this.route.snapshot.queryParamMap.get('mode') == "direct") {
          this.formComponent.selectFunction(id, this.KBLinks);
        }
      });
    if (this.route.snapshot.queryParamMap.get('mode') != "direct") {
      this.formComponent.selectFunction(id, this.KBLinks);
    }

  }

  closeModal() {
    // this.router.navigate([ this.origin || 'home' ]);
    // this.modeParam = this.route.snapshot.queryParamMap.get('mode');
    // if(this.modeParam && this.modeParam == "direct"){
    //   this.router.navigate(['home']);
    //   window.location.reload();
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
