import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';


@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    if (!this.swUpdate.isEnabled) {
      console.log('Nope ☹');
    }else{
      this.swUpdate.checkForUpdate();
    }
    this.swUpdate.available.subscribe(evt => {
      const snack = this.snackbar.open('Update Available', 'Click here to Reload 🎁',{
        duration: 6000,
      })
      
      snack
        .onAction()
        .subscribe(() => {
          window.location.reload();
        })

      })
  }
}
