import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase,AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

declare let Stripe:Function;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  //test objects
  items: Observable<any[]>;
  //object to check data exit
  itemRef: AngularFireObject<any>;

  paid;
  role;

 email;
 name;

 affiliate

  constructor(
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    private router: Router,
    public afAuth:AngularFireAuth
    ) {
      //test data
      this.items = db.list('events').valueChanges();
   }

   //used trigger in login page but now abandunded
   login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    .catch(error=>console.log(error))
  }

  //as long as this update function 
  private updateUserData(): void{
    let path=`users/${this.afAuth.auth.currentUser.uid}`;
    let data={
      email:this.afAuth.auth.currentUser.email,
      name:this.afAuth.auth.currentUser.displayName,
    }
    this.db.object(path).update(data).catch(error=>console.log(error));
  }

  //sign up as an Owner and update email name and role into owner table
  //then navigate to signup page
  signupOwner(){
  let path=`users/${this.afAuth.auth.currentUser.uid}`;
    let data={
      email:this.email,
      name:this.name,
      role:'owner'
    }
    this.db.object(path).update(data).catch(error=>console.log(error)).then(e=>{
      this.router.navigate(['/signup']);
      } 
    );
  }

  //same for truckers you can sign up as a trucker but to use service needs to pay
  signupTrucker(){

    this.afAuth.auth.onAuthStateChanged(user=>{
      if(user){

        this.email=this.afAuth.auth.currentUser.email
        //this.afAuth.auth.currentUser.email;
        this.name=this.afAuth.auth.currentUser.displayName;
              //in job comfirm page can see valable add in navigate
      let path=`users/${this.afAuth.auth.currentUser.uid}`;

      let today=new Date().toLocaleDateString()

      let da=String(today).split('/')
      let ds=da[2]+'/'+da[0]+'/'+da[1]

      console.log(ds)

      let pathAff=`affiliate/${this.affiliate}/${ds}/${this.afAuth.auth.currentUser.uid}`

  let data={
    email:this.email,
    name:this.name,
    role:'trucker',
    affiliate:this.affiliate!=null?this.affiliate:null,
  }

      this.db.object(path).update(data).catch(error=>console.log(error))
      .then(e=>{
        //update affiliate event
        if(this.affiliate!=null){
            let data={
              affiliate:this.affiliate
            }
            this.db.object(pathAff).update(data)
            .catch(e=>{console.log(e)})
        }
      })
      .then(e=>{
      //check user is a subcribe or not
      this.db.list('stripeEvents').query.once("value").then(data=>{
        data.forEach(d=>{
          var obj=d.val()
          //console.log(obj['email']);
          var mail
    
          var emailtext=obj['email'].toString()
          // console.log(emailtext.substring(emailtext.length-9,emailtext.length))
          var emailtype=emailtext.substring(emailtext.length-9,emailtext.length)
    
          if(emailtype=='gmail.com'){
            // console.log(emailtext)
            if(obj['email']==this.email){
              let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
              let paidData={
                paid:'paid'
              }
              this.paid='paid'
              this.db.object(updatePaidPath)
              .update(paidData)
              .catch(e=>{
                console.log(e)
              })
            }
          }else{
            
            if(emailtext==this.email){
              let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
              let paidData={
                paid:'paid'
              }
              this.paid='paid'
              this.db.object(updatePaidPath)
              .update(paidData)
              .catch(e=>{
                console.log(e)
              })
            }else{
              //for people using mail other than gmail
    
            var emailarray=emailtext.split('@')
            
            emailtext=emailarray[0]+"%"+emailarray[1]
    
            emailtext=emailtext+'@gtempaccount.com'
            
            if(emailtext==this.email){
              let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
              let paidData={
                paid:'paid'
              }
              this.paid='paid'
              this.db.object(updatePaidPath)
              .update(paidData)
              .catch(e=>{
                console.log(e)
              })
            }
          }

          }
      
        })
      })
      })
      .then(_=>{
        this.router.navigate(['signup'])
      })     

      }
    })

        //if you are not paid you will go to pay page
        // if(!this.paid){
        // var stripe=Stripe('pk_live_DHwxcZn1QkjzG44dllKG4ViT');
        // stripe.redirectToCheckout({
          //19 plan plan_FT4FdUccg0ZR6j
        // items: [{plan: 'plan_FbwqP0NVFSt4Zz', quantity: 1}],
        // // Do not rely on the redirect to the successUrl for fulfilling
        // // purchases, customers may not always reach the success_url after
        // // a successful payment.
        // // Instead use one of the strategies described in
        // // https://stripe.com/docs/payments/checkout/fulfillment
        // successUrl: window.location.protocol + '//daydaco-19a9b.web.app/signup',
        // cancelUrl: window.location.protocol + '//daydaco-19a9b.web.app.com',
        // })
        // .then(function (result) {
        // if (result.error) {
        //   // If `redirectToCheckout` fails due to a browser or network
        //   // error, display the localized error message to your customer.
        //     // var displayError = document.getElementById('error-message');
        //     // displayError.textContent = result.error.message;
        //       console.log(result.error)
        //     }
        //   });
        // }
      // } 
    // )
    //if you are paid update your info and then can go to sign up page or beyond
    // if(this.paid){
    //   let path=`users/${this.afAuth.auth.currentUser.uid}`;
    //   let data={
    //     email:this.email,
    //     name:this.name,
    //     role:'trucker'
    //   }
    //   this.db.object(path).update(data).catch(error=>console.log(error)).then(e=>{
    //   this.router.navigate(['signup'])
    //   })
    // }

  }

ngOnInit() {

  this.route.paramMap.subscribe(params => {
    
    this.affiliate=params.get('affiliate')
    console.log(this.affiliate)
    
  });

this.afAuth.auth.onAuthStateChanged(user=>{
  if(user){

      // this.email=this.afAuth.auth.currentUser.email;
      // this.name=this.afAuth.auth.currentUser.displayName;

      //check user is a subcribe or not

    // this.db.list('stripeEvents').query.once("value").then(data=>{
    //   data.forEach(d=>{
    //     var obj=d.val();
    //     //console.log(obj['email']);
    //     var mail

    //     var emailtext=obj['email'].toString()
    //     // console.log(emailtext.substring(emailtext.length-9,emailtext.length))
    //     var emailtype=emailtext.substring(emailtext.length-9,emailtext.length)

    //     if(emailtype=='gmail.com'){
    //       // console.log(emailtext)
    //       if(obj['email']==this.afAuth.auth.currentUser.email){
    //         let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
    //         let paidData={
    //           paid:'paid'
    //         }
    //         this.paid='paid';
    //         this.db.object(updatePaidPath)
    //         .update(paidData)
    //         .catch(e=>{
    //           console.log(e)
    //         })
    //       }
    //     }else{
          
    //       if(emailtext==this.afAuth.auth.currentUser.email){
    //         let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
    //         let paidData={
    //           paid:'paid'
    //         }
    //         this.paid='paid';
    //         this.db.object(updatePaidPath)
    //         .update(paidData)
    //         .catch(e=>{
    //           console.log(e)
    //         })
    //       }

    //       //for people using mail other than gmail

    //       var emailarray=emailtext.split('@')
          
    //       emailtext=emailarray[0]+"%"+emailarray[1]

    //       emailtext=emailtext+'@gtempaccount.com'
          
    //       if(emailtext==this.afAuth.auth.currentUser.email){
    //         let updatePaidPath=`users/${this.afAuth.auth.currentUser.uid}`
    //         let paidData={
    //           paid:'paid'
    //         }
    //         this.paid='paid';
    //         this.db.object(updatePaidPath)
    //         .update(paidData)
    //         .catch(e=>{
    //           console.log(e)
    //         })
    //       }
        
    //     }

        
    //   })
    // })

      // this.db.list('stripeEvents').snapshotChanges(['child_added'])
      // .subscribe(actions=>{

      // actions.forEach(action => {
    
      // var userStr=JSON.stringify(action.payload.val());

      // JSON.parse(userStr, (key, value) => {
      //   if(key=='email'){
      //     if(value==this.afAuth.auth.currentUser.email){
      //       let path2=`users/${this.afAuth.auth.currentUser.uid}`;
      //       let data2={
      //         paid:'paid',
      //       }
      //       this.paid='paid';
      //       this.db.object(path2).update(data2).catch(error=>console.log(error));
      //     }
      //   }
      // });
      // });
      // });

    let users;
    this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
    .snapshotChanges().subscribe(a=>{
        users=a.payload.val();
        this.role=users.role;
        this.paid=users.paid;
        if(this.role&&this.paid){
          this.router.navigate(['jobsDone/trucker']);
        }
    });

/* actions.forEach(action => {
  console.log(action.payload.val());
  
  var contra;
  contra=action.key;
  var jCount;
  var jId;

//traslate action payload to json string
var userStr=JSON.stringify(action.payload.val());

JSON.parse(userStr, (key, value) => {
//let regexpNumber = new RegExp('^[0-9]');
//check job has been token or not
//key=='Occupied'&&value=='false'&&

if(key=='Times'||key=='JobID'){
 */


     //check in the referal table if you are referaled 
/* this.db.list(`referral/${this.afAuth.auth.currentUser.uid}`).snapshotChanges(['child_added'])
.subscribe(actions=>{
  actions.forEach(action => {
  
   if((action.payload.val())==(this.afAuth.auth.currentUser.email)){
     //update your owner info in owner table and go to owner prefilepage
    console.log('you are referraled');
    let path3=`owner/${this.afAuth.auth.currentUser.uid}`;
    let data3={
      OwnerEmail:this.afAuth.auth.currentUser.email,
      OwnerName:this.afAuth.auth.currentUser.displayName,
    }
    this.db.object(path3).update(data3).catch(error=>console.log(error));
    this.router.navigate(['profile/owner']);
  }
 });
});  */

      }
    })
  }

}


//regist
// onSubmit(customerData) {
//   this.errorMessage=''
//   this.succeMessage=''
//   this.afAuth.auth.createUserWithEmailAndPassword(
//       customerData.userEmail,
//       customerData.userPass
//     ).catch(error=>{
//          // Handle Errors here.
//       console.log(error.code)
//       console.log(error.message)
//       this.errorMessage=error.message
//     })
//     .then(e=>{
//       if(this.errorMessage){
//         this.registForm.reset()
//       }else{
//         console.log('successed!')
//         this.succeMessage="you are registed!"
//         this.afAuth.auth.onAuthStateChanged(user=>{
//           if(user){
//             console.log(user.email+user.uid)
//           }
//         })
//         // this.router.navigate(['/login'])
//       } 
//     })
// }