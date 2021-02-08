import { Injectable } from '@angular/core';
import { WindowRef } from './core/window-ref.service';
import { Header } from '../models/header.model';
import { Footer } from '../models/footer.model';
import { PageComponent } from '../../modules/customer-care/models/page.component.model';
import { UserInfo } from '../models/user.info.model';


@Injectable({
  providedIn: 'root'
})
export class UIBaseService {
    private _data: Object;
    private _homeVarList: PageComponent[];

  constructor(private win: WindowRef) {
    this.readAll();
  }

  private readAll() {
    const __data = this.win.nativeWindow['pageComponentsData'];
    if ( __data === undefined ) {
    } else {
      try {
        this._data = JSON.parse(__data);
        if ( this._data['pageType'] = 'home' ) {
        this._homeVarList = <PageComponent[]>this._data['pageComponents'];
      }
      } catch (error) {
      }
    }
  }

  public get data(): Object {
    return this._data;
  }

  public get compData(): PageComponent[] {
    if(this._homeVarList){

      return this._homeVarList
      .filter(pg => pg.componentType !== 'HeaderComponent')
      .filter(pg => pg.componentType !== 'FooterComponent');
    }
    else{
return [];
    }
    
  }

  public getDataOfType(componentType: string, componentVarName?: string) {
    const pgComp = componentVarName
      ? this._homeVarList.find( item => item.componentVarname === componentVarName )
      : this._homeVarList.find( item => item.componentType === componentType );

    try {
      return pgComp
        ? JSON.parse(this.win.nativeWindow[pgComp.componentVarname])
        : JSON.parse(this.win.nativeWindow[componentType]);
    } catch (error) {
      // tslint:disable-next-line:max-line-length
    }
    return {};
  }

  public getDataFromVar(varName: string) {
    try {
      return JSON.parse(this.win.nativeWindow[varName]);
    } catch (error) {
    }
    return {};
  }

  public get pageHeader(): Header {
    return <Header>this.getDataOfType('HeaderComponent');
  }

  public get pageFooter(): Footer {
    return <Footer>this.getDataOfType('FooterComponent');
  }

  public get userInfo(): UserInfo {
    return <UserInfo>this.getDataFromVar('userInfo');
  }

  public getBooleanDataFromVar(varName:string){
    return this.win.nativeWindow[varName];
  }
}
