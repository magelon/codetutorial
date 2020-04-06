//this componet response for dispay jobs info from every broker or owner post
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import{JobBlock} from'../dataModel/job-block';
import { stringify } from '@angular/compiler/src/util';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {

  public JobForm
  company
  public companyName
  public title
  public info
  i
  subhauler:boolean
  //length  of jobs
  length
  contractorsWithJobBlock: Array<JobBlock>=[]

  itemsRefO: AngularFireList<any>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private _snackBar: MatSnackBar
    ) { 
            
    }

getJobs(){
  let companyPath=`owner/${this.afAuth.auth.currentUser.uid}`
  this.db.object(companyPath).snapshotChanges().subscribe(a=>{
    this.company=a.payload.val();
    this.companyName=this.company.OwnerCompanyName;

    //inseption deep dream second layer
    this.db.list(`ownerCreateJobs/${this.companyName}`)
    .query.once("value").then(data=>{
      this.contractorsWithJobBlock=new Array<JobBlock>();
      data.forEach(e=>{
        var obj=e.val()
          var contractor=e.key;
          //console.log(e.key)
          e.forEach(ee=>{
            var eobj=ee.val()
            //console.log(eobj['JobID'])
            if(eobj['SubHauler']!=''){
              // this.subhauler=true
              this.contractorsWithJobBlock.push(new JobBlock(e.key,eobj['JobUID'],eobj['SubHauler'],eobj['JobDate']));
              }else{
              this.contractorsWithJobBlock.push(new JobBlock(e.key,eobj['JobUID'],'',eobj['JobDate']));
              }

            })
          })
              this.length=this.contractorsWithJobBlock.length;
          })
      });
}

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 2000,
  });
}

deleteJob(item){
  this.db.object(`ownerCreateJobs/${this.companyName}/${item.contractor}/${item.jobId}`).remove()
  .then(e=>{
    this.db.object(`jobMemo/${this.companyName}/${item.contractor}/${item.jobId}`).remove()
   
    .catch(e=>{
      console.log(e)
    })
    this.getJobs()
    this.openSnackBar('contract','deleted!👌')
    
  })
 
}

//function collect contractors and it's jobs form a new object array

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        
      this.getJobs();
       
      }})
  }

}
