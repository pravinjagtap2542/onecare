import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../../../common/services/language-service';

@Component({
  selector: 'cop-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnInit {
  @Input() data: {id: string, function: string, title: string, description: string, displayinportal: string, tileicon: string, isPublic: boolean};
  
  origin: string;
  isAvayaCloudOffice: boolean =false;
  isAvayaCCass: boolean = false;
  viewTitle:string;
  localecode:string;

  constructor(private router: Router, private route: ActivatedRoute, private languageService:LanguageService,
    ) { }

  ngOnInit(): void {

    //console.log("data",this.data);
    if(window.location.href.indexOf("AvayaCloudOffice") > -1){
      this.isAvayaCloudOffice = true;
     // this.acoUrl = window.location.href;
     let index = window.location.href.indexOf("view=");
     this.viewTitle = window.location.href.slice(index+5,window.location.href.length)
    
    }

    // if(window.location.href.indexOf('customercare') > -1){
    //   let index = window.location.href.indexOf("customercare/");
    //   this.localecode = window.location.href.slice(index+12, index+15);
    //   console.log("localecode",this.localecode);
    // }
    if (window.location.href.indexOf("AvayaOneCloudCCaaS") > -1) {
      this.isAvayaCCass = true;
      let index = window.location.href.indexOf("view=");
      this.viewTitle = window.location.href.slice(index+5,window.location.href.length)
    }

    var url= window.location.href;
     this.origin = url.includes('/home') ? this.languageService.localCode+'/home' : url.includes('/history') ? this.languageService.localCode+'/history' : this.languageService.localCode+'/requests';
    //console.log("origin before",this.origin);
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(event => {
      const urlPath: string = event['urlAfterRedirects'];
      //console.log("urlpath",urlPath);
      this.origin = urlPath.includes('/home') ? this.languageService.localCode+'/home' : urlPath.includes('/history') ? this.languageService.localCode+'/history' : this.languageService.localCode+'/requests';
     // console.log("this.origin",this.origin);
    });
    //console.log("data",this.data);
  }
  
  
}
