import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { UIDataService } from '../../services/uidata.service';
import { TableGrid, DataService } from '../../../../common/services/data.service';
import { catchError, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { of, Subscription, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { HPSMTicketResp } from '../../models/ticket.model';
import { LanguageService } from '../../../../common/services/language-service';

@Component({
  selector: 'cop-outage-list',
  templateUrl: './outage-list.component.html',
  styleUrls: ['./outage-list.component.scss']
})

export class OutageListComponent implements OnInit {

  origin: string;
  snackBarConfig = <MatSnackBarConfig>environment.snackBarConfig;
  plannedOutageContent = [];
  unplannedOutageContent = [];
  showMore: boolean = false;
  showMoreIncident: any;
  show = false;
  plannedOutage: any;
  unplannedOutage: any;
  isLoadingResults: boolean = true;
  showModal : any;
  statusBoardInfo : any;
   public essayArray : String[];



  //showModal : boolean;
//   plannedOutage: any = {
//   "@count": 1,
//   "@start": 1,
//   "@totalcount": 1,
//   "Messages": [],
//   "ResourceName": "CustOpsChange",
//   "ReturnCode": 0,
//   "content": [{"CustOpsChange": {
//     "Service": "ONE-SOURCE-CONFIGURATOR-SERVICE",
//     "description.structure": {"Description": [
//       "GO-LIVE for the OEFC Global Order Entry Touchless Dashboard Project / PTR 1785.01.",
//       null,
//       "\"Extending the current Order Entry Metrics that is restricted to OKC orders to cover all orders types for the Global Team, allowing review of all the touches required to create sales orders\"",
//       null,
//       "\"Extending the current Order Entry Metrics that is restricted to OKC orders. Adding in extra logic to improve the ability to drill into the information and provide improved actionable analysis . This project will extend this metric to cover all orders types for the Global Team, allowing review of all the touches required to create sales orders. This metric would cover all sources of orders e.g. One Source, EDI, Manual etc.\"",
//       "\"The metric will allow us to analyze what are the issues that cause orders to fail to create and thus requires manual intervention to create. In addition this model would provide all the information that is required to find out any Auto validation errors that was happening in SAP.\"",
//       null,
//       "Who is doing the work/who\u2019s responsible for the work?",
//       " \u2013 Kishore Kommalapati",
//       " \u2013 CR is assigned directly to Kishore's WG 'IT-AVA-AIA'.",
//       null,
//       "Any additional work required such as:",
//       "o\tDatabase updates? \u2013 NO",
//       "o\tLoad Balancing work? \u2013 NO",
//       "o\tDNS changes? \u2013 NO",
//       "o\tSSO work? \u2013 NO",
//       "o\tSSL Cert updates? (must be SHA-2 compatible) \u2013 NO",
//       null,
//       "There is NO outage",
//       "There are no IC's/PB's",
//       "This does not modify any existing CI's",
//       "This is for PTR 1785.01",
//       null,
//       "There is NO project SharePoint link.",
//       "."
//     ]},
//     "header": {
//       "ApprovalStatus": "approved",
//       "AssignmentGroup": "IT-AVA-AIA",
//       "ChangeID": "CR57639",
//       "ChangeManager": "ACOTTRELL",
//       "CurrentPhase": "Change GTP Approval",
//       "PlannedEnd": "2019-05-08T04:00:00+00:00",
//       "PlannedStart": "2019-05-06T04:00:00+00:00",
//       "RequestedBy": "ACOTTRELL",
//       "Status": "initial",
//       "Title": "(08)  PTR 1785.01 \u2013 OEFC Global Order Entry Touchless Dashboard \u2013 GO-LIVE"
//     }
//   }}]
// };
//   unplannedOutage: any = {
//   "@count": 2,
//   "@start": 1,
//   "@totalcount": 2,
//   "Messages": [],
//   "ResourceName": "CustOpsIncident",
//   "ReturnCode": 0,
//   "content": [
//     {"CustOpsIncident": {
//       "AffectedServices": ["PLDS-SERVICE"],
//       "Area": "Other",
//       "AssignmentGroup": "AVA-IT-OP-PAYROLL",
//       "CI": "ADP-US-PAYROLL",
//       "Category": "incident",
//       "ClosureCode": "Solved (completely)",
//       "Contact": "TEST_APAC",
//       "DegreeServiceLoss": "100",
//       "Description": [
//         "Symptoms: ,nk",
//         null,
//         "Affected Users:",
//         "Handle 1: DICKY, Location: SINGAPORE-301081",
//         "Handle 2: ARNAUDLAGACHE, Location: BRUSSELS-307894",
//         "Handle 3: TEST_CALA, Location: SANTIAGODECHILE-307589",
//         "**Title from related Incident record IC1330001:",
//         "System Incident raised from ITSS for ADP US PAYROLL-SERVICE"
//       ],
//       "EscalationType": "SLA-Warning",
//       "IncidentID": "IC1330006",
//       "JournalUpdates": [
//         "08/30/16 15:18:31 Argentina (gdipaola):",
//         "Testing"
//       ],
//       "Location": "PUNE-307437",
//       "OpenTime": "2016-08-22T12:41:43+00:00",
//       "OpenedBy": "arnaudlagache",
//       "OutageEnd": "2016-08-30T18:33:44+00:00",
//       "OutageStart": "2016-08-03T12:04:25+00:00",
//       "PercentAffectedUsers": "13",
//       "Priority": "4",
//       "Service": "ADP US PAYROLL-SERVICE",
//       "ServiceArea": "Applications",
//       "Solution": ["Issue was fixed by running the application... test."],
//       "Status": "Work In Progress",
//       "SubArea": "Other",
//       "TicketOwner": "arnaudlagache",
//       "Title": "System Incident raised from ITSS for ADP US PAYROLL-SERVICE",
//       "Type": "1",
//       "UpdatedBy": "arnaudlagache",
//       "UpdatedTime": "2019-02-07T17:51:11+00:00",
//       "Workaround": ["Test run-app."]
//     }},
//     {"CustOpsIncident": {
//       "Area": "Access/Security",
//       "AssignmentGroup": "IT-SMT-SVCMGMT",
//       "CI": "DWSMGVMAP03",
//       "Category": "incident",
//       "ClosureCode": "Solved (completely)",
//       "Contact": "JDRAYE",
//       "DegreeServiceLoss": "25",
//       "Description": [
//         "Title field: ",
//         " Bug ticket reported from ITSC for  PLDS-SERVICE",
//         "Problem Description: Test",
//         "Is Troubleshooted: Test",
//         "Is solution searched in Knowledge Base: Test",
//         "PoC info: ",
//         "Handle: jdraye",
//         "Telephone number: 9089535854564",
//         "Contact Timeframe: all hours"
//       ],
//       "EscalationType": "SLA-Breached",
//       "IncidentID": "IC1330385",
//       "JournalUpdates": [
//         "11/13/18 06:06:49 US/Eastern (arnaudlagache):",
//         "08/29/18 06:23:03 US/Eastern (arnaudlagache):",
//         "update 3",
//         "08/29/18 06:18:33 US/Eastern (arnaudlagache):",
//         "here are the results...",
//         "08/29/18 05:16:23 US/Eastern (arnaudlagache):",
//         "update from IC...",
//         "06/20/18 09:55:18 US/Eastern (arnaudlagache):",
//         "test",
//         "02/27/18 10:11:32 US/Eastern (arnaudlagache):",
//         "SysIc has workaround"
//       ],
//       "Location": "BRUSSELS-307894",
//       "OpenTime": "2017-10-09T08:38:41+00:00",
//       "OpenedBy": "arnaudlagache",
//       "OutageStart": "2016-12-07T16:32:05+00:00",
//       "PercentAffectedUsers": "12",
//       "Priority": "3",
//       "Service": "PLDS-SERVICE",
//       "ServiceArea": "Applications",
//       "Solution": ["solved"],
//       "Status": "Work In Progress",
//       "SubArea": "Login - Expired Password",
//       "TicketOwner": "arnaudlagache",
//       "Title": "Approval Limits are not set in Coupa for Accounts created by Identity Access Portal causing unnecessary requisition approvals",
//       "Type": "1",
//       "UpdatedBy": "arnaudlagache",
//       "UpdatedTime": "2019-04-30T14:38:25+00:00",
//       "Workaround": ["Users need to re-install the Pulse Secure client. In case they need assistance, they can contact IT Service Desk."]
//     }}
//   ]
// };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private uiB: UIBaseService,
    private uiDS: UIDataService,
    private ds: DataService,
    private snackBar: MatSnackBar,
    private languageService:LanguageService
  ) { }

    ngOnInit() {
     this.isLoadingResults = true
      this.ds.getDataOf(`plannedoutage/?usertype=${this.uiB.userInfo.usertype}`)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
        this.plannedOutage = resp;
        this.plannedOutageContent = this.plannedOutage.content;
        if(this.plannedOutageContent){
        this.plannedOutageContent.forEach(function(value){

            if(value.CustOpsChange.header && (value.CustOpsChange.header.PlannedStart && value.CustOpsChange.header.PlannedEnd)){
            //   var PlannedStartYear = new Date(value.CustOpsChange.header.PlannedStart).getFullYear();
            //   var PlannedStartMonth = new Date(value.CustOpsChange.header.PlannedStart).getMonth() + 1;
            //   var PlannedStartDate = new Date(value.CustOpsChange.header.PlannedStart).getDate();

            //   var PlannedEndYear = new Date(value.CustOpsChange.header.PlannedEnd).getFullYear();
            //   var PlannedEndMonth = new Date(value.CustOpsChange.header.PlannedEnd).getMonth() + 1;
            //   var PlannedEndDate = new Date(value.CustOpsChange.header.PlannedEnd).getDate();

            //   var currentDateYear = new Date().getFullYear();
            //   var currentDateMont = new Date().getMonth() + 1;
            //   var currentDateDate = new Date().getDate();

            //   var PlannedStartTemp = PlannedStartYear + "/" + PlannedStartMonth + "/" + PlannedStartDate;

            //   var PlannedEndTemp = PlannedEndYear + "/" + PlannedEndMonth + "/" + PlannedEndDate;

            //   var currentDateTemp = currentDateYear + "/" + currentDateMont + "/" + currentDateDate;

            //   var PlannedStart = new Date(PlannedStartTemp);
            //   var PlannedEnd = new Date(PlannedEndTemp);
            //   var currentDate = new Date(currentDateTemp);

            // if ((currentDate.getTime() < PlannedEnd.getTime()) && (currentDate.getTime() < PlannedStart.getTime())) {
            //   value.CustOpsChange.header.Status = "Pending"
            // }
            // if (currentDate > PlannedEnd ) {
            //   value.CustOpsChange.header.Status = "Completed"
            // }
            // if ((currentDate.getTime() <= PlannedEnd.getTime()) && (currentDate.getTime() >= PlannedStart.getTime())) {
            //   value.CustOpsChange.header.Status = "In Progress"
            // }

            
            var plannedStart = +new Date(value.CustOpsChange.header.PlannedStart);
            var plannedEnd = +new Date(value.CustOpsChange.header.PlannedEnd);
            var currentDate = +new Date();
                  
            if ((currentDate < plannedEnd && currentDate < plannedStart)) {
                value.CustOpsChange.header.Status = "Pending"
              }
              if (currentDate >= plannedEnd ) {
                value.CustOpsChange.header.Status = "Completed"
              }
                         
              if ((currentDate <= plannedEnd) && (currentDate >= plannedStart)) {
                value.CustOpsChange.header.Status = "In Progress"
              }


          }

        })
        this.plannedOutageContent.sort((a,b)=>new Date(b.CustOpsChange.header.PlannedStart).getTime() - new Date(a.CustOpsChange.header.PlannedStart).getTime());
      }
        });
        // this.plannedOutageContent = this.plannedOutage.content;
        this.ds.getDataOf(`unplannedoutage/?usertype=${this.uiB.userInfo.usertype}`)
          .pipe(
            catchError(val => of(`ERROR sending data ${val}`)))
          .subscribe(resp => {
           this.unplannedOutage = resp;
           this.unplannedOutageContent = this.unplannedOutage.content;
           this.isLoadingResults = false;
            if(this.unplannedOutageContent){
             this.unplannedOutageContent.sort((a,b)=>new Date(b.CustOpsIncident.OutageStart).getTime() - new Date(a.CustOpsIncident.OutageStart).getTime());
            }
           
          });
          // this.unplannedOutageContent = this.unplannedOutage.content;
      this.route.queryParamMap
        .subscribe(params => {
          this.origin = params.get('origin') || 'requests';
        })
    }

    RowSelected(i){    
      let stringData = '';
      this.unplannedOutageContent[i].showMore = !this.unplannedOutageContent[i].showMore;
      if (this.unplannedOutageContent[i].showMore) {
          this.unplannedOutageContent[i].CustOpsIncident.Workaround.forEach(element => {
            if (element && element.length > 0) {
              stringData = stringData + element + '<br/>';
            } else {
              stringData = stringData + '<div>&nbsp;</div>';
            }
          });
        this.unplannedOutageContent[i].activeContent = stringData;
      } else {
        this.unplannedOutageContent[i].activeContent = this.unplannedOutageContent[i].CustOpsIncident.Workaround[0];
      }
    }
    
    RowSelected1(i){
      let stringData1 = '';
      this.plannedOutageContent[i].showMore = !this.plannedOutageContent[i].showMore;
      if(this.plannedOutageContent[i].showMore){
        this.plannedOutageContent[i].CustOpsChange.StatusBoardInformation.forEach(element => {
          if(element && element.length > 0){
            stringData1 = stringData1 + element + '<br/>';
          }else {
            stringData1 = stringData1 + '<div>&nbsp;</div>';
          }
        });
        this.plannedOutageContent[i].activeContent = stringData1;
      }else {
        this.plannedOutageContent[i].activeContent = this.plannedOutageContent[i].CustOpsChange.StatusBoardInformation[0];
      }
    }
    
    closeModal() {
      this.router.navigate([ this.origin || this.languageService.localCode+'/requests' ]);
    }
     showMoreIncidentId(i){
       this.showMoreIncident = i;
       this.showMore = !this.showMore;
     }

     openInfoPopup(unplannedOutage){
       if(unplannedOutage){
       this.statusBoardInfo = unplannedOutage.CustOpsIncident ? unplannedOutage.CustOpsIncident.StatusBoardInformation : "";
       this.essayArray = this.statusBoardInfo.toString().split(/[\n,]+/);
       this.showModal = true;
       }
     }

     closeInfoPopup(){
        this.showModal = false;
     }
    onAffectedClick(IncidentID){
      let url = "createunplannedoutage/"+IncidentID;
      let message;
      this.ds.createData(url,IncidentID)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
          const response = <HPSMTicketResp>resp;
          if(+response.ReturnCode == 0){
            message = `Ticket ${response.CustOpsInteraction.InteractionID} created successfully.`;
            this.ds.refreshDataOf(<TableGrid>{name: 'currentList', state: true});
          }
          else{
            message =  `There was an error creating ticket - ${response.Messages[0].toString()}`;
          }
          this.snackBar.open(message, 'Dismiss', this.snackBarConfig);
          this.closeModal();
        });
    }

    // onClick(event)
    // {
    //   this.showModal = true;
    // }
    // hide()
    // {
    //   this.showModal = false;
    // }
}
