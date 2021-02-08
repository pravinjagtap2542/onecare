import { Component, OnInit, ElementRef } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { WindowRef } from '../../../services/core/window-ref.service';
import { UIDataService } from '../../../../modules/customer-care/services/uidata.service';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { UIBaseService } from '../../../services/uibase.service';
import { Header } from '../../../models/header.model';
import { interval } from 'rxjs/internal/observable/interval';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { LanguageService } from '../../../services/language-service';

@Component({
  selector: 'cop-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss']
})
export class PublicHeaderComponent implements OnInit {
  RequestedURL = ''
  showMenu = false;
  filterInput: any;
  header: Header;
  firstName: string;
  fillData: string;
  lastName: string;
  userType: string;
  userInfo : any;

  pollingData: any;
  status: boolean = false;
  showDropHide: boolean = false;
  searchResponse: any;
  searchStr: any;
  show: boolean = false;
  publicHeaderlink: any;
  originUrl: string;
  isAvayaCloudOffice: boolean = false;
  isSearchPage :boolean = false;
  isAvayaCCass: boolean = false;
  infoMenu: boolean = false;
  langDropdown: boolean = false;
  enUrl: string = "";
  frUrl: string = "";
  ringSSoSession: any;
  hideListMenus: boolean = false;
  sinInLink: any;
  isSearchOpen: boolean = false;
  constructor(
    private uibase: UIBaseService,
    private router: Router,
    private ds: DataService,
    private ui: UIDataService,
    private win: WindowRef,
    private el: ElementRef,
    private searchservice: SearchService, private languageService: LanguageService) { }

  ngOnInit() {

    this.originUrl = window.location.origin;
    if (window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAvayaCloudOffice = true;
    }
    if(window.location.href.indexOf("search") > -1) {
      this.isSearchPage = true;
    
    
    }
    if (window.location.href.indexOf("AvayaCCaaS") > -1 || window.location.href.indexOf("AvayaOneCloudCCaaS") > -1) {
      this.isAvayaCCass = true;
    }
    var currentUrl = window.location.href;
    var spiltUrl = currentUrl.slice(0, currentUrl.indexOf('.com') + 4);
    if (this.isAvayaCloudOffice) {
      this.enUrl = spiltUrl + "/AvayaCloudOffice";
      this.frUrl = spiltUrl + "/fr/AvayaCloudOffice";
    }

    this.ds.ringSso.subscribe(profile => {
      //console.log("profile in subscribe",profile)
      this.ringSSoSession = profile;
    });

    this.filterInput = this.ui;
    // this.fillData = `[{"id":"1397230853405","title":"Report an Outage affecting Avaya","logoimage":"/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1397237044970&ssbinary=true","openinsamewindow":"true","url":"https://salescms-staging.avaya.com/customercare/en/home?modal=show&function=1397215362921&origin=home&mode=direct","alttext":"Report an Outage affecting Avaya"},{"id":"1397208679419","title":"Avaya System Outages","openinsamewindow":"true","url":"https://partner-itss.avaya.com ","alttext":"Avaya System Outages"},{"id":"1397208989829","title":"Docs & FAQs","openinsamewindow":"false","url":"https://support.avaya.com/search-landing/","alttext":"Docs & FAQs"},{"id":"1397208996250","title":"Partner Programs","openinsamewindow":"false","url":"https://sales.avaya.com/en/partner-programs","alttext":"Partner Programs"}]}`;
    this.publicHeaderlink = this.filterInput.uibase.pageHeader.headerLinks;
    this.publicHeaderlink.forEach(element => {
      if (element.alttext == "signin") {
        this.sinInLink = element;
        // console.log("signinlink",this.sinInLink)
      }
    });
    this.userInfo = this.uibase.userInfo;
    this.userType = this.uibase.userInfo.usertype;
  }

  clickEvent() {
    this.status = !this.status;
  }
  closeMenuItems() {
    //console.log("Close menu")
    var dropdowns = this.el.nativeElement.querySelectorAll(".menu-dropdown,.menuList,.user-dropdown");
    for (var i = 0; i < dropdowns.length; i++) {

      dropdowns[i].classList.remove('open');
      var arrowIcons = dropdowns[i].querySelectorAll('.rotate,.active')
      arrowIcons.forEach(function (icon) {
        icon.classList.remove('rotate')
        icon.classList.remove('active')
      });
      dropdowns[i].classList.remove('active');
    }
  }

  openLanguageDropdown() {
    this.langDropdown = true;
  }
  closeLanguageDropdown() {
    this.langDropdown = false;
  }
  linkTarget(link, targetType) {
    if (!link.HasSubHeaderLink) {
      window.open(link.url, targetType);

    }
    // this.showMenu = !this.showMenu;
  }
  onLoginEventFired(event, searchStr) {
    // this.searchservice.setSearchResultsPageStatus(false);
    this.showDropHide = true;
    let autoFillUrl = '/cs/Satellite?pagename=OCP/Search/getSuggestions&q=' + searchStr + '&client=test_frontend&site=default_collection&format=os';
    this.ds.getSearchResults(autoFillUrl)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        this.searchResponse = resp;
        // console.log('search Response', this.searchResponse.body.results);
      })

    if ((event.key == 'Enter' || event.which === 1)) {
      this.show = !this.show;
      this.searchservice.setSearchTerm(searchStr);
      this.searchservice.setSearchResultsPageStatus(false);
      this.searchStr = '';
    }

  }
  headSearch() {
    this.show = !this.show;
    this.showDropHide = false;
  }

  revokeSsoSesion() {
    let url = "revokeToken";
    const formData = new FormData();
    formData.append("Token", this.ringSSoSession.accessToken);
    this.ds.publicPostData(url, formData)
      .pipe(
        switchMap((resp: any) => {
          return of(resp);
        }))
      .subscribe(data => {
        this.ds.getRingSessionData(null);
        localStorage.removeItem('ringUser');
          window.location.reload();
  

      });

  }

  OpenRequestsView(type) {

    var acoUrl = window.location.href;
    var index = acoUrl.indexOf('?');
    //var arr = [this.acoUrl.slice(0, index), this.acoUrl.slice(index + 1)];
    //var view = "AvayaCloudOffice";
    this.isSearchOpen = true;
    this.ui.openRequestsTab.next(type);
    this.ui.openSearchView.next(false);

    if (type == 'my') {
      this.RequestedURL = acoUrl = acoUrl.slice(0, index) + "/#myrequests?" + acoUrl.slice(acoUrl.indexOf('view='), acoUrl.length);
    } else if (type == 'history') {
      this.RequestedURL = acoUrl = acoUrl.slice(0, index) + "/#history?" + acoUrl.slice(acoUrl.indexOf('view='), acoUrl.length);
    }
   // console.log('RequestedURL:' + this.RequestedURL);
    setTimeout(() => {
      window.postMessage({ 'urlUpdated': this.RequestedURL }, '*');
      this.closeProfileDropdown();
      this.closeMenuItems();
    }, 3000);

  }
  closeProfileDropdown() {
    var dropdowns = this.el.nativeElement.querySelectorAll(".cop-prof");
    for (var i = 0; i < dropdowns.length; i++) {

      dropdowns[i].classList.remove('open');
      dropdowns[i].classList.remove('active');
    }
  }
  openProfileDropdown() {

  }
  doNothing() {
    return;
  }

  openSearchView() {
    this.isSearchOpen = false;
    this.ui.openSearchView.next(true);
    this.ui.openRequestsTab.next(null);
  }
  ngOnDestroy() {
    this.pollingData.unsubscribe();
  }
}
