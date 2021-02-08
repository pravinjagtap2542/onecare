import { Component, OnInit, Input } from '@angular/core';
import { UIDataService } from '../../services/uidata.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
@Component({
  selector: 'cop-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss']
})
export class NewsSectionComponent implements OnInit {
  @Input() newsData : any;
  //@Input() topNewsData : any;
  catalogData:any;
  //newsData:any;
  //topNewsData:any
  safeSrc: SafeResourceUrl;
  safeSrcinModal: SafeResourceUrl;
  showModal: boolean = false;
  constructor( private uiDS: UIDataService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    //this.catalogData = this.uiDS.getUIData('TicketCatalogComponent');
    //console.log(this.catalogData);
   
    //this.newsData =  this.catalogData.filter(obj => {
     // return obj.hasOwnProperty('News');
    //})

   // this.newsData = this.newsData[0].News;

   // this.topNewsData = this.topNewsData[0].TopNews;
   // console.log("new enhancement of top news-->",this.topNewsData);
    // this.newsData.array.forEach(element => {
    //   if(element.mediaContent){}
    // });
    //console.log("News",this.newsData);
  }

 


  
  openInfoPopup(url){
    this.safeSrcinModal = url;
    this.showModal = true;
  }

  closeInfoPopup(){
    this.showModal = false;
    this.safeSrcinModal = "";
 }
}
