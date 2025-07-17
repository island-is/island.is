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

      if (response.status >= 200 && response.status < 300) {
        return response.data
      } else {
        throw { status: response.status, message: response.data }
      }
    } catch (error) {
      if (error.response) {
        throw { status: error.response.status, message: error.response.data }
      }
      throw new Error(`Request failed: ${error.message}`)
    }
  }
}
