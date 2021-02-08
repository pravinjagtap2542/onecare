import { Injectable } from '@angular/core';
import { DomService } from './dom.service';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) {  }

  private modalContainer = 'modal-container';

  init(component: any, inputs: object, outputs: object) {
    const componentConfig = {
      inputs: inputs,
      outputs: outputs
    };
    this.domService.appendComponentTo(this.modalContainer, component, componentConfig);
    window.scrollTo(0, 0);
    document.getElementById(this.modalContainer).className = 'av-modal show';
  }

  destroy() {
    this.domService.removeComponent();
    document.getElementById(this.modalContainer).className = 'av-modal';
  }

  /*
  * Hide Modal Popup on out focus click
  * @params: Window Event
  */
  public offClickHandler(event: any) {
    if (event.target.className === 'av-modal show') {
      this.destroy();
    } else if (event.target.offsetParent !== null) {
      if (event.target.offsetParent.className === 'av-modal show') {
        this.destroy();
      }
    }
  }

  /*
  * Hide Modal Popup on close button click (component level)
  */
  public closeModal() {
    this.destroy();
  }

}
