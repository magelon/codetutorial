import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})



export class PaintComponent implements OnInit {

   

    constructor() {
       
    }

    download(){
    var canvas = <HTMLCanvasElement>document.getElementById("mycanvas");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
    
  }

ngOnInit() {

var colorPicker=<HTMLCanvasElement>document.getElementById("body");
var fillColor='rgba(0,0,0,0.1)';

  colorPicker.addEventListener("change", watchColorPicker, false);

function watchColorPicker(event) {
  document.querySelectorAll("p").forEach(function(p) {
    p.style.color = event.target.value;
    fillColor= event.target.value;

  });
}

    var canvas = <HTMLCanvasElement>document.getElementById("mycanvas");
    var context = canvas.getContext("2d");
    
    let Dimension=10;
    let width=canvas.width;
    let height=canvas.height;
    let pixelSize=width/Dimension;

    context.strokeStyle='rgba(0,0,0,0.1)';

  //Background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //drawing the board
    for(let i=0;i<Dimension;++i){
      let x=Math.floor(i*width/Dimension);
      context.beginPath();
      //pixelSize devide by two can 
      context.moveTo(x+pixelSize,0);
      context.lineTo(x+pixelSize,height);
      context.stroke();

      let y=Math.floor(i*height/Dimension);
      context.beginPath();
      context.moveTo(0,y+pixelSize);
      context.lineTo(width,y+pixelSize);
      context.stroke();

    }

    canvas.addEventListener('click', (e)=>{

      console.log(e);
      let offsetX=e.offsetX;
      let offsetY=e.offsetY;

      let pixel=[Math.floor(offsetX/pixelSize),Math.floor(offsetY/pixelSize)];

      if(e.which==1){
          console.log(e+"mousedown")
      }
      
      //Zoomed in red 'square'
      context.fillStyle = fillColor;
      context.fillRect(pixel[0]*pixelSize, pixel[1]*pixelSize, pixelSize-1, pixelSize-1);
    });
    
    
  }

}
