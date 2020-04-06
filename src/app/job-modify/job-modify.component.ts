import { Component, OnInit,OnChanges, SimpleChanges,Input } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-job-modify',
  templateUrl: './job-modify.component.html',
  styleUrls: ['./job-modify.component.css']
})
export class JobModifyComponent implements OnInit {

  @Input() JobDate:Date;
  @Input() Job:string;

  public JobForm;
  public role;
  public info;
  public jobList;

  //date:Date
  day

  itemRef: AngularFireObject<any>;

companyName;
contractor;
jobId;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router
    ) {
      this.JobForm = this.formBuilder.group({
        Contractor: '',
        ContractorEmail:'',
        Foreman: '',
        ForemanEmail:'',
        ForemanPhone: '',
        BrokerName:'',
        BrokerPhone:'',
        BrokerEmail:'',
        JobID:'',
        BridgeFare:'',
        //Times:'',
        JobDate:'',
        Day:'',
        ArriveTime:'',
        ArriveAt:'',
        LoadAt:'',
        Job:'',
      });

     }

     onSubmit(customerData) {
      //authenticate check
      if(this.afAuth.user){
       if(customerData.Contractor!=""
       &&customerData.ContractorEmail!=""
       &&customerData.ForemanEmail!=""
       &&customerData.Foreman!=""
       &&customerData.ForemanPhone!=""
       
       &&customerData.BrokerName!=""
       &&customerData.BrokerPhone!=""
       &&customerData.BrokerEmail!=""

       &&customerData.Job!=""
       &&customerData.JobID!=""
       &&customerData.JobDate!=""
      
       &&customerData.ArriveTime!=""
       &&customerData.ArriveAt!=""
       &&customerData.LoadAt!=""
       
       ){

//loop through all the jobs store in database
//let jobString=(String)(customerData.JobID);
//this.jobList=jobString.split(","); 
//let jobSize=this.jobList.length;

//for(let i=0;i<jobSize;i++){

  let path=`ownerCreateJobs/${this.info.OwnerCompanyName}/${customerData.Contractor}/${customerData.JobID}`;

  let data={
    Contractor:customerData.Contractor,
    ContractorEmail:customerData.ContractorEmail,

    ForemanEmail:customerData.ForemanEmail,
    Foreman:customerData.Foreman,
    ForemanPhone:customerData.ForemanPhone,

    Job:customerData.Job,
    BridgeFare:customerData.BridgeFare,
    JobID:customerData.JobID,
    JobDate:customerData.JobDate,
    Day:this.day,

    ArriveTime:customerData.ArriveTime,
    ArriveAt:customerData.ArriveAt,
    LoadAt:customerData.LoadAt,

    OwnerCompanyEmail:this.info.OwnerCompanyEmail,
    OwnerCompanyPhone:this.info.OwnerCompanyPhone,
    OwnerCompanyName:this.info.OwnerCompanyName,
    OwnerName:this.info.OwnerName,
    
    BrokerDispatcherName:customerData.BrokerName,
    BrokerDispatcherPhone:customerData.BrokerPhone,
    BrokerDispatcherEmail:customerData.BrokerEmail,

  }

  this.db.object(path).update(data)
  .catch(error=>console.log(error))
  .then(any=>this.router.navigate(['assign',this.info.OwnerCompanyName,
  customerData.Contractor,
  customerData.JobID
  ]));

  this.JobForm.reset();
        }
      }
     }
   
     date(value:Date){  
        this.day=value.getDay();
        let weekdays=['Sun','Mon','Tue','Wed','Tur','Fri','Sat']
        this.day=weekdays[this.day];
     }

  ngOnInit() {
  
    this.route.paramMap.subscribe(params => {
      this.companyName = params.get('companyName');
      this.contractor=params.get('contractor');
      this.jobId=params.get('jobid');
    });

    //get info in owner create jobs

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        let users;
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
            users=a.payload.val();
            this.role=users.role;

            this.itemRef = this.db.object(`${this.role}/${this.afAuth.auth.currentUser.uid}`);
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
