import { AES, SHA512, enc } from 'crypto-js';
import { randomPrime } from 'src/app/Utils/Prime';

class DiffieHellman {
    private prime: number;
    private anyNumber: number;
    private privateKey: number;
    private hashKey: string;
    private numberKey: BigInt;
    private publicKey: BigInt | undefined;
    private entryKey: string;
    private hashEntryKey: string;

    private static readonly MIN_PRIME = 1000;
    private static readonly MAX_PRIME = 19999999;

    constructor() {
        this.entryKey = "";
        this.hashEntryKey = "";
        this.hashKey = "";
        this.numberKey = 0n;
        this.prime = randomPrime(DiffieHellman.MIN_PRIME, DiffieHellman.MAX_PRIME)
        this.anyNumber = Crypto.randomNumber(2, 10)
        this.privateKey = Crypto.randomNumber(DiffieHellman.MIN_PRIME - 1, this.prime - 1)
    }

    public set Key(publicKey: string) {
        const _publicKey = BigInt(publicKey);
        const prime = BigInt(this.prime);
        const privateKey = BigInt(this.privateKey);

        this.numberKey = ((_publicKey ** privateKey) % prime);
        this.hashKey = SHA512(this.numberKey.toString()).toString(enc.Hex);
    }

    public get Key() {
        return (this.hashKey);
    }

    public set EntryKey(entryKey: string) {
        this.entryKey = entryKey;
        this.hashEntryKey = SHA512(this.entryKey.toString()).toString(enc.Hex);
    }

    public get EntryKey(): string {
        return (this.entryKey);
    }

    public set Prime(prime: number) {
        this.prime = prime;
    }

    public get Prime(): number {
        return (this.prime);
    }

    public set AnyNumber(anyNumber: number) {
        this.anyNumber = anyNumber;
    }

    public get AnyNumber(): number {
        return (this.anyNumber);
    }

    public get HashEntryKey(): string {
        return (this.hashEntryKey.toString());
    }

    public get PublicKey() {
        if (this.publicKey === undefined) {
            const prime = BigInt(this.prime);
            const anyNumber = BigInt(this.anyNumber);
            const privateKey = BigInt(this.privateKey);
            this.publicKey = (((anyNumber ** privateKey) % prime));
        }

        return this.publicKey.toString();
    }
}

export class Crypto extends DiffieHellman {
    constructor() {
        super();
    }

    public static randomNumber(min: number, max: number) {
        return (Math.floor(Math.random() * (max - min) + min));
    }

    public encryptEntry(message: string) {
        if (this.EntryKey !== "")
            return (this.encrypt(message, this.HashEntryKey));
        return (message);
    }

    public decryptEntry(message: string) {
        if (this.EntryKey !== "")
            return (this.decrypt(message, this.HashEntryKey));
        return (message);
    }

    public encryptDH(message: string) {
        if (this.Key !== "")
            return (this.encrypt(message, this.Key));
        return (message);
    }

    public decryptDH(message: string) {
        if (this.Key !== "")
            return (this.decrypt(message, this.Key));
        return (message);
    }

    private encrypt(message: string, key: string) {
        return (AES.encrypt(message, key).toString())
    }

    private decrypt(message: string, key: string) {
        return (AES.decrypt(message, key).toString(enc.Utf8))
    }
}
