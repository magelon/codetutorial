import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroupDirective, NgForm,  FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.css']
})
export class ForgetPassComponent implements OnInit {

  public resetForm;
  public err;
  public emailSent;

  constructor(
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private router: Router,
    public afAuth:AngularFireAuth
  ) {
    this.resetForm=this.formBuilder.group({
      Email:''
    })
   }

  reset(customerData){
    this.afAuth.auth.sendPasswordResetEmail(customerData.Email).catch(e=>{
      this.err=e
    }).then(_=>{
      if(this.err){
        
      }else{
        this.emailSent=true;
      }
    })
  }

  ngOnInit() {
    this.emailSent=false;
  }

}
