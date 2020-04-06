export class LoadBlock {
    ScaleTagID:string;
    Weight:string;
    Material:string;
    LoadStart:string;
    LoadEnd:string;
    LoadTimeStamp:string;

    UnloadStart:string;
    UnloadEnd:string;
    
   
    constructor(
        ScaleTagID:string,
        Weight:string,
        Material:string,
        LoadStart:string,
        LoadEnd:string,
        UnloadStart:string,
        UnloadEnd:string,
        LoadTimeStamp:string,
        ){
        this.ScaleTagID=ScaleTagID;
        this.Weight=Weight;
        this.Material=Material;
        this.LoadStart=LoadStart;
        this.LoadEnd=LoadEnd;
        this.LoadTimeStamp=LoadTimeStamp;
        this.UnloadStart=UnloadStart;
        this.UnloadEnd=UnloadEnd;
       
    }
}