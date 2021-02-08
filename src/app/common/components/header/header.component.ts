import { Component, OnInit, Input, Output, EventEmitter,ViewChild, ElementRef } from '@angular/core';	
import { Header } from '../../models/header.model';	
import { UIBaseService } from '../../services/uibase.service';	
import { Router,ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';

import { map, catchError, switchMap, startWith } from 'rxjs/operators';
import { interval } from "rxjs/internal/observable/interval";
import { DataService } from '../../services/data.service';
import { UIDataService } from '../../../modules/customer-care/services/uidata.service';
import { Catalog, Deligation } from '../../../modules/customer-care/models/catalog.model';
import { WindowRef } from '../../services/core/window-ref.service';
import { SearchService } from '../../services/search.service';
// import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'cop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  header: Header;
  firstName: string;
  lastName: string;
  showMenu = false;
  infoMenu = false;
  pollingData: any;
  userType: string;
  show: boolean = false;
  close: boolean = true;
  dropDownShow: boolean = false;
  viewSettingIcon: boolean = false;
  views = [];
  filterInput: any;
  searchResponse: any;
  @Input() search;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;
  selectedDropdown: string = '';
  checkingDown: any;
  viewId: any;
  disableApplySetting: boolean = true;
  hideMobile: boolean = false;
  fillData: any;
  searchStr: any;
  searchFieldResponse: any;
  showDropHide: boolean = false;
  status: any;
  counter: number;
  showInvalidDelegationMsg = false;
  addButtonEnable = false;
  hideListMenus: boolean = false;
  userIdresponse: any;
  deligationInitialResponse: any;
  deligationData: any;
  responseArray = [];
  jointArray = [];
  url = '';
  initialDefaultDropdown: any;
  limitedDeligation: boolean = false;
  addButtonFlag: boolean = false;
  activeInputUserArray = [];
  listOFRequests = [];
  mergedUserid = [];
  finalInputArray = [];
  hideInitalResponseInputBox = false;
  trimedInputvaluesBoolean = false;
  logout: any;
  defaultSettingIcon: boolean;
  originUrl: string;
  userInfo: any;
  disabledSelect: boolean = true;
  greyTitleText = "";
  isSearchTermBlank: boolean;
  change: boolean = false;
  filterDocumentType = "all";
  filterContentType = "all";
  FilterType = "Relevence";
  
  //comment or uncomment depending on the url you wish to access local or server
  environmentUrlIslocal: boolean = false;
  stat = [
    { 'name': 'Avaya Knowledge', 'key': 'avayaknowledge' },
      { 'name': 'OneCare Service Catalog', 'key': 'onecareservice_catalog' }
  ];
  //status = [];
  public deviceType: string = "";
  //langDropdown: boolean;
   //searchTerm: string;
   searchResultJsonResponse: string;
   isLoadingResults: boolean;
   totalRecords: any;
   fromSearchResult: number;
   pageChange: number;
   toSearchResult: number;
   checkUrl: boolean;
   profile= 'avaya_en';
   searchUrl: string;
   searchTerm : '';
  delegationBoolean: boolean = false;
  delegationOriginUrl: string;
  myrequestsOriginUrl: string;
  historyOriginUrl: string;
  isOpenTableView:boolean = false;
 
  
  public constructor(
    private fb: FormBuilder,
    private uibase: UIBaseService,
    private router: Router,
    private route : ActivatedRoute,
    private ds: DataService,
    private ui: UIDataService,
    private uib: UIBaseService,
    private win: WindowRef,
    private el: ElementRef,
    private searchservice: SearchService,
    private languageService: LanguageService
  ) { }

  userprofileForm = this.fb.group({
    mobiles: this.fb.array([
      this.fb.control('')
    ])

  })

  ngOnInit() {
    /**
      * logout url variable accourding to env
      */
    this.logout = environment.sso_signout + '?source=' + environment.sourceUrl;

    this.originUrl = window.location.origin;
    // Subscribe to userProfileForm Value Changes
    this.userProfileFormValueChanges();

    this.filterInput = this.ui;
    this.filterInput = this.filterInput.getUIData("TicketCatalogComponent", "TicketCatalogComponent1378121271914");
    this.getSearchTerm()
    if (Array.isArray(this.filterInput)) {
      this.filterInput.forEach(element => {
        if (element.views && element.views.length > 0) {
          element.views.forEach(child => {
            this.views.push(child);
          })
        }
      });
    }

    if (this.views.length > 1) {
      this.disableApplySetting = false;
    }
    this.checkingDown = this.views.forEach(defaultview => {
      if (defaultview.defaultview) {
        this.viewId = defaultview.id;
        this.initialDefaultDropdown = defaultview.id;
      }
    })

    this.header = new Header(
      this.uibase.pageHeader['logo'],
      this.uibase.pageHeader['headerLinks'],
      this.uibase.pageHeader['usersettings']);
    this.fillData = `[{"id":"1397230853405","title":"Report an Outage affecting Avaya","logoimage":"/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1397237044970&ssbinary=true","openinsamewindow":"true","url":"https://salescms-staging.avaya.com/customercare/en/home?modal=show&function=1397215362921&origin=home&mode=direct","alttext":"Report an Outage affecting Avaya"},{"id":"1397208679419","title":"Avaya System Outages","openinsamewindow":"true","url":"https://partner-itss.avaya.com ","alttext":"Avaya System Outages"},{"id":"1397208989829","title":"Docs & FAQs","openinsamewindow":"false","url":"https://support.avaya.com/search-landing/","alttext":"Docs & FAQs"},{"id":"1397208996250","title":"Partner Programs","openinsamewindow":"false","url":"https://sales.avaya.com/en/partner-programs","alttext":"Partner Programs"}]}`;
    this.firstName = this.uibase.userInfo.First_Name;
    this.lastName = this.uibase.userInfo.Last_Name;
    this.userInfo = this.uibase.userInfo;
    this.userType = this.uibase.userInfo.usertype;

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.hideMobile = true
    } else {
      this.hideMobile = false;
    }

    //  this.pollingData = interval(1800000)
    this.pollingData = interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => this.ds.getSessionDataOf('checksession')
          .pipe(
            catchError((error) =>of(`ERROR sending data ${error}`))
          )
        ))
      .subscribe((response: any) => {
       // console.log("checksession response", response)
        if (response.status === 302) {
          window.location.reload();
        }
      });
    
  //  this.getSearchTerm();
  //  var currentUrl = window.location.href;
    //var spiltUrl = currentUrl.slice(0, currentUrl.indexOf('.com') + 4)
   
   // if (currentUrl.indexOf('salescms') > 0) {
    //this.searchUrl = spiltUrl + this.languageService.localCode + "search";
   
    
    var q;
    var filterkey;
    this.route.queryParams.subscribe(params=>{
      q = params['q'];
      if(q && q !=null && q !=undefined){
        this.searchTerm = q;
        filterkey= params['filterkey']
      
        if (filterkey && filterkey != null && filterkey != undefined) {
        
          this.filterCategory = filterkey;
        }
        this.getSearchResultJsonResponse();
      }
    })

    const linkElement = this.uib.getDataOfType('TabContainer')[2];
    var checkvalue = linkElement ? linkElement.url :'';
    if(checkvalue){
    this.ds.getData(checkvalue)
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
      //}

      this.delegationOriginUrl = this.languageService.localCode+"/home/#dgrequests";
      this.myrequestsOriginUrl = this.languageService.localCode+"/home/#myrequests";
      this.historyOriginUrl = this.languageService.localCode+"/home/#history";
}
getSearchTerm() {
  this.searchservice
    .getSearchTerm()
    .subscribe(data => {
   
      if (Object.keys(data).length > 0) {
        
        this.searchTerm = data;
       
        this.getSearchResultJsonResponse();
      } else {
       
       // this.searchTerm = '';
      }
      if (window.location.href.indexOf("en/search") > -1) {
        this.checkUrl = true;
      }
    });
}
 // clickEvent() {
  //   this.status = !this.status;
  // }
  clickEvent(textData) {
    //console.log("click event")
    this.change = !this.change;
    this.pageChange = 1;
    if (textData === 'oneCare') {
      this.profile = "onecare_servicecatalog";
      this.isLoadingResults = true;
      this.onPageChange(this.pageChange);
     
      let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/searchresults&sortBy=relevance&profile=' + this.filterCategory + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType + '&source=onecare';
     
      
      this.ds.getSearchHtmlResponse(url)
        .subscribe(data => {
          // console.log('----onecare_servicecatalog---avaya_en---', data);
          this.responseResult(data);
         // this.grayTitle = true;
        });
    } else {
      this.profile = "avaya_en";
      this.isLoadingResults = true;
      this.onPageChange(this.pageChange);
    
      let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/searchresults&sortBy=relevance&profile=' + this.filterCategory + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType +'&source=onecare';
      this.ds.getSearchHtmlResponse(url)
        .subscribe(data => {
          //console.log('----getSearchResultJsonResponse---avaya_en---', data);
          this.responseResult(data);
          //this.grayTitle = true;
        });
   
      }
    }
    onPageChange = (event) => {
      window.scrollTo(0, 0);
      this.pageChange = event;
    
      this.getSearchResultJsonResponse();
     // this.totalRecords = this.searchResultJsonResponse.body.totalResults;
      let checkValue = this.pageChange * 10;
      this.fromSearchResult = checkValue - 9;
      if (checkValue < this.totalRecords) {
        this.toSearchResult = checkValue;
      } else {
        this.toSearchResult = this.totalRecords;
      }
    }
    // closeMenuItems() {
    //   this.hideListMenus = true;
    // }
    // onLoginEventFired(event, searchStr, dropdownSelected: boolean) {
    //   if ((event.keyCode === 13 || dropdownSelected == true)) {
    //     // this.searchservice.setSearchResultsPageStatus(false);
    //     //console.log("sd"+this.filterCategory)
    //     this.showDropHide = true;
    //     let autoFillUrl = '/cs/Satellite?pagename=OCP/Search/getSuggestions&q=' + searchStr + '&client=test_frontend&site=default_collection&format=os' + '&filterCategory=' + this.searchservice.selectedFilterdropdown + '&filterLang=' + this.searchservice.selectedLanguageOption;
    //     //console.log("sd"+autoFillUrl)
    //     this.ds.getSearchResults(autoFillUrl)
    //       .pipe(
    //         catchError(val => of(`ERROR sending data ${val}`))
    //       )
    //       .subscribe(resp => {
    //         this.searchResponse = resp;
    //       })
    //     //  debugger
    //     this.show = !this.show;
    //     // Set Search Term to Service for App Level Usage
    //     this.searchservice.setSearchTerm(searchStr);
    //     // IF ENTER KEY CHECK
    //     this.searchservice.setSearchResultsPageStatus(false);
    //     // Reset Header Component search term
    //     this.searchStr = '';
    //   }
    // }
  userDropf() {

  }
  doNothing() {
    return;
  }

  // showSettings() {
  //   this.dropDownShow = !this.dropDownShow;
  //   this.viewSettingIcon = !this.viewSettingIcon;
  // }

  showOutage() {
    let showOutageList = 'showOutage';
    this.router.navigate([this.languageService.localCode + '/serviceoutage'], {
      queryParams: {
        outage: showOutageList,
        modal: 'show',
        origin: this.languageService.localCode + '/requests'
      }
    });
  }


  // getSearchResultJsonResponse() {
  //   this.isLoadingResults = true;
  //   this.searchResultJsonResponse = '';
  //   let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/home/search-results&sortBy=relevance&profile=' + this.profile + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm;
    
  //   this.ds.getSearchHtmlResponse(url)
  //     .subscribe(data => {
  //       this.responseResult(data);
  //       // this.clickedAvaya = false;
  //       // this.clickedOnecare = true;
  //     });
  // }
  getSearchResultJsonResponse() {
   
    // window.location.href=window.location.href +'?search=true&searchkey='+this.searchTerm;
    //needed to blank all arrays
    this.isLoadingResults = true;
    this.searchResultJsonResponse = '';
    this.profile = "aco_en";
    // if (this.isAvayaCloudOffice) {
    //   if (this.languageService.lang == 'fr') {
    //     this.profile = "aco_fr";
    //   }
    // }
    //this.filterCategory = "avayaknowledge";
    // if (this.isAvayaCloudOffice) {
    //   this.filterCategory = "aco_en";
    //   if (this.languageService.lang == 'fr') {
    //     this.filterCategory = "aco_fr";
    //   }
    // }
   
    let url = '/cs/Sites?lookuphost=/customercare&lookuppage=en/searchresults&sortBy=relevance&profile=' + this.filterCategory + '&currentPage=' + this.pageChange + '&pageSize=10&partialfields=&q=' + this.searchTerm + '&filterCategory=' + this.filterCategory + '&filterLang=' + encodeURIComponent(this.filterLang) + '&filterDocumentType=' + encodeURIComponent(this.filterDocumentType) + '&filterContentType=' + encodeURIComponent(this.filterContentType) + '&FilterType=' + this.FilterType +'&source=onecare';
    // window.location.href=url;
    this.ds.getSearchHtmlResponse(url)
      .subscribe(data => {
        this.checkTotalResults(data)
        //window.location.href=window.location.href +'?search=true&searchkey='+this.searchTerm;
        // window.location.href=this.searchUrl;
      });
  }
  checkTotalResults(data) {
    this.isLoadingResults = false;
    if (data.body.totalResults == 0 || data.body.totalResults == "0") {
      this.totalRecords = 0
    }
    this.responseResult(data);
    //  this.getFacetsCount(data);
    // this.getLanguages(data);
    // this.getSupportContentType(data);
    // this.getSupportDocType(data);
    // this.grayTitle = true;
    //window.location.href=window.location.href +'?search=true&searchkey='+this.searchTerm;
  }
  
  responseResult(data) {
    this.searchResultJsonResponse = data;
    this.isLoadingResults = false;
    // this.totalRecords = this.searchResultJsonResponse.body.totalResults;
    let checkValue = this.pageChange * 10;
    this.fromSearchResult = checkValue - 9;
    if (checkValue < this.totalRecords) {
      this.toSearchResult = checkValue;
    } else {
      this.toSearchResult = this.totalRecords;
    }
  }

  
  

  headSearch() {
    
    this.show = !this.show;
    this.showDropHide = false;
    //this.fileinput.nativeElement.focus();
    // this.showMenu = false;
  }

  searchDropDownSelect(name) {
    this.searchStr = name;
    this.showDropHide = false;
  //  this.onLoginEventFired(event, this.searchStr, false);
  }

  //this function opens a default view from a profile dropdown.
  openDefaultView() {
    let url;
    this.viewSettingIcon = true;
  }

  selectChangeHandler() {
    this.selectedDropdown = this.viewId;
    let url = "/customercare/en/home/user?action=update&viewid=" + this.selectedDropdown;
    this.ds.getData(url)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        window.location.reload();
      })
  }

  toggleMobileview() {
    this.showMenu = !this.showMenu;
    this.callMyProfileService();
  }
  //This funcions opens the delagation view from a profile dropdown.
  openDelgatesView() {
    this.defaultSettingIcon = true;
    let deligationUrl;
    if (this.environmentUrlIslocal) {
      deligationUrl = 'http://localhost:4200/cs/cop/assets/data/delegationExisting.json';
    } else {
      deligationUrl = '/customercare/en/home/user?action=getDelegUser';
    }
    this.ds.getData(deligationUrl)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        this.responseArray = [];
        this.deligationInitialResponse = resp;
        let deligationData = (this.deligationInitialResponse.delegUsers).split(',');
        deligationData.forEach(loopvalue => {
          if (loopvalue.length >= 3 && loopvalue != 'null') {
            this.responseArray.push(loopvalue);
          }
        });
        if (this.responseArray && this.responseArray.length >= 5) {
          this.hideInitalResponseInputBox = true;
        } else {
          this.hideInitalResponseInputBox = false;
          this.userProfileFormValueChanges();
        }
      })
  }

  openProfileDropdown() {
    this.infoMenu = true;
    this.callMyProfileService();
    //this.hideListMenus = true;
  }
  OpenRequestsView(type){
    
    if(type==="my" && !this.isOpenTableView){
      this.ui.openRequestsTab.next(type);
      this.isOpenTableView = true;
      this.router.navigateByUrl(this.languageService.localCode+"/home/#myrequests");
    }else if(type!= 'my'){
      this.isOpenTableView = false;
      this.ui.openRequestsTab.next(type);
    }
    // }else if(type === 'delegated'){
    //   this.router.navigateByUrl(this.languageService.localCode+"/home/#dgrequests");
    // }else if(type === 'history'){
    //   this.router.navigateByUrl(this.languageService.localCode+"/home/#history");
    // }
    this.closeProfileDropdown();
  }

  callMyProfileService() {
    this.checkingDown = this.views.forEach(defaultview => {
      if (defaultview.defaultview) {
        this.viewId = defaultview.id;
        this.initialDefaultDropdown = defaultview.id;
      }
    })
    let url;
    if (this.environmentUrlIslocal) {
      url = "http://localhost:4200/cs/cop/assets/data/delegationExisting.json"
    } else {
      url = "/customercare/en/home/user?action=add&viewid=" + this.viewId;
    }
    // let url = "/customercare/en/home/user?action=add&viewid=" + this.viewId;
    this.ds.getData(url)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        //console.log('---resp--', JSON.stringify(resp));
      })
  }

  closeMenuItems(){
    var dropdowns =this.el.nativeElement.querySelectorAll(".menu-dropdown,.menuList");
    for (var i = 0; i < dropdowns.length; i++) {
      
      dropdowns[i].classList.remove('open');
      var arrowIcons =  dropdowns[i].querySelectorAll('.rotate,.active')
      arrowIcons.forEach(function(icon) {
       icon.classList.remove('rotate')
       icon.classList.remove('active')
      });
      dropdowns[i].classList.remove('active');
     } 
  }

  closeProfileDropdown() {
    //console.log("close Profile")
    this.infoMenu = false;
    this.defaultSettingIcon = false;
    this.viewSettingIcon = false;
    this.hideListMenus = false;
    var dropdowns =this.el.nativeElement.querySelectorAll(".cop-prof");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('open');
      dropdowns[i].classList.remove('active');
     }
   
  }
  get mobiles() {
    if (this.responseArray) {
      if ((this.responseArray && this.responseArray.length <= 5) || this.mobiles.controls.length <= 5) {
        return this.userprofileForm.get('mobiles') as FormArray;
      }
    }
  }

  backToMainMenu() {
    this.defaultSettingIcon = false;
    this.viewSettingIcon = false;
    this.showInvalidDelegationMsg = false;
    this.activeInputUserArray = [];
    this.userprofileForm = this.fb.group({
      mobiles: this.fb.array([
        this.fb.control('')
      ]),
    })
  }

  userProfileFormValueChanges() {
    this.userprofileForm.get('mobiles').valueChanges.subscribe(user => {

      var duplicateResponseArray;
      // Check if user input is available in Existing Array or not
      if (this.responseArray) {
        duplicateResponseArray = this.responseArray.find(element => {
          return element == user[0].trim();
        });
      }

      // Check if user input is available in Latest inputs
      const duplicateInputs = this.activeInputUserArray.find(element => {
        return element == user[0].trim();
      });

      this.finalInputArray = user[0].trim();

      // If Duplicate Value, Alert User with Notification
      if ((duplicateResponseArray || duplicateInputs) && user[0].trim() != this.uibase.userInfo.uid) {
        // Show Error Message
        this.showInvalidDelegationMsg = true;
        // Hide Add Button
        this.addButtonFlag = false;
        // Hide Apply Settings Button
        this.disableApplySetting = true;
      } else {
        // Hide Error Message
        this.showInvalidDelegationMsg = false;
        // Show Add Button
        this.addButtonFlag = true;

        // Max Limit Validation for 5
        if (((this.responseArray && this.responseArray.length) + this.mobiles.length) > 4) {
          this.addButtonFlag = false;
          this.disableApplySetting = false;
        }
        if (this.responseArray && this.responseArray.length < 5) {
          this.disableApplySetting = false;
        }

      }

    });
  }

  /**
   * Validate Delegate User Exist / Not
   * Make a service call and based on the response process the remaining flow
   */
  validateDelegateUser(user) {
    let url;
    if (this.environmentUrlIslocal) {
      url = 'http://localhost:4200/cs/cop/assets/data/delegation.json';
    } else {
      url = '/cops/user/actions/checkuserid?uid=' + user;
    }

    if (user.toString().indexOf('@') >= 0) {
      url = '/cops/user/actions/checkuser/?emailid=' + user;
    }
    this.ds
      .deligationGetData(url)
      .subscribe(resp => {
        this.userIdresponse = <Deligation>resp;

        // User Already Exists - Failed Scenario
        if ((this.userIdresponse && this.userIdresponse.Status == "UserNotExist") || user == this.uibase.userInfo.uid) {
          // Show Error Message
          this.showInvalidDelegationMsg = true;
          // Hide Add Button
          this.addButtonFlag = false;
          this.disableApplySetting = true;
        } else {

          // User Exist - Success Scenario
          // Show Apply Settings Button
          this.disableApplySetting = false;

          // this.mobiles.push(this.fb.control(''));
          // Create New Form Control only if the existing length is less than 5
          if (user !== 'e' || user !== '') {
            // Push User to active array

            // Disable Previous Valid input controls

            if (this.activeInputUserArray.length == 0) {
              this.userprofileForm.controls.mobiles.get("0").disable();
              if (((this.responseArray && this.responseArray.length) + this.mobiles.length) > 5) {
                this.addButtonFlag = false;
              } else {
                this.mobiles.push(this.fb.control(''));
              }
            } else {
              var BreakException = {};
              try {
                this.activeInputUserArray.forEach((elem, index) => {

                  // Enable Readonly for previous Inputs
                  if (this.mobiles.length === index) {

                  } else {
                    this.userprofileForm.controls.mobiles.get((this.mobiles.length - 1).toString()).disable();
                    if (((this.responseArray && this.responseArray.length) + this.mobiles.length) > 4) {
                      this.addButtonFlag = false;
                    } else {
                      this.mobiles.push(this.fb.control(''));
                      throw BreakException;

                    }
                  }
                })
              } catch (e) {
                if (e !== BreakException) throw e;
              }
            }
            this.activeInputUserArray.push(user);
          }
          return;

        }
      })
  }

  addInputDeligation() {
    this.addButtonFlag = false;
    if ((this.responseArray && this.mobiles) && (this.responseArray.length + this.mobiles.length) <= 5) {
      let checkInpuVal = this.userprofileForm.controls.mobiles.get((this.mobiles.length - 1).toString()).value;

      // Validate User Existance using service call
      if (checkInpuVal !== '') {
        this.validateDelegateUser(this.userprofileForm.controls.mobiles.get((this.mobiles.length - 1).toString()).value.trim());
      } else {
        // Show Error Message
        this.showInvalidDelegationMsg = true;
        // Hide Add Button
        this.addButtonFlag = false;
        // Hide Apply Settings Button
        this.disableApplySetting = true;
      }
    }
  }

  deleteRow(index: number) {
    this.mobiles.removeAt(index);
    this.activeInputUserArray.splice(index, 1);
    if (this.responseArray && this.responseArray.length <= 5) {
      this.addButtonFlag = true;
    }
  }

  deleteInitialValue(index: number) {
    this.responseArray.splice(index, 1);
    if (this.responseArray.length <= 0 || this.responseArray == undefined || this.responseArray == []) {
      this.responseArray = null;
    }
    this.selectedDropdown = this.viewId;
    this.url = "/customercare/en/home/user?action=update&viewid=" + this.selectedDropdown + '&delegUser=' + this.responseArray;
    this.ds.getData(this.url)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        if (this.responseArray == null) {
          window.location.reload();
          this.userprofileForm = this.fb.group({
            mobiles: this.fb.array([
              this.fb.control('')
            ]),
          })
          this.openDelgatesView();
        }
        if ((this.responseArray && this.mobiles) && (this.mobiles.length + this.responseArray.length) <= 5) {
          this.hideInitalResponseInputBox = false;
        } else {
          this.hideInitalResponseInputBox = true;
        }
        if (this.responseArray && this.responseArray.length <= 5) {
          this.addButtonFlag = true;
        }

      })
  }

  //this function gets called after clicking apply settings button of delegation view
  saveDelegatesList() {
    this.selectedDropdown = this.viewId;
    let serviceResp = this.responseArray;
    let mobileInputs = [];
    let user = this.userprofileForm.controls.mobiles.get((this.mobiles.length - 1).toString()).value;
    if (user == '') {
      user = this.userprofileForm.controls.mobiles.get((this.mobiles.length - 2).toString()).value;
    } else {
      user = this.userprofileForm.controls.mobiles.get((this.mobiles.length - 1).toString()).value;
    }
    if (user && user != "") {
      let url;
      if (this.environmentUrlIslocal) {
        url = 'http://localhost:4200/cs/cop/assets/data/delegation.json';
      } else {
        url = '/cops/user/actions/checkuserid?uid=' + user;
      }

      if (user.toString().indexOf('@') >= 0) {
        url = '/cops/user/actions/checkuser/?emailid=' + user;
      }

      this.ds
        .deligationGetData(url)
        .subscribe(resp => {
          this.userIdresponse = <Deligation>resp;

          // User Already Exists - Failed Scenario
          if (this.userIdresponse && this.userIdresponse.Status == "UserNotExist") {
            // Show Error Message
            this.showInvalidDelegationMsg = true;
            // Hide Add Button
            this.addButtonFlag = false;
          } else { // User Exist - Success Scenario

            this.mobiles.controls.forEach(inputValue => {
              mobileInputs.push(inputValue.value);
            })

            // POST SETTING SERVICE CALL
            if (mobileInputs.concat(serviceResp).length > 0) {
              this.url = "/customercare/en/home/user?action=update&viewid=" + this.selectedDropdown + '&delegUser=' + mobileInputs.concat(serviceResp);
              this.ds.getData(this.url)
                .pipe(
                  catchError(val => of(`ERROR sending data ${val}`))
                )
                .subscribe(resp => {
                  // window.location.reload();
                  var response = JSON.parse(JSON.stringify(resp));
                  this.userprofileForm = this.fb.group({
                    mobiles: this.fb.array([
                      this.fb.control('')
                    ]),
                  })

                  if (response && response.status === "Success") {
                    this.sendEmailTodelegateUsers(mobileInputs);
                  }
                  this.backToMainMenu();

                })
            } else {
              this.url = "/customercare/en/home/user?action=update&viewid=" + this.selectedDropdown;
              this.ds.getData(this.url)
                .pipe(
                  catchError(val => of(`ERROR sending data ${val}`))
                )
                .subscribe(resp => {
                  var response = JSON.parse(JSON.stringify(resp));
                  // window.location.reload();
                  this.userprofileForm = this.fb.group({
                    mobiles: this.fb.array([
                      this.fb.control('')
                    ]),
                  })

                  if (response && response.status === "Success") {
                    this.sendEmailTodelegateUsers(mobileInputs);
                  }
                  this.backToMainMenu();
                })
            }
            // let inputRespon = this.finalInputArray;  

          }
        })
    }
  }

  //this method is used to send email notification to delegated users
  sendEmailTodelegateUsers(currentUsers) {
    let url = 'sendDelegateEmail'
    let dataForm = new FormData();
    dataForm.append('OldDelegateUsers', this.responseArray.join());
    dataForm.append('NewDelegateUsers', currentUsers.join())
    // var data = {
    //   OldDelegateUsers:this.responseArray,
    //   NewDelegateUsers:currentUsers
    // }
    this.ds.postData(url, dataForm)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {

        // window.location.reload();

      })

  }

  linkTarget(link, targetType) {
    if (!link.HasSubHeaderLink) {
      window.open(link.url, targetType);
    }
    //this.showMenu = !this.showMenu;
  }

//   openLanguageDropdown(){
//     this.langDropdown = true; 
//  }
//  closeLanguageDropdown(){
//    this.langDropdown = false;
//  }
  ngOnDestroy() {
    this.pollingData.unsubscribe();
  }

  // stat = [
  //   { 'name': 'All', 'key': 'all' },
  //   { 'name': 'Avaya Knowledge', 'key': 'avayaknowledge' },
  //   { 'name': 'One Care Service Catalog', 'key': 'onecareservice_catalog' }

  // ];

  statusArray = ['Avaya Knowledge' ,'OneCare Service Catalog'];
  filterCategory = "all";
  filterLang = "all";
  filtered: any;
  selected: any;
  
  // onOptionsSelected(event,searchTerm: string, value: string)
  // {
  //   this.searchservice.selectedFilterdropdown = value;
  //   window.location.href = this.languageService.localCode +'/search?search=true&searchkey=' + this.searchTerm + '&filterkey=' + this.filterCategory;
  // }
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
  //  this.resetFilters()
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
     // debugger
     
      //this.getSearchResultJsonResponse();

      if (window.location.href.indexOf('salescms') > 0) {
        window.location.href = "https://salescms.avaya.com/customercare/"+this.languageService.localCode +'/search?q=' + this.searchTerm+'&profile=' + this.filterCategory + '&source=onecare';
      }else{
      window.location.href = this.languageService.localCode +'/search?q=' + this.searchTerm+'&profile=' + this.filterCategory + '&source=onecare';
      }
    //  window.location.href = this.languageService.localCode +'/search?q=' + this.searchTerm+'&profile=' + this.profile + '&filterkey=' + this.filterCategory+'&site=onecare';
    }
    else {
      this.isSearchTermBlank = true;
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
     // this.resetFilters()
      this.pageChange = 1;
      if (this.fileinput != null) {
        this.searchTerm = this.fileinput.nativeElement.value
        if (this.fileinput.nativeElement.value != "") {
         
          this.getSearchResultJsonResponse();
          // this.searchPublicUrl = window.location.href 
          //'?search=true&searchkey=' +  this.searchTerm;
         
          window.location.href = this.languageService.localCode +'/search?q=' + this.searchTerm +'&profile=' + this.filterCategory +'&source=onecare';
        }
        else {
          this.isSearchTermBlank = true;
        }
      }
      // bigSearch content
    }
  }
//  window.location.href = '?search=true&searchkey=' +  this.searchTerm +'&filterkey=' +this.filterCategory;
  // onOptionsSelected(event, searchTerm: string, value: string) {
  //   //this.searchservice.selectedFilterdropdown = value;
  //     window.location.href= this.searchUrl;
  //window.location.href = this.searchUrl + '?search=true&searchkey=' + this.searchTerm + '&filterkey=' + this.filterCategory;
  //  // window.location.href ='en/search'+'?search=true&searchkey=' +  this.searchTerm +'&filterkey=' +this.filterCategory;
  //  // this.searchservice.selectedFilterdropdown = value;
  // }
  //this.searchservice.selectedLanguageOption = value;
  //this.resetFilters()
  // console.log("onOptionsSelected1::" );
  //console.log("onOptionsSelected arraylenght::" + this.selectedLanguages);
  // for (var i = 0; i < this.stat.length; i++) {
  //   if (event.target.value == this.stat[i].name) {
  // console.log("msg1" + this);
  //console.log("log::" + this.stat[i].key)
  // if(this.stat!=null){
  //   this.filtered = this.stat.filter(t => t.name == this.selected);
  //  this.filterCategory = this.stat[i].key;
  //console.log("msg1" + this.filterCategory);
  // }
  //  }
 // }
  // this.onLoginEventFired(event, searchStr,true)
  //this.select_all = false;
  //this.pageChange = 1;
  //this.searchTerm = this.fileinput.nativeElement.value // bigSearch content
  //this.getSearchResultJsonResponse();
  // console.log("msg1"+this); 
  // this.filtered = this.stat.filter(t=>t.name ==this.selected);
  // this.filterCategory=this.selected;
  // console.log("msg"+this.filterCategory);
  //this .selected ko filtercategory ko assign karna hai , jo bhi selected value hai woh.. 
}
//}