export class CustomNextError extends Error {
  statusCode: number
  title: string
  constructor(statusCode: number, title?: string, message?: string) {
    super(message ?? title)
    this.statusCode = statusCode
    // @ts-ignore make web strict
    this.title = title
  }
}
