import { Component } from '@angular/core';
import { Chat } from 'src/app/Utils/Chat';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  constructor(private chatService: ChatService) { }

  protected get Contacts(): Array<string> {
    return (this.chatService.Contacts);
  }
  protected get ChatSelected(): Chat | undefined {
    return (this.chatService.ChatSelected);
  }

  protected HasMessage(contact: string): boolean {
    var chat = this.chatService.getChat(contact);

    if (chat === undefined)
      return false;

    return chat.Contact.hasNewMessage;
  }

  protected showChat(contact: string) {
    this.chatService.showChat(contact);
  }

  protected getColor(contact: string) {
    if (this.ChatSelected !== undefined)
      if (contact === this.ChatSelected.Contact.name)
        return 'basic';

    return 'primary';
  }

}
