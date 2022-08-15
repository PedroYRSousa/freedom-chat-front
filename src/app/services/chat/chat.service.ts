import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';

import { Chat } from 'src/app/components/chat/Chat';
import { MySocket } from 'src/app/MySocket/MySocket';
import { AudioService } from 'src/app/services/audio/audio.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends MySocket {

  private contacts: Array<string> = [];
  private chatSelected: Chat | undefined = undefined;
  private chats: { [id: string]: Chat } = {};

  constructor(private audioService: AudioService) {
    super(io(environment.URL));

    this.on('newMessage');
    this.on('addContact');
    this.on('getContacts');
    this.on('removeContact');

    this.emit('getContacts', {});
  }

  public get ChatSelected(): Chat | undefined { return (this.chatSelected); }
  public get Contacts(): Array<string> { return (this.contacts); }
  public get ContactIsOffline(): boolean {
    if (this.chatSelected === undefined)
      return true;

    if (!this.contacts.includes(this.chatSelected.Contact.name))
      return (true);

    return (false);
  }

  public getChat(contactId: string): Chat | undefined {
    if (!this.contacts.includes(contactId))
      return undefined;

    return (this.chats[contactId])
  }

  public showChat(contact: string): void {
    if (this.chatSelected !== undefined)
      if (!this.Contacts.includes(this.chatSelected.Contact.name))
        delete this.chats[this.chatSelected.Contact.name];

    this.chatSelected = this.getChat(contact);

    if (this.chatSelected !== undefined)
      this.chatSelected.Contact.hasNewMessage = false;
  }

  public addMessage(message: string) {
    if (this.chatSelected === undefined)
      return;

    this.chatSelected.addMessage(message);
    this.emit('addMessage', { contactId: this.chatSelected.Contact.name, message });
  }

  private newMessage(body: any) {
    const { author, message } = body;

    var chat = this.getChat(author);

    if (chat === undefined)
      return;

    this.audioService.playAudio();
    chat.newMessage(author, message, this.chatSelected !== chat);
  }

  private getContacts(body: any) {
    const { contacts } = body;

    (contacts as Array<string>).forEach(contact => {
      this.addContact({ contact });
    });
  }

  private addContact(body: any) {
    const { contact } = body;

    this.chats[contact] = new Chat({ name: contact, hasNewMessage: false }, this.Id);
    this.contacts.push(contact)
  }

  private removeContact(body: any) {
    const { contact } = body;

    if (!this.Contacts.includes(contact))
      return;

    this.contacts = this.contacts.filter((_contact) => _contact !== contact)
  }
}
