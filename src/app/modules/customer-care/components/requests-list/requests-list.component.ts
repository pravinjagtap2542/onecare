import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService, TableGrid } from '../../../../common/services/data.service';
import { Ticket, Hptickets } from '../../models/ticket.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { map, catchError } from 'rxjs/operators';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { ModalService } from '../../../../common/services/modal.service';
import { ModifyTicketComponent } from '../modify-ticket/modify-ticket.component';
import { LanguageService } from '../../../../common/services/language-service';
import { UIDataService } from '../../services/uidata.service';

@Component({
  selector: 'cop-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit, OnDestroy {

  tickets: MatTableDataSource<Ticket>;
  displayedColumns: string[] = ['ticketId', 'startDate', 'title', 'status', 'possibleActions'];
  subscription: Subscription;
  ticketsList: any[];
  rowsExist = false;
  header: string;
  description: string;
  refreshTable: TableGrid;
  dataUrl: string;
  isLoadingResults = true;
  hpsmTicketList: any[];
showComponentInfo:boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  deligationResp: any;
  deligationResponseArray = [];


  constructor(
    private uib: UIBaseService,
    private ds: DataService,
    private router: Router,
    private ts: TicketsService,
    private uiDS: UIDataService,
    public modalService: ModalService,private languageService:LanguageService) {  }

  ngOnInit() {
    this.refreshTable = <TableGrid>{name: 'currentList', state: false};
    // const linkElement = this.uib.getDataOfType('TabContainer').find(item => item.title === 'Requests');
    const linkElement = this.uib.getDataOfType('TabContainer')[0];
    this.header = linkElement.title;
    this.description = linkElement.description;
    this.dataUrl = linkElement.url;
    //this.populateTicketsList();
    this.ds.refreshData.subscribe(data => {
      if (data.name === 'currentList' && data.state) {
        this.refresh();
        this.refreshTable = {name: data.name, state: !data.state};
      }
    });

    this.uiDS.showRequestComp.subscribe(data => {
     // console.log("data",data);
      if(data){
     this.showComponentInfo = true;
     this.populateTicketsList();
    
      }
    })
  }




  applyFilter(filterValue: string) {
    this.tickets.filter = filterValue.trim().toLowerCase();

    if (this.tickets.paginator) {
      this.tickets.paginator.firstPage();
    }
  }

  public openModalAction(event: any, id?: string) {
    const requestId = event ? event.target.selectedOptions[0].id : id;
    const selectedOption = event ? event.target.selectedOptions[0].value : 'view';
    const ticketType = 'current';

    if(!(id.startsWith("IT"))){
      ////// This is for only Siebel Ticket///////////////////////////
    this.isLoadingResults = true;
       this.ds.getDataOf(`srticketdetails/${id}/`)
         .pipe(
           catchError(val => of(`ERROR sending data ${val}`)))
         .subscribe(resp => {
           this.isLoadingResults = false;
           const inputDataSiebel = <Hptickets[]>resp;
           this.ticketsList = inputDataSiebel['content'];
          // console.log("attachments: this.ticketsList[0].CustOpsInteraction.FileNames.content,",this.ticketsList[0].CustOpsInteraction.FileNames.content);

          if(this.ticketsList && this.ticketsList.length !=0){
           //this.ts.theTicket = this.ticketsList.find(ticket =>
            //  ticket['CustOpsInteraction'].InteractionID === requestId)['CustOpsInteraction'];
            // this.ts.theTicket = this.ticketsList[0].find(ticket =>
            //     ticket['CustOpsInteraction'].InteractionID === requestId);
                // if(this.ticketsList[0].CustOpsInteraction){
                 
                // }

                if(this.ticketsList[0].CustOpsInteraction){
                  this.ts.theTicket = this.ticketsList[0].CustOpsInteraction;
             this.ts.theAttachment = this.ticketsList[0].CustOpsInteraction.FileNames.content;
                }
           }

             // Open Modal
             if ( requestId && selectedOption ) {
               this.router.navigate([this.languageService.localCode+'/requests'], {
                 queryParams: {
                   modal: 'show',
                   action: selectedOption,
                   id: requestId,
                   ticketType: ticketType,
                   origin: this.languageService.localCode+'/requests'
                 }

               });
             }
             return;

         });
    }/////End of logic for Siebel Ticket only /////
    else{
      this.ts.theTicket = this.hpsmTicketList.find(ticket =>
        ticket['CustOpsInteraction'].InteractionID === requestId)['CustOpsInteraction'];

        if ( requestId && selectedOption ) {
          this.router.navigate([this.languageService.localCode+'/requests'], {
            queryParams: {
              modal: 'show',
              action: selectedOption,
              id: requestId,
              ticketType: ticketType,
              origin:this.languageService.localCode+'/requests'
            }
          });
        }
        return;
    }

  }

  private populateTicketsList() {
    const actionOptions = [
      { 'id': 'view', 'name': 'View Details' },
      { 'id': 'edit', 'name': 'Edit' },
      { 'id': 'close', 'name': 'Close' }];
    const keyMapObj = {
      'ticketId': 'InteractionID',
      'startDate': 'OpenTime',
      'title': 'Title',
      'status': 'Status'
    };

    let deligationUrl = '/customercare/en/home/user?action=getDelegUser';
    this.ds.getData(deligationUrl)
      .pipe(
        catchError(val => of(`ERROR sending data ${val}`))
      )
      .subscribe(resp => {
        this.deligationResp = resp;
        let deligationData = (this.deligationResp.delegUsers).split(',');
        deligationData.forEach(loopvalue => {
          if (loopvalue.length >= 3 && loopvalue != 'null') {
            this.deligationResponseArray.push(loopvalue);
          }
        });
      })
    this.subscription = this.ds.getData(this.dataUrl)
      .pipe(
        map(data => {
          const inputData = <Hptickets[]>data;
          this.ticketsList = inputData['content'];
          this.hpsmTicketList = inputData['content'];

          if ( this.ticketsList ) {
            data = this.ticketsList.map(custOpsInteractionObj => {
              const newObj = {};
              newObj['ticketId'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['ticketId']];
              newObj['startDate'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['startDate']];
              newObj['title'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['title']];
              newObj['status'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['status']];
              newObj['possibleActions'] = actionOptions;
              return newObj;
            });
          } else {
            return {};
          }
          this.rowsExist = inputData['@count'] > 0 ? true : false;
          // this.isLoadingResults = !this.rowsExist;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        }))
      .subscribe(data => {
        const siebelActionOptions = [
          { 'id': 'view', 'name': 'View Details' },
          { 'id': 'edit', 'name': 'Edit' }];
          const siebelActionOptionsCC = [
            { 'id': 'view', 'name': 'View Details' }];
        for(let i in data){
          if(data[i].ticketId){
            if(!data[i].ticketId.startsWith("IT")){
              if(data[i].status == 'Completed' || data[i].status == 'Cancelled'){
                data[i].possibleActions = siebelActionOptionsCC;
              }else{
                data[i].possibleActions = siebelActionOptions;
              }

            }
          }
        }
        this.tickets = new MatTableDataSource(<Ticket[]>data);
      //  console.log("tickets----->>>>>",this.tickets);
        this.tickets.paginator = this.paginator;
        this.tickets.sort = this.sort;
        this.isLoadingResults = false;
      });
  }

  refresh() {
    this.subscription.unsubscribe();
    this.populateTicketsList();
  }

  ngOnDestroy() {
    return this.subscription ? this.subscription.unsubscribe() : null;
  }
}
