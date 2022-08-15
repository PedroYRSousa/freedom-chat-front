import { Contact } from "src/app/interfaces/contact.interface";
import { Content } from "src/app/interfaces/content.interface";

export class Chat {
    private author: string
    private contact: Contact
    private content: Array<Content>

    constructor(contact: Contact, author: string) {
        this.content = []
        this.author = author
        this.contact = contact
    }

    public get Contact(): Contact { return this.contact }
    public get Content(): Array<Content> { return this.content }

    public addMessage(content: string): void {
        this.Content.push({ author: this.author, content })
    }

    public newMessage(author: string, content: string, newContent: boolean = false) {
        this.Contact.hasNewMessage = newContent;
        this.Content.push({ author, content })
    }
}
