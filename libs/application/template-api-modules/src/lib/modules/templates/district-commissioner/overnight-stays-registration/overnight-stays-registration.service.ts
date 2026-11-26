import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import {
  buildSubmissionPayload,
  getHomeLodgingYear,
  HomeLodging,
  OvernightStaySubmissionResponse,
} from '@island.is/application/templates/district-commissioners/overnight-stays-registration'
import {
  DistrictCommissionersHomeLodgingsService,
  HomeLodgingDto,
} from '@island.is/clients/district-commissioners-home-lodgings'
import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'

const toHomeLodging = (homeLodging: HomeLodgingDto): HomeLodging => ({
  ...homeLodging,
  years: [...homeLodging.years].sort((a, b) => b.year - a.year),
})

@Injectable()
export class OvernightStaysRegistrationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly homeLodgingsService: DistrictCommissionersHomeLodgingsService,
  ) {
    super(ApplicationTypes.OVERNIGHT_STAYS_REGISTRATION)
  }

  private async fetchHomeLodgings(auth: User): Promise<HomeLodging[]> {
    try {
      const homeLodgings = await this.homeLodgingsService.getHomeLodgings(auth)
      return homeLodgings.map(toHomeLodging)
    } catch (error) {
      this.logger.error('Failed to fetch home lodgings from Sýslumenn', {
        error,
      })
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að sækja heimagistingar',
          summary:
            'Villa kom upp við að sækja heimagistingar frá Sýslumönnum. Vinsamlegast reyndu aftur síðar.',
        },
        500,
      )
    }
  }

  async getHomeLodgings({
    auth,
  }: TemplateApiModuleActionProps): Promise<HomeLodging[]> {
    const homeLodgings = await this.fetchHomeLodgings(auth)

    if (homeLodgings.length === 0) {
      throw new TemplateApiError(
        {
          title: 'Engin heimagisting skráð',
          summary:
            'Engin heimagisting er skráð á þína kennitölu hjá Sýslumönnum, því er ekki hægt að skila yfirliti.',
        },
        400,
      )
    }

    return homeLodgings
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<OvernightStaySubmissionResponse> {
    const submission = buildSubmissionPayload(application)
    const homeLodging = (await this.fetchHomeLodgings(auth)).find(
      (item) => item.id === submission.homeLodgingId,
    )
    const reportingYear =
      homeLodging && getHomeLodgingYear(homeLodging, submission.year)

    if (!reportingYear || reportingYear.returned) {
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að skila yfirliti',
          summary:
            'Heimagisting fannst ekki, árið er þegar skilað eða skráningin er ekki lengur virk.',
        },
        400,
      )
    }

    const response = await this.homeLodgingsService
      .submitOvernightStays(auth, submission)
      .catch((error) => {
        this.logger.error('Failed to submit overnight stays to Sýslumenn', {
          applicationId: application.id,
          error,
        })
        throw new TemplateApiError(
          {
            title: 'Ekki tókst að skila yfirliti',
            summary:
              'Villa kom upp við að skila yfirliti til Sýslumanna. Vinsamlegast reyndu aftur síðar.',
          },
          500,
        )
      })

    if (response.error || !response.id) {
      this.logger.warn('Sýslumenn rejected the overnight stays submission', {
        applicationId: application.id,
        error: response.error,
      })
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að skila yfirliti',
          summary:
            response.error ??
            'Sýslumenn tóku ekki við yfirlitinu. Vinsamlegast reyndu aftur síðar.',
        },
        400,
      )
    }

    return {
      id: response.id,
      submittedAt: response.submittedAt ?? new Date().toISOString(),
      errors: [],
    }
  }
}
