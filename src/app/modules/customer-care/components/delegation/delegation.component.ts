import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService, TableGrid } from '../../../../common/services/data.service';
import { Ticket, Hptickets } from '../../models/ticket.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ModifyTicketComponent } from '../modify-ticket/modify-ticket.component';
import { map, catchError } from 'rxjs/operators';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { MyActivitiesComponent } from '../my-activities/my-activities.component';
import { LanguageService } from '../../../../common/services/language-service';

@Component({
  selector: 'cop-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.scss']
})
export class DelegationComponent implements OnInit {
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
  delegationTabHide: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private uib: UIBaseService,
    private ds: DataService,
    private router: Router,
    private ts: TicketsService,
    private myAvtivities: MyActivitiesComponent,
    private languageService:LanguageService
  ) { }

  ngOnInit() {
    this.refreshTable = <TableGrid>{ name: 'currentList', state: false };
    // const linkElement = this.uib.getDataOfType('TabContainer').find(item => item.title === 'Requests');
    const linkElement = this.uib.getDataOfType('TabContainer')[2];
    this.header = linkElement.title;
    this.description = linkElement.description;
    this.dataUrl = linkElement.url;
    this.myAvtivities.tabAction('dgrequests');
    this.populateTicketsList();
    this.ds.refreshData.subscribe(data => {
      if (data.name === 'currentList' && data.state) {
        this.refresh();
        this.refreshTable = { name: data.name, state: !data.state };
      }
    });
  }

  applyFilter(filterValue: string) {
    this.tickets.filter = filterValue.trim().toLowerCase();
    if (this.tickets.paginator) {
      this.tickets.paginator.firstPage();
    }
  }
  public openModalAction(event: any, id?: string) {
    this.myAvtivities.tabAction('dgrequests');
    const requestId = event ? event.target.selectedOptions[0].id : id;
    const selectedOption = event ? event.target.selectedOptions[0].value : 'view';
    const ticketType = 'current';

    if (!(id.startsWith("IT"))) {
      ////// This is for only Siebel Ticket///////////////////////////
      this.isLoadingResults = true;
      let selectedSiebelTicket = "srticketdetails/" + id;
      this.ds.getDataOf(`srticketdetails/${id}/`)
        .pipe(
          catchError(val => of(`ERROR sending data ${val}`)))
        .subscribe(resp => {
          this.isLoadingResults = false;
          const inputDataSiebel = <Hptickets[]>resp;
          this.ticketsList = inputDataSiebel['content'];
          // console.log("attachments: this.ticketsList[0].CustOpsInteraction.FileNames.content,",this.ticketsList[0].CustOpsInteraction.FileNames.content);
          this.ts.theTicket = this.ticketsList.find(ticket =>
            ticket['CustOpsInteraction'].InteractionID === requestId)['CustOpsInteraction'];

          this.ts.theAttachment = this.ticketsList[0].CustOpsInteraction.FileNames.content;

          // Open Modal
          if (requestId && selectedOption) {
            this.router.navigate([this.languageService.localCode+'/delegation'], {
              queryParams: {
                modal: 'show',
                action: selectedOption,
                id: requestId,
                ticketType: ticketType,
                origin: this.languageService.localCode+'/delegation'
              }

            });
          }
          return;

        });
    }/////End of logic for Siebel Ticket only /////
    else {
      this.ts.theTicket = this.hpsmTicketList.find(ticket =>
        ticket['CustOpsInteraction'].InteractionID === requestId)['CustOpsInteraction'];

      if (requestId && selectedOption) {
        this.router.navigate([this.languageService.localCode+'/delegation'], {
          queryParams: {
            modal: 'show',
            action: selectedOption,
            id: requestId,
            ticketType: ticketType,
            origin: this.languageService.localCode+'/delegation'
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

    this.subscription = this.ds.getData(this.dataUrl)
      .pipe(
        map(data => {
          
          const inputData = <Hptickets[]>data;
          this.ticketsList = inputData['content'];
          this.hpsmTicketList = inputData['content'];

          if (this.ticketsList) {
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
        for (let i in data) {
          if (data[i].ticketId) {
            if (!data[i].ticketId.startsWith("IT")) {
              if (data[i].status == 'Completed' || data[i].status == 'Cancelled') {
                data[i].possibleActions = siebelActionOptionsCC;
              } else {
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
