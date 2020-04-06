import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

declare var Plotly: any;

@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.component.html',
  styleUrls: ['./addcard.component.css']
})
export class AddcardComponent implements OnInit {

  @ViewChild("tester", { static: true })
  private tester: ElementRef; 

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  public behavior:BehaviorSubject<string>;

  public cardSet:Array<any>
  public cardSetNames:Array<any>

  public cardId;
  public cardName;
  
  public cardAttribute;
  public cardType;
  public cardRace;
  public cardAtk;
  public cardDef;
  public cardLevel;
   

  public cardPrice;
  public cardImgUrl;

  public Cardpreview;

  public updateSuccess;

  infoupdateSuccess

  public currentNumberOfCards;

  //card img for preview
  public cardImgPre

  profileUrl: Observable<string | null>;

  //error when update card
  public addErr;

  historyEr

  public cardDesc

  previewButton

  addButton

  oldPrice

  Root_url="https://db.ygoprodeck.com/api/v5/cardinfo.php?name="

  //authority to upload img
  uploadAu

  myControl = new FormControl();
  options:string[]=[''];
  
  NameOptions:string[]=[''];

  filteredOptions: Observable<string[]>;

  //requesting card id
  rci:any

  bar

  barPercent

  optionsPrice:string[]=['']

  TESTER:any

  setNumberArray:any

  gainValue

  loseValue
  
  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) { }


  getRequest(){

    this.http.get<any>(this.Root_url+this.rci).toPromise().then(data=>
      {
        console.log(data[0])
        //console.log(data[0].banlist_info)
        this.cardPrice=data[0].card_prices.tcgplayer_price
        //changed cardid to number
        this.cardId=data[0].id
        this.cardName=data[0].name

        this.cardAttribute=data[0].attribute
        this.cardType=data[0].type
        this.cardRace=data[0].race
        this.cardAtk=data[0].atk
        this.cardDef=data[0].def
        this.cardLevel=data[0].level

        this.cardSet=new Array<any>()
        this.cardSet=data[0].card_sets

        var itemsProcessed=0
        this.cardSetNames=new Array<any>()
        this.cardSet.forEach(
          (item,index,array)=>{
            this.cardSetNames.push(item.set_name)

            if(!this.setNumberArray[index]){
              this.setNumberArray[index]=0
            }

            itemsProcessed++;
            if(itemsProcessed===array.length){
              console.log(this.cardSetNames)
            }
          }
       )
       
        this.cardDesc=data[0].desc

        //if its a link monster it also has linkmarks as an array

      }).catch(err=>{
        console.log(err);
      })
      // .then(_=>{
      //   this.updateCInfo()
      // })
}



//just for developement
updateAllPrice(){
this.gainValue=new Array<any>()
// this.NameOptions.forEach(e=>{
//   console.log('cardName: '+e)
// })

this.optionsPrice.forEach((e,index,collections)=>{
  
//update 3 seconds pre request
//other wise yugiohprodeck will ban you 😂
setTimeout(_=>{

  if(parseInt(e)&&(parseInt(e)>100)){
    var tmpId=e
    
    console.log("updating price:"+e)
    
    var tmpPrice=0
    // this.getRequest()
  
    this.http.get<any>(this.Root_url+tmpId)
    .toPromise()
    .then(data=>
      {
        tmpPrice=data[0].card_prices.tcgplayer_price?data[0].card_prices.tcgplayer_price:0
        this.cardPrice=data[0].card_prices.tcgplayer_price?data[0].card_prices.tcgplayer_price:" "
        this.cardName=data[0].name?data[0].name:" "
        this.cardAttribute=data[0].attribute?data[0].attribute:" "
        this.cardType=data[0].type?data[0].type:" "
        this.cardRace=data[0].race?data[0].race:" "
        this.cardAtk=data[0].atk?data[0].atk:" "
        this.cardDef=data[0].def?data[0].def:" "
        this.cardLevel=data[0].level?data[0].level:" "
        this.cardDesc=data[0].desc?data[0].desc:" "
  
        this.cardSet=new Array<any>()
        this.cardSet=data[0].card_sets?data[0].card_sets:" "
  
        var itemsProcessed=0
        this.cardSetNames=new Array<any>()
        this.cardSet.forEach(
          (item,indexx,array)=>{
            this.cardSetNames.push(item.set_name)
            itemsProcessed++;
            if(itemsProcessed===array.length){
              console.log(this.cardSetNames)
            }
          }
         )
        }
        ).then(_=>{
        this.updatePrice(tmpId,tmpPrice)

//end loop update card id array which changes price today
if(index==(this.optionsPrice.length-1)){
  let dataPath=`trendList/${this.afAuth.auth.currentUser.uid}`
  var err

  this.db.object(dataPath)
  .remove()
  .then(_=>{

    this.db.object(dataPath)
    .update(this.gainValue)
    .catch(e=>{
      err=e
    }).then(_=>{
      if(err){
        console.log('error '+err)
      }else{
        console.log('trendList updated!')
      }
    })

  })

  
}

        })
        }
      },index*1000
    )

  }
  
  );
}

updateAllAnimation(){

  this.updateAllPrice()

  this.bar=0
  this.barPercent=0
  this.optionsPrice.forEach((e,index,collections)=>{
    //update 3 seconds pre request
    //other wise yugiohprodeck will ban you 😂
    setTimeout(_=>{
      this.bar++
      console.log(this.bar)
      this.barPercent=((this.bar/this.optionsPrice.length)*100).toFixed(2)
      },index*1000)
    }
  )
}

updatePrice(tmp,cardP){
  let now=new Date()
  let year=now.getFullYear()
  
  let month=now.getMonth().toString()
  if(now.getMonth()<10){
    month='0'+month
  }
  
  let date=now.getDate().toString()
  if(now.getDate()<10){
    date='0'+date
  }

  let time=now.getFullYear()+""+month+""+date

  let cardData={
  
    cardPrice:cardP?cardP:" ",
    
  }

  if(tmp&&cardP){

    var oldP

    let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${tmp}`

//get current price and compare
this.db.object(dataPath).query.once("value")
.then(data=>{
  var obj=data.val()
  oldP=obj['cardPrice']

  if(cardP>oldP){
    this.gainValue.push(tmp)
    console.log("card gained value")
  }

  
}).then(_=>{
  //update card price 
  this.db.object(dataPath)
  .update(cardData)
  .catch(error=>{
    this.addErr=error
  }).then(_=>{
    if(this.addErr){
      console.log(this.addErr)
    }else{
      console.log("update success")
      this.infoupdateSuccess=true;
    }
  })
//add today's price in database
let history=`collections/${this.afAuth.auth.currentUser.uid}/${tmp}/priceHistoy/${time}`
this.db.object(history)
.update(cardData)
.catch(e=>{
  this.historyEr=e
}).then(_=>{
  if(this.historyEr){

  }else{
    console.log("Price histroy update success")
    this.infoupdateSuccess=true
  }
  })
})

  }

}

updateCInfo(){
  let cardData={
    cardId:this.cardId?this.cardId:" ",
    cardName:this.cardName?this.cardName:" ",
    // cardSet:this.cardSet?this.cardSet:" ",
    cardAttribute:this.cardAttribute?this.cardAttribute:" ",
    cardType:this.cardType?this.cardType:" ",
    cardRace:this.cardRace?this.cardRace:" ",
    cardAtk:this.cardAtk?this.cardAtk:" ",
    cardDef:this.cardDef?this.cardDef:" ",
    cardLevel:this.cardLevel?this.cardLevel:" ",

    cardSet:this.cardSet?this.cardSet:" ",

    cardPrice:this.cardPrice?this.cardPrice:" ",
    cardDesc:this.cardDesc?this.cardDesc:" ",
    // cardImg:this.cardImgUrl?this.cardImgUrl:" ",
    // cardAmount:this.currentNumberOfCards?this.currentNumberOfCards:1
  }

  let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`

  this.db.object(dataPath)
  .update(cardData)
  .catch(error=>{
    this.addErr=error
  }).then(_=>{
    if(this.addErr){
      console.log(this.addErr)
    }else{
      console.log("update success")
      this.infoupdateSuccess=true;
      this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`)
      .query.once("value")
      .then(data=>{
        var obj=data.val()
        localStorage.setItem(data.key,JSON.stringify(obj))
      })
    }
  })
}

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `/cardSource/${this.cardId}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
    )
    .subscribe()

  }

//   copyToClipboard(item): void {
//     let listener = (e: ClipboardEvent) => {
//         e.clipboardData.setData('text/plain', (item));
//         e.preventDefault();
//     };

//     document.addEventListener('copy', listener);
//     document.execCommand('copy');
//     document.removeEventListener('copy', listener);
// }

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  preview(){

    this.addButton=false

    this.setNumberArray=new Array<any>()

    this.previewButton=false

    this.rci=null

    var xarr=new Array<any>()
    var yarr=new Array<any>()

    if(this.cardId!=null){
      //check search is text or id
      if(isNaN(this.cardId)){
        //loop through localstorage
        for(var i=0;i<localStorage.length;i++){
          //find card id in localstorage by value

          let cardObj= JSON.parse(localStorage.getItem(localStorage.key(i)))

          if(cardObj['cardName']==this.cardId){
            //sign rci card id in localstorage
            this.rci=localStorage.key(i)

          }
        }

        if(this.rci){

 //pull price from realtime database
 this.db.list(`carddb/${this.rci}/priceHistory`)
 .query.once("value")
 .then( data=>{
  let count=0

  data.forEach(e=>{
        count++
        if(e.key){
         xarr.push(e.key)

         var eobj=e.val()

         yarr.push(eobj['tcgplayer_price'])

         //console.log('tcg: '+ eobj['tcgplayer_price'])

        if(count==data.numChildren()){
          console.log("done"+count)

          Plotly.newPlot( this.TESTER,
            [{
         x: xarr,
         y: yarr 
        }],
          {
         margin: { t: 0 } 
          } );

        }

         
        }
       
      }) 
   }
 
  ).then(_=>{

  //  Plotly.newPlot( this.TESTER,
  //      [{
  //   x: xarr,
  //   y: yarr 
  //  }],
  //    {
  //   margin: { t: 0 } 
  //    } );

  })

        //popular set array with card amounts
        this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.rci}/cardSet`)
        .query.once("value")
        .then(data=>{
          var obj=data.val()
          console.log('cardset length: '+obj.length)
          data.forEach(dd=>{
            var ddobj=dd.val()
            console.log('each set number: '+ddobj['set_N'])
            if(!ddobj['set_N']){
              this.setNumberArray.push(0)
            }else{
              this.setNumberArray.push(ddobj['set_N'])
            }
            
          })
        })
          
        //get current price
        this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.rci}`)
        .query.once("value")
        .then(data=>{
          
        if(data!=null){
        var obj=data.val()
                               
        // this.Cardpreview=obj['cardImg']   
        if(obj!=null){
          this.cardPrice=obj['cardPrice']
        }
       
        this.oldPrice=this.cardPrice
        console.log('was '+this.cardPrice)
  
        if(!obj||!obj['cardAmount']){
          this.addButton=true
        }else{
          this.currentNumberOfCards=obj['cardAmount']  
        }
        }
  
        }).then(_=>{
          this.getRequest()
        })
  
        const ref = this.storage.ref(`cardSource/${this.rci}.jpg`);
        this.profileUrl = ref.getDownloadURL();
        }
        }else{
        this.rci=this.cardId

//pull price from realtime database
this.db.list(`carddb/${this.rci}/priceHistory`)
.query.once("value")
.then( data=>{
  
let count=0

    data.forEach(e=>{
          count++
          if(e.key){
           xarr.push(e.key)

           var eobj=e.val()

           yarr.push(eobj['tcgplayer_price'])

           //console.log('tcg: '+ eobj['tcgplayer_price'])

          if(count==data.numChildren()){
            console.log("done"+count)

            Plotly.newPlot( this.TESTER,
              [{
           x: xarr,
           y: yarr 
          }],
            {
           margin: { t: 0 } 
            } );

          }

           
          }
         
          

    }) 
  }

 ).then(_=>{

  // Plotly.newPlot( this.TESTER,
  //     [{
  //  x: xarr,
  //  y: yarr 
  // }],
  //   {
  //  margin: { t: 0 } 
  //   } );

 })

 //popular set array with card amounts
 this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet`)
 .query.once("value")
 .then(data=>{
   var obj=data.val()
   console.log('cardset length: '+obj.length)
   data.forEach(dd=>{
     var ddobj=dd.val()
     console.log('each set number: '+ddobj['set_N'])
     if(!ddobj['set_N']){
       this.setNumberArray.push(0)
     }else{
      this.setNumberArray.push(ddobj['set_N'])
     }
     
   })
 })

        this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`).query.once("value")
        .then(data=>{
          
        if(data!=null){
        var obj=data.val()
                               
        // this.Cardpreview=obj['cardImg']   
        if(obj!=null){
          this.cardPrice=obj['cardPrice']
        }
       
        this.oldPrice=this.cardPrice
        console.log('was '+this.cardPrice)
  
        if(!obj||!obj['cardAmount']){
          this.addButton=true
        }else{
          this.currentNumberOfCards=obj['cardAmount']  
        }
      }
  
        
        }).then(_=>{
          this.getRequest()
        })
  
        const ref = this.storage.ref(`cardSource/${this.cardId}.jpg`);
        this.profileUrl = ref.getDownloadURL();
      }

      

    }
  }

  setPlusOne(i){

    //let dataPath=`collections/${this.afAuth.auth.currentUser.uid}`
    
    // this.db.list(dataPath).query.once("value")
    // .then(data=>{
    //   data.forEach(e=>{
    //     console.log(e.key)

    //     this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${e.key}/priceHistoy/202001`)
    //     .remove()

    //   })
    // })

    //let now=new Date()
    //console.log(now.getMonth().toString()+0)
    //console.log('number in set'+i+'+'+(now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()))
    var setNumber=0
    
    this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`).query.once("value")
    .then(data=>{
      var obj=data.val()
      //console.log('set amount: '+obj['set_N'])
      if(obj){
        if(obj['set_N']){
          setNumber=obj['set_N']
          setNumber++
        }else{
          setNumber++
        }

        //update array data
        this.setNumberArray[i]=setNumber

        let setData={
          set_N:setNumber
        }
            this.db.object(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`)
           .update(setData)
      }else{
        //set don't has a number
        console.log("no number")
        let setNumber=1
        let setData={
          set_code:this.cardSet[i].set_code,
          set_N:setNumber,
          set_name:this.cardSet[i].set_name,
          set_rarity:this.cardSet[i].set_rarity
        }
        this.setNumberArray[i]=setNumber

        this.db.object(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`)
        .update(setData)

      }
    })
  }

  setMinusOne(i){
    var setNumbers=0
    
    this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`).query.once("value")
    .then(data=>{
      var obj=data.val()
      //console.log('set amount: '+obj['set_N'])
      if(obj){
        if(obj['set_N']){
          setNumber=obj['set_N']
          setNumber--
        }else{
          setNumber--
        }

  //update array data
  var setNumber=this.setNumberArray[i]
  setNumber--
  this.setNumberArray[i]=setNumber

        let setData={
          set_N:setNumber
        }
            this.db.object(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`)
           .update(setData)
      }else{
        setNumbers=0
        
        let setData={
          set_code:this.cardSet[i].set_code,
          set_N:setNumbers,
          set_name:this.cardSet[i].set_name,
          set_rarity:this.cardSet[i].set_rarity
        }
        this.setNumberArray[i]=setNumbers
        this.db.object(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet/${i}`)
        .update(setData)

      }
    })
  }

plusOne(){
    var curretNumber
    //get current card number
    this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`).query.once("value")
    .then(data=>{
      
      var obj=data.val()
                         
      curretNumber=obj['cardAmount']           
    })
    .then(_=>{

//currentNumber plus one
curretNumber++
//update card number
let cardData={
  cardAmount:curretNumber
}
let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`

this.db.object(dataPath)
.update(cardData).
catch(error=>{
  this.addErr=error
}).then(_=>{
  if(this.addErr){
    console.log(this.addErr)
  }else{
    console.log("card number update success")
    this.currentNumberOfCards++
  }
})

    })
    

}

minusOne(){
    
  var curretNumber
  //get current card number
  this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`).query.once("value")
  .then(data=>{
    
    var obj=data.val()
                       
    curretNumber=obj['cardAmount']           
  })
  .then(_=>{

//currentNumber plus one
curretNumber--
//update card number
let cardData={
cardAmount:curretNumber
}
let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`

this.db.object(dataPath).update(cardData).
catch(error=>{
this.addErr=error
}).then(_=>{
if(this.addErr){
  console.log(this.addErr)
}else{
  console.log("card number update success")
  this.currentNumberOfCards--
}
})

  })
}

addCard(){
  
  let cardData={
    // cardId:this.cardId?this.cardId:" ",
    // cardName:this.cardName?this.cardName:" ",
    // cardSet:this.cardSet?this.cardSet:" ",
    // cardAttribute:this.cardSet?this.cardAttribute:" ",
    // cardType:this.cardType?this.cardType:" ",
    // cardPrice:this.cardPrice?this.cardPrice:" ",
    cardImg:this.cardImgUrl?this.cardImgUrl:" ",
    cardAmount:1
  }

  //not going to happen if automatic because preview function will change id to number
  if(isNaN(this.cardId)){
   
    this.http.get<any>(this.Root_url+this.cardId).toPromise().then(data=>
      {
        console.log(data[0])
        console.log(data[0].banlist_info)
        this.cardPrice=data[0].card_prices.tcgplayer_price

        this.cardId=data[0].id
        this.cardName=data[0].name

        this.cardAttribute=data[0].attribute
        this.cardType=data[0].type
        this.cardRace=data[0].race
        this.cardAtk=data[0].atk
        this.cardDef=data[0].def
        this.cardLevel=data[0].level

        this.cardSet=new Array<any>()
        this.cardSet=data[0].card_sets

        var itemsProcessed=0
        this.cardSetNames=new Array<any>()
        this.cardSet.forEach(
          (item,index,array)=>{
            this.cardSetNames.push(item.set_name)
            itemsProcessed++;
            if(itemsProcessed===array.length){
              console.log(this.cardSetNames)
            }
          }
       )
       
        this.cardDesc=data[0].desc

        //if its a link monster it also has linkmarks as an array

      }).catch(err=>{
        console.log(err);
      })
      .then(_=>{

        let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`

        this.db.object(dataPath).update(cardData)
        .catch(error=>{
          this.addErr=error
        }).then(_=>{
          if(this.addErr){
            console.log(this.addErr)
          }else{
            console.log("update success")
            this.updateSuccess=true;
          }
        }).then(_=>{
          this.getRequest()
          this.addButton=false
          this.currentNumberOfCards=1
          this.updateCInfo()
        })
      })
      .then(_=>{

        this.oldPrice=this.cardPrice
        
        //popular set array with card amounts
        this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet`)
        .query.once("value")
        .then(data=>{
          var obj=data.val()
          this.oldPrice=obj['tcgplayer_price']
          console.log('cardset length: '+obj.length)
          data.forEach(dd=>{
            var ddobj=dd.val()
            console.log('each set number: '+ddobj['set_N'])
            if(!ddobj['set_N']){
              this.setNumberArray.push(0)
            }else{
             this.setNumberArray.push(ddobj['set_N'])
            }

          })
        })
      })
   
  }else{

    let dataPath=`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}`

    this.db.object(dataPath).update(cardData)
    .
    catch(error=>{
      this.addErr=error
    }).then(_=>{
      if(this.addErr){
        console.log(this.addErr)
      }else{
        console.log("update success")
        this.updateSuccess=true;
      }
    }).then(_=>{
      this.getRequest()
      this.addButton=false
      this.currentNumberOfCards=1
      this.updateCInfo()
    })
    .then(_=>{

     this.oldPrice=this.cardPrice

      //popular set array with card amounts
      this.db.list(`collections/${this.afAuth.auth.currentUser.uid}/${this.cardId}/cardSet`)
      .query.once("value")
      .then(data=>{
        var obj=data.val()
       console.log('cardset length: '+obj.length)
       data.forEach(dd=>{
         var ddobj=dd.val()
         console.log('each set number: '+ddobj['set_N'])
         if(!ddobj['set_N']){
           this.setNumberArray.push(0)
         }else{
          this.setNumberArray.push(ddobj['set_N'])
         }
         
       })
      })
    })

  }

}

  ngOnInit() {

    this.TESTER = document.getElementById('tester');

    console.log(localStorage.length)

    this.previewButton=true
    this.addButton=false

    this.route.paramMap.subscribe(params => {
      //this.companyName = params.get('companyName');userid/:contractor/:jobid
      this.cardId=params.get('cardid');
    });

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        if(user.uid=="8QRYhWtCLEQl12dq4OBApmoVCbA3"){
          this.uploadAu=true
        }

        if(localStorage.length<200){
          this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`).query.once("value")
          .then(data=>{
          data.forEach(e=>{
            let obj=e.val()

            this.optionsPrice.push(e.key)

            this.options.push(e.key)
            if(obj['cardName']){
              this.options.push(obj['cardName'])
              //insert into localstorage
              localStorage.setItem(e.key,JSON.stringify(obj))
            }
           
          })
        })
    
           
        }else{
          this.options=new Array<any>()

          for(var i=0;i<localStorage.length;i++){
            var nCheck=(localStorage.key(i))
            
            if(parseInt(nCheck)){

              this.optionsPrice.push(localStorage.key(i))
              // console.log(localStorage.key(i)+" "+localStorage.getItem(localStorage.key(i)))
              this.options.push(localStorage.key(i))
              let cardObj= JSON.parse(localStorage.getItem(localStorage.key(i)))
              this.options.push(cardObj['cardName'])
              // this.options.push(localStorage.getItem(localStorage.key(i)))
              // this.NameOptions.push(localStorage.getItem(localStorage.key(i)))
            }
            
            // console.log(localStorage.key(i)+" "+localStorage.getItem(localStorage.key(i)))
          }

         
        }

        //filter by card ID
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
        startWith(''),
        map(value => this._filter(value))
        );
     

      }
    })

  }

}




