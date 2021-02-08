import {
  Component,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ProcessProvider } from '../../services/process.service';
import { UIDataService } from '../../services/uidata.service';
import { HeroComponent } from '../hero/hero.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { environment } from '../../../../../environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-care-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('processContainer', { read: ViewContainerRef, static: true })
  container;
  showModal = false;
  modifyTicket = false;
  showOutageList = false;
  subscription: Subscription;
  publicPage = true;
  isSearchPage = false;
  openRequestsView: string = "";
isPublic:boolean = false;
  constructor(
    private uiDS: UIDataService,
    private resolver: ComponentFactoryResolver,
    private processProvider: ProcessProvider,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const steps = this.processProvider.getProcessSteps();

    for (const step of steps) {
      const factory = this.resolver.resolveComponentFactory(step.component);
      const componentRef = this.container.createComponent(factory);

      if (step.component === HeroComponent) {
        componentRef.instance.heroData = this.uiDS.hero;
      } else {
        componentRef.instance.inputData = step.inputData;
      }
    }

    if (window.location.href.indexOf('public') > -1){
      this.isPublic = true;
    }
    if (window.location.href.indexOf('search') > -1){
      this.isSearchPage = true;
    }
    this.subscription = this.route.queryParamMap
      .subscribe(params => {
        this.showModal = false;
        this.modifyTicket = false;
        this.showOutageList = false;
        if (params.keys.length > 0) {
          if (params.has('modal') && params.has('function') && params.has('category')) {
            const functn = params.get('function'), category = params.get('category');

            if (this.uiDS.isValidFunction(functn) && this.uiDS.isValidCategory(functn, category)) {
              this.showModal = !!params.get('modal');
            } else {
              this.goHome();
            }
          } else if (params.has('modal') && params.has('action') && params.has('id')) {
            this.modifyTicket = !!params.get('modal');
          }
          else if (params.has('modal') && !params.has('category') && params.has('function')) {
            const vFunct = params.get('function')
            if (this.uiDS.isValidFunction(vFunct)) {
              this.showModal = !!params.get('modal');
            } else {
              this.goHome();
            }
          }
          else if (params.has('outage')) {
            this.showOutageList = true;
          }
        }
      });
      this.uiDS.openRequestsTab.subscribe(data => {
        this.openRequestsView = data
     })
  }

  goHome() {
    this.snackBar.open(
      `Error – the hyperlink is either incorrect or leads to a page you don’t have access to.`,
      'Dismiss', <MatSnackBarConfig>environment.snackBarConfig);
    if (window.location.href.indexOf('public') > -1) {
      this.router.navigate(['en/public']);
      // this.publicPage = true;
    } else {
      // this.publicPage = false;
      this.router.navigate(['']);
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
