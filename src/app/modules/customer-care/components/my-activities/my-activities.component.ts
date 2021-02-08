import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../../common/services/data.service';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { map, catchError, filter } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { LanguageService } from '../../../../common/services/language-service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UIDataService } from '../../services/uidata.service';

@Component({
  selector: 'cop-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.scss']
})

export class MyActivitiesComponent implements OnInit {

  @Input()
  inputData; tabActive: string;
  RequestedURL: string;
 constructor(
    private ds: DataService,
    private uib: UIBaseService, private languageService:LanguageService,
    private router: Router, 
    private ui: UIDataService,
    private route: ActivatedRoute) { }
  checkValue: any;
  delegationBoolean: boolean;
  isExternalTickets:boolean =false;
  historyOriginUrl:string;
  delegationOriginUrl:string;
  myrequestsOriginUrl:string;
  tabName:string;
  

  ngOnInit() {

    if (window.location.href.indexOf("public") > -1 && window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isExternalTickets = true;
    }
    this.tabAction("myrequests");
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(event => {
      const urlPath: string = event['url'];
      //console.log("urlpath",urlPath);
      //console.log("event",event);
      this.tabName = urlPath.includes('/dgrequests') ? 'dgrequests' : urlPath.includes('/history') ? 'history' : 'myrequests' ;
      
    });
    
    const linkElement = this.uib.getDataOfType('TabContainer')[2];
    this.checkValue = linkElement ? linkElement.url :'';
    if(this.checkValue){
    this.ds.getData(this.checkValue)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        if ((resp['@totalcount'] > 0) || (resp['@count'] > 0)) {
          this.delegationBoolean = true;
        } else {
          this.delegationBoolean = false;
        }
      })
    }
    
      this.delegationOriginUrl = this.languageService.localCode+"/home/#dgrequests";
      this.myrequestsOriginUrl = this.languageService.localCode+"/home/#myrequests";
      this.historyOriginUrl = this.languageService.localCode+"/home/#history";

      this.ui.openRequestsTab.subscribe(data => {
        // this.tabAction("");
        if(data=='my'){
        this.tabAction('myrequests')
        }else if(data == 'history'){
         this.tabAction('history');
        }else if(data == 'dgrequests'){
          this.tabAction('dgrequests');
        }
      })
      

  }
  public tabAction(tab) {

    var tabURL= window.location.href.split('#');
     //var RequestedURL=""
     if(tab == 'home'){
      this.tabActive = 'home';
      window.location.href = "/customercare/" + this.languageService.lang + "/home";
    }
    if (tab == 'myrequests') { 
      if(tabURL){
        this.RequestedURL= tabURL[0] + '#' + tab;
      }
      this.tabActive = 'myrequests'; 
   //  var RequestedURL="/#myrequests"
  //   this.RequestedURL=window.location.href;
    //this.router.navigateByUrl(RequestedURL);
    this.ui.showRequestComp.next(true);
    
  }
    if (tab == 'history') { 
      if(tabURL){
        this.RequestedURL= tabURL[0] + '#' + tab;
      }
      this.tabActive = 'history';
      this.ui.showRequestComp.next(true);
  
    //var RequestedURL="/#history"
   //  this.RequestedURL=window.location.href;
    //this.router.navigateByUrl(RequestedURL);
  
  }
    if (tab == 'dgrequests') {
      if(tabURL){
        this.RequestedURL= tabURL[0] + '#' + tab;
      }
      this.tabActive = 'dgrequests';
     // RequestedURL="/#dgrequests"
    //  this.RequestedURL=window.location.href;
    //this.router.navigateByUrl(RequestedURL);
  
 }
    setTimeout(() => {
      window.postMessage({ 'urlUpdated': this.RequestedURL }, '*')
    }, 3000);
    console.log('RequestedURL:',this.RequestedURL);
    // console.log('RequestedURL:',window.location.href + RequestedURL); 
  }
}
// var currentUrl = window.location.href;
// var spiltUrl = currentUrl.slice(0, currentUrl.indexOf('.com') + 4)