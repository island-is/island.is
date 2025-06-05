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

export class CustomNextRedirect extends Error {
  destination: string
  permanent: boolean
  constructor(destination: string, permanent = false) {
    super(`Redirecting to ${destination}`)
    this.destination = destination
    this.permanent = permanent
  }
}
