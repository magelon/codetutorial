import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

checked=false;
uploadAu

  constructor(
    public afAuth:AngularFireAuth,
  ) { }

  refresh(): void {
    window.location.reload();
}

  feedback(){
    window.location.href="mailto:dguojin@gmail.com?subject='yugioh19 feedback'"
  }

  reset(){
    localStorage.clear()
  }

  clickEvent(e){
    console.log(e.checked)
    if(e.checked){
      (document.getElementById('themeAsset')as HTMLBaseElement).href= `https://firebasestorage.googleapis.com/v0/b/daydaco-19a9b.appspot.com/o/purple-green.css?alt=media&token=a66af52d-b62f-470c-a6bb-e895fa1324ee`;
    }else{
      (document.getElementById('themeAsset')as HTMLBaseElement).href= `https://firebasestorage.googleapis.com/v0/b/daydaco-19a9b.appspot.com/o/deeppurple-amber.css?alt=media&token=063aa2cd-e94e-46b0-8274-e2cbb9a5c1a7`;
    }
  }


  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        if(user.uid=="8QRYhWtCLEQl12dq4OBApmoVCbA3"){
           this.uploadAu=true
         }
        }
      })
  }

}
