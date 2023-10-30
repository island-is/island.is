import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LicenseClient, Result } from '../../licenseClient.type'
import { FetchError, handle404 } from '@island.is/clients/middlewares'
import {
  BasicCardInfoDTO,
  EhicApi,
  TempPDFCardResponseDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { EhicCardResponse } from './ehicCardClient.type'

@Injectable()
export class EhicClient implements LicenseClient<BasicCardInfoDTO> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private ehicApi: EhicApi,
  ) {}
  clientSupportsPkPass = false

  async getLicense(user: User): Promise<Result<EhicCardResponse | null>> {
    try {
      const api = this.ehicApi.withMiddleware(new AuthMiddleware(user as Auth))

      const data = await api.getEhicCard()

      if (data.hasTempCard) {
        const pdfData = await api.getEhicPdfCard().catch(handle404)

        if (pdfData?.data) {
          return {
            ok: true,
            data: {
              ...data,
              tempCardPdf: pdfData.data,
            },
          }
        }
      }

      return { ok: true, data }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return { ok: true, data: null }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
      }
      return {
        ok: false,
        error,
      }
    }
  }
}
