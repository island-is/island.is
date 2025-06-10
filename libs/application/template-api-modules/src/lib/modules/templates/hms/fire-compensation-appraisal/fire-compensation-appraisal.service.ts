import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { mockGetProperties } from './mockedFasteign'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'
import { mapAnswersToApplicationDto, paymentForAppraisal } from './utils'
import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private propertiesApi: FasteignirApi,
    private hmsApplicationSystemService: ApplicationApi,
  ) {
    super(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getProperties({ auth }: TemplateApiModuleActionProps) {
    let properties: Array<Fasteign> = []

    // Mock for dev, since there is no dev service for the propertiesApi
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      properties = mockGetProperties()
    }
    // If on prod we fetch a list of all the fasteignanúmer for kennitala and then
    // fetch each property individually with the full data.
    else {
      try {
        const simpleProperties = await this.getRealEstatesWithAuth(
          auth,
        ).fasteignirGetFasteignir({ kennitala: auth.nationalId })

        properties = await Promise.all(
          simpleProperties?.fasteignir?.map((property) => {
            return this.propertiesApi.fasteignirGetFasteign({
              fasteignanumer: property.fasteignanumer ?? '',
            })
          }) ?? [],
        )
      } catch (e) {
        this.logger.error('Failed to fetch properties:', e.message)
        throw new TemplateApiError(e, 500)
      }
    }

    return properties
  }

  async calculateAmount(props: TemplateApiModuleActionProps) {
    const { application } = props

    try {
      const properties = await this.getProperties(props)

      const selectedRealEstateId = getValueViaPath<string>(
        application.answers,
        'realEstate',
      )
      const selectedUsageUnits = getValueViaPath<Array<string>>(
        application.answers,
        'usageUnits',
      )

      const property = properties.find(
        (property) => property.fasteignanumer === selectedRealEstateId,
      )

      const usageUnitsFireAppraisal =
        property?.notkunareiningar?.notkunareiningar?.map((unit) => {
          if (selectedUsageUnits?.includes(unit.notkunareininganumer ?? '')) {
            return unit.brunabotamat
          }
          return 0
        })

      const selectedUnitsFireAppraisal =
        usageUnitsFireAppraisal?.reduce((acc, curr) => {
          return (acc ?? 0) + (curr ?? 0)
        }, 0) ?? 0

      return paymentForAppraisal(selectedUnitsFireAppraisal)
    } catch (e) {
      this.logger.error('Failed to calculate amount:', e.message)
      throw new TemplateApiError(
        'Error came up calculating the current fire compensation appraisal',
        500,
      )
    }
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      const applicationDto = mapAnswersToApplicationDto(application)

      const res = await this.hmsApplicationSystemService.apiApplicationPost({
        applicationDto,
      })

      if (res.status !== 200) {
        throw new TemplateApiError(
          'Failed to submit application, non 200 status',
          500,
        )
      }

      return res
    } catch (e) {
      this.logger.error('Failed to submit application:', e.message)
      throw new TemplateApiError(e, 500)
    }
  }
}
