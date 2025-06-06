import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
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
@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
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
        this.logger.error('Failed to fetch properties:', e)
        throw new Error('Villa kom upp við að sækja eignir')
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
      this.logger.error('Failed to calculate amount:', e)
      throw new Error('Villa kom upp við að reikna út núverandi brunabótamat')
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
      console.log('--------------------------------')
      console.log('SUBMITTING APPLICATION')
      console.log('--------------------------------')
      const applicationDto = mapAnswersToApplicationDto(application)
      console.dir(applicationDto, { depth: null })

      const res = await this.hmsApplicationSystemService.apiApplicationPost({
        applicationDto,
      })

      console.log('--------------------------------')
      console.log('APPLICATION SUBMITTED')
      console.log('--------------------------------')
      console.log(res)
      console.log('--------------------------------')

      if (res.status !== 200) {
        throw new Error('Villa kom upp við að senda umsókn')
      }

      return res
    } catch (e) {
      console.log('--------------------------------')
      console.log('FAILED TO SUBMIT APPLICATION')
      console.log('--------------------------------')
      console.log(e)
      console.log('--------------------------------')
      this.logger.error('Failed to submit application:', e)
    }
  }
}
