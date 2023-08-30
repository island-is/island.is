export class CustomNextError extends Error {
  statusCode: number
  title: string
  constructor(statusCode: number, title?: string, message?: string) {
    super(message ?? title)
    this.statusCode = statusCode
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    this.title = title
  }
}
