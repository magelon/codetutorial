import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
 import { Observable } from 'rxjs';
 import {finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload-to-fi',
  templateUrl: './upload-to-fi.component.html',
  styleUrls: ['./upload-to-fi.component.css']
})
export class UploadToFiComponent implements OnInit {

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage) { }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = '/ups/icon';
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
    )
    .subscribe()

  }

  ngOnInit() {
  }

}
