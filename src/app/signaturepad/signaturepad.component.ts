import { Component, OnInit,ViewChild  } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Options } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-signaturepad',
  templateUrl: './signaturepad.component.html',
  styleUrls: ['./signaturepad.component.css'],
  
})
export class SignaturepadComponent implements OnInit {
  @ViewChild(SignaturePad, {static: false}) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  constructor() { }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  ngOnInit() {
  }

}
