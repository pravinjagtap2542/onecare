import { Component, OnInit, Output, EventEmitter, Input, Renderer2, Inject } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UIBaseService } from '../app/common/services/uibase.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataService } from './common/services/data.service';
import { SearchService } from '../app/common/services/search.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { LanguageService } from './common/services/language-service';
@Component({
  selector: 'cop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchComponentBoolean: boolean = false;
  searchResultsStatus = false;
  publicPage = false;
  welcomePage = false;
  isIE;
  RequestedURL = ''
  searchPage: boolean = false;
  constructor(private idle: Idle, private router: Router,
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private uiBase: UIBaseService, private ds: DataService,
    private search: SearchService,
    translate: TranslateService,
    private languageService: LanguageService,
    @Inject(DOCUMENT) private _document: Document) {
    //translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    //  translate.use('fr');
    idle.setIdle(5);
    idle.setTimeout(7195); // Timeout the session after 2 hours.
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Navigate to home page after 2 hours so that interseptor takes user to Login page.
    idle.onTimeout.subscribe(() => this.router.navigate(['']));
    this.idle.watch();
  }


  ngOnInit(): void {
    this.RequestedURL = window.location.href;
    this.isIE = navigator.userAgent.indexOf("Trident/7") > -1;
    this.getSearchResultsPageStatus();
    if (window.location.href.indexOf('public') > -1) {
      this.publicPage = true;
    } else {
      this.publicPage = false;
    }
    if (window.location.href.indexOf('search') > -1) {
      this.searchPage = true;
    } 
    if (window.location.href.indexOf('welcome') > -1) {
      this.welcomePage = true;
    } else {
      this.welcomePage = false;
    }

    //this._document.querySelector('.g-recaptcha').innerHTML = '';

    this.route.queryParamMap.subscribe((params) => {
      this.RequestedURL = window.location.href
      //console.log('RequestedURL:' +this.RequestedURL);


      setTimeout(() => {
        window.postMessage({ 'urlUpdated': this.RequestedURL }, '*')
      }, 3000);
      //     const script1 = document.createElement('script') as HTMLScriptElement;
      //    script1.onload = () => {
      //  };
      // document.head.appendChild(script1);
    });
  }

  getSearchResultsPageStatus() {
    this.search
      .getSearchResultsPageStatus()
      .subscribe(data => {
        this.searchResultsStatus = data;
        // this.searchResultsStatus = true;
        //console.log('App Component > searchResultsStatus >', this.searchResultsStatus);
      });
  }

  // if (window.location.href.indexOf('login') > -1) {
  //   this.publicPage = false;
  // }
  /* search instance */
  // searchMethod = function (searchString,pageNo) {
  //   this.searchValue = searchString;
  //   this.searchComponentBoolean = true;
  // let bigSerachData = '';
  //     let url = "http://localhost:4200/cs/cop/assets/data/tickets.json";
  //   console.log('--------url-------', url);    
  //   this.ds.getData(url) 
  //     .pipe(
  //       catchError(val => of(`ERROR sending data ${val}`))
  //     )
  //     .subscribe(resp => {
  //       console.log('---resp---search-',resp);
  // 	this.jsonDataValues = '';
  //       bigSerachData = resp;
  // 	this.jsonDataValues = bigSerachData;
  // 	console.log('---this.jsonDataValues------', this.jsonDataValues);
  //       if (resp && resp.results["length"] === 0) {
  // 		this.jsonDataValues = '';
  //       } else {
  //         this.jsonDataValues = resp;
  //       }
  //     }) 
  // }

  // /* search instance End*/
  // onPageChange = (event) => {
  //     this.pageChange = event;
  //     console.log('--pageNumber--', this.pageChange);
  //  this.searchMethod(this.searchValue, this.pageChange);
  // }


  // login () {
  //     console.log('-in login---');
  //     this.change.emit();
  // }

}
