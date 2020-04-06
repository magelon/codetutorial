import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroupDirective, NgForm,  FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  public registerForm;
  public er;
  public registerSuccess;
  public registerFailed;
  public Failmessage;

  constructor(
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private router: Router,
    public afAuth:AngularFireAuth
  ) { 
    this.registerForm = this.formBuilder.group({ 
      Email:'',
      Pass:''
    });
  }

  

  register(customerData){
    this.afAuth.auth.createUserWithEmailAndPassword(customerData.Email,customerData.Pass).catch(e=>{
      this.er=e
    }).then(_=>{
      if(this.er){
        this.registerFailed=true;
        var errorCode=this.er.errorCode
        var errorMessage=this.er.errorMessage
        this.Failmessage=errorMessage
        console.log("error code"+errorCode+" "+errorMessage)
      }else{

       
          this.registerSuccess=true;
          //this.router.navigate(['/registerSuccess'])

      }
    })
    
    
  }

  ngOnInit() {
  }

}
