//this page need authority
import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import{cardInfo} from '../dataModel/cardInfo';
import{cardInfoS,cardInfoSss} from '../dataModel/cardInfoS';

@Component({
  selector: 'app-your-shop',
  templateUrl: './your-shop.component.html',
  styleUrls: ['./your-shop.component.css']
})
export class YourShopComponent implements OnInit {

  id
  email
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

  trendList

  diaAddId
  MarketNumber

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    public dialog: MatDialog
  ) { }

//get all cards in your shop
getAllCards(id){
  console.log("get all cards from id: "+this.id)

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

  console.log(pageNum)

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

MoreThanThree(){
  this.cardV=0
  // let date=new Date()
  // let year=date.getFullYear()
  // let month=date.getUTCMonth()+1
  let sym=this.db.list(`marketU/${this.afAuth.auth.currentUser.uid}`)
  
  this.cardCollections=new Array<cardInfoSss>()
  this.allcards=new Array<cardInfoSss>()

  sym.query.once('value')
    .then(datas=>{

      //localStorage.clear()

      datas.forEach(data=>{
              
              let obj=data.val()

                //get img from storage
                // const ref = this.storage.ref(`cardSource/${data.key}.jpg`);
                // this.cardImgUrl = ref.getDownloadURL();

                //localStorage.setItem(data.key,JSON.stringify(obj))

                this.cardCollections.push(
                  new cardInfoSss(
                    data.key,
                    obj['cardAmount'],
                    data.key,
                    obj['cardPrice'],
                    obj['cardName'],
                    obj['cardType'],
                    obj['cardAttribute'],
                    obj['cardRace'],
                    obj['cardDesc']
                    )
                    ) 

                this.allcards.push(
                  new cardInfoSss(
                  data.key,
                  obj['cardAmount'],
                  data.key,
                  obj['cardPrice'],
                  obj['cardName'],
                  obj['cardType'],
                  obj['cardAttribute'],
                  obj['cardRace'],
                  obj['cardDesc']
                  ))

                this.cardV=this.cardV+(obj['cardAmount'])*obj['cardPrice']

                     
      })
    }).then(_=>{

      //this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
      // this.truckerjobcount=this.contractorsWithJobBlock.length
      // this.contractorsWithJobBlock.reverse();
      this.pagenumber=1
      this.paging()
    })

}

addErrP;
addErrC;

removeFromYourMarket(r){
  console.log("removed"+r+" from market")

  let cardObj
  = JSON.parse(localStorage.getItem(r))

  cardObj['list']=false
  localStorage.setItem(r,JSON.stringify(cardObj))

  //remove from market c market p and update personal db

  //add cards info in to database called market sort by userid
  //creating this database is easy for user to search and sort their personal database
  let dataPath=`marketU/${this.afAuth.auth.currentUser.uid}/${r}`

  //add cards info in to market db sort by cardid
  //database is for publich to searching card by id or name
  let dataPathC=`marketC/${r}/${this.afAuth.auth.currentUser.uid}`

  //need a update in the personal card database
  let dataPathO=`collections/${this.afAuth.auth.currentUser.uid}/${r}`

  //here is a duplicate code hope reduce in the future 
  //better version in database page
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

  //update the card is list on the market or not
  let cardUp={
    list:false
  }

  this.db.object(dataPathO)
  .update(cardUp)
  .catch(error=>{
    this.addErrC=error
  })
  .then(_=>{
    if(this.addErrC){
      console.log(this.addErrC)
    }else{
      console.log("update list state in db")
    }
  })

  this.db.object(dataPathC)
  .remove()
  .
  catch(error=>{
    this.addErrC=error
  }).then(_=>{
    if(this.addErrC){
      console.log(this.addErrC)
    }else{
      console.log("update in public market success")
      //this.updateSuccess=true;
    }
  })

  this.db.object(dataPath)
  .remove()
  .
  catch(error=>{
    this.addErrP=error
  }).then(_=>{
    if(this.addErrP){
      console.log(this.addErrP)
    }else{
      console.log("update in personal market success")
      //this.updateSuccess=true;
    }
  })

}

openDialog(img,id,number,price,desc): void {
    
  this.diaAddId=id
  this.MarketNumber=number-3

  const dialogRef = this.dialog.open(dialogShop, {
    width: '500px',
    data: {
      diaId: id, 
      diaImg: img,
      diaNumber:number,
      diaPrice:price,
      diaDesc:desc,
      diaAddId:this.diaAddId,
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // this.animal = result;
    this.diaAddId = result;

    //add cards to market place ⤴
    if(result){
      console.log('remove from market place '+this.MarketNumber)
      this.removeFromYourMarket(result)
      }

  });
}

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user=>{

      if(user){
        this.email=user.email
        this.id=user.uid
        this.getAllCards(this.id)
        this.MoreThanThree()
      
      }
    })

  }

}

export interface DialogData {
  diaId: string;
  diaImg: string;
  diaNumber: string;
  diaPrice: string;
  diaDesc:string;
  diaAddId: string;
}

@Component({
  selector: 'dialog-shop',
  templateUrl: 'dialog-shop.html',
})
export class dialogShop {

  constructor(
    public dialogRef: MatDialogRef<dialogShop>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    removeMarket(): void{
      this.data.diaAddId=this.data.diaId
      //console.log(this.data.diaAddId)
      // this.dialogRef.close();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}