import { Injectable } from '@angular/core';
import { CustOpsInteraction } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private _ticket;
  private attachment = [];

  public get theTicket() {
    return this._ticket;
  }
  public set theTicket(value) {
    this._ticket = value;
  }
  public get theAttachment() {
    return this.attachment;
  }
  public set theAttachment(value) {
    this.attachment = value;
  }

  constructor() { }
}
