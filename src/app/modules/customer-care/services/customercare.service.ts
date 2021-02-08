import { Injectable } from '@angular/core';
import { DataService } from '../../../common/services/data.service';

@Injectable()
export class CCDataService {
  private createTicketUrl = 'createticket/';
  private ticketHistoryUrl = 'tickethistory/';
  private delegateUrl = 'dgrequests/';
  private addUpdateTicketUrl = 'addupdate/'; // + ID = ITxxxxx
  private closeTicketUrl = 'close/'; // + ID = ITxxxxx
  private reopenTicketUrl = 'reopen/'; // + ID = ITxxxxx

  constructor(private ds: DataService) { }

  /**
   * getOpenTickets
   */
  public getOpenTickets() {
    return this.ds.getDataOf('myrequests');
  }
}
