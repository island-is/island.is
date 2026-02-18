import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import {
  HmsRentalAgreementService,
  HomeApi,
} from '@island.is/clients/hms-rental-agreement'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  isCancellation,
  parseCancelContract,
  parseTerminateContract,
} from './utils'
import { AttachmentS3Service } from '../../../shared/services'
import { ContractStatus } from './types'
import { coreErrorMessages } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { mockGetRentalAgreements } from './mockedRentalAgreements'

@Injectable()
export class TerminateRentalAgreementService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly homeApi: HomeApi,
    private readonly hmsService: HmsRentalAgreementService,
    private readonly attachmentService: AttachmentS3Service,
  ) {
    super(ApplicationTypes.TERMINATE_RENTAL_AGREEMENT)
  }

  async getRentalAgreements({ auth }: TemplateApiModuleActionProps) {
    try {
      const contracts = await this.hmsService
        .getRentalAgreementsDeprecated(auth)
        .then((res) => {
          return res
            .map((contract) => {
              if (contract.contractStatus === ContractStatus.STATUSVALID) {
                return contract
              }
            })
            .filter((contract) => contract !== undefined)
        })

      if (
        (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
        contracts.length === 0
      ) {
        this.logger.debug('Mocking rental agreements')
        return mockGetRentalAgreements()
      }

      if (contracts.length === 0) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.noContractFoundTitle,
            summary: coreErrorMessages.noContractFoundSummary,
          },
          400,
        )
      }

      return contracts
    } catch (e) {
      if (e instanceof TemplateApiError) {
        // If it's already a TemplateApiError, throw it
        throw e
      }
      this.logger.error('Failed to fetch rental agreements:', e.message)
      throw new TemplateApiError(e, 500)
    }
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      let files
      let parsedApplication
      try {
        files = await this.attachmentService.getFiles(application, [
          'fileUpload',
        ])
      } catch (e) {
        this.logger.error('Failed to get files:', e.message)
        throw e
      }
      if (isCancellation(application)) {
        try {
          parsedApplication = parseCancelContract(application, files)
        } catch (e) {
          this.logger.error('Failed to parse cancel contract:', e.message)
          throw e
        }
        try {
          return await this.homeApi.contractCancelPost({
            cancelContract: parsedApplication,
          })
        } catch (e) {
          this.logger.error('Failed to post cancel contract:', e.message)
          throw e
        }
      } else {
        try {
          parsedApplication = parseTerminateContract(application, files)
        } catch (e) {
          this.logger.error('Failed to parse terminate contract:', e.message)
          throw e
        }
        try {
          return await this.homeApi.contractTerminatePost({
            terminateContract: parsedApplication,
          })
        } catch (e) {
          this.logger.error('Failed to post terminate contract:', e.message)
          throw e
        }
      }
    } catch (e) {
      this.logger.error('Failed to submit application:', e.message)
      this.logger.error('Application submission failure cause:', e.cause)
      throw new TemplateApiError(e, 500)
    }
  }
}
