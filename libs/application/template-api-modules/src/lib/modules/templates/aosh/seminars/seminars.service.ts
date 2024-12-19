import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SeminarAnswers } from '@island.is/application/templates/aosh/seminars'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  CourseDTO,
  SeminarsClientService,
} from '@island.is/clients/seminars-ver'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class SeminarsTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly seminarsClientService: SeminarsClientService,
  ) {
    super(ApplicationTypes.SEMINAR_REGISTRATION)
  }

  async getSeminars({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<CourseDTO> {
    const seminarQueryId =
      getValueViaPath<string>(application.answers, `initialQuery`) ?? ''
    const data = await this.seminarsClientService
      .getSeminar(auth, seminarQueryId)
      .catch(() => {
        this.logger.warn('[seminars-service]: Error fetching data from AOSH')
        throw new TemplateApiError(
          {
            summary:
              'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      })

    if (!data) {
      throw new TemplateApiError(
        {
          summary: `Ekkert námskeið fannst með þessu númeri: ${seminarQueryId}.`,
          title: 'Villa í umsókn',
        },
        400,
      )
    }

    return data
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as SeminarAnswers
    const seminarQueryId =
      getValueViaPath<string>(application.answers, `initialQuery`) ?? ''
    const chargeId =
      getValueViaPath<string>(
        application.externalData,
        'createCharge.data.id',
      ) ?? ''
    await this.seminarsClientService
      .registerSeminar(auth, {
        courseRegistrationCreateDTO: {
          courseId: seminarQueryId,
          paymentContact: {
            email:
              answers.paymentArrangement.individualOrCompany === 'company'
                ? answers.paymentArrangement.contactInfo?.email
                : answers.paymentArrangement.individualInfo?.email,
            phoneNumber:
              answers.paymentArrangement.individualOrCompany === 'company'
                ? answers.paymentArrangement.contactInfo?.phone
                : answers.paymentArrangement.individualInfo?.phone,
          },
          paymentInfo: {
            paymentType:
              answers.paymentArrangement.individualOrCompany === 'company'
                ? answers.paymentArrangement.paymentOptions === 'cashOnDelivery'
                  ? 'card'
                  : 'invoice'
                : 'card',
            companyNationalId:
              answers.paymentArrangement.individualOrCompany === 'company'
                ? answers.paymentArrangement.companyInfo?.nationalId
                : '',
            paymentId: chargeId,
            paymentExplanation: answers.paymentArrangement.explanation ?? '',
          },
          students: answers.participantList.map((participants) => ({
            name: participants.name,
            nationalId: participants.nationalId,
            email: participants.email,
            phoneNumber: participants.phoneNumber,
          })),
        },
      })
      .catch(() => {
        this.logger.warn('[seminars-service]: Error registering seminar')
        throw new TemplateApiError(
          {
            summary: 'Ekki tókst að skrá námskeið, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      })
    return
  }
}
