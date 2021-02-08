import { Component, OnInit, Input } from '@angular/core';
import { Catalog } from '../../models/catalog.model';
import { DataService } from '../../../../common/services/data.service';
import { of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { WindowRef } from '../../../../common/services/core/window-ref.service';
import { LanguageService } from '../../../../common/services/language-service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UIDataService } from '../../services/uidata.service';

@Component({
  selector: 'cop-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.scss']
})
export class ActionCardsComponent implements OnInit {

  cards: Catalog[];
  viewsData: any;
  titles: any;
  titlesUrl: any;
  defaultTitle: any;
  @Input() inputData;
  defaultTitleText: any;
  isLoadingResults: boolean = false;
  originUrlPath: boolean = false;

  metaTitle: string;
  metaDesc: string;
  isAvayaCloudOffice: boolean = false;
  isAvayaCCass: boolean = false;
  publicHeaderlink: any;
  sinInLink: any;
  ringSSoSession: any;
  origin: string;
  newsData: any;
  topNewsData :any;
  news: any;
  //localecode: string;


  constructor(
    private ds: DataService,
    private uiB: UIBaseService,
    private win: WindowRef,
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private uiDS: UIDataService,
  ) { }

  ngOnInit() {
    //console.log("ngOnInit")
    if (window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAvayaCloudOffice = true;
    }
    if (window.location.href.indexOf("AvayaCCaaS") > -1 || window.location.href.indexOf("AvayaOneCloudCCaaS") > -1) {
      this.isAvayaCCass = true;
    }
    if (window.location.href.indexOf('public') > -1) {
      this.originUrlPath = true;
    } else {
      this.originUrlPath = false;
    }

    //console.log("inutdata",this.inputData);
    if (!this.inputData) {
      const inputData = this.uiDS.getTicketCatalog();
     
      this.inputData =  this.uiDS.getUIData("TicketCatalogComponent", "TicketCatalogComponent1378121271914");
      //console.log("inut data reset",this.inputData);
    }

    // this.ds.seesionOnRing.subscribe(isSession =>{   
    //   console.log("isSession Data subscribe",isSession);


    //    if(isSession){
    //     this.router.navigate([this.route.url])
    //     if(!this.inputData){
    //       const inputData = this.uiDS.getTicketCatalog();
    //       this.inputData = inputData;
    //       this.processInputData(inputData);
    //       console.log("inut data reset",this.inputData);
    //     }else{
    //      this.processInputData(this.inputData);
    //      this.ngOnInit();
    //     }
    //    }
    // });

    // if(window.location.href.indexOf('customercare') > -1){
    //   let index = window.location.href.indexOf("customercare/");
    //   this.localecode = window.location.href.slice(index+12, index+15);
    //   console.log("localecode",this.localecode);
    // }
if(this.inputData){
    this.processInputData(this.inputData);
}


    this.publicHeaderlink = this.uiB.pageHeader.headerLinks;
    this.publicHeaderlink.forEach(element => {
      if (element.alttext == "signin") {
        this.sinInLink = element.url;
      }
    });

    this.ds.ringSso.subscribe(profile => {
      this.ringSSoSession = profile;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const urlPath: string = event['urlAfterRedirects'];
        // console.log("urlpath",urlPath);
        this.origin = urlPath.includes('/home') ? this.languageService.localCode + '/home' : urlPath.includes('/history') ? this.languageService.localCode + '/history' : this.languageService.localCode + '/requests';
        //console.log("this.origin",this.origin);
      });

  }


  processInputData(dataInput) {
    const data = <Catalog[]>dataInput;
    // console.log("data",data);
    var metaCatalogIndex;
    if (data) {
      metaCatalogIndex = data.findIndex(ofItem => ofItem && ofItem.id && ofItem.id.toLowerCase() === 'catalogmetadata');
    }
    if (metaCatalogIndex && metaCatalogIndex > 0) {
      this.metaTitle = data[metaCatalogIndex].title;
      this.metaDesc = data[metaCatalogIndex].description;
      data.splice(metaCatalogIndex, 1);
    }
    this.cards = data;
    //console.log("cards",this.cards);
    this.viewsData = this.cards.filter(obj => {
      return obj.hasOwnProperty('views');
    })
    this.newsData = this.cards.filter(obj => {
      return obj.hasOwnProperty('News');
    })

    this.topNewsData = this.newsData[0].TopNews;
    this.news = this.newsData[0].News;
    //console.log("news",this.news);
   // console.log("Topnews",this.topNewsData);

    //console.log("newsdata",this.newsData, this.newsData.length);
    if (this.viewsData.length > 0) {
      this.titles = this.viewsData[0].views.map(a => a.title);
      this.titlesUrl = this.viewsData[0].views.map(a => a.urlname);

      //console.log("----what is in title----", this.titles);
      this.defaultTitle = this.viewsData[0].views.map(a => a.defaultview ? a.title : '');
      for (let i in this.defaultTitle) {
        if (this.defaultTitle[i] != "") {
          this.defaultTitleText = this.defaultTitle[i];
          break;
        }
      }
      if (this.defaultTitleText) {
        this.defaultTitleText = this.defaultTitleText.toString().replace(",", "");
        this.titles = this.titles.filter(item => item !== this.defaultTitleText);
       // console.log("--line no 150--", this.titles);
        for (let i in this.titles) {
          this.titles[i].toString().replace(",", "");
        }
      }
      //this.this.defaultTitleText = this.defaultTitleText.toString().replace(",", "");

    }
  }
  //"hello world".replace(/\s/g, ""); 
  tileViewSelectorChange(event) {
    let titleURL;
    for (let i in this.viewsData[0].views) {
      if (this.viewsData[0].views[i].title == event.target.value) {
        titleURL = this.viewsData[0].views[i].urlname
      }
    }
    var RequestedURL = window.location.href + "?view=" + titleURL;
    //console.log('RequestedURL:', RequestedURL);

    setTimeout(() => {
      window.postMessage({ 'urlUpdated': RequestedURL }, '*')
    }, 3000);
    this.isLoadingResults = true;
    let id = this.viewsData[0].views.map(a => a.title == event.target.value ? a.id : '');
    let paramId: any;
    for (let i in id) {
      if (id[i] != "") {
        paramId = id[i];
        break;
      }
    }
    paramId = paramId.toString().replace(",", "");
    let url = "/cs/Satellite?pagename=CustomerOps%2FAVA_Components%2FCatalogContainer%2FDefaultCatalogContainer&showView=" + paramId + "&usertype=" + this.uiB.userInfo.usertype + "&defaultcatalog=1378121271914&locale=" + this.languageService.localInfo.locale;
    this.ds.getData(url)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        this.win.nativeWindow['TicketCatalogComponent1378121271914'] = JSON.stringify(resp);

        const response = resp;
        const newData = <Catalog[]>response;

        // const metaCatalogIndex = newData.findIndex(ofItem => ofItem.id.toLowerCase() === 'catalogmetadata');
        // if ( metaCatalogIndex > 0 ) {
        //   this.metaTitle = newData[metaCatalogIndex].title;
        //   this.metaDesc = newData[metaCatalogIndex].description;
        //   newData.splice(metaCatalogIndex, 1);
        // }
        this.cards = newData;
        this.isLoadingResults = false;
       // this.router.navigateByUrl(this.origin);

      });

  }


}
