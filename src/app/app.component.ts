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
  protected get ContactIsOffline(): boolean { return (this.chatService.ContactIsOffline); }
  protected set EntryKey(entryKey: string) {
    if (this.chatService.ChatSelected === undefined)
      return;

    this.chatService.ChatSelected.crypto.EntryKey = entryKey;
  }
  protected get EntryKey() {
    if (this.chatService.ChatSelected === undefined)
      return "";

    return (this.chatService.ChatSelected.crypto.EntryKey);
  }

}
