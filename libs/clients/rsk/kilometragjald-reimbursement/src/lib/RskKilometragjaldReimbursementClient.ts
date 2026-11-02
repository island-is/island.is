import { Injectable } from '@nestjs/common'
import FormData from 'form-data'

import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'

import {
  Configuration,
  ReimbursementApi,
  ReimbursementApplication,
  ReimbursementApplicationFromJSON,
} from '../../gen/fetch'

export interface ReimbursementFile {
  fileName: string
  content: Buffer
  contentType?: string
}

export interface SubmitReimbursementInput {
  /** Vehicle registration number (fastanúmer) */
  fastnr: string
  /** yyyy-MM-dd */
  departureDate: string
  departureMileage: number
  /** yyyy-MM-dd */
  arrivalDate: string
  arrivalMileage: number
  files: ReimbursementFile[]
}

@Injectable()
export class RskKilometragjaldReimbursementClient {
  private readonly api: ReimbursementApi

  constructor(private readonly config: Configuration) {
    this.api = new ReimbursementApi(config)
  }

  getApplication(
    auth: Auth,
    fastnr: string,
    requestedBy: string,
  ): Promise<ReimbursementApplication> {
    return this.api
      .withMiddleware(new AuthMiddleware(auth))
      .getReimbursementApplication({ fastnr, requestedBy })
  }

  /**
   * The generated client can not be used for this endpoint: it builds the
   * multipart body with the global FormData, which node-fetch does not
   * serialize, joins the files into a single string and sends dates with
   * Date.toString(). The body is therefore built here with form-data.
   */
  async submitApplication(
    auth: Auth,
    input: SubmitReimbursementInput,
  ): Promise<ReimbursementApplication> {
    const form = new FormData()
    form.append('Fastnr', input.fastnr)
    form.append('DepartureDate', input.departureDate)
    form.append('DepartureMileage', input.departureMileage.toString())
    form.append('ArrivalDate', input.arrivalDate)
    form.append('ArrivalMileage', input.arrivalMileage.toString())
    input.files.forEach((file) =>
      form.append('Files', file.content, {
        filename: file.fileName,
        contentType: file.contentType,
      }),
    )

    const response = await this.config.fetchApi(
      `${this.config.basePath}/reimbursement/submit`,
      {
        method: 'POST',
        headers: {
          ...this.config.headers,
          ...form.getHeaders(),
          Accept: 'application/json',
          Authorization: auth.authorization,
        },
        body: form.getBuffer(),
      },
    )

    if (!response.ok) {
      throw new Error(
        `Kilometragjald reimbursement submit failed with status ${
          response.status
        }: ${await response.text()}`,
      )
    }

    return ReimbursementApplicationFromJSON(await response.json())
  }
}
