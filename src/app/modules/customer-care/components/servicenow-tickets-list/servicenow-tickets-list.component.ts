import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../../common/services/data.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../../common/services/language-service';
import { TicketsService } from '../../services/tickets.service';
import { UIDataService } from '../../services/uidata.service';

@Component({
  selector: 'cop-servicenow-tickets-list',
  templateUrl: './servicenow-tickets-list.component.html',
  styleUrls: ['./servicenow-tickets-list.component.scss']
})
export class ServicenowTicketsListComponent implements OnInit {
tickets:any;
isLoadingResults:boolean = false;
displayedColumns: string[] = ['ticketId', 'startDate', 'title', 'status', 'possibleActions'];
rowsExist = false;
ringSSoSession:any;
tabActive:string ="";
ticketsList:any;

@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
  myrequestsOriginUrl: string;
  historyOriginUrl: string;
  constructor(  private ds: DataService,private languageService:LanguageService,
    private router: Router, 
    private route: ActivatedRoute,
     private ts: TicketsService,
     private uiDS: UIDataService) { }

  ngOnInit() {
    var view = "AvayaCloudOffice";
    //console.log("Inside servicenow tickets");
    this.myrequestsOriginUrl = this.languageService.localCode+"/public/#snmyrequests?view="+view;
    this.historyOriginUrl = this.languageService.localCode+"/public/#snhistoryrequests?view="+view;
    this.ds.ringSso.subscribe(profile =>{
      //console.log("profile in subscribe",profile)
    this.ringSSoSession = profile;
    // if(this.ringSSoSession && this.ringSSoSession.accessToken){
    //   this.populateTicketsList();
    // }
    //this.tabAction('myrequests')
  });
  this.uiDS.openRequestsTab.subscribe(data => {
   // this.tabAction("");
   if(data=='my'){
   this.tabAction('myrequests')
   }else if(data == 'history'){
    this.tabAction('history');
   }
 })
  }

  public tabAction(tab) {
    // if(tab == 'home'){
    //   this.tabActive = 'home';
    //   window.location.reload();
    // }
    if (tab == 'myrequests') { 
      this.tabActive = 'myrequests'; 
      if(this.ringSSoSession && this.ringSSoSession.accessToken){
        this.populateTicketsList();
      }
    }
    if (tab == 'history') { 
      this.tabActive = 'history';
      if(this.ringSSoSession && this.ringSSoSession.accessToken){
        this.populateTicketsList();
      }
     }
    
  }

  applyFilter(filterValue: string) {
   // console.log("filterValue",filterValue);
    if(filterValue && filterValue != ""){
    this.tickets.filter = filterValue.trim().toLowerCase();

    if (this.tickets.paginator) {
      this.tickets.paginator.firstPage();
    }
  }
  }
  populateTicketsList(){
    this.isLoadingResults = true;
    var requestObj ={
      "u_company_id":this.ringSSoSession.companyId,
      "u_email_id":this.ringSSoSession.emailId,
      "u_number" :"",
      "u_authenticated_user":"true"
      
    }

    // var requestObj = {
    //   "u_company_id":"0987654321",
    //   "u_email_id":"acodefault_dev@avaya.com",
    //   "u_number" :"",
    //   "u_authenticated_user":"true"
    //   }  
      const keyMapObj = {
        'ticketId': 'Number',
        'startDate': 'Created',
        'title': 'Title',
        'status': 'State',
      
      };
      var actionOptions = [
        { 'id': 'view', 'name': 'View Details' },
        { 'id': 'edit', 'name': 'Edit' },
        { 'id': 'close', 'name': 'Close' }];


        var requestUrl = "snmyrequest";
        if(this.tabActive == 'history'){
         requestUrl ="sntickethistory"
         var actionOptions = [
          { 'id': 'view', 'name': 'View Details' },]
         
        }
    this.ds.publicPostData(requestUrl, requestObj)
      .pipe(
        map((data:any) => {
          const inputData = data.result;
          //console.log("inputdata",inputData);
         // this.ticketsList = inputData['content'];
         // this.hpsmTicketList = inputData['content'];

          if (inputData) {
            data = inputData.map(custOpsInteractionObj => {
              const newObj = {};
             // console.log("inside map");
              newObj['ticketId'] = custOpsInteractionObj[keyMapObj['ticketId']];
              newObj['startDate'] = custOpsInteractionObj[keyMapObj['startDate']];
              newObj['title'] = custOpsInteractionObj[keyMapObj['title']];
              newObj['status'] = custOpsInteractionObj[keyMapObj['status']];
              newObj['possibleActions'] = actionOptions;
              return newObj;
            });
          } else {
            return {};
          }
         // this.rowsExist = Object.keys(inputData).length > 0 ? true : false;
          this.isLoadingResults = !this.rowsExist;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        }))
      .subscribe(data => {
        // const siebelActionOptions = [
        //   { 'id': 'view', 'name': 'View Details' },
        //   { 'id': 'edit', 'name': 'Edit' }];
        //   const siebelActionOptionsCC = [
        //     { 'id': 'view', 'name': 'View Details' }];
        // for(let i in data){
        //   if(data[i].ticketId){
        //     if(!data[i].ticketId.startsWith("IT")){
        //       if(data[i].status == 'Completed' || data[i].status == 'Cancelled'){
        //         data[i].possibleActions = siebelActionOptionsCC;
        //       }else{
        //         data[i].possibleActions = siebelActionOptions;
        //       }

        //     }
        //   }
        // }
        //console.log("sndata",data)
        this.ticketsList = data;
        this.tickets = new MatTableDataSource(<Ticket[]>data);
        this.rowsExist = data.length > 0 ? true : false;
        this.tickets.paginator = this.paginator;
  
  
        this.tickets.sort = this.sort;
        this.isLoadingResults = false;
      });
  }


  public openModalAction(event: any, id?: string) {
    const requestId = event ? event.target.selectedOptions[0].id : id;
    const selectedOption = event ? event.target.selectedOptions[0].value : 'view';
    const ticketDestination = 'serviceNow';
    var ticketType = ""
    var ticket = "snmyrequests";
    if(this.tabActive =='history'){
     ticket ="snhistoryrequests"
     ticketType="history"
    }


    var view = "AvayaCloudOffice";
      this.ts.theTicket = this.ticketsList.find(ticket =>
        ticket.Number === requestId);

        if ( requestId && selectedOption ) {
          // this.router.navigate([this.languageService.localCode+"/public"], {
          //   queryParams: {
          //     view:view,
          //     modal: 'show',
          //     action: selectedOption,
          //     id: requestId,
          //     ticketType: ticketType,
          //     ticketDestination:ticketDestination,
          //     origin:this.languageService.localCode+"/public"
          //   }
          // });
          window.open(
            '?view='+view+'&modal=show&action='+selectedOption+'&id='+requestId+'&ticketType='+ticketType+'&ticketDestination='+ticketDestination+'&origin='+this.languageService.localCode+'/public',
            '_blank' // <- This is what makes it open in a new window.
          );
          //window.location.href = '?view='+view+'&modal=show&action='+selectedOption+'&id='+requestId+'&ticketType='+ticketType+'&ticketDestination='+ticketDestination+'&origin='+this.languageService.localCode+'public';
        }
        return;
    

  }
}