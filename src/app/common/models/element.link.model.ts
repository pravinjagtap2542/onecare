export class LinkElement {
  constructor(
    private _title?: string,
    private _alttext?: string,
    private _url?: string,
    private _openinsamewindow?: string,
    private _logoimage?: string) {
  }

  public get title(): string {
    return this._title;
  }

  public get altText(): string {
    return this._alttext;
  }

  public get url(): string {
    return this._url;
  }
  public get openinsamewindow(): string {
    return this._openinsamewindow;
  }
  public get logoimage(): string {
    return this._logoimage;
  }

  public set title(v: string) {
    this._title = v;
  }

  public set altText(v: string) {
    this._alttext = v;
  }

  public set url(v: string) {
    this._url = v;
  }
  public set openinsamewindow(v: string) {
    this._openinsamewindow = v;
  }
  public set logoimage(v: string) {
    this._logoimage = v;
  }
}
