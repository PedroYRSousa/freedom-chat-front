import { Socket } from "socket.io";

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

    protected broadcast(label: string, args: any) {
        this.Socket.broadcast.emit(label, args);
    }
}
