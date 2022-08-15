import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';

import { Chat } from 'src/app/Utils/Chat';
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

    this.on('newMessage', (body: any) => this.digest(body));
    this.on('configCall', (body: any) => body);
    this.on('addContact', (body: any) => body);
    this.on('getContacts', (body: any) => body);
    this.on('removeContact', (body: any) => body);

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

    const contactId = this.chatSelected.Contact.name;

    if (this.chatSelected.IsFisrtMessage) {
      const chat = this.chatSelected;
      const prime = chat.crypto.Prime;
      const anyNumber = chat.crypto.AnyNumber;
      const publicKey = chat.crypto.PublicKey;

      this.emit('configCall', { contactId, prime, anyNumber, publicKey });
      this.Socket.on('confirmConfigCall', ({ publicKey }) => {
        this.Socket.removeListener('confirmConfigCall');

        if (chat === undefined)
          return;

        chat.crypto.Key = publicKey;

        chat.addMessage(message);

        message = chat.crypto.encryptEntry(message);
        message = chat.crypto.encryptDH(message);

        this.emit('addMessage', { contactId, message });
      });
    }
    else {
      this.chatSelected.addMessage(message);

      message = this.chatSelected.crypto.encryptEntry(message);
      message = this.chatSelected.crypto.encryptDH(message);

      this.emit('addMessage', { contactId, message });
    }
  }

  private digest(body: any) {
    const { author } = body;

    body.message = this.chats[author].crypto.decryptDH(body.message);
    body.message = this.chats[author].crypto.decryptEntry(body.message);
    return (body);
  }

  private async configCall(body: any) {
    const { contactId, prime, anyNumber, publicKey } = body;
    const chat = this.chats[contactId];

    if (chat == undefined)
      return;

    chat.crypto.Prime = prime;
    chat.crypto.AnyNumber = anyNumber;
    chat.crypto.Key = publicKey;

    this.emit('confirmConfigCall', { contactId, publicKey: chat.crypto.PublicKey });
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
