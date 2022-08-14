import { Socket } from "socket.io-client";

export default class MySocket {
    private id = "";
    private socket: Socket;

    constructor(socket: Socket) {
        this.id = socket.id;
        this.socket = socket;
    }

    public get Id() { return (this.id) };
    public get Socket() { return (this.socket) };

    protected on(label: string) {
        this.Socket.on(label, (body) => {
            if ((this as any)[label])
                (this as any)[label](body)
        });
    }

    protected emit(label: string, args: any) {
        this.Socket.emit(label, args);
    }
}
