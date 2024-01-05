import FormData from 'form-data'
import { Agent } from 'http'
import request from 'request'

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

  uploadStream(authenticationToken: string, file: UploadFile): Promise<string> {
    const formData = new FormData()
    formData.append('File', file.value, file.options)

    const requstOptions: request.Options = {
      method: 'POST',
      qs: { authenticationToken },
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      uri: `${this.url}?authenticationToken=${authenticationToken}`,
      json: true,
      formData: { File: file },
      agent: this.agent,
    }

    return new Promise<string>((resolve, reject) => {
      request(requstOptions, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          if (
            response.statusCode &&
            response.statusCode >= 200 &&
            response.statusCode < 300
          ) {
            resolve(body)
          } else {
            reject({ status: response.statusCode, message: body })
          }
        }
      })
    })
  }
}
