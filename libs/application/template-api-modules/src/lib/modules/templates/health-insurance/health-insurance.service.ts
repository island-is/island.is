import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { transformApplicationToHealthInsuranceDTO } from './health-insurance.utils'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplyHealthInsuranceApplication({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    try {
      logger.info(
        `Start send Health Insurance application for ${application.id}`,
      )
      const vistaSkjal = transformApplicationToHealthInsuranceDTO(application)
      logger.info(`Finished transform Application to Health Insurance DTO`)

      logger.info(`Start query`)
      const attachmentsStr = `["${vistaSkjal.attachmentsFileNames?.join(
        '","',
      )}"]`

      const query = `mutation {
        healthInsuranceApplyInsurance(
        inputs: {
          applicationNumber: "${vistaSkjal.applicationNumber}",
          applicationDate: "${vistaSkjal.applicationDate}",
          nationalId: "${vistaSkjal.nationalId}",
          foreignNationalId: "${vistaSkjal.foreignNationalId}",
          name: "${vistaSkjal.name}",
          ${vistaSkjal.address ? 'address:"' + vistaSkjal.address + '",' : ''}
          ${
            vistaSkjal.postalAddress
              ? 'postalAddress:"' + vistaSkjal.postalAddress + '",'
              : ''
          }
          ${
            vistaSkjal.citizenship
              ? 'citizenship:"' + vistaSkjal.citizenship + '",'
              : ''
          }
          email: "${vistaSkjal.email}",
          phoneNumber:"${vistaSkjal.phoneNumber}",
          ${
            vistaSkjal.residenceDateFromNationalRegistry
              ? 'residenceDateFromNationalRegistry:"' +
                vistaSkjal.residenceDateFromNationalRegistry +
                '",'
              : ''
          }
          ${
            vistaSkjal.residenceDateUserThink
              ? 'residenceDateUserThink:"' +
                vistaSkjal.residenceDateUserThink +
                '",'
              : ''
          }
          userStatus: "${vistaSkjal.userStatus}",
          isChildrenFollowed: ${vistaSkjal.isChildrenFollowed},
          previousCountry: "${vistaSkjal.previousCountry}",
          previousCountryCode: "${vistaSkjal.previousCountryCode}",
          previousIssuingInstitution: "${
            vistaSkjal.previousIssuingInstitution
          }",
          isHealthInsuredInPreviousCountry: ${
            vistaSkjal.isHealthInsuredInPreviousCountry
          },
          ${
            vistaSkjal.additionalInformation
              ? 'additionalInformation:"' +
                vistaSkjal.additionalInformation +
                '",'
              : ''
          }
          ${
            vistaSkjal.attachmentsFileNames &&
            vistaSkjal.attachmentsFileNames.length > 0
              ? 'attachmentsFileNames:' + attachmentsStr + ','
              : ''
          }
        }) {
          isSucceeded,
          caseId,
          comment
        }
      }`

      const res = await this.sharedTemplateAPIService
        .makeGraphqlQuery(authorization, query)
        .then(async (res: Response) => {
          const response = await res.json()
          if (response.errors) {
            logger.error(
              `Error in health insurance application: ${JSON.stringify(
                response.errors,
              )}`,
            )
            throw new Error(
              `Error in health insurance application: ${JSON.stringify(
                response.errors,
              )}`,
            )
          }
          logger.info(`Successful send application to SÍ`)
          return Promise.resolve(response.data)
        })
        .catch((error) => {
          logger.error(
            `Call query health insurance application failed because: ${JSON.stringify(
              error,
            )}`,
          )
          throw new Error(
            `Call query health insurance application failed because: ${JSON.stringify(
              error,
            )}`,
          )
        })

      logger.info(`Finished send Health Insurance application`)
    } catch (error) {
      logger.error(
        `Send health insurance application failed because: ${JSON.stringify(
          error,
        )}`,
      )
      throw new Error(
        `Send health insurance application failed because: ${JSON.stringify(
          error,
        )}`,
      )
    }
  }
}
