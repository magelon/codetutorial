import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute ,Router,NavigationEnd } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { HttpClient } from '@angular/common/http';

import{cardInfoS} from '../dataModel/cardInfoS';

declare var Plotly: any;

@Component({
  selector: 'app-pickacard',
  templateUrl: './pickacard.component.html',
  styleUrls: ['./pickacard.component.css']
})
export class PickacardComponent implements OnInit {

  @ViewChild("tester", { static: true })
  private tester: ElementRef; 

  cardCollections:Array<cardInfoS>

  // random card number in array
  randomN

  //random card object
  rCard:cardInfoS

  Root_url="https://db.ygoprodeck.com/api/v5/cardinfo.php?name="

  desc

archetype
atk
attribute
card_prices //3 tcgplayer
public name
race
//normal xyz link etc
type

cardReadable

TESTER:any

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) { 

  } 

  pickcard(){

    this.randomN=Math.floor(Math.random() * Math.floor(this.cardCollections.length));
    console.log(this.randomN)

    if(this.cardCollections[this.randomN]){

      //get img from storage
                    const ref = this.storage.ref(`cardSource/${this.cardCollections[this.randomN].cardId}.jpg`);
                       
                    ref.getDownloadURL().subscribe(url=>{

                    if(url){
                      this.rCard=new cardInfoS(
                        this.cardCollections[this.randomN].cardId,
                        this.cardCollections[this.randomN].cardAmount,
                        url,
                        this.cardCollections[this.randomN].cardPrice,
                        this.cardCollections[this.randomN].cardName
                        )
                        this.cardReadable=true
                        this.name=this.cardCollections[this.randomN].cardName

                        var xarr=new Array<any>()
                        var yarr=new Array<any>()

                        //pull card describtion
                        this.db.object(`carddb/${this.rCard.cardId}`)
                        .query
                        .once("value")
                        .then(dat=>{
                          var obj=dat.val()
                          
                        this.desc=obj['desc']
                        })

                        //pull price from realtime database
                        this.db.list(`carddb/${this.rCard.cardId}/priceHistory`)
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

          
                        //   Plotly.newPlot( this.TESTER,
                        //     [{
                        //  x: xarr,
                        //  y: yarr 
                        // }],
                        //   {
                        //  margin: { t: 0 } 
                        //   } );
                          

                         })

                         
                     
                      }
                    
                     }
                    )
    }

  }

//post request to yugioh pro deck api
// getRequest(){

//     this.http.get<any>(this.Root_url+this.rCard.cardId).toPromise().then(data=>
//       {
//         console.log(data)
//         console.log(data[0].card_prices.tcgplayer_price);
//         //array of card sets if its a link monster
//         console.log(data[0].card_sets)
//         //description and id are simply string
//         console.log(data[0].desc)
//         //if its a link monster it also has linkmarks as an array

//       }).catch(err=>{
//         console.log(err);
//       });
// }

  ngOnInit() {

   this.TESTER = document.getElementById('tester');
 

    this.cardReadable=false

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        if(localStorage.length<200){
          this.cardCollections=new Array<cardInfoS>()
          this.db.list(`collections/${this.afAuth.auth.currentUser.uid}`).query.once("value")
          .then(data=>{
          data.forEach(e=>{
            let obj=e.val()
            if(obj['cardName']){
            
              //insert into localstorage
              localStorage.setItem(e.key,JSON.stringify(obj))
              this.cardCollections.push(new cardInfoS(obj['cardId'],obj['cardAmount'],obj['cardId'],obj['cardPrice'],obj['cardName'])) 
                
            }
           
          })
        })
    
           
        }else{
          this.cardCollections=new Array<cardInfoS>()

          for(var i=0;i<localStorage.length;i++){
            var nCheck=(localStorage.key(i))
            
            if(parseInt(nCheck)){

            
              let cardObj= JSON.parse(localStorage.getItem(localStorage.key(i)))
              this.cardCollections.push(new cardInfoS(cardObj['cardId'],cardObj['cardAmount'],cardObj['cardId'],cardObj['cardPrice'],cardObj['cardName'])) 
                       
              // this.options.push(localStorage.getItem(localStorage.key(i)))
              // this.NameOptions.push(localStorage.getItem(localStorage.key(i)))
            }
            
            // console.log(localStorage.key(i)+" "+localStorage.getItem(localStorage.key(i)))
          }

        }

      }
    })

  }

}
