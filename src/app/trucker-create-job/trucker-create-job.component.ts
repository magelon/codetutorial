import { Component, OnInit,OnChanges, SimpleChanges,Input } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Md5} from 'ts-md5/dist/md5';

const md5 = new Md5();

@Component({
  selector: 'app-trucker-create-job',
  templateUrl: './trucker-create-job.component.html',
  styleUrls: ['./trucker-create-job.component.css']
})
export class TruckerCreateJobComponent implements OnInit {

  @Input() JobDate:Date;
  @Input() Job:string;

  public JobForm;
  public role;
  public info;
  public jobList;

  subHa
  //date:Date
  day

  jdate
  ujid

  failed
  created
 
  itemRef: AngularFireObject<any>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.JobForm = this.formBuilder.group({
      Contractor: '',
      ContractorEmail:'',
      Trucks:'',
      Foreman: '',
      ForemanEmail:'',
      ForemanPhone: '',
      BrokerName:'',
      BrokerPhone:'',
      BrokerEmail:'',
      SubHauler:'',
      ParHauler:'',
      ParHaulerEmail:'',
      ParHaulerPhone:'',
      ManifestNo:'',
      JobID:'',
      Rate:'',
      //Times:'',
      JobDate:'',
      Day:'',
      ArriveTime:'',
      ArriveAt:'',
      Ocity:'',
      LoadAt:'',
      Dcity:'',
      Job:'',
    });
   }

   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

   onSubmit(customerData) {
    //authenticate check
    if(this.afAuth.user){
     if(
     customerData.JobDate!=''
     &&customerData.ArriveAt!=''
     &&customerData.LoadAt!=''
     
     ){

//loop through all the jobs store in database
//let jobString=(String)(customerData.JobID);
//this.jobList=jobString.split(","); 
//let jobSize=this.jobList.length;

//for(let i=0;i<jobSize;i++){

let path=`onGoingJobs/${this.afAuth.auth.currentUser.uid}/${customerData.Contractor}/${this.ujid}`;

let data={
  Contractor:customerData.Contractor,
  ContractorEmail:customerData.ContractorEmail,

  SubHauler:customerData.SubHauler,
  ParHauler:customerData.ParHauler,
  ParHaulerEmail:customerData.ParHaulerEmail,
  ParHaulerPhone:customerData.ParHaulerPhone,

  ManifestNo:customerData.ManifestNo,
  ForemanEmail:customerData.ForemanEmail,
  Foreman:customerData.Foreman,
  ForemanPhone:customerData.ForemanPhone,

  Trucks:customerData.Trucks,
  Job:customerData.Job,
  Rate:customerData.Rate,
  JobUID:this.ujid,
  JobID:customerData.JobID,
  JobDate:this.jdate,
  Day:this.day,

  ArriveTime:customerData.ArriveTime,
  ArriveAt:customerData.ArriveAt,
  LoadAt:customerData.LoadAt,
  Ocity:customerData.Ocity,
  Dcity:customerData.Dcity,

  OwnerCompanyEmail:this.info.EmployerEmail?this.info.EmployerEmail:" ",
  OwnerCompanyPhone:this.info.EmployerPhone,
  OwnerCompanyName:this.info.Employer,
  OwnerName:this.info.Employer,
  
  BrokerDispatcherName:customerData.BrokerName,
  BrokerDispatcherPhone:customerData.BrokerPhone,
  BrokerEmail:customerData.BrokerEmail,

}

this.db.object(path).update(data)
.then(e=>{
    this.openSnackBar('new job','created!👍')
    // this.JobForm.reset()
}).then(e=>{
    this.router.navigate([`/StageOne/${this.afAuth.auth.currentUser.uid}/${customerData.Contractor}/${this.ujid}`])
}).catch(e=>{
  this.openSnackBar('create job','failed!🚫')
})


      }
    }
   }
 
   date(value:Date){

    if(typeof value == "object" ){
      this.jdate=value.toLocaleDateString()
      this.ujid=md5.appendStr(value.toDateString()).end()

        this.day=value.getDay()

        let weekdays=['Sun','Mon','Tue','Wed','Tur','Fri','Sat']
        this.day=weekdays[this.day];
    }
   }

   toggleEditable(event) {
    if ( event.target.checked ) {
        this.subHa=true
        this.JobForm.get('SubHauler').setValue(this.info.Employer)
       
   }else{
        this.subHa=false
        this.JobForm.get('SubHauler').setValue('')
   } 
  }


  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        let users;
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
            users=a.payload.val();
            this.role=users.role;
            
            this.itemRef = this.db.object(`trucker/${this.afAuth.auth.currentUser.uid}`);
            this.itemRef.snapshotChanges().subscribe(action => {
              if(action.payload.val()==null){
                console.log('not regist');
                this.router.navigate(['']);
              }else{
                this.info=action.payload.val();
                
                console.log(action.payload.val());
              }
            });

          });
      }
    })
  }

}
