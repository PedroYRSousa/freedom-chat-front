import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import MySocket from 'src/app/MySocket/MySocket';
import { Chat } from 'src/app/interfaces/chat.interface';
import { Contact } from 'src/app/interfaces/contact.interface';

import { AudioService } from 'src/app/services/audio/audio.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends MySocket {

  private contacts: Array<Contact> = [];
  private contactSelected: string = "-1";
  private chat: Array<Chat> = [];

  constructor(private audioService: AudioService) {
    super(io('http://localhost:3000/'));

    this.on('getChat');
    this.on('addContact');
    this.on('getContacts');
    this.on('removeContact');
    this.on('alertNewContentChat');

    this.emit('getContacts', {});
  }

  public get Chat(): Array<Chat> { return (this.chat); }
  public get Contacts(): Array<Contact> { return (this.contacts); }
  public get ContactSelected(): string { return (this.contactSelected); }

  public askChat(contact: string) {
    this.contactSelected = contact;

    this.contacts.forEach(_contact => {
      if (_contact.name === contact)
        _contact.hasNewMessage = false;
    });

    this.emit('askChat', { contactId: contact });
  }

  public addMessage(message: string) {
    const contactId = this.ContactSelected;

    this.emit('addMessage', { contactId, message });
  }

  private getChat(body: any) {
    const { chat } = body;

    this.chat = chat;
  }

  private getContacts(body: any) {
    const { contacts } = body;

    (contacts as Array<string>).forEach(contact => {
      this.contacts.push({ name: contact, hasNewMessage: false })
    });
  }

  private addContact(body: any) {
    const { contact } = body;

    this.contacts.push({ name: contact, hasNewMessage: false });
  }

  private removeContact(body: any) {
    if (this.ContactSelected === body.contact)
      this.contactSelected = "";

    this.contacts = this.contacts.filter((contact) => contact.name !== body.contact)
  }

  private alertNewContentChat(body: any) {
    const { contactId } = body;

    this.audioService.playAudio();

    this.contacts.forEach(contact => {
      if (contact.name === contactId)
        contact.hasNewMessage = true;
    });
  }
}
