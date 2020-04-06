import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-http-request-example',
  templateUrl: './http-request-example.component.html',
  styleUrls: ['./http-request-example.component.css']
})
export class HttpRequestExampleComponent implements OnInit {

// readonly Root_url='https://us-central1-daydaco-19a9b.cloudfunctions.net/';
Root_url
posts:any;
tag;
tag2; 

  constructor(private http: HttpClient) {
    
   }

/* getPosts(){
  console.log('sending...');
  let params=new HttpParams().set('dest','alfardproject@gmail.com').set('jobid','999').set('contractor','npumoshou@gmail.com').
  set('contractName','aa').set('broker','brokerEmail').set('owner','ownerEmail').set('foreman','foremanemail');
 
  this.http.get(this.Root_url+'emails',{params}).toPromise()
  .then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err);
  });

} */

emailList={
  contractor:'contractorName',
  jobId:'jobid',
  contractorEmail:'alfardproject@gmail.com',
  driverEmail:'dguojin@gmail.com',
  brokerEmail:'npumoshou@gmail.com',
  ownerEmail:'ownerEmail',
  foremanEmail:'foremanEmail'

}

metaurl(url){
  let data={
    text:url
  }

  let header=new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': "*",
  });

  let options={headers:header};

    this.http.post(this.Root_url+'metaurl',data,options).toPromise().then(data=>
      {
        console.log(data);
      }).catch(err=>{
        console.log(err);
      });

}


scraper(tag){
  
  let search={
    tag:tag
  }

  let header=new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': "*",
  });
  
  let options={headers:header};
  let Root_url2= 'http://localhost:5001'
    this.http.post(Root_url2+'scraper',search,options).toPromise().then(data=>
      {
        console.log(data);
      }).catch(err=>{
        console.log(err);
      });

}

//acao for http to https
postRequest(){
  let header=new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  
  let options={headers:header};

    this.http.post(this.Root_url+'postEmails',this.emailList,options).toPromise().then(data=>
      {
        console.log(data);
      }).catch(err=>{
        console.log(err);
      });
}

pushdata(){
  let header=new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  
  let options={headers:header};

    this.http.post(this.Root_url+'pushData',this.emailList,options).toPromise().then(data=>
      {
        console.log(data);
      }).catch(err=>{
        console.log(err);
      });
}

  ngOnInit() {
  }

}
