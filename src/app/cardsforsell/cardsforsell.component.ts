import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import{cardInfoSss,cardInfoSssL} from '../dataModel/cardInfoS';


@Component({
  selector: 'app-cardsforsell',
  templateUrl: './cardsforsell.component.html',
  styleUrls: ['./cardsforsell.component.css']
})
export class CardsforsellComponent implements OnInit {

  cardCollections:Array<cardInfoSssL>

  //collection for display
  DisplyCollections:Array<cardInfoSssL>


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

  cardSearch(name){
    this.DisplyCollections=new Array<cardInfoSssL>()
    this.allcards.forEach((element,index,array) => {

    // console.log(element.cardName)

      if(element.cardName.toLowerCase().includes(name.toLowerCase())){

        this.DisplyCollections.push(
          element
        )

        const filePath = `/cardSource/${element.cardId}.jpg`;
        const ref = this.storage.ref(filePath);
       
        ref.getDownloadURL().subscribe(url=>{

          if(url){
              //console.log(url);
             
              //write the url to collections
              for(var i=0;i<this.DisplyCollections.length;i++){
                if(this.DisplyCollections[i].cardId==element.cardId){
                  this.DisplyCollections[i].cardImgUrl=url
                }
              }
          }

        })  

      }

      if(index==(this.allcards.length-1)){
        this.cardCollections=new Array<cardInfoSssL>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

    });
  }

  trendSearch(){
    //get trend list
    let dataPath=`trendList/${this.afAuth.auth.currentUser.uid}`

    this.db.object(dataPath).query.once("value")
    .then(data=>{
      var obj=data.val()
      this.trendList=obj
      
    })
    .then(_=>{

      this.DisplyCollections=new Array<cardInfoSssL>()

      this.trendList.forEach(e => {
        
        this.allcards.forEach((element,index,array) => {
  
          // console.log(element.cardName)
      
            if(element.cardId.toLowerCase().includes(e)){
      
              this.DisplyCollections.push(
                element
              )
      
              const filePath = `/cardSource/${element.cardId}.jpg`;
              const ref = this.storage.ref(filePath);
             
              ref.getDownloadURL().subscribe(url=>{
      
                if(url){
                    //console.log(url);
                   
                    //write the url to collections
                    for(var i=0;i<this.DisplyCollections.length;i++){
                      if(this.DisplyCollections[i].cardId==element.cardId){
                        this.DisplyCollections[i].cardImgUrl=url
                      }
                    }
                }
      
              })  
      
            }
      
            if(index==(this.allcards.length-1)){
              this.cardCollections=new Array<cardInfoSssL>()
              this.cardCollections=this.DisplyCollections
              this.paging()
            }
      
          });

      });

      

    })


  }

  addErrP;
  addErrC;

  //add card to market function 
  addToYourMarket(res,num){
    console.log(res+": "+num+" has added to market place")

    let cardObj= JSON.parse(localStorage.getItem(res))
  
    console.log(cardObj['list'])

    cardObj['list']=true

    localStorage.setItem(res,JSON.stringify(cardObj))

    //add cards info in to database called market sort by userid
    //creating this database is easy for user to search and sort their personal database
    let dataPath=`marketU/${this.afAuth.auth.currentUser.uid}/${res}`

    //add cards info in to market db sort by cardid
    //database is for publich to searching card by id or name
    let dataPathC=`marketC/${res}/${this.afAuth.auth.currentUser.uid}`

    //need a update in the personal card database
    let dataPathO=`collections/${this.afAuth.auth.currentUser.uid}/${res}`

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
      list:true
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


     //constructe a model of card in market sort by user 
     let cardData={
      cardId:res,
      cardName:cardObj['cardName'],
      cardAmount:num ,
      date:time
    }

    this.db.object(dataPathC).update(cardData)
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

    this.db.object(dataPath).update(cardData)
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

    //if it's ready in market database mark as display

  }

  //this function add all cards more than a play set in to database one by one
  addAllToYourMarket(){

    //if it's ready in market database mark as display
    
    //gets the array of 3+ cards
    //we are using allcards as a stable source of cards infomation
    this.allcards.forEach((element,index,array) => {
      
      let cardObj= JSON.parse(localStorage.getItem(element.cardId))
  
      cardObj['list']=true
  
      localStorage.setItem(element.cardId,JSON.stringify(cardObj))

//add cards info in to database called market sort by userid
    //creating this database is easy for user to search and sort their personal database
    let dataPath=`marketU/${this.afAuth.auth.currentUser.uid}/${element.cardId}`

    //add cards info in to market db sort by cardid
    //database is for publich to searching card by id or name
    let dataPathC=`marketC/${element.cardId}/${this.afAuth.auth.currentUser.uid}`

      //need a update in the personal card database
      let dataPathO=`collections/${this.afAuth.auth.currentUser.uid}/${element.cardId}`

     //constructe a model of card in market sort by user 

     var cardcount=(element.cardAmount-3)

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
  list:true
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


     let cardData={
      cardId:element.cardId,
      cardName:element.cardName,
      cardAmount: cardcount,
      date:time
    }

    this.db.object(dataPathC).update(cardData)
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

    this.db.object(dataPath).update(cardData)
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
    )

  }

  openDialog(img,id,number,price,desc,list): void {
    
    this.diaAddId=id
    this.MarketNumber=number-3

    console.log(list)

    const dialogRef = this.dialog.open(dialogZoom, {
      width: '500px',
      data: {
        diaId: id, 
        diaImg: img,
        diaNumber:number,
        diaPrice:price,
        diaDesc:desc,
        diaAddId:this.diaAddId,
        list:list
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      this.diaAddId = result;

      //add cards to market place ⤴
      if(result){
        console.log('add to market place '+this.MarketNumber)
        this.addToYourMarket(result,this.MarketNumber)
        }

    });
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

  this.DisplyCollections=new Array<cardInfoSssL>()
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
    this.DisplyCollections=new Array<cardInfoSssL>()

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

  // sortPrice(price){
  //   let sym=this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`)
  //   this.cardCollections=new Array<cardInfo>()

  //   sym.query.once('value')
  //     .then(datas=>{
  //       datas.forEach(data=>{
                
  //               let obj=data.val()
  //               if(obj['cardPrice']>=price){
 
  //                 //get img from storage
  //                 // const ref = this.storage.ref(`cardSource/${data.key}.jpg`);
  //                 // this.cardImgUrl = ref.getDownloadURL();

  //                 this.cardCollections.push(new cardInfo(data.key,obj['cardAmount'],obj['cardImg'],obj['cardPrice'])) 
  //               }       
  //       })
  //     }).then(_=>{
  //       // this.truckerjobcount=this.contractorsWithJobBlock.length
  //       // this.contractorsWithJobBlock.reverse();
  //     })
  // }

  MoreThanThree(){
    this.cardV=0
    // let date=new Date()
    // let year=date.getFullYear()
    // let month=date.getUTCMonth()+1
    let sym=this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`)
    

    this.cardCollections=new Array<cardInfoSssL>()
    this.allcards=new Array<cardInfoSss>()

    sym.query.once('value')
      .then(datas=>{

        localStorage.clear()

        datas.forEach(data=>{
                
                let obj=data.val()
                if(obj['cardAmount']>3){

                  //get img from storage
                  // const ref = this.storage.ref(`cardSource/${data.key}.jpg`);
                  // this.cardImgUrl = ref.getDownloadURL();

                  localStorage.setItem(data.key,JSON.stringify(obj))


                  this.cardCollections.push(
                    new cardInfoSssL(
                      data.key,
                      obj['cardAmount']-3,
                      data.key,
                      obj['cardPrice'],
                      obj['cardName'],
                      obj['cardType'],
                      obj['cardAttribute'],
                      obj['cardRace'],
                      obj['cardDesc'],
                      obj['list']
                      )
                      ) 

                  this.allcards.push(
                    new cardInfoSssL(
                    data.key,
                    obj['cardAmount']-3,
                    data.key,
                    obj['cardPrice'],
                    obj['cardName'],
                    obj['cardType'],
                    obj['cardAttribute'],
                    obj['cardRace'],
                    obj['cardDesc'],
                    obj['list']
                    ))

                  this.cardV=this.cardV+(obj['cardAmount']-3)*obj['cardPrice']

                }       
        })
      }).then(_=>{

        this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
        // this.truckerjobcount=this.contractorsWithJobBlock.length
        // this.contractorsWithJobBlock.reverse();
        this.pagenumber=1
        this.paging()
      })

  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(localStorage.length>100){
        console.log(localStorage.length)

        this.cardCollections=new Array<cardInfoSssL>()
        this.allcards=new Array<cardInfoSssL>()
        this.cardV=0
        var count=0

        for(var i=0;i<localStorage.length;i++){
            count++
          if(parseInt(localStorage.key(i))){
            let cardObj
            = JSON.parse(localStorage.getItem(localStorage.key(i)))
            if(cardObj['cardAmount']>3){
              var carId=cardObj['cardId']
            
              var carAmount=cardObj['cardAmount']
              var carImg=carId
              var carPrice=cardObj['cardPrice']
              var carName=cardObj['cardName']
  
              this.cardV=this.cardV+(carPrice*(carAmount-3))

              // console.log("jsonobject in localstorage"+cardObj['cardId'])
              this.cardCollections.push(
                new cardInfoSssL(
                  carId,
                  carAmount,
                  carImg,
                  carPrice,
                  carName,
                  cardObj['cardType'],
                  cardObj['cardAttribute'],
                  cardObj['cardRace'],
                  cardObj['cardDesc'],
                  cardObj['list']
                )
              )
             
              this.allcards.push(
                new cardInfoSssL(
                  carId,
                  carAmount,
                  carImg,
                  carPrice,
                  carName,
                  cardObj['cardType'],
                  cardObj['cardAttribute'],
                  cardObj['cardRace'],
                  cardObj['cardDesc'],
                  cardObj['list']
                )
              )
            }
           
          }
            
          }

          if(count==localStorage.length){
            console.log("data pushed start to sort")
            this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
            this.pagenumber=1
            // this.truckerjobcount=this.contractorsWithJobBlock.length
            // this.contractorsWithJobBlock.reverse();
            this.cardV=Math.round(this.cardV)
            this.paging()
          }
        
      }else{
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
  list:string;
}

@Component({
  selector: 'dialog-zoom',
  templateUrl: 'dialog-zoom.html',
})
export class dialogZoom {

  constructor(
    public dialogRef: MatDialogRef<dialogZoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    addMarket(): void{
      this.data.diaAddId=this.data.diaId
      //console.log(this.data.diaAddId)
      // this.dialogRef.close();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}