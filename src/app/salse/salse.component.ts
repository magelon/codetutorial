import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';

import { AngularFireDatabase,AngularFireObject  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-salse',
  templateUrl: './salse.component.html',
  styleUrls: ['./salse.component.css']
})
export class SalseComponent implements OnInit {

checkupV

affiliates

affiliatelink

result
checkout=true

  constructor(
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    public afAuth:AngularFireAuth,
    private router: Router
  ) { }

  regist(){
      this.affiliatelink=`http://daydaco-19a9b.web.app/affiliate/${this.checkupV}`
      let data={
        affiliateName:`${this.checkupV}`
      }
      this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
      .update(data)
      .catch(e=>{console.log(e)})
      .then(e=>{
        let dat={
          state:'in'
        }
        this.db.object(`affiliates/${this.checkupV}`)
        .update(dat)
        .catch(e=>{console.log(e)})
      })
      .then(e=>{
        this.router.navigate(['salse'])
      })
  }

  copyToClipboard(item): void {
    let listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (item));
        e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
}

checkup(){
  // console.log(this.checkupV)

  if(this.checkupV){

  this.affiliates=new Array<string>()
  this.db.list(`affiliates`).query.once("value").then(data=>{
    data.forEach(d=>{
      console.log(d.key)
      this.affiliates.push(d.key)
    })
  }).then(l=>{
    if(this.affiliates.includes(this.checkupV)){
      console.log("already used")
      this.result="already used,pick another one"
      this.checkout=true
    }else{
      console.log("you can use this")
      this.result="you can use this in affiliate link "
      this.checkout=false
      }
    })
  }
}

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        let userO
        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
        .snapshotChanges().subscribe(a=>{
          userO=a.payload.val()
          this.affiliatelink=userO.affiliateName?`http://daydaco-19a9b.web.app/affiliate/${userO.affiliateName}`:null
          if(this.affiliatelink==null){
            console.log('null')
          }else{
            console.log(this.affiliatelink)
          }
          
        })
        // this.affiliatelink=
      }
    })

  }

}
