export class jobBlockForOwner {
    date:string;
    contractor:string;
    broker:string;
    owner:string;
    jobUid:string;
    subHauler:string;
    driver:string;
    driverId:string;
   
    constructor(
        date:string,
        contra:string,
        broker:string,
        owner:string,
        jobUid:string,
        subHauler:string,
        driver:string,
        driverId:string
        ){
            this.date=date;
        this.broker=broker;
        this.owner=owner;
        this.contractor=contra;
        this.jobUid=jobUid;
        this.subHauler=subHauler;
        this.driverId=driverId;
        this.driver=driver;
    }
}
