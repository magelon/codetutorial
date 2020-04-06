import { Component, OnInit,ViewChild ,Inject,forwardRef } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, Observer, empty } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, database } from 'firebase/app';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {LoadBlock} from '../dataModel/load-block';

// import * as jsPDF from 'jspdf'

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WeekDay } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import * as moment from 'moment';

import {Md5} from 'ts-md5/dist/md5';

import {MatSnackBar} from '@angular/material/snack-bar';

const md5 = new Md5();

export interface DialogData {
  animal: string
}

export interface SignData{
  popupSign:string
}

@Component({
  selector: 'app-stage-one',
  templateUrl: './stage-one.component.html',
  styleUrls: ['./stage-one.component.css'],
  providers: [
    { provide: 'Window',  useValue: window },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StageOneComponent),
      multi: true,
    },{
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
    }
  ]
})
export class StageOneComponent implements OnInit {

  //check is subHauler or not
  subha

  tabs;//=new Array<LoadBlock>();
  idSet: Set<string> = new Set<string>();
  selected = 'option2';

  truckDataTimeStamp;
  BeginShiftTimeStamp;
  //arrive at site timestamp
  ArriveTimeStamp;
  LoadTimeStamp;
  EndShiftTimeStamp;

  response;
  //yearandmonth
  jobdate
  /* removeTab(index: number) {
    this.tabs.splice(index, 1);
  } */

  loadid

  panelOpenState = false;

  //truck no
  firstFormGroup: FormGroup;
 
  //time arrive at site
  forthFormGroup: FormGroup;
  //loading unloading
  fifthFormGroup: FormGroup;
  //signature
  sixthFormGroup: FormGroup;
  //begin shift
  seventhFormGroup: FormGroup;
  //end shift
  eighthFormGroup:FormGroup;

name;
email;
userId;
contractor;
jobId;
//companyName;

itemsRef: AngularFireObject<any>;

info

public loadForm;

base64Image;

signatureData;

driverSign;
foremanSign;
//driver signed
dSigned;
//foreman signed
fSigned;

readonly Root_url='https://us-central1-daydaco-19a9b.cloudfunctions.net/';

animal

popupSignF

disableButton

hide=false;

companyName
donePath

totalTime
//job date
da
//job date split reorder string
ds
//done job path orderd by date
doneDatePath

loadLength

nettime

@ViewChild(SignaturePad, {static: false}) public signaturePad: SignaturePad;

public options: Object = {};

  public _signature: any = null;

  public propagateChange: Function = null;

  get signature(): any {
    return this._signature;
  }

  set signature(value: any) {
    this._signature = value;
    console.log('set signature to ' + this._signature);
    console.log('signature data :'+value);
    console.log(this.signaturePad.toData());

    this.propagateChange(this.signature);
  }

public rewind(){
  this.signaturePad.fromData(this.signatureData);
}

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this._signature = value;
    this.signaturePad.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  public ngAfterViewInit(): void {
    this.signaturePad.clear();
  }

  public drawBegin(): void {
    console.log('Begin Drawing');
  }

  public drawComplete(): void {

    this.signatureData=this.signaturePad.toData();
    console.log(this.signatureData);
    this.signature = this.signaturePad.toDataURL('image/jpeg', 0.5);

  }

  public clear(): void {
    this.signaturePad.clear();
    this.signature = '';
  }

public signaturePadOptions: Object = { 
  // passed through to szimek/signature_pad constructor
  'minWidth': 1,
  'canvasWidth': 300,
  'canvasHeight': 200,
  'backgroundColor':'rgb(255,255,255)',
};

openSignDialog():void{
    const signRef=this.dialog.open(
      PopupSignF,{
        width:'500px',
        height:'400px',
        data:{popupSignF:this.popupSignF}
      }
    )

    signRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      let ojp=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`
      // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
      this.popupSignF = result;
      let fsignData={
        ForemanSignData:this.popupSignF,
      }
      this.db.object(ojp).update(fsignData).catch(e=>{console.log(e)})
      .then(e=>{
        this.db.object(this.donePath).update(fsignData).catch(e=>{console.log(e)})
        .then(e=>{
          this.db.object(this.doneDatePath).update(fsignData).catch(e=>{
            console.log(e)
          })
        })
       
      })
      
    });
}

openDialog(): void {
  console.log(this.animal)
  const dialogRef = this.dialog.open(
    DialogOverviewExampleDialog, {
    width: '500px',
    height:'500px',
    data: {name: this.name, animal: this.animal}
  }
  );

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    let ojp=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`
    // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
    this.animal = result;
    let noteData={
      notes:this.animal,
    }
    this.db.object(ojp).update(noteData).catch(e=>{console.log(e)})
    .then(e=>{
      this.db.object(this.donePath).update(noteData).catch(e=>{console.log(e)})
      .then(e=>{
        this.db.object(this.doneDatePath).update(noteData).catch(e=>{
          console.log(e)
        })
      })
     
    })
    
  });
}

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    @Inject('Window') private window: Window,
  ) {
   
   }

updateTruckInfo(){
  
  this.truckDataTimeStamp=new Date().toLocaleTimeString();;
  
  this.firstFormGroup.get('trucktimestamp').setValue(this.truckDataTimeStamp);
  
  if(this.firstFormGroup.valid){
     //copy data to done table
  // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
  let doneData={
                ArriveAt:this.info.ArriveAt,
                LoadAt:this.info.LoadAt,
                Ocity:this.info.Ocity,
                Dcity:this.info.Dcity,
                ManifestNo:this.info.ManifestNo,

                TruckerEmail:this.email,
                OwnerCompanyEmail:this.info.OwnerCompanyEmail,
                BrokerEmail:this.info.BrokerEmail,
                ContractorEmail:this.info.ContractorEmail,
                ForemanEmail:this.info.ForemanEmail,

                Rate:this.info.Rate,
                Foreman:this.info.Foreman,
                ForemanPhone:this.info.ForemanPhone,
                BrokerDispatcherName:this.info.BrokerDispatcherName,
                BrokerDispatcherPhone:this.info.BrokerDispatcherPhone,
                OwnerCompanyName:this.info.OwnerCompanyName,
                OwnerCompanyPhone:this.info.OwnerCompanyPhone,
                Contractor:this.info.Contractor,

                SubHauler:this.info.SubHauler,
                ParHauler:this.info.ParHauler,
                ParHaulerEmail:this.info.ParHaulerEmail,
                ParHaulerPhone:this.info.ParHaulerPhone,

                Job:this.info.Job,
                JobDate:this.info.JobDate,
                Day:this.info.Day,
                JobID:this.info.JobID,
                JobUID:this.jobId,

                driverID:this.userId
        }

    this.db.object(this.donePath).update(doneData).catch(e=>{console.log(e)})
    .then(e=>{
      this.db.object(this.doneDatePath).update(doneData).catch(e=>{console.log(e)})
    })
    //update data in 
    let goingJobPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
    let data={
      TruckNumber:this.firstFormGroup.get('TruckNumber').value,
      LicPlate:this.firstFormGroup.get('LicPlate').value,
      TruckType:this.firstFormGroup.get('TruckType').value,
      TruckDataTimeStamp:this.firstFormGroup.get('trucktimestamp').value,
    }
    this.db.object(goingJobPath).update(data).
    catch(error=>console.log(error))
    .then(e=>{
      this.db.object(this.donePath).update(data).
      catch(error=>console.log(error))
    })
    .then(e=>{
      this.db.object(this.doneDatePath).update(data)
      .catch(e=>{console.log(e)})
      this.openSnackBar("Trucker informations","updated")
    })

  }
    
}

updateBeginShift(){
  
  this.BeginShiftTimeStamp=new Date().toLocaleTimeString();
  this.seventhFormGroup.get('beginshifttimestamp').setValue(this.BeginShiftTimeStamp);
  if(this.seventhFormGroup.valid){
    //update data in 
    let goingJobPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
    // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
    let data={
      BeginShiftTime:this.seventhFormGroup.get('BeginShiftTime').value,
      BeginShiftTimeStamp:this.seventhFormGroup.get('beginshifttimestamp').value,
      TotalTime:''
    }
    this.db.object(goingJobPath).update(data).
    catch(error=>console.log(error))
    .then(e=>{
      this.db.object(this.donePath).update(data).
      catch(error=>console.log(error));
    })
    .then(e=>{
      this.db.object(this.doneDatePath).update(data)
      .catch(e=>{console.log(e)})
    })
    
  }

}

//arrive at time
updateArrive(){

  this.ArriveTimeStamp=new Date().toLocaleTimeString();
  this.forthFormGroup.get('arrivetimestamp').setValue(this.ArriveTimeStamp);
  if(this.forthFormGroup.valid){
    //update data in 
    let goingJobPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
    // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
    let data={
      ArriveAtSiteTime:this.forthFormGroup.get('ArriveAtSiteTime').value,
      ArriveAtSiteTimeStamp:this.forthFormGroup.get('arrivetimestamp').value,
    }
    this.db.object(goingJobPath).update(data).
    catch(error=>console.log(error))
    .then(e=>{
      this.db.object(this.donePath).update(data).
      catch(error=>console.log(error))
    })
    .then(e=>{
      this.db.object(this.doneDatePath).update(data)
      .catch(e=>{console.log(e)})
    })
   
  }
}

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 4000,
  });
}

openTopSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 4000,
    verticalPosition: 'top'
  });
}

updateLoad(){
  this.LoadTimeStamp=new Date().toLocaleTimeString();
  this.fifthFormGroup.get('loadtimestamp').setValue(this.LoadTimeStamp);
  if(this.fifthFormGroup.get('LoadId').value!=""&&this.fifthFormGroup.get('LoadId').value!==null){
    //loads table
    let LoadsPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.fifthFormGroup.get('LoadId').value}`;
     let donePath=`done/${this.companyName}/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.fifthFormGroup.get('LoadId').value}`
      let doneDatePath=`done/${this.companyName}/${this.userId}/${this.ds}/${this.contractor}/${this.jobId}/Loads/${this.fifthFormGroup.get('LoadId').value}`
  
      let loaddate={
      LoadId:this.fifthFormGroup.get('LoadId').value?this.fifthFormGroup.get('LoadId').value:" ",
      ScaleTagID:this.fifthFormGroup.get('ScaleTagID').value?this.fifthFormGroup.get('ScaleTagID').value:" ",
      Weight:this.fifthFormGroup.get('Weight').value?this.fifthFormGroup.get('Weight').value:" ",
      Material:this.fifthFormGroup.get('Material').value?this.fifthFormGroup.get('Material').value:" ",
      LoadStart:this.fifthFormGroup.get('LoadStart').value?this.fifthFormGroup.get('LoadStart').value:" ",
      LoadEnd:this.fifthFormGroup.get('LoadEnd').value?this.fifthFormGroup.get('LoadEnd').value:" ",
      UnloadStart:this.fifthFormGroup.get('UnloadStart').value?this.fifthFormGroup.get('UnloadStart').value:" ",
      UnloadEnd:this.fifthFormGroup.get('UnloadEnd').value?this.fifthFormGroup.get('UnloadEnd').value:" ",
      LoadTimeStamp:this.fifthFormGroup.get('loadtimestamp').value?this.fifthFormGroup.get('loadtimestamp').value:" ",
    }
      this.db.object(LoadsPath).update(loaddate).
      catch(error=>console.log(error))
    
    .then(e=>{
      this.db.object(donePath).update(loaddate).catch(error=>console.log(error))
    })
    .then(e=>{
      this.db.object(doneDatePath).update(loaddate).catch(e=>{console.log(e)})
    })
    .then(e=>{
      this.openSnackBar("load","updated")
      this.fifthFormGroup.reset()
    })
    
  }else{
    if(this.fifthFormGroup.get('LoadStart').value!=""&&this.fifthFormGroup.get('LoadStart').value!==null){
         //create id
if(this.loadLength==0){
  this.loadid=1

  let LoadsPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`;
     let donePath=`done/${this.companyName}/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`
      let doneDatePath=`done/${this.companyName}/${this.userId}/${this.ds}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`

      let loaddate={
        LoadId:this.loadid,
        ScaleTagID:this.fifthFormGroup.get('ScaleTagID').value?this.fifthFormGroup.get('ScaleTagID').value:" ",
        Weight:this.fifthFormGroup.get('Weight').value?this.fifthFormGroup.get('Weight').value:" ",
        Material:this.fifthFormGroup.get('Material').value?this.fifthFormGroup.get('Material').value:" ",
        LoadStart:this.fifthFormGroup.get('LoadStart').value?this.fifthFormGroup.get('LoadStart').value:" ",
        LoadEnd:this.fifthFormGroup.get('LoadEnd').value?this.fifthFormGroup.get('LoadEnd').value:" ",
        UnloadStart:this.fifthFormGroup.get('UnloadStart').value?this.fifthFormGroup.get('UnloadStart').value:" ",
        UnloadEnd:this.fifthFormGroup.get('UnloadEnd').value?this.fifthFormGroup.get('UnloadEnd').value:" ",
        LoadTimeStamp:this.fifthFormGroup.get('loadtimestamp').value?this.fifthFormGroup.get('loadtimestamp').value:" ",
      }

      this.db.object(LoadsPath).update(loaddate).
      catch(error=>console.log(error))
    .then(e=>{
      this.db.object(donePath).update(loaddate).catch(error=>console.log(error))
    })
    .then(e=>{
      this.db.object(doneDatePath).update(loaddate).catch(e=>{console.log(e)})
    })
    .then(e=>{
      this.openSnackBar("new load","created")
      this.fifthFormGroup.reset()
    })

}else{
  
  this.db.list(`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads`)
  .query.limitToLast(1).once('value')
  .then(data=>{
    data.forEach(e=>{
      this.loadid=e.key+1
    })
    
  }).then(_=>{

    let LoadsPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`;
    let donePath=`done/${this.companyName}/${this.userId}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`
    let doneDatePath=`done/${this.companyName}/${this.userId}/${this.ds}/${this.contractor}/${this.jobId}/Loads/${this.loadid}`

     let loaddate={
       LoadId:this.loadid,
       ScaleTagID:this.fifthFormGroup.get('ScaleTagID').value?this.fifthFormGroup.get('ScaleTagID').value:" ",
       Weight:this.fifthFormGroup.get('Weight').value?this.fifthFormGroup.get('Weight').value:" ",
       Material:this.fifthFormGroup.get('Material').value?this.fifthFormGroup.get('Material').value:" ",
       LoadStart:this.fifthFormGroup.get('LoadStart').value?this.fifthFormGroup.get('LoadStart').value:" ",
       LoadEnd:this.fifthFormGroup.get('LoadEnd').value?this.fifthFormGroup.get('LoadEnd').value:" ",
       UnloadStart:this.fifthFormGroup.get('UnloadStart').value?this.fifthFormGroup.get('UnloadStart').value:" ",
       UnloadEnd:this.fifthFormGroup.get('UnloadEnd').value?this.fifthFormGroup.get('UnloadEnd').value:" ",
       LoadTimeStamp:this.fifthFormGroup.get('loadtimestamp').value?this.fifthFormGroup.get('loadtimestamp').value:" ",
     }

   
     this.db.object(LoadsPath).update(loaddate).
     catch(error=>console.log(error))
   .then(e=>{
     this.db.object(donePath).update(loaddate).catch(error=>console.log(error))
   })
   .then(e=>{
     this.db.object(doneDatePath).update(loaddate).catch(e=>{console.log(e)})
   })
   .then(e=>{
      this.openSnackBar("new load","created")
     this.fifthFormGroup.reset()
   })

  })
  
}

    // let loadid=md5.appendStr('newload').end()

    
    }
  }
}

updateEndShift(){
  this.EndShiftTimeStamp=new Date().toLocaleTimeString();
  this.eighthFormGroup.get('endshifttimestamp').setValue(this.EndShiftTimeStamp);
  if(this.eighthFormGroup.valid){
    //update data in 
    let goingJobPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
    // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
    this.nettime=this.eighthFormGroup.get('ESnetTime').value
    let data={
      StartShiftTime:this.eighthFormGroup.get('StartShiftTime').value,
      EndShiftTime:this.eighthFormGroup.get('EndShiftTime').value,
      EndShiftTimeStamp:this.eighthFormGroup.get('endshifttimestamp').value,
      NetTime:this.eighthFormGroup.get('ESnetTime').value
    }
    this.db.object(goingJobPath).update(data).
    catch(error=>console.log(error))
    .then(e=>{
      this.db.object(this.donePath).update(data).
      catch(error=>console.log(error))
      this.openSnackBar("Shift informations","updated")
    })
  }
}


deleteLoad(hero){
  //hero.ScaleTagID
  console.log(hero.ScaleTagID);
  let DeleteLoadsPath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads/${hero.LoadId}`;
  let donePath=`done/${this.companyName}/${this.userId}/${this.contractor}/${this.jobId}/Loads/${hero.LoadId}`
  let doneDatePath=`done/${this.companyName}/${this.userId}/${this.ds}/${this.contractor}/${this.jobId}/Loads/${hero.LoadId}`
  this.db.object(DeleteLoadsPath).remove()
  .catch(error=>console.log(error))
  .then(e=>{
    this.db.object(donePath).remove()
    .catch(error=>console.log(error))
  })
  .then(e=>{
    this.db.object(doneDatePath).remove()
    .catch(error=>console.log(error))
    this.openSnackBar("Load information","deleted")
  }) 
  
}

modifyLoad(hero){
      this.fifthFormGroup.get('LoadId').setValue(hero.LoadId)
      this.fifthFormGroup.get('ScaleTagID').setValue(hero.ScaleTagID)
      this.fifthFormGroup.get('Weight').setValue(hero.Weight)
      this.fifthFormGroup.get('Material').setValue(hero.Material)
      this.fifthFormGroup.get('LoadStart').setValue(hero.LoadStart)
      this.fifthFormGroup.get('LoadEnd').setValue(hero.LoadEnd)
      this.fifthFormGroup.get('UnloadStart').setValue(hero.UnloadStart)
      this.fifthFormGroup.get('UnloadEnd').setValue(hero.UnloadEnd)
      this.fifthFormGroup.get('loadtimestamp').setValue(hero.LoadTimeStamp)

      this.openTopSnackBar(`update your load informations in up form,don't forget to save after modify`,`look up`)
}

driverComplete(){
    this.driverSign=this._signature;
    if(this.driverSign){
    // console.log('driver:'+this.driverSign);
    //reset pad
    this.signaturePad.clear();
    this.dSigned=true;
    this.sixthFormGroup.get('driverName').setValue(this.name);
    // this.nettime=this.sixthFormGroup.get('netTime').value
    //going job path
    let ojp=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`
    // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
    //driver sign data
    let dsd={
      DriverName:this.sixthFormGroup.get('driverName').value,
      DriverSignData:this.driverSign,
      // NetTime:this.nettime
    }
    this.db.object(ojp).update(dsd).then(d=>{
      this.db.object(this.donePath).update(dsd)
      .catch(e=>{console.log(e)})
    })
    .then(_=>{
      this.db.object(this.doneDatePath).update(dsd)
      .catch(e=>{console.log(e)})
    })
    .then(_=>{
      this.openSnackBar("Driver signature","completed")
      this._signature=null
    })
   
  }
  
}

foremanComplete(){
  
  if(this.sixthFormGroup.get('foremanName').value!=''&&this._signature!=null){
    this.foremanSign=this._signature
    // console.log('foreman:'+this.foremanSign);
  this.signaturePad.clear();
  this.fSigned=true;
  // this.sixthFormGroup.get('foremanName').setValue(this.info.Foreman);
  //going job path
  let ojp=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`
  // let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`

   var ms=moment(this.EndShiftTimeStamp,"HH:mm:ss A").diff(moment(this.truckDataTimeStamp,"HH:mm:ss A"))
   this.totalTime=moment.duration(ms).asHours()

  //foreman sign data
  let fsd={
    ForemanName:this.sixthFormGroup.get('foremanName').value,
    ForemanSignData:this.foremanSign,
    ForemanNotes:this.sixthFormGroup.get('foremanNotes').value,
    ForemanEmail:this.sixthFormGroup.get('foremanEmail').value,
    TotalTime:this.totalTime
  }

  // this.totalTime=(Math.round(this.totalTime*10000))/10000

  this.db.object(ojp).update(fsd).then(d=>{
    this.db.object(this.donePath).update(fsd)
    .catch(e=>{console.log(e)})
  })
  .then(e=>{
    this.db.object(this.doneDatePath).update(fsd)
    .catch(e=>{console.log(e)})
    this.openSnackBar("Foreman signature","completed")
  })
  
  }
  //calculate total time
  
}

giveUp(){
   //let occupPath=`ownerOrBrokerCreateJobs/${this.companyName}/${this.contractor}/${this.jobId}`;
    // let truckersinfo=`trucker/${this.userId}/State`;
    // this.db.object(truckersinfo).set('free')

    // .then(e=>{})

    //delet job in hand
    let path=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
    this.db.object(path).remove()
    .catch(error=>console.log(error))
  
  .then(e=>{
         
      //  let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
  
       this.db.object(this.donePath).remove()
       .catch(error=>console.log(error))
      })
      .then(e=>{
        this.db.object(this.doneDatePath).remove()
        .catch(error=>console.log(error))
      })


  .then(e=>{
    //use a table to record who was assigned to the job
    // let jobMemoPath=`jobMemo/${this.info.OwnerCompanyName}/${this.contractor}/${this.jobId}/${this.userId}`
    // let memoData={ 
    //   State:'give up'
    // }
    //update in memo
    // this.db.object(jobMemoPath).update(memoData).catch(error=>console.log(error))
  })     
         
    .then(e=>{
      this.openSnackBar("Job","removed")
      this.router.navigate(['truckerCreateJob']).catch(error=>console.log(error));
    })
  

}

sendEmail(){
  this.disableButton = true; 
   let link=`https://daydaco-19a9b.web.app`
   let linkData={
     pdfLink:`${link}/print/${this.userId}/${this.contractor}/${this.jobId}`
   }
  //  let donePath=`done/${this.userId}/${this.contractor}/${this.jobId}`
  
   this.db.object(this.donePath).update(linkData).catch(e=>{
     console.log(e)
   }).then(e=>{
     this.db.object(this.doneDatePath).update(linkData).catch(e=>{
       console.log(e)
     })
   })

   let emailList={
    company:this.info.OwnerCompanyName,
    contractName:this.contractor,
    jobId:this.jobId,
    uid:this.userId,
    pdfLink:`https://daydaco-19a9b.web.app/print/${this.userId}/${this.contractor}/${this.jobId}`,
    contractorEmail:this.info.ContractorEmail,
    driverEmail:this.email,
    brokerEmail:this.info.BrokerEmail,
    ownerEmail:this.info.OwnerCompanyEmail,
    foremanEmail:this.info.ForemanEmail,
    parentHaulerEmail:this.info.ParHaulerEmail,
  }

  //server send email
  let header=new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  
  let options={headers:header};

    this.http.post(this.Root_url+'postEmails',emailList,options).toPromise().then(data=>
    {
        console.log(data);
        this.response=data;
        if(this.response!=null){
          console.log('response'+this.response);
        }
      
        let path=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`;
        //delete job in ongoing
        this.db.object(path).remove().catch(e=>console.log(e));

        // let truckersinfo=`trucker/${this.userId}/State`;
        // this.db.object(truckersinfo).set('free')     
        // .catch(error=>console.log(error));

      })
      .then(e=>{
        //use a table to record who was assigned to the job
      //   let jobMemoPath=`jobMemo/${this.info.OwnerCompanyName}/${this.contractor}/${this.jobId}/${this.userId}`
      //   let memoData={ 
      //   State:'finished'
      // }
        //update in memo
        // this.db.object(jobMemoPath).update(memoData).catch(error=>console.log(error))
      })
      .then(e=>{
        let hoursPath=`workingHours/${this.userId}/${this.ds}/${this.jobId}`
       
        let hourData={
          hours:this.totalTime
        }
        this.db.object(hoursPath).update(hourData)
        .catch(e=>console.log(e))
      })
      .then(e=>{
        this.openSnackBar("Emails","sent!")
        this.router.navigate(['jobsDone/trucker']);
      })
      .catch(err=>{
        console.log(err);
      });

}
/* 
getBase64ImageFromURL(url: string) {
  return Observable.create((observer: Observer<string>) => {
    // create an image object
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = (err) => {
         observer.error(err);
      };
    } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
    }
  });
}

getBase64Image(img: HTMLImageElement) {
  // We create a HTML canvas object that will create a 2d image
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  // This will draw image    
  ctx.drawImage(img, 0, 0);
  // Convert the drawn image to Data URL
  var dataURL = canvas.toDataURL("image/png");
return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


download() {
  var doc = new jsPDF();
  
  doc.text(20, 20, `Driver: ${this.name}`);
  doc.text(20, 30, `Arrive At: ${this.info.ArriveAt}`);
  //doc.addPage();
  doc.text(20, 40, `Arrive time: ${this.info.ArriveTime}, ${this.info.JobDate}`);
  doc.text(20,50,`Job: ${this.info.Job}`);

// for testing you can add any image url here or get dynamically  from other methods as you require
/*
let imageUrl = 'https://firebasestorage.googleapis.com/v0/b/tfttierlist.appspot.com/o/items%2FB.F.%20Sword.png?alt=media&token=194d2184-0ce6-4489-9e90-e4c4943a4da6'
;

this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {    
  console.log(base64data);
  // this is the image as dataUrl
  this.base64Image = 'data:image/jpg;base64,' + base64data;
});


this.signaturePad.fromData(this.signatureData);
  doc.addImage(this.signature,"JPG",50,200,100,50);
 //doc.addImage((this.signaturePad.toDataURL('image/jpeg', 0.5)) ,"JPG", 50, 200, 100,50);
  // Save the PDF
  doc.save('Test.pdf');
} **/

drawStart() {
  // will be notified of szimek/signature_pad's onBegin event
  console.log('begin drawing');
}

completeJob(){
    //complete job and put data in person done job table and company done table sofar to owner done table
    //then delete record from person job table
}

  ngOnInit() {

    this.firstFormGroup = this.formBuilder.group({
      TruckNumber: ['', Validators.required],
      LicPlate: ['', Validators.required],
      TruckType: ['', Validators.required],
      trucktimestamp:['',Validators.required]
    });
  
 /*    this.seventhFormGroup=this.formBuilder.group({
      BeginShiftTime:['',Validators.required],
      beginshifttimestamp:['', Validators.required],
    }); */

    this.eighthFormGroup=this.formBuilder.group({
      StartShiftTime:[''],
      EndShiftTime:['',Validators.required],
      ESnetTime:[''],
      endshifttimestamp:['',Validators.required],
    })

    /* this.forthFormGroup = this.formBuilder.group({
      ArriveAtSiteTime: ['', Validators.required],
      arrivetimestamp:['',Validators.required],
    }); */

    this.fifthFormGroup = this.formBuilder.group({
      LoadId:[''],
      ScaleTagID:[''],
      Weight:[''],
      Material:[''],
      LoadStart:[''],
      LoadEnd:[''],
      UnloadStart:[''],
      UnloadEnd:[''],
      loadtimestamp:['']
    });

    this.sixthFormGroup=this.formBuilder.group({
        driverName:[''],
        // netTime:[''],
        foremanName:['',Validators.required],
        foremanNotes:[''],
        foremanEmail:['']
        
    });

    this.route.paramMap.subscribe(params => {
      //this.companyName = params.get('companyName');userid/:contractor/:jobid
      this.userId=params.get('userid');
      this.contractor=params.get('contractor');
      this.jobId=params.get('jobid');
    });

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.name=this.afAuth.auth.currentUser.displayName;
        this.email=this.afAuth.auth.currentUser.email;
      }});

   /*  //get the company name first
    let companyNamePath=`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/companyName`;
    this.db.object(companyNamePath).snapshotChanges().subscribe(action => {
    this.companyName =action.payload.val(); 
    }); */

    //get loads list 
    this.tabs=this.db.list(`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}/Loads`)
    .valueChanges();

    this.tabs.subscribe(result=>{
      this.loadLength=result.length
      console.log(this.loadLength)
    })
    this.loadLength

    //get on going job info
    this.itemsRef = this.db
    .object
    (`onGoingJobs/${this.userId}/${this.contractor}/${this.jobId}`);

    this.itemsRef.snapshotChanges().subscribe(action => {
      //console.log(action.type)
      //console.log(action.key)
      if(action.payload.val()==null){
      }else{
        //go to profile page
        this.info=action.payload.val();

        this.companyName=this.info.OwnerCompanyName

        this.jobdate=this.info.JobDate

        this.da=String(this.info.JobDate).split('/')
        this.ds=this.da[2]+'/'+this.da[0]+'/'+this.da[1]

        //to store the final done date 
        this.doneDatePath=`done/${this.companyName}/${this.userId}/${this.ds}/${this.contractor}/${this.jobId}`

        this.donePath=`done/${this.companyName}/${this.userId}/${this.contractor}/${this.jobId}`

        if(this.info.SubHauler==''){
          this.subha=true;
        }else{
          this.subha=false;
        }

        this.firstFormGroup.get('TruckNumber').setValue(this.info.TruckNumber);
        this.firstFormGroup.get('LicPlate').setValue(this.info.LicPlate);
        this.firstFormGroup.get('TruckType').setValue(this.info.TruckType);
        this.firstFormGroup.get('trucktimestamp').setValue(this.info.TruckDataTimeStamp);

       /*  this.seventhFormGroup.get('BeginShiftTime').setValue(this.info.BeginShiftTime);
        this.seventhFormGroup.get('beginshifttimestamp').setValue(this.info.BeginShiftTimeStamp);
        
        this.forthFormGroup.get('ArriveAtSiteTime').setValue(this.info.ArriveAtSiteTime);
        this.forthFormGroup.get('arrivetimestamp').setValue(this.info.ArriveAtSiteTimeStamp);
         */

         //this.fifthFormGroup.get('ScaleTagID').setValue('scaletagid');
        /*this.fifthFormGroup.get('Weight').setValue('weight');
        this.fifthFormGroup.get('Material').setValue('Material');
        this.fifthFormGroup.get('LoadStart').setValue('LoadStart');
        this.fifthFormGroup.get('LoadEnd').setValue('LoadEnd');
        this.fifthFormGroup.get('UnloadStart').setValue('UnloadStart');
        this.fifthFormGroup.get('UnloadEnd').setValue('UnloadEnd');
        this.LoadTimeStamp='timestamp'; */
        this.nettime=this.info.NetTime

        this.eighthFormGroup.get('StartShiftTime').setValue(this.info.StartShiftTime)
        this.eighthFormGroup.get('EndShiftTime').setValue(this.info.EndShiftTime);
        this.eighthFormGroup.get('ESnetTime').setValue(this.info.NetTime);
        this.eighthFormGroup.get('endshifttimestamp').setValue(this.info.EndShiftTimeStamp);

        this.EndShiftTimeStamp=this.info.EndShiftTimeStamp
        this.truckDataTimeStamp=this.info.TruckDataTimeStamp
        
        this.totalTime=this.info.TotalTime

        if(this.info.DriverSignData){
          this.driverSign=this.info.DriverSignData;
          
          //driver signed
          this.dSigned=true;

          this.sixthFormGroup.get('driverName').setValue(this.driverSign);

        }

        if(this.info.ForemanSignData){
          this.foremanSign=this.info.ForemanSignData;
          //foreman signed
          this.fSigned=true;

          this.sixthFormGroup.get('foremanName').setValue(this.foremanSign);

          this.sixthFormGroup.get('foremanEmail').setValue(this.info.ForemanEmail)

          }
        }
      }
    );
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      dialogRef.disableClose=true;
    }
}

@Component({
  selector: 'popup-sign-f',
  templateUrl: 'popup-sign-f.html',
})

export class PopupSignF {

signfData

@ViewChild(SignaturePad, {static: false}) public signaturePad: SignaturePad;


  constructor(
    public signRef: MatDialogRef<PopupSignF>,
    @Inject(MAT_DIALOG_DATA) public data: SignData) {
      signRef.disableClose=true;
    }

    public signaturePadOptions: Object = { 
      // passed through to szimek/signature_pad constructor
      'minWidth': 1,
      'canvasWidth': 250,
      'canvasHeight': 200,
      'backgroundColor':'rgb(255,255,255)',
    }

    public clear(): void {
      this.signaturePad.clear();
      this.signfData = '';
    }

    public rewind(){
      this.signaturePad.fromData(this.signfData);
    }

    drawStart() {
      // will be notified of szimek/signature_pad's onBegin event
      console.log('begin drawing');
    }

    public drawComplete(): void {

      this.signfData=this.signaturePad.toData();
      console.log(this.signfData);
      this.signfData = this.signaturePad.toDataURL('image/jpeg', 0.5)
    }

}