import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})



export class PaintComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var canvas = <HTMLCanvasElement>document.getElementById("mycanvas");
    var context = canvas.getContext("2d");

    
    let Dimension=25;
    let width=canvas.width;
    let height=canvas.height;
    let pixelSize=width/Dimension;

    context.strokeStyle='rgba(0,0,0,0.1)';

    for(let i=0;i<Dimension;++i){
      let x=Math.floor(i*width/Dimension);
      context.beginPath();
      context.moveTo(x,0);
      context.lineTo(x,height);
      context.stroke();

      let y=Math.floor(i*height/Dimension);
      context.beginPath();
      context.moveTo(0,y);
      context.lineTo(width,y);
      context.stroke();

    }

    //Background
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('click', (e)=>{

      console.log(e);
      let offsetX=e.offsetX;
      let offsetY=e.offsetY;

      let pixel=[Math.floor(offsetX/pixelSize),Math.floor(offsetY/pixelSize)];

      if(e.which==1){
          console.log(e+"mousedown")
      }
      
      //Zoomed in red 'square'
      context.fillStyle = "#FFF";
      context.fillRect(pixel[0]*pixelSize, pixel[1]*pixelSize, pixelSize-1, pixelSize-1);
    });
    
    
  }

}
