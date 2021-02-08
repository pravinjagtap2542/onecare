import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../../models/hero.model';
import { UIDataService } from '../../services/uidata.service';

@Component({
  selector: 'cop-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() heroData: Hero;

  constructor( private uiDS: UIDataService,) { }
  ngOnInit() {

    if (!this.heroData) {
      this.heroData = this.uiDS.hero;
    }
   }
}
