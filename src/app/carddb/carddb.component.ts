import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import{cardInfo} from '../dataModel/cardInfo';
import{cardInfoS} from '../dataModel/cardInfoS';

@Component({
  selector: 'app-carddb',
  templateUrl: './carddb.component.html',
  styleUrls: ['./carddb.component.css']
})
export class CarddbComponent implements OnInit {

  updating

  Root_url="https://db.ygoprodeck.com/api/v5/cardinfo.php"

  uploadAu

  allcardid

  allcardname

  trendlist

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient
  ) { }

  openDialog(img,id,number,price): void {
    const dialogRef = this.dialog.open(dbZoom, {
      width: '500px',
      data: {diaId: id, diaImg: img,diaNumber:number,diaPrice:price}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

//yugioh has more than 10 thoundands cards it's about 10m data 

updateDB(){

  let now=new Date()
  let year=now.getFullYear()
  
  let month=(now.getMonth()+1).toString()
  if((now.getMonth()+1)<10){
    month='0'+month
  }
  
  let date=now.getDate().toString()
  if(now.getDate()<10){
    date='0'+date
  }

  let time=year+""+month+""+date

  this.updating=true

 

  this.http.get<any>(this.Root_url).toPromise().then(data=>
      {
      console.log("start updating...")

      this.trendlist=new Array<any>()

      data.forEach((e,i,a) => {

        //check card is in database
      this.db.object(`carddb/${e['id']}`).query.once("value")
      .then(cdata=>{

      var err
      //if data exist
      if(cdata){
     //compare price
     var oldPrice

     var newPrice

     var po=e['card_prices'] 
     
     if(po['tcgplayer_price']!=null){
      newPrice=po['tcgplayer_price']
     }else{
       newPrice=0
     }
     
     this.db.object(`carddb/${e['id']}/card_prices`)
     .query
     .once("value")
     .then(price=>{
       var op=price.val()
       if(op['tcgplayer_price']!=null){
        oldPrice=op['tcgplayer_price']
       }else{
         oldPrice=0
       }
       
       if(oldPrice<newPrice){
          this.trendlist.push(e['id'])
          console.log('new high price!!🔥🔥🔥🔥🔥')
       }
     })
     .then(_=>{

     //update price
     let dataPath=`carddb/${e['id']}/priceHistory/${time}`
     this.db.object(dataPath)
     .update(e['card_prices'])
     .catch(error=>{
       err=error
     })
     .then(_=>{

      let dataPath=`carddb/${e['id']}/card_prices`
      this.db.object(dataPath)
      .update(e['card_prices'])

       if(err){
         console.log(err)
       }else{
          console.log(e['name']+" prices updated!!")
          if(i==(data.length-1)){
           console.log("done!")
           this.updating=false
           //remove old list first
           this.db.object(`trending`)
           .remove()
           .then(_=>{
              //update trend list
              this.db.object(`trending`)
              .update(this.trendlist)
           })
           
         }
       }
     })

     })
     

   }else{
     //update card info and then update price history
     this.db.object(`carddb/${e['id']}`)
      .update(e)
      .catch(error=>{
        err=error
      })
      .then(_=>{
        if(err){
          console.log(err)
        }else{
          console.log(e['name']+" basic info updated!")

          let dataPath=`carddb/${e['id']}/priceHistory/${time}`
          this.db.object(dataPath)
          .update(e['card_prices'])
          .catch(error=>{
            err=error
          })
          .then(_=>{
            if(err){
              console.log(err)
            }else{
               console.log(e['name']+" first time prices updated!!")
               if(i==(data.length-1)){
                console.log("done!")
                this.updating=false
              }
            }
          })
        
        }
      })
      
   }
 })
  
    //console.log(time)
    

    //update general card infomations

    // this.db.object(`carddb/${e['id']}`)
    // .update(e)
    // .catch(error=>{
    //   err=error
    // })
    // .then(_=>{
    //   if(err){
    //     console.log(err)
    //   }else{
    //     console.log(e['name']+" data updated!")
    //     if(i==(data.length-1)){
    //       console.log("done!")
    //       this.updating=false
    //     }
    //   }
    // })

    //clear database
    //this.db.object(`carddb`).remove()

   
    


    //update price everyday
    // let dataPath=`carddb/${e['id']}/priceHistory/${time}`
    // this.db.object(dataPath)
    // .update(e['card_prices'])
    // .catch(error=>{
    //   err=error
    // })
    // .then(_=>{
    //   if(err){
    //     console.log(err)
    //   }else{
    //      console.log(e['name']+" prices updated!!")
    //      if(i==(data.length-1)){
    //       console.log("done!")
    //       this.updating=false
    //     }
    //   }
    // })
    
      });

      }
     )

    }

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user=>{
        if(user){
          if(user.uid=="8QRYhWtCLEQl12dq4OBApmoVCbA3"){
             this.uploadAu=true
           }
          }
        }
    )

    // this.afAuth.auth.onAuthStateChanged(user=>{
    //   if(user){
    //     if(user.uid=="8QRYhWtCLEQl12dq4OBApmoVCbA3"){
    //       this.uploadAu=true
    //     }

    //       this.allcardid=new Array<any>()
    //       this.allcardname=new Array<any>()

    //       this.db.list(`carddb`).query.once("value")
    //       .then(data=>{
    //       data.forEach(e=>{
    //         let obj=e.val()

    //         this.allcardid.push(e.key)

            
    //       })
    //     })

    //   }
    // })
  }

}

export interface DialogData {
  diaId: string;
  diaImg: string;
  diaNumber: string;
  diaPrice: string;
}

@Component({
  selector: 'db-zoom',
  templateUrl: 'db-zoom.html',
})
export class dbZoom {

  constructor(
    public dialogRef: MatDialogRef<dbZoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}