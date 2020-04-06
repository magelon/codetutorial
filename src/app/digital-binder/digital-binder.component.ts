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
import{cardInfoS,cardInfoSs,cardInfoSss} from '../dataModel/cardInfoS';

import { stringify } from 'querystring';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

declare var Plotly: any;

@Component({
  selector: 'app-digital-binder',
  templateUrl: './digital-binder.component.html',
  styleUrls: ['./digital-binder.component.css']
})
export class DigitalBinderComponent implements OnInit {

  cardCollections:any

  cardSet:any

  allcards:Array<cardInfoS>

  //all cards type
  allcardsT

  //collection for display
  DisplyCollections:Array<any>

  cardPrice;

  pagenumber
  // cardImgUrl: Observable<string | null>;

  //paging variables
  //totall number of cards array size
  cardsSize
  //pagings we need
  pagings

  //pages array
  pageArr:Array<any>

  networth

  //card tempelary img
  ci

  id

  cardSearchNam

  cardSearchTyp

  cardSearchAttr

  cardSearchRace

  PIE:any

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
    this.DisplyCollections=new Array<cardInfoSss>()
    this.allcards.forEach((element,index,array) => {
      
    //console.log("index "+index)
//&&this.DisplyCollections.length<=20
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
                  //this.pagingSearch()
                }
              }
          }

        })  

      }

      if(index==(this.allcards.length-1)){
        this.cardCollections=new Array<cardInfoSss>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

    })

    


  }

  typeSearch(name){
    this.DisplyCollections=new Array<cardInfoSss>()
    this.allcardsT.forEach((element,index,array) => {
      
    //console.log("index "+index)
//&&this.DisplyCollections.length<=20
      if(element.cardType.toLowerCase().includes(name.toLowerCase())){

        this.DisplyCollections.push(

          new cardInfoSss(
            element.cardId,
            element.cardAmount,
            element.cardImgUrl,
            element.cardPrice,
            element.cardName,
            element.cardType,
            element.cardAttribute,
            element.cardRace,
            element.cardDesc
            )
          
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
                  //this.pagingSearch()
                }
              }
          }

        })  

      }

      if(index==(this.allcardsT.length-1)){
        this.cardCollections=new Array<cardInfoSss>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

    })

    


  }

  attrSearch(name){
    this.DisplyCollections=new Array<cardInfoSss>()
    this.allcardsT.forEach((element,index,array) => {
      
    //console.log("index "+index)
//&&this.DisplyCollections.length<=20
      if(element.cardAttribute.toLowerCase().includes(name.toLowerCase())){

        this.DisplyCollections.push(

          new cardInfoSss(
            element.cardId,
            element.cardAmount,
            element.cardImgUrl,
            element.cardPrice,
            element.cardName,
            element.cardType,
            element.cardAttribute,
            element.cardRace,
            element.cardDesc
            )
          
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
                  //this.pagingSearch()
                }
              }
          }

        })  

      }

      if(index==(this.allcardsT.length-1)){
        this.cardCollections=new Array<cardInfoS>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

    })

    


  }

  raceSearch(name){
    this.DisplyCollections=new Array<cardInfoSss>()
    this.allcardsT.forEach((element,index,array) => {
      
    //console.log("index "+index)
//&&this.DisplyCollections.length<=20
      if(element.cardRace.toLowerCase().includes(name.toLowerCase())){

        this.DisplyCollections.push(

          new cardInfoSss(
            element.cardId,
            element.cardAmount,
            element.cardImgUrl,
            element.cardPrice,
            element.cardName,
            element.cardType,
            element.cardAttribute,
            element.cardRace,
            element.cardDesc
            )
          
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
                  //this.pagingSearch()
                }
              }
          }

        })  

      }

      if(index==(this.allcardsT.length-1)){
        this.cardCollections=new Array<cardInfoSss>()
        this.cardCollections=this.DisplyCollections
        this.paging()
      }

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
 //populate the collections with first 9
 for(var i=0;i<9;i++){
   this.DisplyCollections[i]=this.cardCollections[i]
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

  }

  openDialog(img,id,number,price,desc): void {
    const dialogRef = this.dialog.open(dialogBZoom, {
      width: '500px',
      data: {diaId: id, diaImg: img,diaNumber:number,diaPrice:price,diaDesc:desc}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  changingPage(pageNum){

    this.pagenumber=pageNum
    //console.log(pageNum)
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

  //was used in cards for sell modified for serve all cards collected
  MoreThanThree(){
    this.networth=0
    // let date=new Date()
    // let year=date.getFullYear()
    // let month=date.getUTCMonth()+1
    let sym=this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`)
    this.cardCollections=new Array<cardInfoSss>()

    this.allcards=new Array<cardInfoSss>()

    this.allcardsT=new Array<cardInfoSs>()

    this.cardSet=new Map<any,any>()
    var cardSets=new Array<any>() 

    sym.query.once('value')
      .then(datas=>{

        localStorage.clear()

      console.log(datas.numChildren())

      var count=0

        datas.forEach(data=>{
                
        count++
          // console.log(count)
                let obj=data.val()
                 if(obj['cardAmount']>0){

                  this.networth=this.networth+(obj['cardPrice']*obj['cardAmount'])
                  //get img from storage
                  // const ref = this.storage.ref(`cardSource/${data.key}.jpg`);
                  // this.cardImgUrl = ref.getDownloadURL();

                  this.id= parseInt(data.key)

                  this.cardCollections.push(
                    new cardInfoSss(
                    this.id,
                    obj['cardAmount'],
                    this.id,
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
                    this.id,
                    obj['cardAmount'],
                    this.id,
                    obj['cardPrice'],
                    obj['cardName'],
                    obj['cardType'],
                    obj['cardAttribute'],
                    obj['cardRace'],
                    obj['cardDesc']
                    )
                  )

                  this.allcardsT.push(
                    new cardInfoSss(
                    this.id,
                    obj['cardAmount'],
                    this.id,
                    obj['cardPrice'],
                    obj['cardName'],
                    obj['cardType'],
                    obj['cardAttribute'],
                    obj['cardRace'],
                    obj['cardDesc']
                    )
                    )

                  localStorage.setItem(this.id,JSON.stringify(obj))

                  cardSets.push(obj['cardSet'])

                  cardSets.forEach((e,index,array)=>{
                    if(e.forEach){
                      
                      e.forEach(ee=>{
                        if(!this.cardSet.has(ee.set_name)){
                          this.cardSet.set(ee.set_name,1)
                        }else{
                          this.cardSet.set(ee.set_name,this.cardSet.get(ee.set_name)+1)
                        }
                        
                      })
                    }
      
                  })
                  // const filePath = `/cardSource/${this.id}.jpg`;
                  // const ref = this.storage.ref(filePath);
                 
                  // ref.getDownloadURL().subscribe(url=>{

                  //   if(url){
                  //       // console.log(url);
                  //       this.ci =url
                  //       //write the url to collections
                  //       this.cardCollections.push(new cardInfo(data.key,obj['cardAmount'],this.ci,obj['cardPrice'])) 
                        

                  //       if(count==datas.numChildren()){
                  //         this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
                  //         this.pagenumber=1
                  //         // this.truckerjobcount=this.contractorsWithJobBlock.length
                  //         // this.contractorsWithJobBlock.reverse();
                  //         this.networth=Math.round(this.networth)
                  //         this.paging()
                  //        }
                  //   }
                  // })
                 }       
          }
        )

      }).then(_=>{

//print all cardsets possible with card collections
console.log(this.cardSet)
// var setV=new Array<any>()
// var setL=new Array<any>()
// var count=0
// this.cardSet.forEach((value,key,map)=>{
//   count++
//   setV.push(value)
//   setL.push(key)

//   if(count==this.cardSet.size){

//     var data = [{
//       values: setV.slice(0,20),
//       labels: setL.slice(0,20),
//       type: 'pie'
//     }];
    
//     var layout = {
//       height: 200,
//       width: 250
//     };
    
//     Plotly.newPlot('pie', data);

//   }

// })



        this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
        this.pagenumber=1
        // this.truckerjobcount=this.contractorsWithJobBlock.length
        // this.contractorsWithJobBlock.reverse();
        this.networth=Math.round(this.networth)
        this.paging()

        // console.log(this.allcards)

      })

  }

  ngOnInit() {

    this.PIE=document.getElementById('pie')

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        
        if(localStorage.length>100){
          console.log(localStorage.length)
          
          this.cardCollections=new Array<cardInfoSss>()
          this.allcards=new Array<cardInfoSss>()

          this.allcardsT=new Array<cardInfoSss>()

          this.networth=0
          var count=0
 
          this.cardSet=new Map<any,any>()
          var cardSets=new Array<any>() 

          for(var i=0;i<localStorage.length;i++){
              count++
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
              
              cardSets.push(cardObj['cardSet'])

              cardSets.forEach((e,index,array)=>{
                if(e.forEach){
                  
                  e.forEach(ee=>{
                    if(!this.cardSet.has(ee.set_name)){
                      this.cardSet.set(ee.set_name,1)
                    }else{
                      this.cardSet.set(ee.set_name,this.cardSet.get(ee.set_name)+1)
                    }
                    
                  })
                }
  
              })

              this.networth=this.networth+(carPrice*carAmount)
              // console.log("jsonobject in localstorage"+cardObj['cardId'])
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
             
              this.allcards.push(
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

              this.allcardsT.push(
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
              
            }

            if(count==localStorage.length){
              //print all cardsets possible with card collections
              console.log(this.cardSet)
              
              // var setV=new Array<any>()
              // var setL=new Array<any>()
              // var count=0
              // this.cardSet.forEach((value,key,map)=>{
              //   count++
              //   setV.push(value)
              //   setL.push(key)
              
              //   if(count==this.cardSet.size){
              
              //     var data = [{
              //       values: setV.slice(0.20),
              //       labels: setL.slice(0,20),
              //       type: 'pie'
              //     }];
                  
              //     var layout = {
              //       height: 200,
              //       width: 250
              //     };
                  
              //     Plotly.newPlot('pie', data);
              
              //   }
              
              // })

              console.log("data pushed start to sort")
              this.cardCollections.sort((a, b) => (Math.round(parseInt(a.cardPrice)) > Math.round(parseInt(b.cardPrice))) ? -1 : 1)
              this.pagenumber=1
              // this.truckerjobcount=this.contractorsWithJobBlock.length
              // this.contractorsWithJobBlock.reverse();
              this.networth=Math.round(this.networth)
              this.paging()
            }
          
        }else{
          this.MoreThanThree()
        }
       
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
}

@Component({
  selector: 'dialog-b-zoom',
  templateUrl: 'dialog-b-zoom.html',
})
export class dialogBZoom {

  constructor(
    public dialogRef: MatDialogRef<dialogBZoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}