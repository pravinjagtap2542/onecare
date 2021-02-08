export class ImageElement {
  constructor(
    private _imageUrl: string = '',
    private _altText: string = '') { }

  public set imageUrl(u: string) {
    this._imageUrl = u;
  }

  public set imageAltText(t: string) {
    this._altText = t;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public get altText(): string {
    return this._altText;
  }
}
