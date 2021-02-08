import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'com-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  items = [
    { title: 'Slide 1', imageUrl: 'https://picsum.photos/600/300/?random' },
    { title: 'Slide 2', imageUrl: 'https://picsum.photos/600/300/?random' },
    { title: 'Slide 3', imageUrl: 'https://picsum.photos/600/300/?random' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
