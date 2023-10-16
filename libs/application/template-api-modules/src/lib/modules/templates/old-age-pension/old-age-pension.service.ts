import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'

import {
  HelloOddurApi,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'
import { coreErrorMessages } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

interface customError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

@Injectable()
export class OldAgePensionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    private helloOddurApi: HelloOddurApi,
  ) {
    super(ApplicationTypes.OLD_AGE_PENSION)
  }

  private parseErrors(e: Error | customError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async helloWorld({ application, auth }: TemplateApiModuleActionProps) {
    let response

    try {
      response = await this.siaClientService.getOddur(auth)
    } catch (e) {
      throw new TemplateApiError(
        {
          title: 'Computer says NO!',
          summary: 'Villa hjá TR',
        },
        500,
      )
    }

    return response
  }

  async getStatus({ application, auth }: TemplateApiModuleActionProps) {
    console.log('--------------- AUTH -------------------', auth)

    /*
    When applicant creates new application:
    If no application, create new one
    If there is application with status ‘TRYGGINGASTOFNUN_SUBMITTED' ( send to TR and waiting for them to open ), No creating new application, can only change old one
    If there is application with status ‘TRYGGINGASTOFNUN_IN_REVIEW’ or 'REJECTED’, create new one
    */

    try {
      const resp = await this.siaClientService.getStatus(auth)

      console.log('Computer says OK!!!!', resp)
    } catch (e) {
      this.logger.error('No HELLO!!!!', e)

      throw new TemplateApiError(
        {
          title: 'Computer says NO!',
          summary: 'Villa hjá TR',
        },
        500,
      )
    }

    return true
  }

  async getBankInfo({ auth }: TemplateApiModuleActionProps) {
    try {
      console.log('auth: ', auth)
      const res = await this.siaClientService.getBankInfo(auth)

      if (isRunningOnEnvironment('local')) {
        if (!res.bank) {
          ;(res.bank = '2222'),
            (res.ledger = '00'),
            (res.accountNumber = '123456')
        }
      }
    
      return res
    } catch (e) {
      throw new TemplateApiError(coreErrorMessages.defaultTemplateApiError, 500)
    }
  }
}
