import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  Renderer2} from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.carousel-item'
})
// tslint:disable-next-line:directive-class-suffix
export class CarouselItemElement { }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {
  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel', {static: true}) private carousel: ElementRef;
  @Input() timing = '250ms ease-in';
  @Input() showControls = true;
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  carouselWrapperStyle = {};

  constructor( private builder: AnimationBuilder, private renderer: Renderer2 ) { }

  next() {
    if ( this.currentSlide + 1 === this.items.length ) {
      return;
    }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation( offset ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}%)` }))
    ]);
  }

  prev() {
    if ( this.currentSlide === 0 ) {
      return;
    }

    this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      const w: string = (this.itemsElements.length * 100) + '%';

      this.renderer.setStyle(this.carousel.nativeElement, 'width', w);

      const slideWidthInContainer: string = (100 / this.itemsElements.length) + '%';

      this.itemWidth = (100 / this.itemsElements.length);
      this.itemsElements.forEach(el => {
        this.renderer.setStyle(el.nativeElement, 'width', slideWidthInContainer);
      });

      this.carouselWrapperStyle = {
        width: `100%`
      };
    }, 0);
  }
}
