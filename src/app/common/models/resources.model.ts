import { LinkElement } from './element.link.model';

export interface Resources {
  resources: Resource;
}

export interface Resource {
  category: Category[];
}

export interface Category {
  title: string;
  links: LinkElement[];
}
