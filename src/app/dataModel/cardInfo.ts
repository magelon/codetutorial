// import { Observable, from, BehaviorSubject, Subject } from 'rxjs';
export class cardInfo {
    cardId:string;
    cardAmount:number;
    cardImgUrl:any//Observable<string | null>;
    cardPrice:string;
    // cardRarity:string;
   
    constructor(ci:string,ca:number,ciu:any,cp:string){
        this.cardId=ci;
        this.cardAmount=ca;
        this.cardImgUrl=ciu;
        this.cardPrice=cp;
        // this.cardRarity=cr;
    }
}