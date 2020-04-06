export class cardInfoS {
    cardId:string;
    cardAmount:number;
    cardImgUrl:any//Observable<string | null>;
    cardPrice:string;
    cardName:string;
    // cardRarity:string;
   
    constructor(ci:string,ca:number,ciu:any,cp:string,cn:string){
        this.cardId=ci;
        this.cardAmount=ca;
        this.cardImgUrl=ciu;
        this.cardPrice=cp;
        this.cardName=cn;
        // this.cardRarity=cr;
    }
}

export class cardInfoSs {
    cardId:string;
    cardAmount:number;
    cardImgUrl:any//Observable<string | null>;
    cardPrice:string;
    cardName:string;
    cardType:string;
    cardAttribute:string;
    cardRace:string;
   
    constructor(
        ci:string,
        ca:number,
        ciu:any,
        cp:string,
        cn:string,
        ct:string,
        cat:string,
        car:string
        ){
        this.cardId=ci;
        this.cardAmount=ca;
        this.cardImgUrl=ciu;
        this.cardPrice=cp;
        this.cardName=cn;
        this.cardType=ct;
        this.cardAttribute=cat;
        this.cardRace=car;
    }
}

export class cardInfoSss {
    cardId:string;
    cardAmount:number;
    cardImgUrl:any//Observable<string | null>;
    cardPrice:string;
    cardName:string;
    cardType:string;
    cardAttribute:string;
    cardRace:string;
    cardDesc:string;
   
    constructor(
        ci:string,
        ca:number,
        ciu:any,
        cp:string,
        cn:string,
        ct:string,
        cat:string,
        car:string,
        cde:string
        ){
        this.cardId=ci;
        this.cardAmount=ca;
        this.cardImgUrl=ciu;
        this.cardPrice=cp;
        this.cardName=cn;
        this.cardType=ct;
        this.cardAttribute=cat;
        this.cardRace=car;
        this.cardDesc=cde;
    }
}

//L append list
export class cardInfoSssL {
    cardId:string;
    cardAmount:number;
    cardImgUrl:any//Observable<string | null>;
    cardPrice:string;
    cardName:string;
    cardType:string;
    cardAttribute:string;
    cardRace:string;
    cardDesc:string;
    list:string;
   
    constructor(
        ci:string,
        ca:number,
        ciu:any,
        cp:string,
        cn:string,
        ct:string,
        cat:string,
        car:string,
        cde:string,
        l:string
        ){
        this.cardId=ci;
        this.cardAmount=ca;
        this.cardImgUrl=ciu;
        this.cardPrice=cp;
        this.cardName=cn;
        this.cardType=ct;
        this.cardAttribute=cat;
        this.cardRace=car;
        this.cardDesc=cde;
        this.list=l;
    }
}