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


@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css']
})
export class DeckDetailComponent implements OnInit {

deckName

deckCollections

//main deck
mainCollections
//extra deck
extraCollections

deckValue

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

  openDialog(img,id,number,price,desc): void {
    const dialogRef = this.dialog.open(dialogDetail, {
      width: '500px',
      data: {
         diaId: id,
         diaImg: img,
         diaNumber:number,
         diaPrice:price,
         diaDesc:desc
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  sortDeck(){

  }

  deckValueCheck(){
    this.deckValue=0
    console.log(this.deckCollections)
    this.deckCollections.forEach((element,i,a) => {
       //console.log(element.cardPrice)
      this.db.object(`carddb/${element.cardId}`)
      .query
      .once("value")
      .then(data=>{
        
        var obj=data.val()
        var objj=obj['card_prices']
        this.deckCollections[i].cardPrice=objj['tcgplayer_price']
        //console.log(objj['tcgplayer_price'])
        this.deckValue=this.deckValue+objj['tcgplayer_price']*element.cardAmount
        console.log(this.deckValue)
      })
      //this.deckValue=this.deckValue+(element.cardPrice*element.cardAmount)
    })
    
}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      //this.companyName = params.get('companyName');userid/:contractor/:jobid
      this.deckName=params.get('deckname');
      console.log("got "+`${this.deckName}`)
    })

    this.deckCollections=new Array<cardInfoSss>()
    this.mainCollections=new Array<cardInfoSss>()
    this.extraCollections=new Array<cardInfoSss>()
    
    this.deckValue=0

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user&&this.deckName){
        let sym=this.db.list(`decks/${this.afAuth.auth.currentUser.uid}/${this.deckName}`)
    
        sym.query.once('value')
        .then(datas=>{
          datas.forEach(data=>{
                  let obj=data.val()
                  // console.log(obj['cardId'])
                 
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
                            objv['type'],
                            objv['attribute'],
                            objv['race'],
                            objv['desc']
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
                            objv['type'],
                            objv['attribute'],
                            objv['race'],
                            objv['desc']
                          )
                        )
                      }
                    
                    this.deckCollections.push(
                      new cardInfoSss(
                        objv['id'],
                        obj['cardAmount'],
                        obj['cardImgUrl'],
                        obj['cardPrice'],
                        objv['name'],
                        objv['type'],
                        objv['attribute'],
                        objv['race'],
                        objv['desc']
                      )
                    )
                  })
                  .then(_=>{
                    this.deckCollections.sort((a, b) => (Math.round(parseInt(a.cardId)) > Math.round(parseInt(b.cardId))) ? -1 : 1)
                  })
                  //this.deckCollections.push(obj) 
                            }
                      )   
                    }
              )
              
                            }
                                            }
                                    )

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
  selector: 'dialog-detail',
  templateUrl: 'dialog-detail.html',
})
export class dialogDetail {

  constructor(
    public dialogRef: MatDialogRef<dialogDetail>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}