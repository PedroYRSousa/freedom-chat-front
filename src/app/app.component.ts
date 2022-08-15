import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private chatService: ChatService) {

  }

  public get Id() { return (this.chatService.Id || "ID"); };
  public get Connected() { return (this.chatService.Connected); };
}
