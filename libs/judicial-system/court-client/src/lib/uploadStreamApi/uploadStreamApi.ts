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
        const data = error.response?.data
        const message =
          data === undefined || data === null
            ? error.message
            : typeof data === 'string'
            ? data
            : JSON.stringify(data)

        // The status is reported separately so that callers can react to
        // specific responses, such as the file being too large.
        throw {
          status,
          message: `Upload failed with status ${status}: ${message}`,
        }
      }

      throw new Error(
        `Request failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }
}
