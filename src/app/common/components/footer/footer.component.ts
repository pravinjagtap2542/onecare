import { Component, OnInit } from '@angular/core';
import { Footer } from '../../models/footer.model';
import { UIBaseService } from '../../services/uibase.service';

@Component({
  selector: 'cop-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footer: Footer;
  constructor(private uibase: UIBaseService) { }

  ngOnInit() {
    this.footer = new Footer(
      this.uibase.pageFooter['footerlinks'],
      this.uibase.pageFooter['footernote']
    );
  }
}
