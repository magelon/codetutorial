import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-owner',
  templateUrl: './login-owner.component.html',
  styleUrls: ['./login-owner.component.css']
})
export class LoginOwnerComponent implements OnInit {

  paid;
  role;

 email;
 name;

  constructor(
    public db: AngularFireDatabase,
    private router: Router,
    public afAuth:AngularFireAuth
  ) { }


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

  signupOwner(){
    let path=`users/${this.afAuth.auth.currentUser.uid}`;
      let data={
        email:this.email,
        name:this.name,
        role:'owner'
      }
      this.db.object(path).update(data).catch(error=>console.log(error)).then(e=>{
        this.router.navigate(['/signup']);
        } 
      );
    }

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
          this.email=this.afAuth.auth.currentUser.email;
          this.name=this.afAuth.auth.currentUser.displayName;
          //check user is a subcribe or not
    
        this.db.list('stripeEvents').query.once("value").then(data=>{
          data.forEach(d=>{
            var obj=d.val();
            //console.log(obj['email']);
            if(obj['email']==this.afAuth.auth.currentUser.email){
              let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
              let paidData={
                paid:'paid'
              }
              this.paid='paid';
              this.db.object(updatePaidPath)
              .update(paidData)
              .catch(e=>{
                console.log(e)
              })
            }
          })
        })
    
          // this.db.list('stripeEvents').snapshotChanges(['child_added'])
          // .subscribe(actions=>{
    
          // actions.forEach(action => {
        
          // var userStr=JSON.stringify(action.payload.val());
    
          // JSON.parse(userStr, (key, value) => {
          //   if(key=='email'){
          //     if(value==this.afAuth.auth.currentUser.email){
          //       let path2=`users/${this.afAuth.auth.currentUser.uid}`;
          //       let data2={
          //         paid:'paid',
          //       }
          //       this.paid='paid';
          //       this.db.object(path2).update(data2).catch(error=>console.log(error));
          //     }
          //   }
          // });
          // });
          // });
    
        let users;
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
            users=a.payload.val();
            this.role=users.role;
            if(this.role){
              this.router.navigate(['profile']);
            }
        });
    
    /* actions.forEach(action => {
      console.log(action.payload.val());
      
      var contra;
      contra=action.key;
      var jCount;
      var jId;
    
    //traslate action payload to json string
    var userStr=JSON.stringify(action.payload.val());
    
    JSON.parse(userStr, (key, value) => {
    //let regexpNumber = new RegExp('^[0-9]');
    //check job has been token or not
    //key=='Occupied'&&value=='false'&&
    
    if(key=='Times'||key=='JobID'){
     */
    
    
         //check in the referal table if you are referaled 
    /* this.db.list(`referral/${this.afAuth.auth.currentUser.uid}`).snapshotChanges(['child_added'])
    .subscribe(actions=>{
      actions.forEach(action => {
      
       if((action.payload.val())==(this.afAuth.auth.currentUser.email)){
         //update your owner info in owner table and go to owner prefilepage
        console.log('you are referraled');
        let path3=`owner/${this.afAuth.auth.currentUser.uid}`;
        let data3={
          OwnerEmail:this.afAuth.auth.currentUser.email,
          OwnerName:this.afAuth.auth.currentUser.displayName,
        }
        this.db.object(path3).update(data3).catch(error=>console.log(error));
        this.router.navigate(['profile/owner']);
      }
     });
    });  */
    
          }
        })
      }

}
