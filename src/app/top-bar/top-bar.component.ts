import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {  Router } from '@angular/router';

import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {


  mobileQuery: MediaQueryList;

  fillerNav=['a','b'];

  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  //fillerContent = Array.from({length: 50}, () =>
  //    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  //     labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  //     laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  //     voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  //     cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;

//object to check data exit
itemRef: AngularFireObject<any>;
public info;
public role;
public company;
paid;

  events: string[];
  width= 200;
  height= 56;
  opacity=1;

  open(){
    this.width=1300;
    this.height=2000;
    this.opacity=1;
  }

  close(){
    this.width=1300;
    this.height=56;
    this.opacity=1;
  }

  login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    .then(()=> 
     this.updateUserData()).catch
    (error=>console.log(error));
  }

  private updateUserData(): void{
    
    let path=`users/${this.afAuth.auth.currentUser.uid}`;
    let data={
      email:this.afAuth.auth.currentUser.email,
      name:this.afAuth.auth.currentUser.displayName,
     
    }
    this.db.object(path).update(data).catch(error=>console.log(error));
  }


  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    public afAuth:AngularFireAuth,
    public db: AngularFireDatabase,
    private router: Router
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
   }

   ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onGoing(){
    if(this.paid){
        this.router.navigate(['/Ongoing'])
    }else{
      // window.open('https://truckproject-b9adc.firebaseapp.com/pay.html','_self');
    }
  }

  jobDone(){
    if(this.paid){
      this.router.navigate(['jobsDone'])
    }else{
      // window.open('https://truckproject-b9adc.firebaseapp.com/pay.html','_self');
    }
  }

  //shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  shouldRun=true;

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        this.db.object(`users/${this.afAuth.auth.currentUser.uid}/paid`).snapshotChanges().subscribe(action=>{
                
        this.paid=action.payload.val();
        });

        let users;
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
            users=a.payload.val();
            this.role=users.role;
            if(this.role=='owner'){
              this.itemRef = this.db.object(`owner/${this.afAuth.auth.currentUser.uid}`);
              this.itemRef.snapshotChanges().subscribe(action => {
                if(action.payload.val()==null){
                 
                }else{
                 
                  this.info=action.payload.val();

                  if(!this.info.OwnerCompanyName){
                   this.router.navigate(['signup']);
                 }
                  this.company=this.info.OwnerCompanyName;                 
                }
              }); 
            }
            else if(this.role=='trucker'){
                if(!this.paid){
                  // window.open('https://truckproject-b9adc.firebaseapp.com/pay.html','_self');
                }else{
                  this.itemRef = this.db.object(`trucker/${this.afAuth.auth.currentUser.uid}`);
                  this.itemRef.snapshotChanges().subscribe(action => {
                    if(action.payload.val()==null){
                      
                    }else{
                      
                      this.info=action.payload.val();
                      this.company=this.info.Employer;
                    
                    }
                  });
                }
               
            }
        })
      }else{
        this.router.navigate(['/login']);
      }
    })

  }

}
