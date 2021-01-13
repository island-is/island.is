class APIResponse {
  constructor() {
    this.statusCode = 0
    this.message = []
    this.error = ''
  }

  statusCode: number
  message: string[]
  error: string
}

export default APIResponse
