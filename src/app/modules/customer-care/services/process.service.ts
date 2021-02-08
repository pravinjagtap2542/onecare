import { Injectable } from '@angular/core';
import { ProcessItem } from '../models/processitem.model';
import { HeroComponent } from '../components/hero/hero.component';
import { MyActivitiesComponent } from '../components/my-activities/my-activities.component';
import { ActionCardsComponent } from '../components/action-cards/action-cards.component';
import { UIDataService } from './uidata.service';
import { PageComponent } from '../models/page.component.model';

@Injectable()
export class ProcessProvider {

  private list: PageComponent[];

  constructor(private uidata: UIDataService) {
    this.list = this.uidata.compList;
    this.list.sort((a, b) => a.order - b.order);
  }

  getProcessSteps(): ProcessItem[] {
    return this.getPageElements(this.list);
  }

  private getPageElements(pageComponents: PageComponent[]): ProcessItem[] {
    const result: ProcessItem[] = [];

    for (const pageComponent of pageComponents) {
      const comp = this.resolveComponentsName(pageComponent.componentType);
      const inputData = this.uidata.getUIData(pageComponent.componentType, pageComponent.componentVarname);
      const newItem = new ProcessItem(comp, inputData);
      if (newItem.component) {
        result.push(newItem);
      }
    }

    return result;
  }

  private resolveComponentsName(type: string) {
    if (window.location.href.indexOf('public') > -1 || window.location.href.indexOf('welcome') > -1) {
      if (type === 'TicketCatalogComponent') {
        return ActionCardsComponent;
      }
    } else {
      if (type === 'HeroComponent') {
        //return HeroComponent;
      } else if (type === 'TabContainer') {
        //return MyActivitiesComponent;
      } else if (type === 'TicketCatalogComponent') {
        return ActionCardsComponent;
      }
    }

  }
}
