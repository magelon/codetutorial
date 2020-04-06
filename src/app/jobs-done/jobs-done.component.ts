import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import{JobBlock} from '../dataModel/job-block';
import { stringify } from '@angular/compiler/src/util';

import {jobBlockForOwner}from '../dataModel/jobBlockForOwner';
import { ArrayDataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-jobs-done',
  templateUrl: './jobs-done.component.html',
  styleUrls: ['./jobs-done.component.css']
})
export class JobsDoneComponent implements OnInit {

  contractorsWithJobBlock:Array<JobBlock>

  itemsRef: AngularFireList<any>;

  //jobblock array for ownere
  // jbfoBlock: Array<jobBlockForOwner>=[]

  //owner job display 2d array
  owner2d: Array<any[]>=[[]]

  ownerMap: Map<string,Array<jobBlockForOwner>>
  
  // maptest: Map<string,Array<jobBlockForOwner>>

  role
  uid
  ownerjobcount
  truckerjobcount
  companyName

searchFormGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router
  ){    
  }

  searchRecent(){
    let date=new Date()
    let year=date.getFullYear()
    let month=date.getUTCMonth()+1
    let sym=this.db.list(`done/${this.companyName}/${this.afAuth.auth.currentUser.uid}/${year}/${month}`)
    this.contractorsWithJobBlock=new Array<JobBlock>()

    sym.query.once('value')
      .then(datas=>{
        datas.forEach(data=>{
            data.forEach(d=>{
              d.forEach(dd=>{
                let obj=dd.val()
                this.contractorsWithJobBlock.push(new JobBlock(d.key,obj['JobUID'],obj['JobDate'],obj['ParHauler']))
              })
            })
        })
      }).then(_=>{
        this.truckerjobcount=this.contractorsWithJobBlock.length
        this.contractorsWithJobBlock.reverse();
      })

  }

  searchYM(){
    let year=this.searchFormGroup.get('year').value
    let month=this.searchFormGroup.get('month').value

    let sym=this.db.list(`done/${this.companyName}/${this.afAuth.auth.currentUser.uid}/${year}/${month}`)

if(year&&month){

  this.contractorsWithJobBlock=new Array<JobBlock>()

  sym.query.once('value')
    .then(datas=>{

      datas.forEach(data=>{
          data.forEach(d=>{
            d.forEach(dd=>{
              let obj=dd.val()
              this.contractorsWithJobBlock.push(new JobBlock(d.key,obj['JobUID'],obj['JobDate'],obj['ParHauler']))
            })
          })
      })
    }).then(_=>{
      this.truckerjobcount=this.contractorsWithJobBlock.length
      this.contractorsWithJobBlock.reverse();
    })
}

  }

  search(){
    console.log(this.searchFormGroup.get('year').value+''+this.searchFormGroup.get('month').value)

    let year=this.searchFormGroup.get('year').value
    let month=this.searchFormGroup.get('month').value
    let date=this.searchFormGroup.get('date').value

if(year&&month&&date){
  this.itemsRef = this.db.list(`done/${this.companyName}/${this.afAuth.auth.currentUser.uid}/${year}/${month}/${date}/`);

  this.contractorsWithJobBlock=new Array<JobBlock>();
  
  this.itemsRef.query.once('value')
  .then(data=>{
    
    data.forEach(d=>{
      d.forEach(dd=>{
        let obj=dd.val()
        this.contractorsWithJobBlock.push(new JobBlock(d.key,obj['JobUID'],obj['JobDate'],obj['ParHauler']))
      })
     
    })
  }).then(
    _=>{
      this.truckerjobcount=this.contractorsWithJobBlock.length
      this.contractorsWithJobBlock.reverse();
    }
  )
}

  }

  ngOnInit() {

   

    this.searchFormGroup = this.formBuilder.group({
      year: [''],
      month: [''],
      date:['']
    });

// this.maptest=new Map<string,Array<jobBlockForOwner>>()

// this.maptest.set('k1',[
//   new jobBlockForOwner('56','j1','j1.2','j1.3','j1.4','j1.5','j1.6','j1.7')

// ])

// this.maptest.get('k1').push(
//   new jobBlockForOwner('87','j2','j2.2','j2.3','j2.4','j2.5','j2.6','j2.7')
// )

// this.maptest.set('k2',[
//   new jobBlockForOwner('','jb1','jb1.2','jb1.3','jb1.4','jb1.5','jb1.6','jb1.7')
// ])

// console.log(this.maptest)

this.route.paramMap.subscribe(params => {
      //this.companyName = params.get('companyName');userid/:contractor/:jobid
      this.role=params.get('role');
      
      this.afAuth.auth.onAuthStateChanged(user=>{
        if(user){
            this.uid=this.afAuth.auth.currentUser.uid;
  
            this.db.object(`trucker/${this.uid}`).query.once('value')
            .then(data=>{
              let obj=data.val()
              this.companyName=obj['Employer']

              if(this.role=='owner'){
  
                this.itemsRef = this.db.list(`done/${this.companyName}`);
  
                this.itemsRef.query
                
                .once('value')
                .then(data=>{
                   this.contractorsWithJobBlock=new Array<JobBlock>();
                   this.owner2d=new Array<any[]>()
                   this.ownerMap=new Map<string,Array<jobBlockForOwner>>()
                  data.forEach(d=>{
                    d.forEach(dd=>{
                      dd.forEach(ddd=>{
                        let obj=ddd.val()

                        if(this.ownerMap.has(obj['BrokerDispatcherName'])){
                          this.ownerMap.get(obj['BrokerDispatcherName']).push(
                            new jobBlockForOwner(
                              obj['JobDate'],
                              dd.key,
                              obj['BrokerDispatcherName'],
                              obj['OwnerCompanyName'],
                              obj['JobUID'],
                              obj['ParHauler'],
                              obj['DriverName'],
                              obj['driverID']
                            )
                          )
                        }else{
                          this.ownerMap.set(obj['BrokerDispatcherName'],new Array<any>())
                          this.ownerMap.get(obj['BrokerDispatcherName']).push(
                            new jobBlockForOwner(
                              obj['JobDate'],
                              dd.key,
                              obj['BrokerDispatcherName'],
                              obj['OwnerCompanyName'],
                              obj['JobUID'],
                              obj['ParHauler'],
                              obj['DriverName'],
                              obj['driverID']
                            )
                          )
                        }

                        this.contractorsWithJobBlock.push(new JobBlock(dd.key,obj['JobUID'],obj['JobDate'],obj['driverID']))
                      })
                    
                    })
                   
                  })
                }).then(
                  _=>{
                     this.ownerjobcount=this.contractorsWithJobBlock.length
                    
                  }
                )
  
              }else if(this.role=='trucker'){

                this.searchRecent()
                // this.itemsRef = this.db.list(`done/${this.companyName}/${this.afAuth.auth.currentUser.uid}`);
  
                // this.itemsRef.query.limitToFirst(10).once('value')
                // .then(data=>{
                //    this.contractorsWithJobBlock=new Array<JobBlock>();
                //   data.forEach(d=>{

                //     if(!parseInt(d.key)){
                      
                //       d.forEach(dd=>{
                //         let obj=dd.val()
                //         this.contractorsWithJobBlock.push(new JobBlock(d.key,obj['JobUID'],obj['JobDate'],obj['ParHauler']))
                //       })

                //     }

                  
                   
                //   })
                // }).then(
                //   _=>{
                //     this.truckerjobcount=this.contractorsWithJobBlock.length
                //   }
                // )

              }
  
  //     this.itemsRef.snapshotChanges(['child_changed'])
  //     .subscribe(actions => {
  //       this.contractorsWithJobBlock=new Array<JobBlock>();
  //       actions.forEach(action => {
  //         console.log(action.payload.val());
          
  //         var contra;
  //         contra=action.key;
  //         var jCount;
  //         var jId;
  
  //  //traslate action payload to json string
  //  var userStr=JSON.stringify(action.payload.val());
  
  //  JSON.parse(userStr, (key, value) => {
  //    //let regexpNumber = new RegExp('^[0-9]');
  //    //check job has been token or not
  //    //key=='Occupied'&&value=='false'&&
    
  //    if(/* key=='Times'|| */key=='JobID'){
  
  //       /* if(key=='Times'){
  //         jCount=value;
  //       } */
  //       if(key=='JobID'){
  //         jId=value;
  //       }
  //       if(/* jCount&& */jId){
  //         this.contractorsWithJobBlock.push(new JobBlock(contra,jId,jCount));
  //       }
        
  //      }
       
  //    }
  //  )
           
  //       })
  //     })
      
  
            }
            )
  
      
        }
      })
      
    });

    
  }

}
