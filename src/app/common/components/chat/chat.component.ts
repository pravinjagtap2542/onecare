import { Component, OnInit } from '@angular/core';
// import { Properties } from '../../models/user.info.model';
import { UIBaseService } from '../../services/uibase.service';

@Component({
  selector: 'cop-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

firstname: string;
lastname: string;
phone: string;
email: string;
  constructor(private uibase: UIBaseService) { }

  ngOnInit() {
    this.firstname = this.uibase.userInfo.First_Name;
    this.lastname = this.uibase.userInfo.Last_Name;
    //this.email = this.uibase.userInfo.E-mail;
    this.phone = this.uibase.userInfo.Phone_Number;
  }

  getUser(property: string) {
    // return this.userInfo.find(item => item.key === property).value;
  }
}
