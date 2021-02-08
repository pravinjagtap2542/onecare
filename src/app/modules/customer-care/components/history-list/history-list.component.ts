import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../../common/services/data.service';
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
  selector: 'cop-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {

  ticketsHistory: MatTableDataSource<Ticket>;
  displayedColumns: string[] = ['requestId', 'dateClosed', 'title', 'status', 'actions'];
  subscription: Subscription;
  ticketsList: any[];
  rowsExist = false;
  header: string;
  description: string;
  isLoadingResults = true;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private uib: UIBaseService,
    private ds: DataService,
    private router: Router,
    private ts: TicketsService,
    private myAvtivities: MyActivitiesComponent,
    private languageService:LanguageService) {  }


  ngOnInit() {
    const linkElement = this.uib.getDataOfType('TabContainer')[1]; // TODO: Typecase the return value.
    this.header = linkElement.title;
    this.description = linkElement.description;
    this.myAvtivities.tabAction('history');
    this.populateTicketsList(linkElement.url);
  }

  public openModalAction(event: any, id?: string) {
    this.myAvtivities.tabAction('history');
    const requestId = event ? event.target.selectedOptions[0].id : id;
    const selectedOption = event ? event.target.selectedOptions[0].value : 'view';
    const ticketType = 'historyTicket';

    this.ts.theTicket = this.ticketsList.find(ticket =>
      ticket['CustOpsInteraction'].InteractionID === requestId)['CustOpsInteraction'];

    if ( requestId && selectedOption ) {
      this.router.navigate([this.languageService.localCode+'/history'], {
        queryParams: {
          modal: 'show',
          action: selectedOption,
          id: requestId,
          ticketType: ticketType,
          origin: this.languageService.localCode+'/history'
        }
      });
    }
    return;
  }

  private getOptions(dateTime: string) {
    const actionOptions = [{ 'id': 'view', 'name': 'View Details' }],
          closeDate = new Date(dateTime),
          today = new Date(Date.now()),
          daysOld = Math.round(( today.valueOf() - closeDate.valueOf() ) / (1000 * 60 * 60 * 24));

    if (daysOld <= 14) {
      actionOptions.push({ 'id': 'reopen', 'name': 'Re-open Request' });
    }
    return actionOptions;
  }

  private populateTicketsList(url: string) {
    const myTicketsUrl = url;
    const keyMapObj = {
      'requestId': 'InteractionID',
      'dateClosed': 'CloseTime',
      'title': 'Title',
      'status': 'Status'
    };

    this.subscription = this.ds.getData(myTicketsUrl)
      .pipe(
        map(data => {
          const inputData = <Hptickets>data;
          this.ticketsList = inputData['content'];
          if (this.ticketsList) {
            data = inputData['content'].map(custOpsInteractionObj => {
              const newObj = {};
              newObj['requestId'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['requestId']];
              newObj['dateClosed'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['dateClosed']];
              newObj['title'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['title']];
              newObj['status'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['status']];
              newObj['actions'] = this.getOptions( newObj['dateClosed'] );

              return newObj;
            });
          } else {
            this.isLoadingResults = false;
            this.rowsExist = false;
            return {};
          }
          this.isLoadingResults = false;
          this.rowsExist = inputData['@count'] > 0 ? true : false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        }))
      .subscribe(data => {
        if(this.rowsExist){
          this.ticketsHistory = new MatTableDataSource(<Ticket[]>data);
          this.ticketsHistory.paginator = this.paginator;
          this.ticketsHistory.sort = this.sort;
        }
      });
  }

  applyFilter(filterValue: string) {
    this.ticketsHistory.filter = filterValue.trim().toLowerCase();
    if (this.ticketsHistory.paginator) {
      this.ticketsHistory.paginator.firstPage();
    }
  }

}
