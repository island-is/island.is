declare module 'base45-js' {
  export function decode(input: string): Uint8Array
  export function encode(input: Uint8Array): string
}
