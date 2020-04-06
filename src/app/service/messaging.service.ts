import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {AngularFireFunctions} from '@angular/fire/functions';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

currentMessage;

  constructor(
    private afMessaging: AngularFireMessaging,
    public afAuth:AngularFireAuth,
    public au: AngularFireAuth,
    public db:AngularFireDatabase,
  ) { }


  private updateToken(token){
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        let path=`users/${this.afAuth.auth.currentUser.uid}`
        let data={
          msToken:token,
        }
        this.db.object(path).update(data).catch(e=>{console.log(e)})
      }
    })
  }

  requestPermission() {
    this.afMessaging.requestPermission
    .pipe(mergeMapTo(this.afMessaging.tokenChanges))
    .subscribe(
      (token) => {
         console.log('Permission granted! Save to the server!', token);
         this.updateToken(token); 
    },
      (error) => { console.error(error); },  
    );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message) => { 
        this.currentMessage=message;
        
          const options={
            body:'new job created',
            icon:'./assets/icons/icon-72x72.png',
            vibrate:[100,50,100],
            data:{
              dateOfArrival:Date.now(),
              primaryKey:1
            }
          }

        navigator.serviceWorker.getRegistration().then(
          reg=>{
            reg.showNotification('hello',options);
          }
        )
        console.log(message); });
  }

}
