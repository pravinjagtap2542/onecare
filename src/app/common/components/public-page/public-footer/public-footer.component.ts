import { Component, OnInit } from '@angular/core';
import { Footer } from '../../../models/footer.model';
import { UIBaseService } from '../../../services/uibase.service';

@Component({
  selector: 'cop-public-footer',
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.scss']
})
export class PublicFooterComponent implements OnInit {

  footer: any;
  constructor(private uibase: UIBaseService) { }

  ngOnInit() {
    this.footer = this.uibase.pageFooter;
  }

}
