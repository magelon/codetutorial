import { Component, OnInit, Inject } from '@angular/core';
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
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { cardInfoS,cardInfoSss } from '../dataModel/cardInfoS';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.css']
})
export class DeckBuilderComponent implements OnInit {

cardId
myControl = new FormControl();
options:string[]=[''];
filteredOptions: Observable<string[]>;

Cardpreview
cardPrice
cardName

cardNeeded
cardEnough
cardMissing
currentNumberOfCards

deckName
//two way data binding for search card name
searchName

//variable pass between dialog
diaAddId

//for delete in deck 
diaIdD

//card object add to deck
cardTmp:cardInfoSss

//collection for display
DisplyCollections:Array<any>

cardCollections:Array<cardInfoSss>

deckCollection:Array<cardInfoSss>

rootCollection:Array<cardInfoSss>

extraCollections
mainCollections

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    public dialog: MatDialog
  ) { }

  private _filter(value: string): string[] {
    const filterValue = value//.toLowerCase();
    return this.options.filter(option => option.includes(filterValue));
  }

searchByName(name){
  this.pagenumber=1
  this.DisplyCollections=new Array<any>()

  this.cardCollections=this.rootCollection

  this.cardCollections.forEach((element,index,array) => {

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

      if(index==(this.cardCollections.length-1)){
        this.cardCollections=new Array<cardInfoSss>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

    });

}

cardsSize
pagings
pageArr
pagenumber

paging(){
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

changingPage(pageNum){

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
  // preview(){
  //   this.cardEnough=false
  //   if(this.cardId!=null){
      
  //     this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`).query.once("value")
  //     .then(data=>{
        
  //       var obj=data.val()
                             
  //         if(!obj['cardAmount']){
  //           //dont have this card in collection
  //           const ref = this.storage.ref(`cardSource/${this.cardId}.jpg`);
  //           this.Cardpreview = ref.getDownloadURL();
  //           this.currentNumberOfCards=0

  //         }else{

  //           this.Cardpreview=obj['cardImg']   

  //           this.cardPrice=obj['cardPrice']

  //           this.cardName=obj['cardName']

  //           if((obj['cardAmount']-this.cardNeeded)>=0){
  //             //enough
  //             this.cardEnough=true
  //           }else{
  //             this.cardMissing=obj['cardAmount']-this.cardNeeded
  //           }

  //            this.currentNumberOfCards=obj['cardAmount']  
  //         }
  //     })

  //     // const ref = this.storage.ref(`cardSource/${this.cardId}.jpg`);
  //     // this.profileUrl = ref.getDownloadURL();
  
  //   }
  // }

addToDeck(card){
  // var count=0
  this.DisplyCollections.forEach((e,index,array)=>{
    // count++
  if(e.cardId==card){

console.log(e.cardType)

    this.cardTmp=new cardInfoSss(
      e.cardId,
      1,
      e.cardImgUrl,
      e.cardPrice,
      e.cardName,
      e.cardType,
      e.cardAttribute,
      e.cardRace,
      e.cardDesc
      )
    
    this.deckCollection.push(this.cardTmp)

    //extra
    if(
      String(e.cardType).toLowerCase().includes("link")||
     
      String(e.cardType).toLowerCase().includes("fusion")||
      String(e.cardType).toLowerCase().includes("synchro")||
      String(e.cardType).toLowerCase().includes("xyz")
      ){
        this.extraCollections.push(this.cardTmp)
        this.extraCollections.sort((a, b) => (Math.round(parseInt(a.cardId)) > Math.round(parseInt(b.cardId))) ? -1 : 1)

      }
      else{
        //main
        this.mainCollections.push(this.cardTmp)
        this.mainCollections.sort((a, b) => (Math.round(parseInt(a.cardId)) > Math.round(parseInt(b.cardId))) ? -1 : 1)

      }

    // var countt=0
    // this.deckCollection.forEach((ee,i,a)=>{
    //    countt++
    //   if(ee.cardId==this.cardTmp.cardId){
    //     var amount=this.deckCollection[i].cardAmount
    //     amount++
    //     this.deckCollection[i].cardAmount=amount
    //   }
    //   else{
    //     if(countt===a.length){
    //       this.deckCollection.push(this.cardTmp)
    //     }
    //   } 
        
    //   // if(count===a.length){
    //   //   if(e.cardId==this.cardTmp.cardId){
    //   //     var amount=this.deckCollection[i].cardAmount
    //   //     amount++
    //   //     this.deckCollection[i].cardAmount=amount
    //   //   }else{
    //   //     this.deckCollection.push(this.cardTmp)
    //   //   }

    //   // }

    // })

  }

  // if(count===array.length){

  //   var count=0
  //   this.deckCollection.forEach((e,i,a)=>{
  //     count++
  //     if(e.cardId==this.cardTmp.cardId){
  //       var amount=this.deckCollection[i].cardAmount
  //       amount++
  //       this.deckCollection[i].cardAmount=amount
  //     }

  //     if(count===a.length){
  //       if(e.cardId==this.cardTmp.cardId){
  //         var amount=this.deckCollection[i].cardAmount
  //         amount++
  //         this.deckCollection[i].cardAmount=amount
  //       }else{
  //         this.deckCollection.push(this.cardTmp)
  //       }

  //     }

  //   })
    
    
  // }
  
})
this.deckCollection.sort((a, b) => (Math.round(parseInt(a.cardId)) > Math.round(parseInt(b.cardId))) ? -1 : 1)

}

deleteFromDeck(card){
  //card id for deleting
  var IdD=String(card).slice(0,-6)
  //console.log("deleting"+IdD+"...")
  var BreakException={}
  //searching from deck and delete

  try{

this.mainCollections.forEach((me,mi,ma)=>{
  if(me.cardId==IdD){
    this.mainCollections.splice(this.mainCollections.indexOf(me),1)

    this.deckCollection.forEach((e,i,a)=>{
      if(e.cardId==IdD){
        //this.deckCollection[i].cardAmount--
        // if(this.deckCollection[i].cardAmount==0){
           this.deckCollection.splice(this.deckCollection.indexOf(e), 1)
           throw BreakException;
        // }
        
      }
  
    })

  }
})

this.extraCollections.forEach((ee,ei,ea)=>{
  if(ee.cardId==IdD){
    this.extraCollections.splice(this.extraCollections.indexOf(ee),1)

    this.deckCollection.forEach((e,i,a)=>{
      if(e.cardId==IdD){
        //this.deckCollection[i].cardAmount--
        // if(this.deckCollection[i].cardAmount==0){
           this.deckCollection.splice(this.deckCollection.indexOf(e), 1)
           throw BreakException;
        // }
        
      }
  
    })

  }
})

    // this.deckCollection.forEach((e,i,a)=>{
    //   if(e.cardId==IdD){
    //     //this.deckCollection[i].cardAmount--
    //     // if(this.deckCollection[i].cardAmount==0){
    //        this.deckCollection.splice(this.deckCollection.indexOf(e), 1)
    //        throw BreakException;
    //     // }
        
    //   }
  
    // })

  }
  catch(err){
    console.log(err)
  }

}

openDialog(img,id,number,price,desc): void {

  this.diaAddId=id
  this.diaIdD=id+"delete"

  const dialogRef = this.dialog.open(dialogBuilder, {
    width: '500px',
    data: {
      diaId: id,
       diaImg: img,
       diaNumber:number,
       diaPrice:price,
       diaAddId:this.diaAddId,
       diaIdD:this.diaIdD,
       diaDesc:desc
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed'+result);

    this.diaAddId = result;
    this.diaIdD=result;

    if(result&&result.includes("delete")){
      console.log('delete')
      this.deleteFromDeck(result)
      }else{
        if(result&&!result.includes("delete")){
          console.log('add')
          if(this.deckCollection!=null){
    
            this.addToDeck(result)
    
          }else{
            this.deckCollection=new Array<cardInfoSss>()
            this.addToDeck(result)
           
          }
    
         console.log(this.deckCollection)
    
    
        }else{
          console.log("not add")
        }
      }

    

  })
}

clearDeck(){
  this.deckCollection=new Array<cardInfoSss>()
  this.mainCollections=new Array<any>()
  this.extraCollections=new Array<any>()
}

deckCardId
deckCardCount

saveDeck(){
  if(this.deckName!=null){
    let dataPath=`decks/${this.afAuth.auth.currentUser.uid}/${this.deckName}`

    this.db.object(dataPath).remove()
    .then(_=>{
      this.db.object(dataPath).update(this.deckCollection)
    })
    
    // let deckCard={

    // }

    // this.deckCollection.forEach(e=>{

    // })

  }
}

loadDeck(){

  this.deckCollection=new Array<cardInfoSss>()

  this.extraCollections=new Array<cardInfoSss>()

  this.mainCollections=new Array<cardInfoSss>()

  if(this.deckName!=null){
    let dataPath=`decks/${this.afAuth.auth.currentUser.uid}/${this.deckName}`

    this.db.object(dataPath)
    .query
    .once("value")
    .then(data=>{
      data.forEach(e=>{
        var obj=e.val()
        //1 from database 2 from local storage

        this.db.object(`carddb/${obj['cardId']}`)
        .query
        .once("value")
        .then(datav=>{
          var objv=datav.val()

          if(
            String(objv['type']).toLowerCase().includes("link")||
         
            String(objv['type']).toLowerCase().includes("fusion")||
            String(objv['type']).toLowerCase().includes("synchro")||
            String(objv['type']).toLowerCase().includes("xyz")
            ){
              this.extraCollections.push(
                new cardInfoSss(
                  objv['id'],
                  obj['cardAmount'],
                  obj['cardImgUrl'],
                  obj['cardPrice'],
                  objv['name'],
                  objv['type']?objv['type']:'',
                  objv['attribute']?objv['attribute']:'',
                  objv['race']?objv['race']:'',
                  objv['desc']?objv['desc']:''
                )
              )
            }
            else{
              this.mainCollections.push(
                new cardInfoSss(
                  objv['id'],
                  obj['cardAmount'],
                  obj['cardImgUrl'],
                  obj['cardPrice'],
                  objv['name'],
                  objv['type']?objv['type']:'',
                  objv['attribute']?objv['attribute']:'',
                  objv['race']?objv['race']:'',
                  objv['desc']?objv['desc']:''
                )
              )
            }
          
          this.deckCollection.push(
            new cardInfoSss(
              objv['id'],
              obj['cardAmount'],
              obj['cardImgUrl'],
              obj['cardPrice'],
              objv['name'],
              objv['type']?objv['type']:'',
              objv['attribute']?objv['attribute']:'',
              objv['race']?objv['race']:'',
              objv['desc']?objv['desc']:''
            )
          )
        })

        
      })
    })

    // let deckCard={

    // }

    // this.deckCollection.forEach(e=>{

    // })

  }
}

  ngOnInit() {
   
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        this.deckCollection=new Array<cardInfoSss>()

        this.extraCollections=new Array<cardInfoSss>()

        this.mainCollections=new Array<cardInfoSss>()

        //localstorage
        if(localStorage.length>100){
          console.log(localStorage.length)
          
          this.cardCollections=new Array<cardInfoSss>()
        

          for(var i=0;i<localStorage.length;i++){
              
            if(parseInt(localStorage.key(i))){
              let cardObj
              = JSON.parse(localStorage.getItem(localStorage.key(i)))

              var carId=cardObj['cardId']
              
              var carAmount=cardObj['cardAmount']
              var carImg=carId
              var carPrice=cardObj['cardPrice']
              var carName=cardObj['cardName']
              var carType=cardObj['cardType']?cardObj['cardType']:" "
              var cardAttr=cardObj['cardAttribute']?cardObj['cardAttribute']:" "
              var cardRac=cardObj['cardRace']?cardObj['cardRace']:" "
              

              this.cardCollections.push(
                
                new cardInfoSss(
                  carId,
                  carAmount,
                  carImg,
                  carPrice,
                  carName,
                  carType,
                  cardAttr,
                  cardRac,
                  cardObj['cardDesc']
                )
              )
                
            }

            if(i==(localStorage.length-1)){
              this.rootCollection=new Array<cardInfoSss>()
              this.rootCollection=this.cardCollections
            }
              
            }

        }else{

        localStorage.clear()

        this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`).query.once("value")
        .then(data=>{
          data.forEach(e=>{

              var obj=e.val()

              if(obj['cardName']){
                
              localStorage.setItem(obj['cardId'],JSON.stringify(obj))

              this.cardCollections
              .push(
                new cardInfoSss(
                  obj['cardId'],
                  obj['cardAmount'],
                  obj['cardId'],
                  obj['cardPrice'],
                  obj['cardName'],
                  obj['cardType'],
                  obj['cardAttribute'],
                  obj['cardRace'],
                  obj['cardDesc']
                  )
                )
  
              // this.options
              // .push(obj['cardName'].toLowerCase())
              // .push(e.key)

              }

              this.rootCollection=new Array<cardInfoSss>()
              this.rootCollection=this.cardCollections
            
          })
        })
      }
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    
      }
    })

  }

 

}

export interface DialogData {
  diaId: string;
  diaImg: string;
  diaNumber: string;
  diaPrice: string;
  diaAddId: string;
  diaIdD:string;
  diaDesc:string;
}

@Component({
  selector: 'dialog-builder',
  templateUrl: 'dialog-builder.html',
})
export class dialogBuilder {

  constructor(
    public dialogRef: MatDialogRef<dialogBuilder>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
 
  add(): void{
    this.data.diaAddId=this.data.diaId
    //console.log(this.data.diaAddId)
    // this.dialogRef.close();
  }

  delete():void{
    this.data.diaIdD=this.data.diaId+"delete"
  }

}