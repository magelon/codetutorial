//job details page also accept job page
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import{JobBlock} from'../dataModel/job-block';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-job-confirm-page',
  templateUrl: './job-confirm-page.component.html',
  styleUrls: ['./job-confirm-page.component.css']
})
export class JobConfirmPageComponent implements OnInit {

  contractorName;
  jobId;

  companyName;
  itemsRef: AngularFireObject<any>;

  info;
  name;
  userId;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router
  ) { 
    
  }

comfirm(){
  //set the job occupide to true

  //on going job table
  //path for onGoingjob
  let going=`onGoingJobs/${this.userId}/${this.contractorName}/${this.jobId}`;
  //path for orignal job
  let orign=`ownerOrBrokerCreateJobs/${this.companyName}/${this.contractorName}/${this.jobId}/Occupied`;
  //change orign occupied to true 
  this.db.object(orign).set('true').catch(error=>console.log(error));

let data={
    Driver:this.name,
    ArriveAt:this.info.ArriveAt,
    ArriveTime:this.info.ArriveTime,
    JobDate:this.info.JobDate,
    JobID:this.jobId,
    Job:this.info.Job,
    Foreman:this.info.Foreman,
    Destination:this.info.LoadAt,

    TruckNo:'',
    LicPlate:'',
    TruckType:'',
    //depart timestamp
    DepartTimeStamp:'',

    // arrive time timestamp
    ArriveAtSite:'',
    ArriveTimeStamp:'',

    stage:'1',
    companyName:this.companyName,
}
  //add this job in to person job stack
  //set job into stage 1
  //route to stage 1, job load page
  this.db.object(going).update(data)
  .catch(error=>console.log(error))
  .then(any=>this.router.navigate(['StageOne',this.userId,this.contractorName,this.jobId]));

  let loadsTable=`onGoingJobs/${this.userId}/${this.contractorName}/${this.jobId}/loads`;
  //add load in to on going table in next page
  let load={
      ScaleTagID:'',
      Weight:'',
      Material:'',
      LoadingArriveTime:'',
      LoadingDepartTime:'',
      UnloadingArriveTime:'',
      UnloadingDepartTime:'',
  } 
}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contractorName = params.get('contractor');
      this.jobId=params.get('id');
      this.companyName=params.get('companyName');

      this.itemsRef = this.db
      .object
      (`ownerOrBrokerCreateJobs/${this.companyName}/${this.contractorName}/${this.jobId}`);
      });

    this.itemsRef.snapshotChanges().subscribe(action => {
      //console.log(action.type)
      //console.log(action.key)
      if(action.payload.val()==null){
      }else{
        //go to profile page
        this.info=action.payload.val();
      }
    });

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.name=this.afAuth.auth.currentUser.displayName;
        this.userId=this.afAuth.auth.currentUser.uid;
      }});
   
    //get your company name
    //get the contractor job info under the company name
  }

}
