import { Injectable } from '@angular/core';
import { Hero } from '../models/hero.model';
import { UIBaseService } from '../../../common/services/uibase.service';
import { PageComponent } from '../models/page.component.model';
import { Catalog } from '../models/catalog.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UIDataService {
  public openRequestsTab = new BehaviorSubject("");  
  public openSearchView = new BehaviorSubject(true);
  public acoUrl:string;
  public showRequestComp = new BehaviorSubject(false);
  constructor(private uibase: UIBaseService) { }

  public get compList(): PageComponent[] {
    return this.uibase.compData;
  }

  public getUIData( compName: string, varName?: string ) {
    return this.uibase.getDataOfType(compName, varName);
  }

  public getTicketCatalog() {
    return this.getUIData('TicketCatalogComponent');
  }

  public isValidFunction(catalog: string): boolean {
    return this.getTicketCatalog().findIndex(item => item.id === catalog) >= 0 ? true : false;
  }

  public isValidCategory(catalog: string, func: string): boolean {
    if ( this.isValidFunction(catalog) ) {
      const cat = <Catalog>this.getTicketCatalog().find(item => item.id === catalog);
      const funcIndex = cat.categoryassocs.findIndex(allFunctions => allFunctions.id === func);
      if (funcIndex < 0 ) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  public get hero(): Hero {
    const h = this.uibase.getDataOfType('HeroComponent');
    let hero: Hero;
    if ( h === {} ) {
      hero = new Hero();
    } else {
      hero = new Hero(h.title, h.herodesc);
      if(h.heroimage && h.heroimage.image ){
      hero.image.imageUrl = `url(\'${h.heroimage.image}\')`;
      hero.image.imageAltText = h.heroimage.alttext;
      }
    }
    return hero;
  }
}
