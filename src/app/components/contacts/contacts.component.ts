import { Component } from '@angular/core';
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

  protected askChat(contact: string) {
    this.chatService.askChat(contact);
  }

  protected getColor(contact: string) {
    if (contact === this.chatService.ContactSelected)
      return 'basic';

    return 'primary';
  }

}
