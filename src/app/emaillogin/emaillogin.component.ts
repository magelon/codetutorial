import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroupDirective, NgForm,  FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emaillogin',
  templateUrl: './emaillogin.component.html',
  styleUrls: ['./emaillogin.component.css']
})
export class EmailloginComponent implements OnInit {

public loginForm;
public loginsuccess;
public err;

  constructor(
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private router: Router,
    public afAuth:AngularFireAuth
  ) { 
    this.loginForm=this.formBuilder.group({
      Email:'',
      Pass:''
    })
  }

  login(customerData){
    this.afAuth.auth.signInWithEmailAndPassword(customerData.Email,customerData.Pass).catch(e=>{
      this.err=e
      var errorCode=e.errorCode
      var errorMessage=e.errorMessage
      console.log("error code"+errorCode+" "+errorMessage)
    }).then(_=>{
        if(this.err){
          
        }else{

         let userData={
           userEmail:customerData.Email
         }

          let dataPath=`users/${this.afAuth.auth.currentUser.uid}`

          this.db.object(dataPath).update(userData)
          .catch(error=>{
            
          })
          this.loginsuccess=true
        }
    })
  }


  ngOnInit() {
    
  }

}
