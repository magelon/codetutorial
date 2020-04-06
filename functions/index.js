const functions = require('firebase-functions');

const puppeteer=require('puppeteer');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const cors=require('cors')({origin:true});
const cheerio=require('cheerio');
const getUrls=require('get-urls');
const fetch=require('node-fetch');

// Moments library to format dates.
const moment = require('moment');
//test
//firebase functions:config:set 
//keys.webhooks="rk_test_tIVUvU5hNQZ3MBsaQ40LcKhg00z0vqt1IU" 
//keys.signing="whsec_uUPdeceYt5uLmbLl2O3BDIv8r5qw9Uzd"
//live
//rk_live_q8QFoG0LDw9NCnJZfzyFL56v0044vGB6MI
//whsec_pYmDIrz5TTm8FXO8bOkE8EttUSEfbC9a

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'Daydaco';


const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')(functions.config().keys.webhooks);
const endpointSecret = functions.config().keys.signing;
// Moments library to format dates.
//const moment = require('moment');

//delete customer
const stripeDel=require("stripe")("sk_live_k2Ys4GJen2rXfLuNnB9uU4Ew")

exports.unsub=functions.https.onRequest((request,response)=>{
  cors(request,response,()=>{
    var id=request.body.customerId;
    stripeDel.customers.del(id).then(e=>{
      //delete customer info in stripe events
      admin.database().ref(`stripeEvents`)
      .once('value').then(data=>{
        data.forEach(action=>{
          var obj=action.val()
          if(obj['subid']==id){
            //id for delete
            var deid=action.key
            admin.database().ref(`stripeEvents/${deid}`).remove();
          }
        })
      })
    }).catch(e=>{
      console.log(e);
    })
  })
});
/* function Data(n,e) {
  this.subid = n;
  this.email=e;
}

exports.pushData=functions.https.onRequest((req,res)=>{
  cors(req,res,()=>{
  
  admin.database().ref('/pushData').push(new Data('sub23123','email'));
  return res.status(200).end();
  });
}); */

//datastructure for customerinfo

exports.getuser=functions.https.onRequest((r,p)=>{

  admin.database().ref(`/teststripeEvents`).update(new customerInfo('email','subid','expDate'))

  // admin.database().ref('/users')
  // .once('value'
  // ,(snapshot) => {
  //   snapshot.forEach(e=>{
  //     var element=e.val()
  //     console.log(element['email'])
  //     console.log(e.key)
  //   })
  // })

})


function customerInfo(e,i,d){
  this.email=e;
  this.subid=i;
  this.subdate=d;
}

exports.events = functions.https.onRequest((request, response) => {

    //const formattedDate = moment().format(format);
    //console.log('Sending Formatted date:', formattedDate);
    //admin.database().ref('/tryTime').push(formattedDate);
    // Get the signature from the request header

    let sig = request.headers["stripe-signature"];
    let email;
    let subid;
    let expDate=moment(new Date()).add(30, 'days' ).format('L');
    

    try {
        // Verify the request against our endpointSecret
      let event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
      //response.send("Endpoint for Stripe Webhooks!");

      var userStr=JSON.stringify(event);
  
      JSON.parse(userStr, (key, value) => {
        if(key=='email'){
             email=value;
        }

        if(key=='customer'){
          subid=value;
        }
        
      });

        if(email&&subid){

          admin.database().ref(`/stripeEvents/${subid}`).update(new customerInfo(email,subid,expDate))
          .then((snapshot) => {
          return response.send('200').end();
          //return response.json({ received: true, ref: snapshot.ref.toString() });
          })
          .catch((err) => {
          console.error(err);
          return response.status(500).end();
          }); 
          
        }      
    } catch (err) {
      return response.status(400).end();
    }
    
});

/* exports.emails = functions.https.onRequest((request, response) => {
cors(request,response,()=>{
    
  const doc=new PDFDocument;
  // Draw a triangle
doc.save()
.moveTo(100, 150)
.lineTo(100, 250)
.lineTo(200, 250)
.fill("#FF3300");

  let buffers=[];
  doc.on('data',buffers.push.bind(buffers));
  const fileName="PDF.pdf";
  doc.on('end',()=>{

    let pdfData = Buffer.concat(buffers);

    const dest=request.query.dest;
    const jobid=request.query.jobid;
    
    console.log(dest+':'+jobid);
    const mailOptions={
      from: `${APP_NAME} <daydaco@daydaco.com>`,
      to:dest,
      subject:'test mail send from server',
      html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
      <br />
      <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
       `,
      attachments:[{
          filename:fileName,
          content:pdfData,
          contentType:'application/pdf'
      }]
      
    };

    // returning result
    return mailTransport.sendMail(mailOptions, (erro, info) => {
    if(erro){
      return response.send(erro.toString());
    }
      
  });

  });

  doc.pipe(response);
  doc.end();
  
  });

});   */

const accountSid='ACa2ea06bbae66bdecd3ae955cb1233983'
const authToken='53686921ab4e9cd0d47d604991cbbf72'
const client =require('twilio')(accountSid,authToken)

// exports.cloudMessage=functions.database
//                       .ref('/onGoingJobs/{uid}/{contractor}/{jobid}')
//                       .onCreate((snapshot,context)=>{

//                         const newJob=snapshot.val();
//                         const uid=context.params.uid;
//                         const contract=context.params.contractor;
//                         const jid=context.params.jobid;

//                         admin.database()
//                         .ref(`trucker/${uid}/Phone`)
//                         .once('value')
//                         .then(phone=>phone.val())
//                         .then(p=>{
//                           console.log(p)
//                           client.messages
//                           .create({
//                             body:`new job assigned https://daydaco-19a9b.web.app/StageOne/${uid}/${contract}/${jid}`,
//                             from:'+14155239021',
//                             to: `+1${p}`
//                           }).then(message=>console.log('textmessageid'+message.sid))
//                         })

//                         // admin.database()
//                         // .ref(`users/${uid}/msToken`)
//                         // .once('value')
//                         // .then(token=>token.val())
//                         // .then(userMStoken=>{
            
//                         //   console.log(userMStoken)
//                         //   const payload={

//                         //       "notification": {
//                         //         "title": "new job",
//                         //         "body": "contractor: "+context.params.contractor+"jobid: "+context.params.jobid,
//                         //       }
//                         //     }
                           
//                         //   return admin.messaging()
//                         //   .sendToDevice(userMStoken,payload)
//                         // })
//                         // .then(res=>{
//                         //   console.log("sent successfully",res);
//                         // })
//                         // .catch(err=>{
//                         //   console.log(err);
//                         // })

//                       })

exports.postEmails = functions.https.onRequest((request, response) => {
  cors(request,response,()=>{

    var contract=request.body.contractName;
    // var jobid=request.body.jobId;
    var pdf=request.body.pdfLink;
    var company=request.body.company;
    var userid=request.body.uid;
    var jobid=request.body.jobId;
    var doneinfo;

    var sc;
    
    var mailList=[
      'edew@theizegroup.com',
      request.body.driverEmail,
      request.body.ownerEmail,
      request.body.foremanEmail,
      request.body.brokerEmail,
      request.body.parentHaulerEmail,
      request.body.contractorEmail,
      ]

    admin.database()
    .ref(`done/${company}/${userid}/${contract}/${jobid}`)
    .once('value',(snapshot) => {
      doneinfo = snapshot.val();
    }).then(_=>{});

  const mailOptions={
    from: `${APP_NAME} <daydaco@daydaco.com>`,
    to:mailList,
    subject:`Company: ${company},Contractor: ${contract} information is ready! Send from daydaco server`,
    html: `
    <p style="font-size: 16px;">Here is the result page for contractor: ${contract}</p>
    <br />
    <a target="_blank" href="${pdf}">this is a link to document page, ready for print</a>
    `,
  };

      return mailTransport.sendMail(mailOptions, (erro, info) => {
        if(erro){
          return response.send(erro.toString()).end();
        }else{
          return response.send('200').end();
        }
          
      });

    })
    
      

    //console.log(request.body);
    //response.json(request.body);
    
  });



// const scrapeMetatags=(text)=>{
//   const url=text;
 
//     const res=await fetch(url);
//     const html=await res.text();
//     const $=cheerio.load(html);
//     const getMetatag=(name)=>
//     $(`meta[name=${name}]`).attr('content')||
//     $(`meta[property="og:${name}"]`).attr('content')||
//     $(`meta[property="twitter:${name}"]`).attr('content');

//     return{
//       url,
//       title:$('title').first().text(),
//       favicon:$('link[rel="shortcut icon"').attr('href'),
//       description:getMetatag('description'),
//       image:getMetatag('image'),
//       author:getMetatag('author'),
//     }
  
//   return Promise.res;
// }

// exports.metaurl=functions
// .https
// .onRequest((req,res)=>{
//   cors(req,res,async()=>{
//     const body=JSON.parse(req.body);
//     const data=await scrapeMetatags(body.text);
//     res.send(data)

//   })
// })



// exports.scraper=functions
// .https
// .onRequest((req,res)=>{
//   cors(req,res,async()=>{
//       var tag=req.body.tag;
//       const browser=await puppeteer
//       .launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']});

//       const page=await browser.newPage();
//       await page.goto(`https://twitter.com/search?q=${tag}&src=typed_query`);

//       await page.waitForSelector('img',{
//         visible:true,
//       });

//       const data=await page.evaluate(()=>{
//           const images=document
//           // .querySelector('img');
//           .querySelectorAll('img');

//           const urls=Array.from(images)
//           .map(v=>v.src);
//           return urls
//       });

//       await browser.close();

//       console.log(data)
//       return data;

//   })
// })