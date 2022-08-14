import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playAudio() {
    let audio = new Audio();
    audio.src = "../../../assets/teste.wav";
    audio.load();
    audio.play();
  }
}
