import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroupDirective, NgForm,  FormGroup, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {map, startWith} from 'rxjs/operators';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  myControl = new FormControl();
  options:string[]=[''];
  filteredOptions: Observable<string[]>;

public role;
public truckerDiv=false;

//public alreadySignUp=false;

itemRef: AngularFireObject<any>;
item: Observable<any>;

public checkoutForm;
public info;



EPControl=new FormControl('',[
  Validators.required
])

EEControl=new FormControl('',[
  Validators.required,
  Validators.email,
])

EEmatcher = new MyErrorStateMatcher();
EPmatcher = new MyErrorStateMatcher();

  constructor( private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router
    ) {

      this.checkoutForm = this.formBuilder.group({
        OwnerName: '',
        OwnerCompanyName:'',
        OwnerCompanyPhone:'',
        OwnerCompanyEmail:'',
        
        DriverName:'',
        Employer:'',
        EmployerPhone:'',
        EmployerEmail:'',
        Phone:'',
        Email:'',
        Address:'',
      });

     }

     onSubmit(customerData) {
      // Process user data here
      
     // console.warn('Your info has been submitted', customerData.CompanyName);
//authenticate check
if(this.afAuth.user){
  if(this.role=="trucker"&&customerData.DriverName!=""&&
    customerData.Phone!=""&&customerData.Email!=""){
      //trucker data for trucker's own table
      let path=`trucker/${this.afAuth.auth.currentUser.uid}`;
      //data for trucker employer belone table
      // let truckerPath=`OwnerTruckersInfo/${customerData.Employer}/${this.afAuth.auth.currentUser.uid}`;
    let data={
      DriverName: customerData.DriverName,
      //Employer:customerData.Employer,
      Employer:this.myControl.value,
      EmployerPhone:customerData.EmployerPhone,
      EmployerEmail:customerData.EmployerEmail,
      Phone:customerData.Phone,
      Email:customerData.Email,
      Address:customerData.Address?customerData.Address:" ",
      Icon:this.afAuth.auth.currentUser.photoURL,
    }
    this.db.object(path).update(data).catch(error=>console.log(error))
    // .then(any=>this.db.object(truckerPath).update(data)
    .catch(error=>console.log(error))
    .then(any=>this.router.navigate(['profile']));
  }/* else if(this.role=="broker"&&
  customerData.CompanyName!=""
  &&customerData.DispatcherName!=""&&
  customerData.CompanyPhone!=""&&
  customerData.CompanyEmail!=""&&
  customerData.CompanyAddress!=""&&
  customerData.BrokerOwnerName!=""&&
  customerData.BrokerOwnerPhone!=""&&
  
  customerData.BrokerOwnerEmail!=""){
    let brokerPath=`brokersInfo/${customerData.CompanyName}`;
    let data={
      BrokerOwnerName:customerData.BrokerOwnerName,
      BrokerOwnerPhone:customerData.BrokerOwnerPhone,
      BrokerOwnerEmail:customerData.BrokerOwnerEmail,
      CompanyName: customerData.CompanyName,
     
      CompanyPhone: customerData.CompanyPhone,
      CompanyEmail:customerData.CompanyEmail,
      CompanyAddress:customerData.CompanyAddress,
      Icon:this.afAuth.auth.currentUser.photoURL,
    }
    this.db.object(brokerPath).update(data).then(any=>
      this.db.object(path).update(data).
      catch(error=>console.log(error)).
      then(any=>this.router.navigate(['profile','broker']))
    );
 } */
 

 else if(this.role=="owner"&&
  customerData.OwnerName!=""&&
  customerData.OwnerCompanyName!=""&&
  customerData.OwnerCompanyPhone!=""&&
  customerData.OwnerCompanyEmail!=""
  /* customerData.BrokerDispatcherName!=""&&
  customerData.BrokerDispatcherEmail!=""&&
  customerData.BrokerDispatcherPhone!="" */
  ){
    //ownerCompanyIndex
    // let oCI=`ownerCompanyIndex/${customerData.OwnerCompanyName}`
    // let ociData={
    //   owner:customerData.OwnerName
    // }
    // this.db.object(oCI).update(ociData).then(e=>{
       //owner want to do trucker work so need info in trucker table
    let truckerPath=`trucker/${this.afAuth.auth.currentUser.uid}`;
    let truckerIn={
          DriverName: customerData.OwnerName,
          Employer:customerData.OwnerCompanyName,
          Phone:customerData.OwnerCompanyPhone,
          Email:customerData.OwnerCompanyEmail,
          Icon:this.afAuth.auth.currentUser.photoURL,
    }
    this.db.object(truckerPath).update(truckerIn)
    // .then(e=>{
    //   //owner do trucker work put self data in employer table 
    // let truckerInfoPath=`OwnerTruckersInfo/${customerData.OwnerCompanyName}/${this.afAuth.auth.currentUser.uid}`;
    // let truckerInfoData={
    //   DriverName: customerData.OwnerName,
    //   Employer:customerData.OwnerCompanyName,
    //   Phone:customerData.OwnerCompanyPhone,
    //   Email:customerData.OwnerCompanyEmail,
    //   Icon:this.afAuth.auth.currentUser.photoURL,
    // }

    // this.db.object(truckerInfoPath).update(truckerInfoData)
    .then(e=>{
        //ofcause owner info in owner company table
    let ownerPath=`owner/${this.afAuth.auth.currentUser.uid}`;
    let data={
     OwnerName:customerData.OwnerName,
     OwnerCompanyName:customerData.OwnerCompanyName,
     OwnerCompanyPhone:customerData.OwnerCompanyPhone,
     OwnerCompanyEmail:customerData.OwnerCompanyEmail,
     
     Icon:this.afAuth.auth.currentUser.photoURL,
    }
   
    this.db.object(ownerPath).update(data).
    catch(error=>console.log(error)).
    then(any=>this.router.navigate(['/profile']));
    })
    .catch(error=>console.log(error));
    
    //})
    // })
    }
    }
      // this.checkoutForm.reset();
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

ngOnInit() {
  this.filteredOptions = this.myControl.valueChanges
  .pipe(
    startWith(''),
    map(value => this._filter(value))
  );

this.afAuth.auth.onAuthStateChanged(user=>{
  if(user){

  // this.db.list('ownerCompanyIndex').query.once("value").then(data=>{
  //   data.forEach(e=>{
  //      this.options
  //      .push(e.key);
  //     //console.log(e.key)
  //   })
  // })

  this.db.list('owner').query.once("value")
  .then(data=>{
    data.forEach(e=>{
      var eobj=e.val()
      this.options
      .push(eobj['OwnerCompanyName'])
    })
  })

    let user;
    this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
    .snapshotChanges().subscribe(a=>{
        user=a.payload.val();
        this.role=user.role;
        if(this.role=="trucker"){
          this.truckerDiv=true;
        }else{
          this.truckerDiv=false;
        }
        this.itemRef = this.db.object(`${this.role}/${this.afAuth.auth.currentUser.uid}`);
        this.itemRef.snapshotChanges().subscribe(action => {
        //console.log(action.type);
        //console.log(action.key)
        //console.log(action.payload.val())
        if(action.payload.val()==null){
        
          //this.alreadySignUp=false;
        }else{
          //this.alreadySignUp=true;
          
          this.info=action.payload.val();
    //go to profile page
    //this.router.navigate(['profile']);
    this.checkoutForm.get('DriverName').setValue(this.info.DriverName);
    this.myControl.setValue(this.info.Employer);
    // this.checkoutForm.get('Employer').setValue(this.info.Employer);
    this.checkoutForm.get('EmployerPhone').setValue(this.info.EmployerPhone);
    this.checkoutForm.get('EmployerEmail').setValue(this.info.EmployerEmail);
    this.checkoutForm.get('Phone').setValue(this.info.Phone);
    this.checkoutForm.get('Email').setValue(this.info.Email);
    this.checkoutForm.get('Address').setValue(this.info.Address);

    this.checkoutForm.get('OwnerName').setValue(this.info.OwnerName);
    this.checkoutForm.get('OwnerCompanyName').setValue(this.info.OwnerCompanyName);
    this.checkoutForm.get('OwnerCompanyPhone').setValue(this.info.OwnerCompanyPhone);
    this.checkoutForm.get('OwnerCompanyEmail').setValue(this.info.OwnerCompanyEmail);
    
    
       }
      });
    });
  }
  });

  }

}
