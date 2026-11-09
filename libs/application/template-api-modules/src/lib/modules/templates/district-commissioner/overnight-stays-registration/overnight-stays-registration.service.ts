import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import {
  buildSubmissionPayload,
  HomeLodgingRegistration,
  OvernightStaySubmissionResponse,
} from '@island.is/application/templates/district-commissioners/overnight-stays-registration'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'

const laugavegur = {
  name: 'Laugavegur 112',
  address: 'Laugavegur 112',
  postalCode: '101',
  city: 'Reykjavík',
  propertyNumber: '2296564',
  unitNumber: '0102',
  guestCount: 2,
  roomCount: 1,
}

const midfellsvegur = {
  name: 'Miðfellsvegur 7',
  address: 'Miðfellsvegur 7',
  postalCode: '801',
  city: 'Bláskógabyggð',
  propertyNumber: '2184470',
  unitNumber: '0101',
  guestCount: 6,
  roomCount: 3,
}

const mockHomeLodgings: HomeLodgingRegistration[] = [
  { id: 'HG-00004821', year: 2026, hasBeenSubmitted: false, ...laugavegur },
  {
    id: 'HG-00004822',
    year: 2026,
    hasBeenSubmitted: false,
    ...midfellsvegur,
  },
  { id: 'HG-00004821', year: 2025, hasBeenSubmitted: false, ...laugavegur },
  {
    id: 'HG-00004822',
    year: 2025,
    hasBeenSubmitted: false,
    ...midfellsvegur,
  },
  { id: 'HG-00004821', year: 2024, hasBeenSubmitted: false, ...laugavegur },
  {
    id: 'HG-00004822',
    year: 2024,
    hasBeenSubmitted: true,
    ...midfellsvegur,
  },
  { id: 'HG-00004821', year: 2023, hasBeenSubmitted: true, ...laugavegur },
  {
    id: 'HG-00004822',
    year: 2023,
    hasBeenSubmitted: true,
    ...midfellsvegur,
  },
]

@Injectable()
export class OvernightStaysRegistrationService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.OVERNIGHT_STAYS_REGISTRATION)
  }

  async getHomeLodgings({
    application,
  }: TemplateApiModuleActionProps): Promise<HomeLodgingRegistration[]> {
    if (!application.applicant) {
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að sækja heimagistingar',
          summary: 'Kennitala umsækjanda vantar.',
        },
        400,
      )
    }

    return mockHomeLodgings
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<OvernightStaySubmissionResponse> {
    const submission = buildSubmissionPayload(application)
    const registration = mockHomeLodgings.find(
      (item) =>
        item.id === submission.homeLodgingId &&
        item.year === submission.year &&
        !item.hasBeenSubmitted,
    )

    if (!registration) {
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að skila yfirliti',
          summary:
            'Heimagisting fannst ekki, árið er þegar skilað eða skráningin er ekki lengur virk.',
        },
        400,
      )
    }

    return {
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
      errors: [],
    }
  }
}
