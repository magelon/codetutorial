import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

//object to check data exit
 itemRef: AngularFireObject<any>;
public info;
public role;
public company;
paid; 
//referral;

name
pic

  constructor(public db: AngularFireDatabase,
    private router: Router,
    public afAuth:AngularFireAuth,
    private route: ActivatedRoute,
    ) { 
      
    }

/* onGoing(){
      if(this.paid){
          this.router.navigate(['Ongoing'])
      }else{
        window.open('https://truckproject-b9adc.firebaseapp.com/pay.html','_self');
      }
}

jobDone(){
      if(this.paid){
        this.router.navigate(['jobsDone'])
      }else{
        window.open('https://truckproject-b9adc.firebaseapp.com/pay.html','_self');
      }
} */

  ngOnInit() {

    //the long logic cause web console error can't find value
    this.afAuth.auth.onAuthStateChanged(user=>{
    if(user){
      this.name=this.afAuth.auth.currentUser.displayName
      this.pic=this.afAuth.auth.currentUser.photoURL

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
              
                  this.itemRef = this.db.object(`trucker/${this.afAuth.auth.currentUser.uid}`);
                  this.itemRef.snapshotChanges().subscribe(action => {
                    if(action.payload.val()==null){
                      this.router.navigate(['signup']);
                    }else{
                      
                      this.info=action.payload.val();
                      this.company=this.info.Employer;
                    
                    }
                  });
                
               
            }
        }) 

      /*   this.db.list(`referral`).snapshotChanges(['child_added'])
        .subscribe(actions=>{
        
          actions.forEach(action => {
            console.log(action.payload.val());
          
           if((action.payload.val())==(this.afAuth.auth.currentUser.email)){
           this.referral=true; 
           
           }
          });
        });  */

      }
    })

  }

}
