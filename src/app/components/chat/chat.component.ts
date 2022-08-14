import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  protected message: string = "";

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  protected get Chat(): Array<Chat> { return (this.chatService.Chat); }
  protected get ContactSelected(): string { return (this.chatService.ContactSelected); }

  protected getClass(message: Chat): string {
    if (message.author === this.chatService.Id)
      return ('me');

    return ('');
  }

  protected addMessage() {
    if (this.message.length <= 0)
      return;

    this.chatService.addMessage(this.message);
    this.message = "";
  }
}
