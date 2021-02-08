import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Hero } from '../modules/customer-care/models/hero.model';
import { UIDataService } from '../modules/customer-care/services/uidata.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// import { element } from '@angular/core/src/render3/instructions';
import { DataService } from '../common/services/data.service';
import { SearchService } from '../common/services/search.service';
// import { b } from '@angular/core/src/render3';

@Component({
  selector: 'cop-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  text = '';
  @Input() heroData: Hero;
  @Input() receivedSearchValue;
  // @Input() jsonSearchValue;

  @Input() search;
  @Output() changeSearch = new EventEmitter();
  @ViewChild('fileinput', {static: true}) fileinput: ElementRef;
  heroImage: any;
  searchValue: any;
  jsonloopValues: any;
  bigSearchBar: any;
  bigSerachData: any;
  sesrchdtrValue: any;
  currentValue: any;
  totalengthJson: any;


  subscription: any;
  searchTerm: any;
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
  clickedAvaya: boolean = true;
  clickedOnecare: boolean = true;

  activeTab = null;
  constructor(
    private uiDS: UIDataService,
    private ds: DataService,
    private searchservice: SearchService
  ) { }

  ngOnInit() {
    if(this.uiDS.hero && this.uiDS.hero.image){
      this.heroImage = this.uiDS.hero.image.imageUrl;
      }
    // Get Search Term
    this.getSearchTerm();
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
    // if (this.activeTab !== textData) {
    this.change = !this.change;
    this.pageChange = 1;
    if (textData === 'oneCare') {
      if (this.clickedOnecare) {
        this.clickedAvaya = true;
        this.clickedOnecare = false;
        this.profile = "onecare_servicecatalog";
        this.isLoadingResults = true;
        this.onPageChange(this.pageChange);
        let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/home/search-results&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm +'&site=onecare';
        this.ds.getSearchHtmlResponse(url)
          .subscribe(data => {
            this.responseResult(data);
          });
      }

    } else {
      if (this.clickedAvaya) {
        this.clickedAvaya = false;
        this.clickedOnecare = true;
        this.profile = "avaya_en";
        this.isLoadingResults = true;
        this.onPageChange(this.pageChange);
        let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/home/search-results&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm +'&site=onecare';
        this.ds.getSearchHtmlResponse(url)
          .subscribe(data => {
            this.responseResult(data);
          });
      }
      
    }
    // }
    // this.activeTab = textData;
  }

  getSearchResultJsonResponse() {
    this.isLoadingResults = true;
    this.searchResultJsonResponse = '';
    let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/home/search-results&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm +'&site=onecare';
    this.ds.getSearchHtmlResponse(url)
      .subscribe(data => {
        this.responseResult(data);
        // this.clickedAvaya = false;
        // this.clickedOnecare = true;
      });
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
    if ((event.keyCode === 13 || event.which === 1)) {
      this.pageChange = 1;
      this.searchTerm = this.fileinput.nativeElement.value // bigSearch content
      this.getSearchResultJsonResponse();
    }
  }

  onPageChange = (event) => {
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
    if (tileTitle.length > 0 || tileTitle != '') {
      arrow = '<span class="titleSeparatorIcon">' + ' — ' + '</span>';
      tTitle = '<span class="titleSeparatorFull">' + tileTitle + '</span>';
    } else {
      arrow = '<span class="titleSeparatorIcon">' + '' + '</span>';
      tTitle = '<span class="titleSeparator">' + tileTitle + '</span>';
    }
      if (this.profile == "avaya_en" ) {
      title = '<a target="_blank" href="' + url + '" >' + formTitle + arrow + tTitle + '</a>';
      return title;
    } else {
      title = '<a target="_self" href="' + url + '">' + formTitle + arrow + tTitle + '</a>';
      return title;
    }
    
  }


}
