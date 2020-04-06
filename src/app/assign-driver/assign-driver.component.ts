import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {map, startWith} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

/* export class truckerObj{
  Address:string
  DriverName:string
  Email:string
  Employer:string
  Icon:string
  Phone:string
  State:string
  constructor(
    Address:string,
  DriverName:string,
  Email:string,
  Employer:string,
  Icon:string,
  Phone:string,
  State:string,
  ){
    this.Address=Address
    this.DriverName=DriverName
    this.Email=Email
    this.Employer=Employer
    this.Icon=Icon
    this.Phone=Phone
    this.State=State
  }
} */

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.css']
})
export class AssignDriverComponent implements OnInit {

  myControl = new FormControl();
  //options about outsouorces owners
  options:string[]=[''];
  filteredOptions: Observable<string[]>;

companyName;
contractor;
jobid;

truckers;

input;
public subhaulers;

referralForm;

//assign driver
assign= new Set();
assignSize;

//assign owner
Oassign=new Set();

Owneritem
Ownerobj

//owner item for display
selectedOwner

ownerForm

//outsource obj array
oArray:Array<any>=[]

//truck array for company
// tArray:Array<truckerObj>=[];
tArray:Array<any>=[];
//company trucker list
items: Observable<any[]>;
//referral list
items2: Observable<any[]>;
//assigned trucker list
items3: Observable<any[]>;
//job object
itemRef: AngularFireObject<any>;
//owner object
// itemRef2: AngularFireObject<any>;

jobsrc;
// ownerInfo;

  //used for list of trucker to find uid
  itemsRef: AngularFireList<any>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { 

    this.ownerForm=this.formBuilder.group({
      number:'',
      rate:'',
    })

      this.referralForm=this.formBuilder.group({
        subHaulerEmail:'',
      });
   }

   toggleEditable(event) {
    if ( event.target.checked ) {
        this.assign.add(event.target.value);
        this.assignSize=this.assign.size;
       
   }else{
        this.assign.delete(event.target.value);
        this.assignSize=this.assign.size;
   } 
  }

  toggleEditable2(event) {
    if ( event.target.checked) {
        this.Oassign.add(event.target.value);
        //this.assignSize=this.assign.size;
       
   }else{
        this.Oassign.delete(event.target.value);
       // this.assignSize=this.assign.size;
   } 
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        this.companyName=params.get('companyName');
        this.contractor=params.get('contractor');
        this.jobid=params.get('jobid');
        
        this.db.list(`trucker`)
        .query.once("value").then(data=>{
          data.forEach(e=>{
            var obj=e.val()
            if(obj['Employer']==this.companyName){
             console.log( obj['DriverName'])
             this.tArray.push(obj)
               /* this.tArray.push(new truckerObj(
                 obj['Address'],
                 obj['DriverName'],
                 obj['Email'],
                 obj['Employer'],
                 obj['Icon'],
                 obj['Phone'],
                 obj['State'])) */
            }
          })
        })

    });

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  
    this.myControl.valueChanges.subscribe(data=>{
     this.selectedOwner=data
     this.oArray.forEach(e=>{
      
       if(data==e.OwnerCompanyEmail){
        this.Owneritem=e    
        
       }
     })
    });

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        this.db.list('owner')
        .query
        .once("value")
        .then(data=>{
          data.forEach(e=>{
            var obj=e.val()
            if(obj['OwnerCompanyName']!=this.companyName){
              this.options.push(obj['OwnerCompanyEmail'])
              this.oArray.push(obj)
            }  
          })
        })

        //this.items2 = this.db.list(`referral/${this.afAuth.auth.currentUser.uid}`).valueChanges();
        this.items3=this.db.list(`jobMemo/${this.companyName}/${this.contractor}/${this.jobid}`)
        .valueChanges();
      }
    });

    //get the job detail info
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        //path from owner or broker create jobs
        let jobSrcPath=`ownerCreateJobs/${this.companyName}/${this.contractor}/${this.jobid}`
        this.itemRef=this.db.object(jobSrcPath);
        this.itemRef.snapshotChanges().subscribe(action=>{
          console.log(action.payload.val());
          this.jobsrc=action.payload.val();
        });

        //info for owner info
      /*   let ownerInfoPath=`ownersInfo/${this.companyName}`
        this.itemRef2=this.db.object(ownerInfoPath)
        this.itemRef2.snapshotChanges().subscribe(action=>{
          if(action.key==this.companyName){
              this.ownerInfo=action.payload.val();
          }
        })
      */
          }
          else{
              this.router.navigate(['login']);
          }
    });
 }
  
  //function put new hauler info in referall table 
  //and referall/uid which is your resource

  //functino put new truckers you know
  //truckers have to pay to insert in trucker table

  //assign function assign job to trucker 
  //after assign update trucker working condition to working and job info (company,jobid)
  assignJob(){
    //onGoingJobs table
    this.assign.forEach(item=>{  
      let uid;
      //use item to find trucker id

      this.db.list(`trucker`)
      .query
      .once("value")
      .then(data=>{
        data.forEach(e=>{
          var tObj=e.val()
          if(tObj['Email']==item){
            console.log(e.key)
            uid=e.key
            //add jobinfo into ongojob under uid dir
            let onGoingJobPath=`onGoingJobs/${uid}/${this.contractor}/${this.jobid}`
                  
            let jobDetailsData={
                ArriveAt:this.jobsrc.ArriveAt,
                LoadAt:this.jobsrc.LoadAt,
                Ocity:this.jobsrc.Ocity,
                Dcity:this.jobsrc.Dcity,

                TruckerEmail:item,
                OwnerCompanyEmail:this.jobsrc.OwnerCompanyEmail,
                BrokerEmail:this.jobsrc.BrokerDispatcherEmail,
                ContractorEmail:this.jobsrc.ContractorEmail,
                ForemanEmail:this.jobsrc.ForemanEmail,
                Rate:this.jobsrc.Rate,
                ManifestNo:this.jobsrc.ManifestNo,

                ParHauler: this.jobsrc.ParHauler,
                ParHaulerEmail: this.jobsrc.ParHaulerEmail,
                ParHaulerPhone: this.jobsrc.ParHaulerPhone,
                SubHauler: this.jobsrc.SubHauler,

                Foreman:this.jobsrc.Foreman,
                ForemanPhone:this.jobsrc.ForemanPhone,
                BrokerDispatcherName:this.jobsrc.BrokerDispatcherName,
                BrokerDispatcherPhone:this.jobsrc.BrokerDispatcherPhone,
                OwnerCompanyName:this.jobsrc.OwnerCompanyName,
                OwnerCompanyPhone:this.jobsrc.OwnerCompanyPhone,
                Contractor:this.jobsrc.Contractor,

                Job:this.jobsrc.Job,
                JobDate:this.jobsrc.JobDate,
                Day:this.jobsrc.Day,
                JobID:this.jobsrc.JobID, 
                JobUID:this.jobsrc.JobUID   
            }

            //use a table to record who was assigned to the job
            let jobMemoPath=`jobMemo/${this.companyName}/${this.contractor}/${this.jobid}/${uid}`
            let memoData={
              Email:item,
              State:'assigned'
            }
            //update in memo
            this.db.object(jobMemoPath).update(memoData).catch(error=>console.log(error))
            //used for update truck current state
            let truckersinfo=`trucker/${uid}/State`
            //update to onGoing job list
            this.db.object(onGoingJobPath).update(jobDetailsData)
            .catch(error=>console.log(error))
            .then(any=>
            //change trucker stage to 1 means start to work
            this.db.object(truckersinfo).set('busy')
            
            .catch(error=>console.log(error))
              
             ) .then(any=> 
              this.openSnackBar('new truckers','assigned!✉️')
              );

          }
        })
      })

    //  this.db.list(`OwnerTruckersInfo/${this.companyName}`).query.once("value").then(data=>{
    //    data.forEach(action=>{   
    //       var obj=action.val()
    //       console.log(obj['Email'])
    //       if(obj['Email']==item){
            
    //         uid=action.key;
    //         console.log(uid)
    //         //add jobinfo into ongojob under uid dir
    //         let onGoingJobPath=`onGoingJobs/${uid}/${this.contractor}/${this.jobid}`
                  
    //         let jobDetailsData={
    //             ArriveAt:this.jobsrc.ArriveAt,
    //             LoadAt:this.jobsrc.LoadAt,

    //             TruckerEmail:item,
    //             OwnerCompanyEmail:this.jobsrc.OwnerCompanyEmail,
    //             BrokerEmail:this.jobsrc.BrokerDispatcherEmail,
    //             ContractorEmail:this.jobsrc.ContractorEmail,
    //             ForemanEmail:this.jobsrc.ForemanEmail,
    //             Rate:this.jobsrc.Rate,

    //             Foreman:this.jobsrc.Foreman,
    //             ForemanPhone:this.jobsrc.ForemanPhone,
    //             BrokerDispatcherName:this.jobsrc.BrokerDispatcherName,
    //             BrokerDispatcherPhone:this.jobsrc.BrokerDispatcherPhone,
    //             OwnerCompanyName:this.jobsrc.OwnerCompanyName,
    //             OwnerCompanyPhone:this.jobsrc.OwnerCompanyPhone,
    //             Contractor:this.jobsrc.Contractor,

    //             Job:this.jobsrc.Job,
    //             JobDate:this.jobsrc.JobDate,
    //             Day:this.jobsrc.Day,
    //             JobID:this.jobsrc.JobID,    
    //         }

    //         //use a table to record who was assigned to the job
    //         let jobMemoPath=`jobMemo/${this.companyName}/${this.contractor}/${this.jobid}/${uid}`
    //         let memoData={
    //           Email:item,
    //           State:'assigned'
    //         }
    //         //update in memo
    //         this.db.object(jobMemoPath).update(memoData).catch(error=>console.log(error))
    //         //used for update truck current state
    //         let truckersinfo=`trucker/${uid}/State`
    //         //update to onGoing job list
    //         this.db.object(onGoingJobPath).update(jobDetailsData)
    //         .catch(error=>console.log(error))
    //         .then(any=>
    //         //change trucker stage to 1 means start to work
    //         this.db.object(truckersinfo).set('busy')
            
    //         .catch(error=>console.log(error))
              
    //          ) .then(any=> this.router.navigate(['/Jobs']));
    //       }
    //    })
    //   //this.afdb.object(`/article_backups/${timestamp}`).set(data.val())
    //  })
    })
  }

  assignOwner(){
    if(
      this.ownerForm.get('number').value!=''
      &&this.ownerForm.get('rate').value!=''
      ){

      let path=`ownerCreateJobs/${this.Owneritem.OwnerCompanyName}/${this.contractor}/${this.jobid}`

      let data={
        Contractor:this.jobsrc.Contractor,
        ContractorEmail:this.jobsrc.ContractorEmail,
    
        SubHauler:this.Owneritem.OwnerCompanyName,
        ParHauler:this.jobsrc.OwnerCompanyName,
        ParHaulerEmail:this.jobsrc.OwnerCompanyEmail,
        ParHaulerPhone:this.jobsrc.OwnerCompanyPhone,
    
        ManifestNo:this.jobsrc.ManifestNo,
        ForemanEmail:this.jobsrc.ForemanEmail,
        Foreman:this.jobsrc.Foreman,
        ForemanPhone:this.jobsrc.ForemanPhone,
    
        Job:this.jobsrc.Job,

        Rate:this.ownerForm.get('rate').value, 
        Truckers:this.ownerForm.get('number').value,

        JobID:this.jobsrc.JobID,
        JobUID:this.jobid,
        JobDate:this.jobsrc.JobDate,
        Day:this.jobsrc.Day,
    
        ArriveTime:this.jobsrc.ArriveTime,
        ArriveAt:this.jobsrc.ArriveAt,
        LoadAt:this.jobsrc.LoadAt,
        Ocity:this.jobsrc.Ocity,
        Dcity:this.jobsrc.Dcity,
    
        OwnerCompanyEmail:this.Owneritem.OwnerCompanyEmail,
        OwnerCompanyPhone:this.Owneritem.OwnerCompanyPhone,
        OwnerCompanyName:this.Owneritem.OwnerCompanyName,
        OwnerName:this.Owneritem.OwnerCompanyName,
        
        BrokerDispatcherName:this.jobsrc.BrokerDispatcherName,
        BrokerDispatcherPhone:this.jobsrc.BrokerDispatcherPhone,
        BrokerDispatcherEmail:this.jobsrc.BrokerDispatcherEmail,
    
      }
   
        this.db.object(path).update(data)
        .catch(error=>console.log(error))
            .then(any=>{
              this.openSnackBar('new owner','assigned!✉️')
            })
        
      }
  }
}
