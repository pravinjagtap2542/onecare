import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TableGrid {
  name: string;
  state: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _url = environment.url;
   username = environment.username;
   password = environment.password;
   
  authorizationData = 'Basic ' + btoa(this.username + ':' + this.password);

  private _options = { headers: { 'Content-Type': 'application/json; charset=utf-8' } };
  
  private _refreshData = new BehaviorSubject<TableGrid>({ name: 'new', state: false });
   private ringSSOSession = new BehaviorSubject(null);
  
  ringSso = this.ringSSOSession.asObservable();
  private seesionOn = new BehaviorSubject(null);
  
  seesionOnRing = this.seesionOn.asObservable();

  delegationData: boolean;

  constructor(private http: HttpClient) { }

  getData(url: string) {
    return this.http.get(url);
  }

  getWindowOpen(url: string) {
    return window.open(`${this._url}/${url}`);
  }

  getDataOf(url: string) {
    return this.http.get(`${this._url}/${url}`);
  }

  getSessionDataOf(url: string) {
    return this.http.get(`${this._url}/${url}`, { observe: 'response' });
  }


  getSearchResults(url: string) {
    return this.http.get(url, { observe: 'response' });
  }

  getSearchHtmlResponse(url: string) {
    return this.http.get(url, { observe: 'response' });
  }

  createData(url: string, data: any) {
    return this.http.post(`${this._url}/${url}/`, JSON.stringify(data), this._options);
  }

  postData(url: string, data: any) {
    return this.http.post(`${this._url}/${url}/`, data);
  }

  publicPostData(url: string, data: any) {
    let x = `${this._url}`;
    var splitUrl = x.split('cops');
    let publicUrl = splitUrl[0] + 'cops/public' + splitUrl[1] + `/${url}/`;
    return this.http.post(publicUrl, data);
  }

  deligationGetData(url: string) {
    return this.http.get(url);
  }


  updateData(url: string, data: any) {
    return this.http.put(`${this._url}/${url}/`, JSON.stringify(data), this._options);
  }

  updatePublicData(url:string,data:any){
    let x = `${this._url}`;
    var splitUrl = x.split('cops');
    let publicUrl = splitUrl[0] + 'cops/public' + splitUrl[1] + `/${url}/`;
    return this.http.put(publicUrl, JSON.stringify(data), this._options);
  }
  updateSiebelData(url: string, data: any) {
    return this.http.put(`${this._url}/${url}/`, data);
  }

  deleteData(url: string, data: any) {
    return this.http.post(`${this._url}/${url}/`, JSON.stringify(data), this._options);
  }

  sendEmail(emailData: any) {
    let url = 'sendTicketEmail';
    let x = `${this._url}`;
    var splitUrl = x.split('cops');
    let publicUrl = splitUrl[0] + 'cops/public' + splitUrl[1] + `/${url}/`;
    if(window.location.href.indexOf('public') > -1){
       return this.http.post(publicUrl, emailData);
    }else{
      return this.http.post(`${this._url}/sendTicketEmail`, emailData);
    }
  }
  checkFileVirus(url:string ,data:any){
    let x = `${this._url}`;
    var splitUrl = x.split('cops');
    let publicUrl = splitUrl[0] + 'cops/public' + splitUrl[1] + `/${url}/`;
    const options = {
      params: new HttpParams(),
      reportProgress: false,

    };
    const req = new HttpRequest('POST', publicUrl, data ,options);
    return this.http.request(req);
  }
  checkFileScan(data:any){
    let headers = new HttpHeaders();
//headers = headers.append('Content-Type', 'application/json; charset=utf-8');
headers = headers.append('Authorization',this.authorizationData);

    let url = environment.fileScanUrl;
    const options = {
      params: new HttpParams(),
      reportProgress: false,
      headers:headers
    };
    const req = new HttpRequest('POST', url, data ,options);
    return this.http.request(req);

  }
  sendAttachments(url: string, data: any) {
    const options = {
      params: new HttpParams(),
      reportProgress: false,
    };
    let x = `${this._url}`;
    var splitUrl = x.split('cops');
    let publicUrl = splitUrl[0] + 'cops/public' + splitUrl[1];
    var req;
    if(window.location.href.indexOf('public') > -1){
      req = new HttpRequest('POST', publicUrl + `/hpsmFileUpload/${url}/`, data, options);
    }else{
       req = new HttpRequest('POST', this._url + `/hpsmFileUpload/${url}/`, data, options);
    }
  

    return this.http.request(req);
  }

  get refreshData() {
    return this._refreshData.asObservable();
  }

  protected get URL() {
    return this._url;
  }

  get attachmentsUrl() {
    return this._url + '/hpsmFileUpload/';
  }

  refreshDataOf(data: TableGrid) {
    return this._refreshData.next(data);
  }

  getRingSessionData(data:any){
    this.ringSSOSession.next(data);

  }

  reloadOnRingSession(data:any){
    this.seesionOn.next(true);
  }

}
