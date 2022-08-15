export function isPrime(number: number) {
    if (!Number.isInteger(number)) return false

    if (number <= 3) return number > 1

    if (number % 2 === 0 || number % 3 === 0) return false

    const maxDivisor = Math.floor(Math.sqrt(number))
    for (let i = 5; i <= maxDivisor; i += 6) {
        if (number % i === 0 || number % (i + 2) === 0) return false
    }

    return true
}

export function randomPrime(min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    min = Math.ceil(min)
    max = Math.floor(max)

    const range = max - min + 1
    const randomNumber = Math.floor(Math.random() * range) + min

    if (isPrime(randomNumber)) return randomNumber

    let i = randomNumber - 1
    let j = randomNumber + 1
    while (i >= min && j <= max) {
        if (isPrime(i)) return i
        if (isPrime(j)) return j
        i -= 1
        j += 1
    }

    while (i >= min) {
        if (isPrime(i)) return i
        i -= 1
    }

    while (j <= max) {
        if (isPrime(j)) return j
        j += 1
    }

    return randomPrime(min, max);
}
