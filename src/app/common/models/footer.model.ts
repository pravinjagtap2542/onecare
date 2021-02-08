import { LinkElement } from './element.link.model';

export class Footer {
  constructor(
    private _footerlinks?: LinkElement[],
    private _footernote?: string) {
  }

  public get footerLinks(): LinkElement[] {
    return this._footerlinks;
  }

  public get footerNote(): string {
    return this._footernote;
  }

  public set footerLinks(v: LinkElement[]) {
    this._footerlinks = v;
  }

  public set footerNote(v: string) {
    this._footernote = v;
  }
}
