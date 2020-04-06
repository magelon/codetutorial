import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

declare var mapboxgl: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  //users from youtube
  users
  winner

  constructor(
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth
  ) { }

raffle(){
  var size=this.users.length;
  var random=Math.floor(Math.random()*10);
  var counter=0;
  for (let entry of this.users.entries()) {
    
    if(counter==random){
      console.log("congratz! "+entry[1],entry[0])
      this.winner=entry[1]
    }

    counter++;

    
  }
}

  ngOnInit() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VvamluZG9uZyIsImEiOiJjajZuMndhNzAwNDk5MnFsYTc0ZXg3cW9mIn0.Abnroi4CyO829oqPDzn_hA';


    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });
  

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        if(user.uid=="8QRYhWtCLEQl12dq4OBApmoVCbA3"){
         
          this.db.list(`users`).query.once("value")
          .then(data=>{
          data.forEach(e=>{
            let obj=e.val()

            // this.optionsPrice.push(e.key)

            if(obj['address']){
              
              console.log(obj['uname']+':'+obj['address'])
              this.users.set(obj['address'],obj['uname'])
            }
          })
        })

          }
        }
      })
   
  }

}
