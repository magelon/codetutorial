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
  selector: 'app-pricecheck',
  templateUrl: './pricecheck.component.html',
  styleUrls: ['./pricecheck.component.css']
})
export class PricecheckComponent implements OnInit {

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

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  preview(){

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
          //this.getRequest()
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
          //this.getRequest()
        })
  
        const ref = this.storage.ref(`cardSource/${this.cardId}.jpg`);
        this.profileUrl = ref.getDownloadURL();
      }

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
