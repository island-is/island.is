import axios from 'axios'
import FormData from 'form-data'
import { Agent } from 'http'

export interface UploadFile {
  value: Buffer
  options?: {
    filename?: string
    contentType?: string
  }
}

export class UploadStreamApi {
  private readonly url: string

  constructor(
    basePath: string,
    private readonly headers: { [key: string]: string },
    private readonly agent: Agent | undefined,
  ) {
    this.url = `${basePath}/UploadStream`
  }

  async uploadStream(
    authenticationToken: string,
    file: UploadFile,
  ): Promise<string> {
    const formData = new FormData()
    formData.append('File', file.value, file.options)

    const url = `${this.url}?authenticationToken=${authenticationToken}`

    const requestOptions = {
      method: 'POST',
      headers: {
        ...this.headers,
        Accept: 'application/json',
        ...formData.getHeaders(),
      },
      data: formData,
      httpsAgent: this.agent,
    }

    try {
      const response = await axios(url, requestOptions)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data || error.message
        throw new Error(`Upload failed with status ${status}: ${message}`)
      }
      throw new Error(
        `Request failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }
}
