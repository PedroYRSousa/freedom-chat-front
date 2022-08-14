import { Component, OnInit, HostListener, OnChanges, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {

  @Input() chat: Array<Chat> = [];
  @ViewChild('viewChat') viewChat!: ElementRef;
  protected message: string = "";

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    setInterval(() => {
      if (!this.viewChat)
        return;

      if (!this.viewChat.nativeElement)
        return;

      this.viewChat.nativeElement.scrollTop = this.viewChat.nativeElement.scrollHeight;
    }, 500)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewChat)
      return;

    if (!this.viewChat.nativeElement)
      return;

    this.viewChat.nativeElement.scrollTop = this.viewChat.nativeElement.scrollHeight;
  }

  protected get Chat(): Array<Chat> { return (this.chat); }
  protected get ContactSelected(): string { return (this.chatService.ContactSelected); }
  protected get ContactSelectedIsOffline(): boolean { return (this.chatService.ContactSelected === ""); }

  protected getClass(message: Chat): string {
    if (message.author === this.chatService.Id)
      return ('me');

    return ('');
  }

  protected addMessage() {
    if (this.message.length <= 0)
      return;

    this.chatService.addMessage(this.message);
    this.chat.push({ author: this.chatService.Id, content: this.message });
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
