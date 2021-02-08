import { Directive, HostListener, ElementRef ,Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { ICON_REGISTRY_PROVIDER } from '@angular/material';

@Directive({
  selector: '[copDropdown]'
})
export class DropdownDirective {

  constructor(@Inject(DOCUMENT) private document: any, private el: ElementRef) {
   
   }
  @HostListener('click', ['$event'])
  toggle($event: any) {
    
    $event.stopPropagation();
   
   if(this.el.nativeElement.children[1] && this.el.nativeElement.children[1].classList.contains('open')){

    this.el.nativeElement.children[1].classList.remove('open');
   
     var arrowIcons =  this.document.querySelectorAll('.rotate')
    arrowIcons.forEach(function(icon) {
     icon.classList.remove('rotate')
    });
    this.el.nativeElement.classList.remove('active');
    
   }else{
    var dropdowns = document.querySelectorAll('.menu-dropdown,.user-dropdown')
    for (var i = 0; i < dropdowns.length; i++) {
      
     dropdowns[i].classList.remove('open');
     var arrowIcons =  this.document.querySelectorAll('.rotate')
    arrowIcons.forEach(function(icon) {
     icon.classList.remove('rotate')
    });
    this.el.nativeElement.classList.remove('active');
    }
    var subdropdowns = this.el.nativeElement.querySelectorAll('.submenu')
    for (var i = 0; i < subdropdowns.length; i++) {
      
      subdropdowns[i].classList.remove('open');
      var arrowIcons =  this.document.querySelectorAll('.rotate')
      arrowIcons.forEach(function(icon) {
       icon.classList.remove('rotate')
      });
      this.el.nativeElement.classList.remove('active');
    }
    if(this.el.nativeElement.children[1]){
    this.el.nativeElement.children[1].classList.add('open');
    this.el.nativeElement.classList.add('active');
    }
    if(this.el.nativeElement.children[0] && this.el.nativeElement.children[0].children[0].children[0]){
     if(this.el.nativeElement.children[0].children[0].children[0].classList.contains('icon-arrow-down')){
         this.el.nativeElement.children[0].children[0].children[0].classList.add('rotate');
      }
    }
   }
   
    //var dropdowns = this.el.nativeElement.querySelectorAll('.menu-dropdown');
    
  }

  // @HostListener('mouseenter') mouseover(){
  //   if(this.el.nativeElement.children[1]){
  //       this.el.nativeElement.children[1].classList.add('open');
  //       this.el.nativeElement.classList.add('active');
  //       }
  //       if(this.el.nativeElement.children[0]){
  //        if(this.el.nativeElement.children[0].children[0].children[0].classList.contains('icon-arrow-down')){
  //            this.el.nativeElement.children[0].children[0].children[0].classList.add('rotate');
  //         }
  //       }
  // }

//   @HostListener('mouseleave') mouseleave(){
//      if(this.el.nativeElement.children[1] && this.el.nativeElement.children[1].classList.contains('open')){

//     this.el.nativeElement.children[1].classList.remove('open');
   
//      var arrowIcons =  this.document.querySelectorAll('.rotate')
//     arrowIcons.forEach(function(icon) {
//      icon.classList.remove('rotate')
//     });
//     this.el.nativeElement.classList.remove('active');
    
//    }else{
//     var dropdowns = document.querySelectorAll('.menu-dropdown,.user-dropdown')
//     for (var i = 0; i < dropdowns.length; i++) {
      
//      dropdowns[i].classList.remove('open');
//      var arrowIcons =  this.document.querySelectorAll('.rotate')
//     arrowIcons.forEach(function(icon) {
//      icon.classList.remove('rotate')
//     });
//     this.el.nativeElement.classList.remove('active');
//     }
//     var subdropdowns = this.el.nativeElement.querySelectorAll('.submenu')
//     for (var i = 0; i < subdropdowns.length; i++) {
      
//       subdropdowns[i].classList.remove('open');
//       var arrowIcons =  this.document.querySelectorAll('.rotate')
//       arrowIcons.forEach(function(icon) {
//        icon.classList.remove('rotate')
//       });
//       this.el.nativeElement.classList.remove('active');
//     }
//   }
// }
}

@Directive({
  selector: '[copSubDropdown]'
})
export class SubDropdownDirective {

  constructor(@Inject(DOCUMENT) private document: any, private el: ElementRef) {
   
   }
  @HostListener('click', ['$event'])
  toggle($event: any) {
    
    $event.stopPropagation();
   
   if(this.el.nativeElement.children[1] && this.el.nativeElement.children[1].classList.contains('open')){

    //this.el.nativeElement.children[1].classList.remove('open');
    var arrowIcons =  this.document.querySelectorAll('.rotateSub')
    arrowIcons.forEach(function(icon) {
     icon.classList.remove('rotateSub')
    });
    this.el.nativeElement.classList.remove('active');
    
   }else{
    var sbdropdowns = this.document.querySelectorAll('.submenu')
    for (var i = 0; i < sbdropdowns.length; i++) {
      
      sbdropdowns[i].classList.remove('open');
    }
    var arrowIcons =  this.document.querySelectorAll('.rotateSub')
    arrowIcons.forEach(function(icon) {
     //icon.classList.remove('rotateSub')
    });
    this.el.nativeElement.classList.remove('active');
    if(this.el.nativeElement.children[1]){
    this.el.nativeElement.children[1].classList.add('open');
    this.el.nativeElement.classList.add('active');
    }
    //this.el.nativeElement.children[0].children[0].classList.add('rotateSub');
   // this.el.nativeElement.parentNode.classList.add('open')
   }
   
    //var dropdowns = this.el.nativeElement.querySelectorAll('.menu-dropdown');
    
  }

//   @HostListener('mouseenter') mouseover(){
//     if(this.el.nativeElement.children[1]){
//         this.el.nativeElement.children[1].classList.add('open');
//         this.el.nativeElement.classList.add('active');
//         }
//   }

//   @HostListener('mouseleave') mouseleave(){
//     if(this.el.nativeElement.children[1] && this.el.nativeElement.children[1].classList.contains('open')){

//         this.el.nativeElement.children[1].classList.remove('open');
//         var arrowIcons =  this.document.querySelectorAll('.rotateSub')
//         arrowIcons.forEach(function(icon) {
//          icon.classList.remove('rotateSub')
//         });
//         this.el.nativeElement.classList.remove('active');
        
//        }else{
//         var sbdropdowns = this.document.querySelectorAll('.submenu')
//         for (var i = 0; i < sbdropdowns.length; i++) {
          
//           sbdropdowns[i].classList.remove('open');
//         }
//         var arrowIcons =  this.document.querySelectorAll('.rotateSub')
//         arrowIcons.forEach(function(icon) {
//          //icon.classList.remove('rotateSub')
//         });
//   }
// }
}


@Directive({
  selector: '[copprofDropdown]'
})
export class ProfileDropdownDirective {

  constructor(@Inject(DOCUMENT) private document: any, private el: ElementRef) {
   
   }
  @HostListener('click', ['$event'])
  toggle($event: any) {
    
    $event.stopPropagation();
   
   if(this.el.nativeElement.children[1] && this.el.nativeElement.children[1].classList.contains('open')){

    this.el.nativeElement.children[1].classList.remove('open');
    // var arrowIcons =  this.document.querySelectorAll('.rotateSub')
    // arrowIcons.forEach(function(icon) {
    //  icon.classList.remove('rotateSub')
    // });
     this.el.nativeElement.classList.remove('active');
    
   }else{
    var sbdropdowns = this.document.querySelectorAll('.menu-dropdown,.user-dropdown')
    for (var i = 0; i < sbdropdowns.length; i++) {
      
      sbdropdowns[i].classList.remove('open');
    }
    // var arrowIcons =  this.document.querySelectorAll('.rotateSub')
    // arrowIcons.forEach(function(icon) {
    //  //icon.classList.remove('rotateSub')
    // });
     this.el.nativeElement.classList.remove('active');
    if(this.el.nativeElement.children[1]){
    this.el.nativeElement.children[1].classList.add('open');
    this.el.nativeElement.classList.add('active');
    }
    //this.el.nativeElement.children[0].children[0].classList.add('rotateSub');
   // this.el.nativeElement.parentNode.classList.add('open')
   }
   
    //var dropdowns = this.el.nativeElement.querySelectorAll('.menu-dropdown');
    
  }
}