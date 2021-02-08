import { ImageElement } from '../../../common/models/element.image.model';

export class Hero {

  constructor(
    private _title: string = 'DEFAULT',
    private _description: string = 'DEFAULT',
    private _image: ImageElement = new ImageElement()) {  }

  public set title(v: string) {
    this._title = v;
  }

  public set description(v: string) {
    this._description = v;
  }

  public set image(v: ImageElement) {
    this._image = v;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get image(): ImageElement {
    return this._image;
  }
}
