export class JobBlock {
    contractor:string;
    jobId:string;
    jobCount:string;
    driver:string;
   
    constructor(contra:string,jobId:string,jobCount:string,driver:string){
        this.contractor=contra;
        this.jobId=jobId;
        this.jobCount=jobCount;
        this.driver=driver;
    }
}
