import { Crypto } from "src/app/Utils/Crypto";
import { Contact } from "src/app/interfaces/contact.interface";
import { Content } from "src/app/interfaces/content.interface";

export class Chat {
    private author: string
    private contact: Contact
    private content: Array<Content>
    private isFisrtMessage: boolean
    private crypto: Crypto

    constructor(contact: Contact, author: string) {
        this.content = []
        this.author = author
        this.contact = contact
        this.isFisrtMessage = true;
        this.crypto = new Crypto();
    }

    public get Contact(): Contact { return this.contact }
    public get Content(): Array<Content> { return this.content }
    public get IsFisrtMessage(): boolean { return this.isFisrtMessage }

    public addMessage(content: string): void {
        this.isFisrtMessage = false;
        this.Content.push({ author: this.author, content })
    }

    public newMessage(author: string, content: string, newContent: boolean = false) {
        this.Contact.hasNewMessage = newContent;
        this.Content.push({ author, content })
    }
}
