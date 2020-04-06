import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { StripeScriptTag } from "stripe-angular"
import { Router,NavigationEnd }from'@angular/router';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  login;

  constructor(
    public afAuth:AngularFireAuth,
    public au: AngularFireAuth,
    public StripeScriptTag:StripeScriptTag,
    public db: AngularFireDatabase,
    public router:Router,
  ) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.login=true;
      }
  })
}

}
