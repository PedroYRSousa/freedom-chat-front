import { AES, SHA512, enc } from 'crypto-js';
import { randomPrime } from 'src/app/Utils/Prime';

export class Crypto {
    constructor() {
        var key = SHA512("teste").toString();
        console.log("key");
        console.log(key);
        var encrypt = AES.encrypt("teste", key).toString();
        console.log("encrypt");
        console.log(encrypt);
        var decrypt = AES.decrypt(encrypt, key).toString(enc.Utf8);
        console.log("decrypt");
        console.log(decrypt);

        var prime = randomPrime();
        console.log("prime");
        console.log(prime);
    }
}
