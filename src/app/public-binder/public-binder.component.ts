//this page does not require authority beause it is meant for public
import { Component, OnInit,Inject } from '@angular/core';
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
import{cardInfoS,cardInfoSss} from '../dataModel/cardInfoS';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import{cardInfo} from '../dataModel/cardInfo';


@Component({
  selector: 'app-public-binder',
  templateUrl: './public-binder.component.html',
  styleUrls: ['./public-binder.component.css']
})
export class PublicBinderComponent implements OnInit {

mail
id

cardCollections:Array<cardInfoSss>

  //collection for display
  DisplyCollections:Array<cardInfoSss>

  cardPrice

  pagenumber

  allcards
  // cardImgUrl: Observable<string | null>;

  //paging variables
  //totall number of cards array size
  cardsSize
//totally value
  cardV
  //pagings we need
  pagings

  //pages array
  pageArr:Array<any>

  //card id for open dialog
  diaId

  //card img url for open dialog
  diaImg

  cardSearchName

  diaAddId
  MarketNumber

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  openDialog(img,id,number,price,desc,name): void {
    
    this.diaAddId=id
    this.MarketNumber=number-3
  
    const dialogRef = this.dialog.open(dialogPb, {
      width: '500px',
      data: {
        diaId: id, 
        diaImg: img,
        diaNumber:number,
        diaPrice:price,
        diaDesc:desc,
        diaAddId:this.diaAddId,
        diaName:name,
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      this.diaAddId = result;
  
      //add cards to market place ⤴
      if(result){
        console.log('remove from market place '+this.MarketNumber)
        this.addToCart(result)
        }
  
    });
  }

  addToCart(r){
    console.log(r+" has been add to cart.")
  }

getUidFromM(mail){
  this.db.list(`users`)
  .query.once("value")
  .then( data=>{
   let count=0
   data.forEach(e=>{
    count++
    var eobj=e.val()
        if(eobj['userEmail']==mail){
            console.log(e.key)
            this.id=e.key
            if(this.id){
              this.MoreThanThree(this.id)
            }
        }
    })
  })

  

}

paging(){

  if(this.cardCollections.length>0){
//calculater how many pages needed
this.cardsSize=this.cardCollections.length
this.pagings=Math.round(this.cardsSize/9)

if(this.pagings<(this.cardsSize/9)){
  this.pagings++
  this.pageArr=Array(this.pagings).fill(this.pagings,1,this.pagings)
}else{
  this.pageArr=Array(this.pagings).fill(this.pagings,1,this.pagings)
}

this.DisplyCollections=new Array<cardInfoSss>()
//populate the collections with first 10 
for(var i=0;i<9;i++){
  this.DisplyCollections[i]=this.cardCollections[i]
}

if(this.DisplyCollections.length==9){

  var i=0

    this.DisplyCollections.forEach(
      each=>{
        console.log(each.cardId)
        if(each.cardId){

          const filePath = `/cardSource/${each.cardId}.jpg`;
          const ref = this.storage.ref(filePath);
         
          ref.getDownloadURL().subscribe(url=>{

            if(url){
                //console.log(url);
               
                //write the url to collections
                for(var i=0;i<9;i++){
                  if(this.DisplyCollections[i].cardId==each.cardId){
                    this.DisplyCollections[i].cardImgUrl=url
                  }
                }
            }

          })   

        }
       
      }
    )
  }
  }
}

changingPage(pageNum){

  //console.log(pageNum)

  this.pagenumber=pageNum

  //reset displaycollection
  this.DisplyCollections=new Array<cardInfoSss>()

  //populate the array
  for(var i=pageNum*9-9;i<pageNum*9;i++){
    this.DisplyCollections.push(this.cardCollections[i])
    // this.DisplyCollections[i]=this.cardCollections[i]
  }

  if(this.DisplyCollections.length==9){

    var i=0

      this.DisplyCollections.forEach(
        each=>{
          console.log(each.cardId)
          const filePath = `/cardSource/${each.cardId}.jpg`;
              const ref = this.storage.ref(filePath);
             
              ref.getDownloadURL().subscribe(url=>{

                if(url){
                    //console.log(url);
                    //write the url to collections
                    for(var i=0;i<9;i++){
                      if(this.DisplyCollections[i].cardId==each.cardId){
                        this.DisplyCollections[i].cardImgUrl=url
                      }
                    }
                }

              })   
        }
      )
  }

}

MoreThanThree(id){
  this.cardV=0
  // let date=new Date()
  // let year=date.getFullYear()
  // let month=date.getUTCMonth()+1
  let sym=this.db.list(`marketU/${id}`)
  
  this.cardCollections=new Array<cardInfoSss>()
  this.allcards=new Array<cardInfoSss>()

  sym.query.once('value')
    .then(datas=>{

      //localStorage.clear()

      datas.forEach(data=>{
              
              let obj=data.val()

              if(true){

                //get img from storage
                // const ref = this.storage.ref(`cardSource/${data.key}.jpg`);
                // this.cardImgUrl = ref.getDownloadURL();

                //localStorage.setItem(data.key,JSON.stringify(obj))

                //describtion was replaced by date put on the market
                this.cardCollections.push(
                  new cardInfoSss(
                    data.key,
                    obj['cardAmount'],
                    data.key, 
                    data.key,
                    obj['cardName'],
                    data.key,
                    data.key,
                    data.key,
                    obj['date']
                    )
                    ) 

                this.allcards.push(
                  new cardInfoSss(
                    data.key,
                    obj['cardAmount'],
                    data.key,
                    data.key,
                    obj['cardName'],
                    data.key,
                    data.key,
                    data.key,
                    obj['date']
                  ))

                this.cardV=0//this.cardV+(obj['cardAmount'])*obj['cardPrice']

              }       
      })
    }).then(_=>{

      //this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
      // this.truckerjobcount=this.contractorsWithJobBlock.length
      // this.contractorsWithJobBlock.reverse();
      this.pagenumber=1
      this.paging()
    })

}

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
      //this.companyName = params.get('companyName');userid/:contractor/:jobid
      this.mail=params.get('email');
      console.log("got "+`${this.mail}`)
    })

    
      if(this.mail){
        this.getUidFromM(this.mail)
      }

    
  }

}

export interface DialogData {
  diaId: string;
  diaImg: string;
  diaNumber: string;
  diaPrice: string;
  diaDesc:string;
  diaAddId: string;
  diaName:string;
}

@Component({
  selector: 'dialog-pb',
  templateUrl: 'dialog-pb.html',
})
export class dialogPb {

  constructor(
    public dialogRef: MatDialogRef<dialogPb>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    addToCart(): void{
      this.data.diaAddId=this.data.diaId
      //console.log(this.data.diaAddId)
      // this.dialogRef.close();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}