import { ImageElement } from './element.image.model';
import { LinkElement } from './element.link.model';

export class Header {
  constructor(
    private _logo?: ImageElement,
    private _headerlinks?: LinkElement[],
    private _usersettings?: string) {
  }

  public get logo(): ImageElement {
    return this._logo;
  }

  public get headerLinks(): LinkElement[] {
    return this._headerlinks;
  }

  public get userSettings(): string {
    return this._usersettings;
  }

  public set logo(v: ImageElement) {
    this._logo = v;
  }

  public set headerLinks(v: LinkElement[]) {
    this._headerlinks = v;
  }
  // addHeaderLink
  // removeHeaderLink(index)
  // above two properties can be added in future

  public set userSettings(v: string) {
    this._usersettings = v;
  }
}
