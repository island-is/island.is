declare module 'entropy-string' {
  export class Entropy {
    constructor({ bits: number })
    string: () => string
  }
}
