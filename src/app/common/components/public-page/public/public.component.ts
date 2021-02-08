// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, SimpleChange, Inject } from '@angular/core';
import { Hero } from '../../../../modules/customer-care/models/hero.model';
//  /modules/customer-care/
import { UIDataService } from '../../../../modules/customer-care/services/uidata.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
// import { element } from '@angular/core/src/render3/instructions';
import { DataService } from '../../../../common/services/data.service';
import { SearchService } from '../../../../common/services/search.service';
import { ActivatedRoute } from '@angular/router';
// import { b } from '@angular/core/src/render3';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language-service';

import { UIBaseService } from '../../../services/uibase.service';
@Component({
  selector: 'cop-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  text = '';
  @Input() heroData: Hero;
  @Input() receivedSearchValue;
  // @Input() jsonSearchValue;

  @Input() search;
  @Output() changeSearch = new EventEmitter();
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;
  heroImage: any;
  searchValue: any;
  jsonloopValues: any;
  bigSearchBar: any;
  bigSerachData: any;
  sesrchdtrValue: any;
  currentValue: any;
  totalengthJson: any;
  isAvayaCloudOffice: boolean = false;
  isAvayaCCass: boolean = false;
  subscription: any;
  searchTerm = '';
  searchTermResponse: any;
  searchFieldResponse: any
  searchResultJsonResponse: any;

  pageChange = 1;
  totalRecords: any;
  toSearchResult: any;
  fromSearchResult: any;
  isLoadingResults: boolean = false;
  oneCareUrl: any;
  avayaUrl: any;
  change: boolean = false;
  changeCursor: boolean = true;
  mouseLeaver: boolean = true;
  profile = "avaya_en";
  checkUrl: boolean = false;
  grayTitle = false;
  commonURl: any;
  acoUrl: string;
  publicHeaderlink: any;
  filterInput: any;
  sinInLink: any;
  publicPageLink: string;
  filterDropdown: boolean = false;
  filterCategory = "all";
  filterLang = "all";
  filterDocumentType = "all";
  filterContentType = "all";
  selected: any;
  selected1: any;
  filtered: any;
  FilterTypeSelected: any;
  expanded: boolean = false;
  sta: any;
  langCount = []
  panelOpenState = false;
  select_all2 = false;
  select_all1 = false;
  select_all = false;
  ringSSOSession: any;
  isRingSSOSession: boolean;
  selectedLanguages: Array<any> = [];
  docTypeArray: Array<any> = []
  docTypeCount: Array<any> = []
  contentTypeArray: Array<any> = []
  contentTypeCount: Array<any> = []
  selectedDocType: Array<any> = [];
  selectedContentType: Array<any> = [];
  languageArray: Array<any> = [];
  languageCount: Array<any> = [];
  //selectedLanguage:Array<any> = [];
  disabledSelect: boolean = true;
  FilterType = "Relevence";
  isSearchTermBlank: boolean;
  greyTitleText = "";
  is404Page: boolean = false;
  stat = [
    { 'name': 'Avaya Knowledge', 'key': 'avayaknowledge' },
    //  { 'name': 'OneCare Service Catalog', 'key': 'onecareservice_catalog' }
  ];
  status = [];
  SortBy = [
    { 'name': 'Relevence', 'key': 'relevence' },
    { 'name': 'Last Updated', 'key': 'last_updated' }
  ];
  Sort = ["Relevence", "Last Updated"];
  searchkey: string;
  openSearchView: boolean = true;

  constructor(
    private uiDS: UIDataService,
    private ds: DataService,
    private searchservice: SearchService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languageService: LanguageService, private uiB: UIBaseService) { }

  ngOnInit() {
    this.publicPageLink = "/customercare/" + this.languageService.lang + "/public";
    if (!this.heroData) {
      this.heroData = this.uiDS.hero;
    }
    // Get Search Term
    this.getSearchTerm();
    var currentUrl = window.location.href;
    var spiltUrl = currentUrl.slice(0, currentUrl.indexOf('.com') + 4)
    if (currentUrl.indexOf('salescms') > 0) {
      this.acoUrl = spiltUrl + "/customercare" + this.languageService.localCode + "/AvayaCloudOffice";
    } else {
      this.acoUrl = spiltUrl + this.languageService.localCode + "/AvayaCloudOffice";
    }

    this.filterInput = this.uiDS;
    this.publicHeaderlink = this.filterInput.uibase.pageHeader.headerLinks;
    this.publicHeaderlink.forEach(element => {
      if (element.alttext == "signin") {
        this.sinInLink = element.url;
      }
    });
    var code;
    this.route.queryParams.subscribe(params => {
      code = params['code'];

      if (code && code != null && code != undefined) {
        this.validateRingCentraCode(code);
      }


    });

    var ringSessionLive = JSON.parse(localStorage.getItem('ringUser'));
    if (ringSessionLive) {
      const now = new Date()
      // compare the expiry time of the item with the current time
      if (now.getTime() > ringSessionLive.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        this.revokeSsoSesion();
        localStorage.removeItem('ringUser');
        this.isRingSSOSession = false;
        this.ds.getRingSessionData(null);
      } else {
        this.isRingSSOSession = true;
        this.ds.getRingSessionData(ringSessionLive.value);
      }
    }
    if (window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAvayaCloudOffice = true;
    }
    if (window.location.href.indexOf("AvayaCCaaS") > -1 || window.location.href.indexOf("AvayaOneCloudCCaaS") > -1) {
      this.isAvayaCCass = true;
    }

    if (this.uiDS.hero && this.uiDS.hero.image) {
      this.heroImage = this.uiDS.hero.image.imageUrl;
    }

    var pageNotFound = this.uiB.getDataFromVar("booleanPageNotFound");
    if (pageNotFound.isPageNotFound == true || pageNotFound.isPageNotFound == 'true' || pageNotFound.isPageNotFound == `true`) {
      this.is404Page = true;
    }
    //console.log("this.is404page", this.is404Page)

    if (this.isAvayaCloudOffice) {
      this.status = ['Avaya Knowledge'];
    }
    else {
      this.status = ['Avaya Knowledge'];
      //this.status = ['Avaya Knowledge', 'OneCare Service Catalog'];
    }

    this.uiDS.openSearchView.subscribe(data => {
      this.openSearchView = data
    })
    this.ds.ringSso.subscribe(profile => {
      this.ringSSOSession = profile;

    });
  }


  onOptionsSelected(event, value: string) {
    if (this.fileinput != null) {
      if (this.fileinput.nativeElement.value != "") {
        this.disabledSelect = false;
      }
      else {
        this.disabledSelect = true;
      }
    }
    if (value == "OneCare Service Catalog") {
      this.greyTitleText = "OneCare Service Catalog"
    }
    else {
      this.greyTitleText = "Avaya Knowledge"
    }
    this.resetFilters()

    for (var i = 0; i < this.stat.length; i++) {
      if (event.target.value == this.stat[i].name) {
        this.filtered = this.stat.filter(t => t.name == this.selected);
        this.filterCategory = this.stat[i].key;
      }
    }
    this.pageChange = 1;
    if (this.fileinput != null) {
      this.searchTerm = this.fileinput.nativeElement.value;
    }
    // bigSearch content
    if (this.searchTerm.trim() != "") {
      //console.log("2");
      this.getSearchResultJsonResponse();

    }
    else {
      this.isSearchTermBlank = true;
    }

  }

  onSortBySelection(event, value: string) {
    for (var i = 0; i < this.SortBy.length; i++) {
      if (event.target.value == this.SortBy[i].name) {
        this.FilterTypeSelected = this.SortBy.filter(t => t.name == this.selected1);
        this.FilterType = this.SortBy[i].key;
      }
    }
    this.pageChange = 1;
    if (this.fileinput != null) {
      this.searchTerm = this.fileinput.nativeElement.value
    } // bigSearch content

    this.getSearchResultJsonResponse();
  }

  onSelectAllContentType(e: any) {
    for (let i = 0; i < this.contentTypeArray.length; i++) {
      const item = this.contentTypeArray[i];
      item.is_selected1 = e;
    }
    if (e == false) {
      this.contentTypeCount = []
      this.selectedContentType = [];
    } else {
      this.filterContentType = "all"

      this.getSearchResultJsonResponse();
    }
  }
  onSelectAllDocumentType(e: any) {
    for (let i = 0; i < this.docTypeArray.length; i++) {
      const item = this.docTypeArray[i];
      item.is_selected2 = e;
    }
    if (e == false) {
      this.docTypeCount = []
      this.selectedDocType = [];
    }
    else {
      this.filterDocumentType = "all"

      this.getSearchResultJsonResponse();
    }
  }
  onSelectAllLanguageType(e: any) {
    for (let i = 0; i < this.languageArray.length; i++) {
      const item = this.languageArray[i];
      item.is_selected = e;
    }
    if (e == false) {
      this.languageCount = []
      this.selectedLanguages = [];
    }
    else {
      this.filterLang = "all"

      this.getSearchResultJsonResponse();
    }
  }

  getSearchTerm() {
    this.searchservice
      .getSearchTerm()
      .subscribe(data => {
        if (Object.keys(data).length > 0) {
          this.searchTerm = data;
          this.getSearchResultJsonResponse();
        } else {
          this.searchTerm = '';
        }
        if (window.location.href.indexOf("en/search") > -1) {
          this.checkUrl = true;
        }
      });
  }

  clickEvent(textData) {
    this.change = !this.change;
    this.pageChange = 1;
    if (textData === 'oneCare') {
      this.profile = "onecare_servicecatalog";
      this.isLoadingResults = true;
      this.onPageChange(this.pageChange);
      let url = '/cs/Satellite?pagename=OCP/Search/GetSearchResultJSON&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType;
      this.ds.getSearchHtmlResponse(url)
        .subscribe(data => {
          this.responseResult(data);
          this.grayTitle = true;
        });
    } else {
      this.profile = "avaya_en";
      this.isLoadingResults = true;
      this.onPageChange(this.pageChange);
      let url = '/cs/Satellite?pagename=OCP/Search/GetSearchResultJSON&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType;
      this.ds.getSearchHtmlResponse(url)
        .subscribe(data => {
          this.responseResult(data);
          this.grayTitle = true;
        });
    }
  }
  getSearchResultJsonResponse() {

    // window.location.href=window.location.href +'?search=true&searchkey='+this.searchTerm;
    //needed to blank all arrays
    this.isLoadingResults = true;
    this.searchResultJsonResponse = '';
    this.profile = "aco_en";
    if (this.isAvayaCloudOffice) {
      if (this.languageService.lang == 'fr') {
        this.profile = "aco_fr";
      }
    }
    //this.filterCategory = "avayaknowledge";
    if (this.isAvayaCloudOffice) {
      this.filterCategory = "aco_en";
      if (this.languageService.lang == 'fr') {
        this.filterCategory = "aco_fr";
      }
    }
    //console.log("search3::" + this.searchTerm);
    let url = '/cs/Satellite?pagename=OCP/Search/GetSearchResultJSON&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType;

    this.ds.getSearchHtmlResponse(url)
      .subscribe(data => {
        this.checkTotalResults(data)

      });
  }

  checkTotalResults(data) {
    this.isLoadingResults = false;
    if (data.body.totalResults == 0 || data.body.totalResults == "0") {
      this.totalRecords = 0
    }
    this.responseResult(data);
    //  this.getFacetsCount(data);
    this.getLanguages(data);
    this.getSupportContentType(data);
    this.getSupportDocType(data);
    this.grayTitle = true;
    //window.location.href=window.location.href +'?search=true&searchkey='+this.searchTerm;
  }

  //alert(code);
  validateRingCentraCode(code) {
    let url = "getUserProfile";
    const formData = new FormData();
    formData.append("RingCode", code);
    formData.append("redirect_uri", this.sinInLink);
    this.ds.publicPostData(url, formData)
      .pipe(
        switchMap((resp: any) => {
          if (resp) {
            if (resp.accessToken) {
              this.isRingSSOSession = true;
              this.ringSSOSession = resp;
              //this.ds.ringSSOSession = resp;
            }
          }
          return of(resp);
        }))
      .subscribe((data: any) => {
        if (data.accessToken) {
          this.isRingSSOSession = true;
          this.ringSSOSession = data;
          // this.ds.reloadOnRingSession(true);
          // this.ds.ringSSOSession = data;
          this.ds.getRingSessionData(data);
          this.setRingSSOSession(data);
          setTimeout(() => {
            window.location.href = this.acoUrl;
          }
            , 200);
        }

      });
  }

  setRingSSOSession(data) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: data,
      expiry: now.getTime() + (60 * 60000)
    }

    localStorage.setItem('ringUser', JSON.stringify(item));
  }
  responseResult(data) {
    this.searchResultJsonResponse = data;
    this.isLoadingResults = false;
    this.totalRecords = this.searchResultJsonResponse.body.totalResults;
    let checkValue = this.pageChange * 10;
    this.fromSearchResult = checkValue - 9;
    if (checkValue < this.totalRecords) {
      this.toSearchResult = checkValue;
    } else {
      this.toSearchResult = this.totalRecords;
    }
  }

  getfileinput(event) {
    if (this.fileinput != null) {
      this.greyTitleText = "Avaya Knowledge"
      if (this.fileinput.nativeElement.value != "") {
        this.isSearchTermBlank = false;
      }
      else {
        this.isSearchTermBlank = true;
      }
    }
    if (event.keyCode === 13 || event.which === 1) {
      //this.select_all = false;
      this.resetFilters()
      this.pageChange = 1;
      if (this.fileinput != null) {
        this.searchTerm = this.fileinput.nativeElement.value
        if (this.fileinput.nativeElement.value != "") {

          this.getSearchResultJsonResponse();

        }
        else {
          this.isSearchTermBlank = true;
        }
      }
      // bigSearch content

    }
  }





  private resetFilters(): void {
    this.select_all = false;
    this.select_all1 = false;
    this.select_all2 = false;
    this.selectedLanguages = [];
    this.docTypeArray = []
    this.contentTypeArray = []
    this.languageCount = []
    this.selectedLanguages = []
    this.languageArray = []
    this.docTypeCount = []
    this.contentTypeCount = []
    this.selectedDocType = [];
    this.selectedContentType = [];
    this.filterLang = "all"
    this.filterContentType = "all"
    this.filterDocumentType = "all"
    this.languageArray.forEach(element => {
      element.is_selected = false;
    });
    this.docTypeArray.forEach(element => {
      element.is_selected2 = false;
    });
    this.contentTypeArray.forEach(element => {
      element.is_selected1 = false;
    });
  }

  onPageChange = (event) => {
    window.scrollTo(0, 0);
    this.pageChange = event;
    this.getSearchResultJsonResponse();
    this.totalRecords = this.searchResultJsonResponse.body.totalResults;
    let checkValue = this.pageChange * 10;
    this.fromSearchResult = checkValue - 9;
    if (checkValue < this.totalRecords) {
      this.toSearchResult = checkValue;
    } else {
      this.toSearchResult = this.totalRecords;
    }
  }

  setMergeTitle(url, tileTitle, formTitle) {
    let title;
    let arrow;
    let tTitle;
    // 
    if (tileTitle.length > 0 || tileTitle != '') {
      arrow = '<span class="titleSeparatorIcon">' + '—' + '</span>';
      tTitle = '<span class="titleSeparatorFull">' + tileTitle + '</span>'
    } else {
      arrow = '<span class="titleSeparatorIcon">' + '' + '</span>';
      tTitle = '<span class="titleSeparator">' + tileTitle + '</span>'
    }
    title = '<a target="_blank" href="' + url + '">' + formTitle + arrow + tTitle + '</a>';
    return title;
  }

  getFacetsCount(data) {
    // debugger
    var facetsLangVal = data.body.Facets[0].language
    for (let i = 0; i < facetsLangVal.length; i++) {
      if (facetsLangVal[i].Value == "English") {
        this.languageArray[0].count = facetsLangVal[i].Count
        //this.englishCount= facetsVal[i].LanguageCount
      }
      if (facetsLangVal[i].Value == "French") {
        this.languageArray[1].count = facetsLangVal[i].Count
        //this.french
      }
    }
  }

  getSupportDocType(data) {
    if (this.docTypeArray.length == 0) {
      var docType = data.body.Facets[2].supportdocumenttype
      // console.log("getSupportDocType::" + docType.toString())
      for (let i = 0; i < docType.length; i++) {
        this.docTypeArray.push({ name: docType[i].Value, count: docType[i].Count, is_selected2: false });
        // this.docTypeArray.push(docType[i].Value)
        // this.docTypeCount.push(docType[i].Count)
      }
    }
  }

  getLanguages(data) {
    // if(data.length > 0)
    if (this.languageArray.length == 0) {
      var language = data.body.Facets[0].language

      for (let i = 0; i < language.length; i++) {
        this.languageArray.push({ name: language[i].Value, count: language[i].Count, is_selected2: false });
        // this.docTypeArray.push(docType[i].Value)
        // this.docTypeCount.push(docType[i].Count)
      }
    }
  }

  getSupportContentType(data) {
    if (this.contentTypeArray.length == 0) {
      var contentType = data.body.Facets[1].supportcontenttype
      for (let i = 0; i < contentType.length; i++) {
        this.contentTypeArray.push({ name: contentType[i].Value, count: contentType[i].Count, is_selected1: false });
        //this.contentTypeArray.push(contentType[i].Value)
        //this.contentTypeCount.push(contentType[i].Count)
      }
    }
  }

  docTypeSelection(event, language: string) {
    this.pageChange = 1;
    if (event.checked) {
      this.selectedDocType.push(language);
    } else {
      let index = this.selectedDocType.indexOf(language);
      this.selectedDocType.splice(index, 1);
    }
    if (this.selectedDocType.length > 0) {
      this.filterDocumentType = this.selectedDocType[0];
      for (var i = 1; i < this.selectedDocType.length; i++) {
        this.filterDocumentType += "|" + this.selectedDocType[i]
      }
      this.filterDocumentType = this.filterDocumentType.replace(/ /g, "%20");
    }
    else {
      this.filterDocumentType = "all"
    }

    this.getSearchResultJsonResponse();
  }

  LanguageSelection(event, language: string) {
    this.pageChange = 1;
    if (event.checked) {
      this.selectedLanguages.push(language);
    } else {
      let index = this.selectedLanguages.indexOf(language);
      this.selectedLanguages.splice(index, 1);
    }
    if (this.selectedLanguages.length > 0) {
      //console.log("inif")
      this.filterLang = this.selectedLanguages[0];
      for (var i = 1; i < this.selectedLanguages.length; i++) {
        this.filterLang += "|" + this.selectedLanguages[i]
      }
      this.filterLang = this.filterLang.replace(/ /g, "%20");
    }
    else {
      this.filterLang = "all"
    }
    this.contentTypeArray = [];
    this.docTypeArray = [];

    this.getSearchResultJsonResponse();
  }


  contentTypeSelection(event, language: string) {
    this.pageChange = 1;
    // console.log("contentTypeSelection::" + language)
    if (event.checked) {
      this.selectedContentType.push(language);
    } else {
      let index = this.selectedContentType.indexOf(language);
      this.selectedContentType.splice(index, 1);
    }
    //console.log("contentTypeSelection selectedContentType[0]::" + this.selectedContentType[0])
    if (this.selectedContentType.length > 0) {
      this.filterContentType = this.selectedContentType[0];
      for (var i = 1; i < this.selectedContentType.length; i++) {
        this.filterContentType += "|" + this.selectedContentType[i]
      }
      this.filterContentType = this.filterContentType.replace(/ /g, "%20");
    }
    else {
      this.filterContentType = "all"
    }

    this.getSearchResultJsonResponse();
  }

  revokeSsoSesion() {
    let url = "revokeToken";
    const formData = new FormData();
    if (this.ringSSOSession) {
      formData.append("Token", this.ringSSOSession.accessToken);
    }
    this.ds.publicPostData(url, formData)
      .pipe(
        switchMap((resp: any) => {
          return of(resp);
        }))
      .subscribe(data => {
        this.ds.getRingSessionData(null);
        localStorage.removeItem('ringUser')

      });

  }
}

