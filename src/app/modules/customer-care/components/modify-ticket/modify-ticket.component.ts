import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { of, Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, takeUntil, finalize, map, filter } from 'rxjs/operators';
import { DataService, TableGrid } from '../../../../common/services/data.service';
import { HPSMTicketResp, Hptickets, Attachment, SiebelTicket } from '../../models/ticket.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { environment } from '../../../../../environments/environment';
import { LanguageService } from '../../../../common/services/language-service';
import { UIBaseService } from '../../../../common/services/uibase.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cop-modify-ticket',
  templateUrl: './modify-ticket.component.html',
  styleUrls: ['./modify-ticket.component.scss']
})
export class ModifyTicketComponent implements OnInit {

  selectedOption: string;
  form: FormGroup;
  commentDescription: string;
  requestedTicket;
  ticketType: any;
  ticketDestination:any;
  isClickedOnce = false;
  showReOpen: boolean;
  attResp: Hptickets;
  noOfAtt = 0;
  attList: Attachment;
  siebelAttachment: any;
  selectedFiles: File[] = [];
  subscriptions: Subscription[];
  private unsubscribe$ = new Subject();
  siebelTicket = false;
  updateResponse: any;
  formattedSiebelRT: any;
  showNoUpdate = false;

  snackBarConfig = <MatSnackBarConfig>environment.snackBarConfig;
  private modalTicketSubject = new BehaviorSubject(null);
  modalTicketID = this.modalTicketSubject.asObservable();
  ticketId: string;
  ticketsList: any;
  hpsmTicketList: any;
  HPSMdataUrl: any;
  tabName:string;
  ringSSoSession: any;
  snCloseState: any;
  isAcoView: boolean = false;
  acoUrl: string;
  CHGTicket: boolean = false;
  possibleActions:any;
  cancelledTicketMessage: string;
  resolvedTicketMessage: string;
  isFileScanProgress: boolean;
  errorVirusMessage: string;
  validFileScan: string;
  isTicketSubmitted: any;
  delegationOriginUrl: string;
  myrequestsOriginUrl: string;
  historyOriginUrl: string;
  constructor(
    private ds: DataService,
    private uib: UIBaseService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private ts: TicketsService,
    private languageService:LanguageService,
    private translator: TranslateService 
  ) { }

  ngOnInit() {
    this.ticketType = this.route.snapshot.queryParamMap.get('ticketType');
    this.ticketDestination = this.route.snapshot.queryParamMap.get('ticketDestination');
    this.ticketId = this.route.snapshot.queryParamMap.get('id');
    if(this.ticketId && this.ticketId.startsWith("CHG")){
      this.CHGTicket = true;
    }
    var linkElement;
    this.ds.ringSso.subscribe(profile =>{
      //console.log("profile in subscribe",profile)
      this.ringSSoSession = profile;
      if(this.ringSSoSession && this.ringSSoSession.accessToken && this.ticketDestination == "serviceNow"){
        this.getServiceNowTicketInfo(this.ticketId);
      }
   
  });
    if(this.ticketType == "historyTicket"){
    linkElement = this.uib.getDataOfType('TabContainer')[1];
    this.tabName = this.languageService.localCode+"/home/#history";
    }else if(this.ticketType == "current"){
      linkElement = this.uib.getDataOfType('TabContainer')[0];
      this.tabName = this.languageService.localCode+"/home/#myrequests";
    }
    // else if(this.ticketType == "serviceNow" && this.ringSSoSession){
    //     this.getServiceNowTicketInfo(this.ticketId);
    // }
    else{
      linkElement = this.uib.getDataOfType('TabContainer')[2];
      this.tabName =  this.languageService.localCode+"/home/#dgrequests";
    }
    
    this.HPSMdataUrl = linkElement ? linkElement.url : '';
    this.requestedTicket = this.ts.theTicket;

 
    if(this.ticketId && this.ticketId.startsWith("1-")){
      this.siebelTicket = true;
      if(!this.requestedTicket){
         this.getSiebelTicketInfo(this.ticketId);
      }
    }
    if(this.ticketId && this.ticketId.startsWith("IT")){
      if(!this.requestedTicket){
          this.getHPSMTicketInfo(this.HPSMdataUrl);  
      }
      this.ds.getDataOf(`ticketattachments/${this.ticketId}/`)
      .subscribe(response => {
        this.attResp = <Hptickets>response;
        this.noOfAtt = this.attResp['@count'];
        this.siebelAttachment = this.ts.theAttachment;
       // this.showHideReOpenTab(this.requestedTicket.OpenTime);
      });
    }else{
      
      if(this.requestedTicket && this.requestedTicket.Status == 'Completed' || this.requestedTicket && this.requestedTicket.Status == 'Cancelled'){
          this.showNoUpdate = true;
      }
        this.attResp = <Hptickets>this.siebelAttachment;
        this.noOfAtt =  this.siebelAttachment ? this.siebelAttachment.length : 0;
    }
    
    this.selectAction(this.route.snapshot.queryParamMap.get('action') );
    this.commentDescription = '';
    if (window.location.href.indexOf("public") > -1 && window.location.href.indexOf("AvayaCloudOffice") > -1) {
      this.isAcoView = true;
      this.acoUrl = window.location.href;

      var index = this.acoUrl.indexOf('?');
      //var arr = [this.acoUrl.slice(0, index), this.acoUrl.slice(index + 1)];
      this.acoUrl = this.acoUrl.slice(0, index) + "?view=AvayaCloudOffice";
    }
   // this.setLocalizationText();
   this.delegationOriginUrl = this.languageService.localCode+"/home/#dgrequests";
   this.myrequestsOriginUrl = this.languageService.localCode+"/home/#myrequests";
   this.historyOriginUrl = this.languageService.localCode+"/home/#history";
  }

  onOptionsSelected(event,value){
    //console.log("event",event);
    //console.log("values",value);
    this.snCloseState = value;
  }
  selectAction(action: string) {
    this.selectedOption = action;
    switch (action) {
      case 'edit':
      case 'reopen':
        this.form = new FormGroup({'UpdateAction': new FormControl()});
        break;

      case 'close':
        this.form = new FormGroup({'Solution': new FormControl(),'closure':new FormControl()});
    }
  }

  prepareMessageFileScan():string{
    var message = "";
    if(this.validFileScan)
       message = "Attachments:"+ this.validFileScan  + " ";
    if(this.errorVirusMessage){
      message = message + "File Scan Failure:"+ this.errorVirusMessage;
    }

  return message;
}

  addUpdate(ticketId) {
    if (this.selectedFiles.length > 0) {
      this.isFileScanProgress = true;
      const formData = new FormData();
       this.selectedFiles.forEach((file ,index) => {  
         formData.append('files', file ,file.name); 
       });
 
     
     this.ds.checkFileScan(formData)
     .pipe(catchError (val => of(`ERROR sending data ${val}`)),
     takeUntil(this.unsubscribe$),
     catchError(val => of(`ERROR submitting ticket ${val}`)),
     finalize(() => {
       //this.snackBar.open("Something went wrong..", 'Dismiss', this.snackBarConfig);
        //this.closeModal(this.origin);
       //if(this.isAcoView){
         //this.navigateToAvayaCloudOffice();
     //   }else{
        // this.router.navigate(['en/public']);
      //  }
      
     }))
     .subscribe(resp => {
       var responseArray = resp['body'];
       //console.log("responseArray",responseArray)
       if(responseArray){
       responseArray.forEach((response,index)=>{
         //console.log("response",response);     
           if(response.status){
             
             if(this.errorVirusMessage == ""){
               this.errorVirusMessage = response.filename;
             }else{
               this.errorVirusMessage = this.errorVirusMessage + "," + response.filename ;
             }
             if(this.selectedFiles.length == 1){
               this.selectedFiles = [];
             }else{
                  
               this.selectedFiles.forEach(file =>{
                 if(file.name === response.filename){
                   this.selectedFiles.splice(this.selectedFiles.indexOf(file) ,1);   
                 }
               })
               
             }
           }else{
             if(this.validFileScan == ""){
               this.validFileScan = response.filename;
             }else{
             this.validFileScan = this.validFileScan + "," + response.filename;
             }
           }
       });  
       setTimeout(() => {
        if(!this.isTicketSubmitted){
        this.submitTicket(ticketId);
        this.isTicketSubmitted = true;
        }
      }, 8000);   
     } 
      })  
     }else{
      this.submitTicket(ticketId);
  }
}

  submitTicket(ticketId){
    this.isClickedOnce = true;
    let message;

      if(this.ticketDestination == 'serviceNow'){

        var requestObj = {
          "u_company_id":this.ringSSoSession.companyId,
          "u_number":ticketId,
          "u_email_id":this.ringSSoSession.emailId,
          "u_entitlement": this.requestedTicket.Entitlement,
          "u_state":this.snCloseState ? this.snCloseState : '',
          "u_description":"" ,
          "u_work_notes":this.form.value.UpdateAction ? this.form.value.UpdateAction : this.form.value.Solution,
          "u_authenticated_user":"true"
      } 
//       var requestObj = {
//         "u_company_id":"0987654321",
//         "u_number":"INC1532419",
//         "u_email_id":"acodefault_dev@avaya.com",
//         "u_entitlement":"General Question",
//         "u_state":"",
//         "u_description":this.form.value.UpdateAction,
//         "u_work_notes":"Update work notes123788kdkrlkrkl",
//         "u_authenticated_user":"true"
// } 


        this.ds
        .updatePublicData('snupdateticket', requestObj)
        .pipe(
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          switchMap((response:any) => {
          if ( typeof response !== 'string' ) {
            const resp = response[0];

            if(resp['Status Code'] == 0){
                message = `${resp['Ticket Number']} updated Successfully`;
            }else if(resp['Status Code'] === 71){
              message = `There was an error Updating ticket - ${ticketId}`;
            }else{
              message =   `Error updating the ticket ${ticketId}`;
            }
            // message = +resp.ReturnCode === 0 ?
            // `Ticket ${resp.CustOpsInteraction.InteractionID} updated successfully.` :
            // `Error updating the ticket ${resp.Messages.toString()}`;

           // this.requestedTicket.UpdateAction = resp.CustOpsInteraction.UpdateAction;
            // Upload files, if attached.
            return of(response);
          }}),
          takeUntil(this.unsubscribe$),
          finalize(() => {
           let snackBarRef = this.snackBar.open(message, 'Dismiss', this.snackBarConfig);
            snackBarRef.afterDismissed().subscribe(() => {
              //console.log('The snack-bar was dismissed');
                setTimeout(() => {
                  this.closeModal();
                 }, 1000);
            });
      
            
          }))
      .subscribe(resp => console.log('')
      );
          
       } else if(ticketId.startsWith("IT")){
        this.ds
          .updateData('addupdate/' + ticketId, this.form.value)
          .pipe(
            catchError(val => of(`ERROR submitting ticket ${val}`)),
            switchMap(response => {
            if ( typeof response !== 'string' ) {
              const resp = <HPSMTicketResp>response;

              if(+resp.ReturnCode === 0){
                  message = `Ticket ${resp.CustOpsInteraction.InteractionID} updated successfully.`;
              }else if(+resp.ReturnCode === 71){
                message = `There was an error creating ticket - ${resp.Messages[0].toString()}`;
              }else{
                message =   `Error updating the ticket ${resp.Messages.toString()}`;
              }
              // message = +resp.ReturnCode === 0 ?
              // `Ticket ${resp.CustOpsInteraction.InteractionID} updated successfully.` :
              // `Error updating the ticket ${resp.Messages.toString()}`;

              this.requestedTicket.UpdateAction = resp.CustOpsInteraction.UpdateAction;
              // Upload files, if attached.
              if ( this.selectedFiles.length > 0 ) {
                const formData = new FormData();
                this.selectedFiles.forEach(file => formData.append('attachFile', file, file.name));
                return this.ds.sendAttachments(resp.CustOpsInteraction.InteractionID, formData);
              }
              return of(response);
            }}),
            takeUntil(this.unsubscribe$),
            finalize(() => {
              this.snackBar.open(message, 'Dismiss', this.snackBarConfig);
              this.closeModal();
            }))
        .subscribe(resp => console.log('')
        );
    }else{
      // siebel ticket update
      let siebelFormData = new FormData();
      siebelFormData.append('comment', this.form.value.UpdateAction);
      siebelFormData.append('subscription', ticketId);
      siebelFormData.append('srId', this.requestedTicket.Impact);

      if ( this.selectedFiles.length > 0 ) {
        this.selectedFiles.forEach( file => siebelFormData.append('attachFile', file, file.name));
      }
      this.ds
        .postData('srupdateticket', siebelFormData)
        .pipe(
          catchError(val => of(`ERROR submitting ticket ${val}`)),
          switchMap(response => {
          if ( typeof response !== 'string' ) {
            this.updateResponse = response;

            if(this.updateResponse && this.updateResponse.seibelResponse){
                message = `Ticket ${this.updateResponse.seibelResponse} updated successfully.`;
            }else{
              message =   `Error updating the ticket ${ticketId}`;
            }
          //  this.ts.theTicket.UpdateAction = resp.CustOpsInteraction.UpdateAction;
            return of(response);
          }}),
          takeUntil(this.unsubscribe$),
          finalize(() => {
            this.snackBar.open(message, 'Dismiss', this.snackBarConfig);
            this.closeModal();
          }))
      .subscribe(resp => console.log(''));

    }
  }
  
  onSelect(files) {
    for ( const file of files ) {
        this.selectedFiles.push(file);
    }
  }

  closeReopenTicket(action: string) {
    this.isClickedOnce = true;
    if(this.ticketDestination == 'serviceNow'){
      this.addUpdate(this.requestedTicket.InteractionID);
    }else{
     
      let message;
      const act = action === 'close' ? 'closed' : 're-opened';
  
      this.ds
        .deleteData(action + '/' + this.requestedTicket.InteractionID, this.form.value)
        .pipe(catchError(val => of(`ERROR submitting ticket ${val}`)))
        .subscribe(response => {
          if ( typeof response !== 'string' ) {
            const resp = <HPSMTicketResp>response;
  
            if (+resp.ReturnCode === 0) {
              message = `Ticket ${resp.CustOpsInteraction.InteractionID} ${act} successfully.`;
  
              if ( action === 'close' ) {
                this.ds.refreshDataOf(<TableGrid>{name: 'currentList', state: true});
              }
            } else if(+resp.ReturnCode === 71){
              message = `There was an error creating ticket - ${resp.Messages[0].toString()}`;
            }else if(+resp.ReturnCode === 3){
                message = `The ticket you are updating is being processed. Please try again in 5 minutes`;
            }else {
              message = `Error creating the ticket ${resp.Messages.toString()}`;
            }
  
            this.requestedTicket.UpdateAction = resp.CustOpsInteraction.UpdateAction;
          } else {
            message = response;
          }
          this.snackBar.open(message, 'Dismiss', this.snackBarConfig);
          this.router.navigate([this.route.snapshot.queryParamMap.get('origin') || this.tabName]);
        });
    }
  }

  private showHideReOpenTab(dateTime: string) {
    const closeDate = new Date(dateTime),
          today = new Date(Date.now()),
          daysOld = Math.round(( today.valueOf() - closeDate.valueOf() ) / (1000 * 60 * 60 * 24));

    this.showReOpen = daysOld <= 14 ? true : false;
  }

  closeModal() {
    if(this.isAcoView){
      window.close();

    }else{
   // this.router.navigate([this.route.snapshot.queryParamMap.get('origin') || "/"+this.tabName]);
   if(this.route.snapshot.queryParamMap.get('origin').indexOf('delegation') > 0){
    this.router.navigate([this.delegationOriginUrl]);
   }else if(this.route.snapshot.queryParamMap.get('origin').indexOf('history') > 0){
    this.router.navigate([this.historyOriginUrl]);
   }else{
    this.router.navigateByUrl("/"+this.tabName);
   }

   
    }
  }
  downloadAttachment(contentAttached){
    let attachCont = contentAttached.attachment.href.split(":").pop() + "?attachmentname=" + contentAttached.attachment.name;
    this.ds.getWindowOpen(`ticketattachments/${this.requestedTicket.InteractionID}/${attachCont}`);

  }

  getSiebelTicketInfo(ticketId){
    this.ds.getDataOf(`srticketdetails/${ticketId}/`)
    .pipe(
      catchError(val => of(`ERROR sending data ${val}`)))
    .subscribe(resp => {
      const inputDataSiebel = <Hptickets[]>resp;
      this.ticketsList = inputDataSiebel['content'];
     // console.log("attachments: this.ticketsList[0].CustOpsInteraction.FileNames.content,",this.ticketsList[0].CustOpsInteraction.FileNames.content);
      this.ts.theTicket = this.ticketsList.find(ticket =>
        ticket['CustOpsInteraction'].InteractionID === ticketId)['CustOpsInteraction'];
        this.requestedTicket = this.ticketsList.find(ticket =>
          ticket['CustOpsInteraction'].InteractionID === ticketId)['CustOpsInteraction'];
        this.ts.theAttachment = this.ticketsList[0].CustOpsInteraction.FileNames.content;
        this.siebelAttachment = this.ts.theAttachment;
        this.showHideReOpenTab(this.ts.theTicket.OpenTime);
        return;

    });
  }

  getHPSMTicketInfo(HPSMdataUrl){
    const keyMapObj = {
      'ticketId': 'InteractionID',
      'startDate': 'OpenTime',
      'title': 'Title',
      'status': 'Status'
    };
    this.ds.getDataOf(`smticketdetails/${this.ticketId}/`)
    .pipe(
      map(data => {
        const inputData = <Hptickets[]>data;
        this.hpsmTicketList = inputData['content'];

        if ( this.hpsmTicketList ) {
          data = this.hpsmTicketList.map(custOpsInteractionObj => {
            const newObj = {};
            newObj['ticketId'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['ticketId']];
            newObj['startDate'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['startDate']];
            newObj['title'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['title']];
            newObj['status'] = custOpsInteractionObj['CustOpsInteraction'][keyMapObj['status']];

            return newObj;
          });
        } else {
          return {};
        }

        this.ts.theTicket = this.hpsmTicketList.find(ticket =>
          ticket['CustOpsInteraction'].InteractionID === this.ticketId)['CustOpsInteraction'];
          this.requestedTicket = this.hpsmTicketList.find(ticket =>
            ticket['CustOpsInteraction'].InteractionID === this.ticketId)['CustOpsInteraction'];

// this.ts.theTicket = this.hpsmTicketList['CustOpsInteraction'];
// this.requestedTicket = this.hpsmTicketList['CustOpsInteraction'];
            this.ds.getDataOf(`ticketattachments/${this.ticketId}/`)
            .subscribe(response => {
              this.attResp = <Hptickets>response;
              this.noOfAtt = this.attResp['@count'];
              this.siebelAttachment = this.ts.theAttachment;
             // this.showHideReOpenTab(this.requestedTicket.OpenTime);
            });
          
        return  data;
      }),
      catchError(() => {
       
        return of([]);
      }))
    .subscribe(data => { 
 
    });
  }

  getServiceNowTicketInfo(ticketId){
    this.setLocalizationText();
    if(this.ringSSoSession){
    var requestObj ={
      "u_company_id":this.ringSSoSession.companyId,
      "u_email_id":this.ringSSoSession.emailId,
      "u_number" :ticketId,
      "u_authenticated_user":"true"
    }
  }
    // var requestObj = {
    //   "u_company_id":"0987654321",
    //   "u_email_id":"acodefault_dev@avaya.com",
    //   "u_number" :"INC1532420",
    //   "u_authenticated_user":"true"
    //   }  
      const keyMapObj = {
        'ticketId': 'Number',
        'startDate': 'Created',
        'title': 'Title',
        'status': 'State',
        'Description':'Description',
        'Contact':'Contact',
        'Entitlement':'Entitlement',
        'Worknotes':'Worknotes',
        'Created':'Created',
      
      };


    this.ds.publicPostData("sngetticketdetails", requestObj)
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
              newObj['InteractionID'] = custOpsInteractionObj[keyMapObj['ticketId']];
              newObj['startDate'] = custOpsInteractionObj[keyMapObj['startDate']];
              newObj['Title'] = custOpsInteractionObj[keyMapObj['title']];
              newObj['Status'] = custOpsInteractionObj[keyMapObj['status']];
              newObj['Description'] = custOpsInteractionObj[keyMapObj['Description']];    
              newObj['Contact'] = custOpsInteractionObj[keyMapObj['Contact']];
              newObj['Entitlement'] = custOpsInteractionObj[keyMapObj['Entitlement']];
             // newObj['Worknotes'] = custOpsInteractionObj[keyMapObj['Worknotes']] ? custOpsInteractionObj[keyMapObj['Worknotes']].split('\n\n******\n\n') : [];
             newObj['Worknotes'] = custOpsInteractionObj[keyMapObj['Worknotes']]
              newObj['OpenTime'] = custOpsInteractionObj[keyMapObj['Created']];
              //newObj['possibleActions'] = actionOptions;
              return newObj;
            });
          } else {
            return {};
          }
       
          return data;
        }),
        catchError(() => {
         // this.isLoadingResults = false;
          return of([]);
        }))
      .subscribe(data => {
      
        //console.log("sndata",data)
        this.ts.theTicket = data[0];
        this.requestedTicket = data[0];
        this.possibleActions = [
          { 'id': 'Resolved', 'name': this.resolvedTicketMessage },
          { 'id': 'Cancelled', 'name': this.cancelledTicketMessage }];
  
       if(this.CHGTicket){
        this.possibleActions = [
         
          { 'id': 'Cancelled', 'name': this.cancelledTicketMessage}];
       }
      //console.log("requested Ticket",this.requestedTicket);
      //  console.log("tickets----->>>>>",this.tickets);
       
      });

  }

  setLocalizationText(){
    this.translator.get('resolved').subscribe((res: string) => {
      this.resolvedTicketMessage = res
    });
    this.translator.get('cancelledTicket').subscribe((res: string) => {
      this.cancelledTicketMessage = res
    });
  }
}
