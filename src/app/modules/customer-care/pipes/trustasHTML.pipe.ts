import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHTMLPipe implements PipeTransform{
  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}


@Pipe({name: 'safeResource'})
export class SafeResourcePipe implements PipeTransform{
  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(style);
  }
}
