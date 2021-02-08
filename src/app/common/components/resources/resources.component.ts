import { Component, OnInit } from '@angular/core';
import { UIBaseService } from '../../services/uibase.service';
import { Resources } from '../../models/resources.model';
import { LinkElement } from '../../models/element.link.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'com-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  allResources: Resources;
  initLinks: LinkElement[][];
  remaininLinks: LinkElement[][];
  expanded = false;

  constructor(private uib: UIBaseService) { }

  ngOnInit() {
    this.allResources = <Resources>this.uib.getDataFromVar('Resources');
    this.initLinks = [
      this.allResources.resources.category[0].links.slice(0, 6),
      this.allResources.resources.category[1].links.slice(0, 3)
    ];
    this.remaininLinks = [
      this.allResources.resources.category[0].links.splice(6),
      this.allResources.resources.category[1].links.splice(3)
    ];
  }
}
