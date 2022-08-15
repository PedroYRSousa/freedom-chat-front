import { Socket } from "socket.io-client";

export class MySocket {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public get Id() { return (this.socket.id) };
    public get Socket() { return (this.socket) };
    public get Connected() { return (this.socket.connected) };

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
