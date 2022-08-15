import { Component, HostListener } from '@angular/core';
import { Content } from 'src/app/interfaces/content.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  protected message: string = "";

  constructor(private chatService: ChatService) { }

  protected get ChatSelected() { return (this.chatService.ChatSelected); };
  protected get ContactIsOffline(): boolean { return (this.chatService.ContactIsOffline); }

  protected getClass(message: Content): string {
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        this.addMessage();
        break;
      default:
        break;
    }
  }
}
