import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase,AngularFireObject,AngularFireList  } from '@angular/fire/database';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import{cardInfoS} from '../dataModel/cardInfoS';

@Component({
  selector: 'app-decklist',
  templateUrl: './decklist.component.html',
  styleUrls: ['./decklist.component.css']
})
export class DecklistComponent implements OnInit {

  deckCollections

  constructor(
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router,
  ) { }

  deckList(){
   
    // let date=new Date()
    // let year=date.getFullYear()
    // let month=date.getUTCMonth()+1
    let sym=this.db.list(`decks/${this.afAuth.auth.currentUser.uid}`)
    
    this.deckCollections=new Array<any>()
    

    sym.query.once('value')
      .then(datas=>{
        datas.forEach(data=>{
                
                let obj=data.val()
                 
                  this.deckCollections.push(data.key) 
        
        })
      }).then(_=>{

       console.log(this.deckCollections)
      })

  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.deckList()
      }
    })
    
  }

}
