//our root app component
import {Component, NgModule, Injectable, Inject, NgZone} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
//import {Observable} from 'rxjs/Observable';
//import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RecaptchaModule, RecaptchaLoaderService} from 'ng-recaptcha';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class RecaptchaDynamicLanguageLoaderService {
  public ready: Observable<any>;
  public language = '';
  private static ready: BehaviorSubject<any>;

  constructor( private route: ActivatedRoute) {
    this.init();
    this.ready = RecaptchaDynamicLanguageLoaderService.ready.asObservable();
  }
  
  public updateLanguage(newLang: string): void {
    this.language = newLang;
    RecaptchaDynamicLanguageLoaderService.ready.next(null);
    this.init();
  }
  
  private init() {
    if (RecaptchaDynamicLanguageLoaderService.ready) {
      if (RecaptchaDynamicLanguageLoaderService.ready.getValue()) {
        return;
      }
    } else {
      RecaptchaDynamicLanguageLoaderService.ready = new BehaviorSubject<any>(null);
      window.ng2recaptchaloaded = () => {
        RecaptchaDynamicLanguageLoaderService.ready.next(grecaptcha);
      };
    }
    
    const script = document.createElement('script') as HTMLScriptElement;
    script.innerHTML = '';
    const langParam = this.language ? '&hl=' + this.language : '';
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=ng2recaptchaloaded${langParam}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);


    this.route.queryParamMap.subscribe((params) => {
    //     console.log("alert");
    //     alert("changed")
    //    // if (ev instanceof NavigationEnd) {
    //     const script1 = document.createElement('script') as HTMLScriptElement;
      
       
    //      window.postMessage({ 'urlUpdated': window.location.href },'*');
    //       script1.onload = () => {
           
    //         window.postMessage({ 'urlUpdated': window.location.href },'*');
    //     };
  
    //     document.head.appendChild(script1);
       // }
      });
  }
}