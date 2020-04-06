import { Component, OnInit } from '@angular/core';
import { StripeToken } from "stripe-angular";
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-sub',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.css']
})
export class SubComponent implements OnInit {

  constructor(
    public afAuth:AngularFireAuth,
    private router: Router
  ) { }

  onStripeInvalid( error:Error ){
    console.log('Validation Error', error)
  }
 
  setStripeToken( token:StripeToken ){
    console.log('Stripe token', token);
    this.router.navigate(['profile']);
  }
 
  ngOnInit() {
  }

}
