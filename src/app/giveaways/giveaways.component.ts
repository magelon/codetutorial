import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import {finalize } from 'rxjs/operators';

import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroupDirective, NgForm,  FormGroup, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-giveaways',
  templateUrl: './giveaways.component.html',
  styleUrls: ['./giveaways.component.css']
})
export class GiveawaysComponent implements OnInit {

  uname;
  name;
  address;
  //check update success or not
  upda;

  errorhoulder;

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) { }

update(){

  let data={
    uname:this.uname,
    name:this.name,
    address:this.address
  }

  this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
  .update(data)
  .catch(error=>{
    this.errorhoulder=error
  }).then(_=>{
    if(this.errorhoulder){
      console.log(this.errorhoulder)
    }else{
      console.log("update success")
      this.upda=true;
    }
  })
}

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        //get address if has
        let sym=this.db.list(`users/${user.uid}`)
        sym.query.once('value')
        .then(datas=>{
          let obj=datas.val()

          if(obj['uname']){
            this.uname=obj['uname']
          }

          if(obj['name']){
            this.name=obj['name']
          }
          if(obj['address']){
            this.address=obj['address']
          }
        })
       
      }
    })
  }

}
