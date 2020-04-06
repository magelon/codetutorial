import { Component } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { StripeScriptTag } from "stripe-angular"
import { Router,NavigationEnd }from'@angular/router';
import { from } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';

import { MessagingService } from './service/messaging.service';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { UpdateService } from './service/update.service';

import{trigger,keyframes,animate,transition} from '@angular/animations';
import * as kf from './animations/keyframes';

import {MatSnackBar} from '@angular/material/snack-bar';

import { ConnectionService } from 'ng-connection-service';

  declare let ga:Function;
  declare let Stripe:Function;
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[
    trigger(
      'cardAnimator',
    [
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      transition('* => jello', animate(1000, keyframes(kf.jello))),
      transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY))),
    ]
    )
  ]
})
export class AppComponent {



  title = 'dumpapp';
  //live: pk_live_DHwxcZn1QkjzG44dllKG4ViT
  private publishableKey:string = "pk_test_KFuKDO7ayBQ3tw9nsQAYGls5"

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  paid;
  role;
 
  email;

  affiliate
  
  //sent to notification
  message;

  //root url for firebase clould functions
  readonly Root_url='https://us-central1-daydaco-19a9b.cloudfunctions.net'

  //customer id for unsucribtion
  cid


  animationState: string;

  startAnimation(state) {
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  status = 'ONLINE';
  isConnected = true;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  constructor(
    private msgService:MessagingService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    public afAuth:AngularFireAuth,
    public au: AngularFireAuth,
    public StripeScriptTag:StripeScriptTag,
    public db: AngularFireDatabase,
    public router:Router,
    private http: HttpClient,
    private update: UpdateService,
    private _snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    ) {

      this.connectionService.monitor().subscribe(isConnected => {
        this.isConnected = isConnected;
        if (this.isConnected) {
          this.status = "ONLINE";
          this.openSnackBar('you are online','👍')
        }
        else {
          this.status = "OFFLINE";
          this.openSnackBar('you are offline','😩')
        }
      })
      
      this.mobileQuery = media.matchMedia('(max-width: 2000px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      //google analytics
      this.router.events.subscribe(event=>{
            if(event instanceof NavigationEnd){ 
              ga('set','page',event.urlAfterRedirects);
              ga('send','pageview');
            }
      });

  }

  feedback(){
    window.location.href="mailto:dguojin@gmail.com?subject='daydaco feedback'"
  }

  changeTheme() {
    (document.getElementById('themeAsset')as HTMLBaseElement).href= `https://firebasestorage.googleapis.com/v0/b/daydaco-19a9b.appspot.com/o/purple-green.css?alt=media&token=a66af52d-b62f-470c-a6bb-e895fa1324ee`;
  }

subscribe(){
      var stripe=Stripe('pk_live_DHwxcZn1QkjzG44dllKG4ViT');

if(this.affiliate!=null){
  
  stripe.redirectToCheckout({

    //11.35
    items:[{plan:'plan_FnBg7ZvDtzxuKH',quantity:1}],
    //19
    //items: [{plan: 'plan_FT4FdUccg0ZR6j', quantity: 1}],
    //5
    // items: [{plan: 'plan_FbwqP0NVFSt4Zz', quantity: 1}],
    // Do not rely on the redirect to the successUrl for fulfilling
    // purchases, customers may not always reach the success_url after
    // a successful payment.
    // Instead use one of the strategies described in
    // https://stripe.com/docs/payments/checkout/fulfillment
    successUrl: window.location.protocol + '//daydaco-19a9b.firebaseapp.com',
    cancelUrl: window.location.protocol + '//daydaco-19a9b.firebaseapp.com',
  })
  .then(function (result) {
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer.
      var displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
    }
  })
}else{
  stripe.redirectToCheckout({

    //11.35
    items:[{plan:'plan_Fpw2UEcr9Gdl8v',quantity:1}],
    //19
    //items: [{plan: 'plan_FT4FdUccg0ZR6j', quantity: 1}],
    //5
    // items: [{plan: 'plan_FbwqP0NVFSt4Zz', quantity: 1}],
    // Do not rely on the redirect to the successUrl for fulfilling
    // purchases, customers may not always reach the success_url after
    // a successful payment.
    // Instead use one of the strategies described in
    // https://stripe.com/docs/payments/checkout/fulfillment
    successUrl: window.location.protocol + '//daydaco-19a9b.firebaseapp.com',
    cancelUrl: window.location.protocol + '//daydaco-19a9b.firebaseapp.com',
  })
  .then(function (result) {
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer.
      var displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
    }
  })
}

}

//unsubscribe function use userid to delet custom in stripe
unsubscribe(){
  //query once from database 
  this.db.list('stripeEvents').query.once("value").then(data=>{
    data.forEach(action=>{
      var obj=action.val();
        if(obj['email']==this.email){
          this.cid=obj['subid']

          let unsub={
            customerId:this.cid,
          }
      
          //header
          let header=new HttpHeaders({
          'Content-Type' : 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          });
      
          let options={headers:header};
      
          this.http.post(this.Root_url+'unsub',unsub,options).toPromise().then(data=>
          {
            console.log(data);
            let response=data;
            if(response!=null){
              console.log('response'+response);
            }
            })

        }
    })
  })

}

  open(){
   
  }

  close(){
 
  }

  //update user email and name to users table key is uid given by google
  private updateUserData(): void{
    
    let path=`users/${this.afAuth.auth.currentUser.uid}`;
    let data={
      email:this.afAuth.auth.currentUser.email,
      name:this.afAuth.auth.currentUser.displayName,
    }
    this.db.object(path).update(data).catch(error=>console.log(error));
  }

  //login using google auth
  login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    .then(()=> 
    //upate user datas every time login
     this.updateUserData()).catch
    (error=>console.log(error));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  //navigate to ongoing page
  onGoing(){
    if(this.paid){
        this.router.navigate(['/Ongoing'])
    }else{
      this.subscribe();
    }
  }

  //navigate to jobsdone page
  jobDone(){
    if(this.paid){
      this.router.navigate(['/jobsDone/trucker'])
    }else{
      this.subscribe();
    }
  }

  
  //shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  //shouldRun=true;

  //logout from google auth
  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['']);
  }

  ngOnInit() {

    //after auth using google
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        //request notification permission
        this.msgService.requestPermission();
        //call service functions to listen on the response
        this.msgService.listen();
        //get current message from resopnse
        this.message=this.msgService.currentMessage;
        
        /*this.db.object(`users/${this.afAuth.auth.currentUser.uid}/paid`).snapshotChanges().subscribe(action=>{   
        this.paid=action.payload.val();
        }); */

        let users;

        //get user paid,role and email info
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
            users=a.payload.val();
            this.paid=users.paid;
            this.role=users.role;
            this.email=users.email;
            this.affiliate=users.affiliate?users.affiliate:null;
          })
        }else{
        // this.router.navigate(['/login']);
      }
    })
  }
}
