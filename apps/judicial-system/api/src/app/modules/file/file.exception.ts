export class FileExeption extends Error {
  constructor(public readonly status: number, statusText: string) {
    super(statusText)
  }
}
