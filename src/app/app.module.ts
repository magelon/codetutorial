import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { Module as StripeModule } from "stripe-angular";
 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireFunctionsModule} from'@angular/fire/functions';

import { TopBarComponent } from './top-bar/top-bar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignaturepadComponent } from './signaturepad/signaturepad.component';

import { SignaturePadModule } from 'angular2-signaturepad';
import { SignupPageComponent } from './signup-page/signup-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CreatJobComponent } from './creat-job/creat-job.component';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobConfirmPageComponent } from './job-confirm-page/job-confirm-page.component';
import { StageOneComponent,DialogOverviewExampleDialog,PopupSignF} from './stage-one/stage-one.component';

import { PersonalJobsPageComponent } from './personal-jobs-page/personal-jobs-page.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatNativeDateModule} from '@angular/material/core';
import {DemoMaterialModule} from './material-module';
import { SubComponent } from './sub/sub.component';
import { HttpRequestExampleComponent } from './http-request-example/http-request-example.component';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { PrintPageComponent } from './print-page/print-page.component';
import { JobsDoneComponent } from './jobs-done/jobs-done.component';
import { UploadToFiComponent } from './upload-to-fi/upload-to-fi.component';
import { JobModifyComponent } from './job-modify/job-modify.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { LoginOwnerComponent } from './login-owner/login-owner.component';
import { TruckerCreateJobComponent } from './trucker-create-job/trucker-create-job.component';

import { ReversePipe } from './print-page/print-page.component';
import { SalseComponent } from './salse/salse.component';
import { SalseRecordsComponent } from './salse-records/salse-records.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { EmailloginComponent } from './emaillogin/emaillogin.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { AddcardComponent } from './addcard/addcard.component';
import { CardsforsellComponent,dialogZoom } from './cardsforsell/cardsforsell.component';
import { DeckBuilderComponent, dialogBuilder } from './deck-builder/deck-builder.component';
import { PickacardComponent } from './pickacard/pickacard.component';
import { DigitalBinderComponent,dialogBZoom } from './digital-binder/digital-binder.component';
import { DecklistComponent } from './decklist/decklist.component';
import { DeckDetailComponent,dialogDetail } from './deck-detail/deck-detail.component';
import { BlogComponent } from './blog/blog.component';
import { CarddbComponent,dbZoom } from './carddb/carddb.component';
import { CardMarketComponent } from './card-market/card-market.component';
import { PublicBinderComponent,dialogPb } from './public-binder/public-binder.component';
import { YourShopComponent, dialogShop } from './your-shop/your-shop.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { GiveawaysComponent } from './giveaways/giveaways.component';
import { PricecheckComponent } from './pricecheck/pricecheck.component';
import { MapComponent } from './map/map.component';



// import { LocationStrategy, HashLocationStrategy} from '@angular/common';

// const firebaseConfig = {
//   apiKey: "AIzaSyAy4Vx5HGQ82x8hCiBuPhAtxQphCq8KJDU",
//   authDomain: "truckproject-b9adc.firebaseapp.com",
//   databaseURL: "https://truckproject-b9adc.firebaseio.com",
//   projectId: "truckproject-b9adc",
//   storageBucket: "truckproject-b9adc.appspot.com",
//   messagingSenderId: "192747041888",
//   appId: "1:192747041888:web:a3e175088a47deb1"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDcNmOw71YF5va33F2ZQnLAd2e2k1UtQc4",
  authDomain: "codetutorial-aab47.firebaseapp.com",
  databaseURL: "https://codetutorial-aab47.firebaseio.com",
  projectId: "codetutorial-aab47",
  storageBucket: "codetutorial-aab47.appspot.com",
  messagingSenderId: "781290358357",
  appId: "1:781290358357:web:5467b2010c1f08377db6dc",
  measurementId: "G-5EYKFCRFWP"
};

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    LoginPageComponent,
    SignaturepadComponent,
    SignupPageComponent,
    ProfilePageComponent,
    CreatJobComponent,
    JobsPageComponent,
    JobConfirmPageComponent,
    StageOneComponent,
    DialogOverviewExampleDialog,
    PopupSignF,
    PersonalJobsPageComponent,
    SubComponent,
    HttpRequestExampleComponent,
    AssignDriverComponent,
    PrintPageComponent,
    JobsDoneComponent,
    UploadToFiComponent,
    JobModifyComponent,
    SettingPageComponent,
    LoginOwnerComponent,
    TruckerCreateJobComponent,
    ReversePipe,
    SalseComponent,
    SalseRecordsComponent,
    RegisterPageComponent,
    EmailloginComponent,
    RegisterSuccessComponent,
    ForgetPassComponent,
    AddcardComponent,
    CardsforsellComponent,
    DeckBuilderComponent,
    PickacardComponent,
    DigitalBinderComponent,
    dialogZoom,
    dialogBZoom,
    dialogBuilder,
    dialogDetail,
    dialogShop,
    DecklistComponent,
    DeckDetailComponent,
    BlogComponent,
    CarddbComponent,
    dbZoom,
    CardMarketComponent,
    PublicBinderComponent,
    YourShopComponent,
    dialogPb,
    FrontpageComponent,
    GiveawaysComponent,
    PricecheckComponent,
    MapComponent,
    
  ],
  entryComponents: [
    TopBarComponent,
    StageOneComponent,
    DialogOverviewExampleDialog,
    PopupSignF,
    dialogZoom,
    dialogBZoom,
    dialogBuilder,
    dialogDetail,
    dialogShop,
    dialogPb,
    dbZoom

  ],
  imports: [
    [ StripeModule.forRoot() ],
    BrowserModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    SignaturePadModule,
    RouterModule.forRoot([
      {path:'map',component:MapComponent},
      {path:'checkprice',component:PricecheckComponent},
      {path:'giveaways',component:GiveawaysComponent},
      {path:'',component:FrontpageComponent},
      {path:'yourshop',component:YourShopComponent},
      {path:'publicbinder/:email',component:PublicBinderComponent},
      {path:'cardmarket',component:CardMarketComponent},
      {path:'database',component:CarddbComponent},
      {path:'blog',component:BlogComponent},
      {path:'deckdetail/:deckname',component:DeckDetailComponent},
      {path:'decklist',component:DecklistComponent},
      {path:'binder',component:DigitalBinderComponent},
      {path:'pick',component:PickacardComponent},
      {path:'register',component:RegisterPageComponent},
      {path:'deckbuilder',component:DeckBuilderComponent},
      {path:'addcard/:cardid',component:AddcardComponent},
      {path:'cfs',component:CardsforsellComponent},
      {path:'emaillogin',component:EmailloginComponent},
      {path:'forgetPass',component:ForgetPassComponent},
      {path:'registerSuccess',component:RegisterSuccessComponent},
      {path:'truckerCreateJob',component:TruckerCreateJobComponent},
      {path:'signUpWith/owner',component:LoginOwnerComponent},
      {path:'sub',component:SubComponent},
      {path:'setting',component:SettingPageComponent},
      {path:'JobModify/:companyName/:contractor/:jobid',component:JobModifyComponent},
      {path:'upload',component:UploadToFiComponent},
      // {path:'', component: LoginPageComponent },
      {path:'affiliate/:affiliate',component:LoginPageComponent},
      {path:'salse',component:SalseComponent},
      {path:'signature',component:SignaturepadComponent},
      {path:'signup',component:SignupPageComponent},
      {path:'profile',component:ProfilePageComponent},
      {path:'createJob',component:CreatJobComponent},
      {path:'Jobs',component:JobsPageComponent},
      {path:'JobConfirm/:contractor/:id/:companyName',component:JobConfirmPageComponent},
      {path:'StageOne/:userid/:contractor/:jobid',component:StageOneComponent},
      {path:'Ongoing',component:PersonalJobsPageComponent},
      {path:'http',component:HttpRequestExampleComponent},
      {path:'assign/:companyName/:contractor/:jobid',component:AssignDriverComponent},
      {path:'print/:userid/:contractor/:jobid',component:PrintPageComponent},
      {path:'jobsDone/:role',component:JobsDoneComponent},
      ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
