import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SeminarAnswers } from '@island.is/application/templates/aosh/seminars'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  CourseDTO,
  IndividualDTO,
  SeminarsClientService,
} from '@island.is/clients/seminars-ver'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'
import {
  externalData as externalDataMessages,
  application as applicationMessages,
  IndividualOrCompany,
  RegisterNumber,
} from '@island.is/application/templates/aosh/seminars'
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

    if (seminarQueryId === '') {
      this.logger.warn('[seminars-service]: No seminar query id found')
      throw new TemplateApiError(
        {
          summary: externalDataMessages.ver.noSeminarFound,
          title: externalDataMessages.ver.noSeminarFoundTitle,
        },
        400,
      )
    }

    const data = await this.seminarsClientService
      .getSeminar(auth, seminarQueryId)
      .catch(() => {
        this.logger.warn('[seminars-service]: Error fetching data from AOSH')
        throw new TemplateApiError(
          {
            summary: externalDataMessages.ver.generalError,
            title: externalDataMessages.ver.generalErrorTitle,
          },
          400,
        )
      })

    return data
  }

  async checkIndividual({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<IndividualDTO | undefined> {
    const courseId =
      getValueViaPath<string>(application.answers, 'initialQuery', '') ?? ''
    const individuals = [{ nationalId: auth.nationalId, email: '' }]
    const returnedIndividuals =
      await this.seminarsClientService.checkIndividuals(
        auth,
        individuals,
        courseId,
        auth.nationalId,
      )
    if (returnedIndividuals.length > 0) {
      return returnedIndividuals[0]
    }
    return
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const registeringMany = getValueViaPath<string>(
      application.answers,
      'applicant.registerManyQuestion',
      '',
    )

    const paymentArrangement = getValueViaPath<
      SeminarAnswers['paymentArrangement']
    >(application.answers, 'paymentArrangement')

    const participantList = getValueViaPath<SeminarAnswers['participantList']>(
      application.answers,
      'participantList',
    )

    const applicant = getValueViaPath<SeminarAnswers['applicant']>(
      application.answers,
      'applicant',
    )

    const seminarQueryId =
      getValueViaPath<string>(application.answers, `initialQuery`) ?? ''
    const chargeId =
      getValueViaPath<string>(
        application.externalData,
        'createCharge.data.id',
      ) ?? ''
    return await this.seminarsClientService
      .registerSeminar(auth, {
        courseRegistrationCreateDTO: {
          courseId: seminarQueryId,
          paymentContact: {
            email:
              paymentArrangement?.individualOrCompany ===
              IndividualOrCompany.company
                ? paymentArrangement?.contactInfo?.email
                : applicant?.email,
            phoneNumber:
              paymentArrangement?.individualOrCompany ===
              IndividualOrCompany.company
                ? paymentArrangement?.contactInfo?.phone
                : applicant?.phoneNumber,
          },
          paymentInfo: {
            companyNationalId:
              paymentArrangement?.individualOrCompany ===
              IndividualOrCompany.company
                ? paymentArrangement?.companyInfo?.nationalId
                : '',
            paymentId: chargeId,
            paymentExplanation: paymentArrangement?.explanation ?? '',
          },
          students:
            registeringMany === RegisterNumber.many
              ? participantList?.map((participants) => ({
                  name: participants.nationalIdWithName.name,
                  nationalId: participants.nationalIdWithName.nationalId,
                  email: participants.email,
                  phoneNumber: participants.phoneNumber,
                }))
              : [
                  {
                    name: applicant?.name,
                    nationalId: applicant?.nationalId,
                    email: applicant?.email,
                    phoneNumber: applicant?.phoneNumber,
                  },
                ],
        },
      })
      .catch(() => {
        this.logger.warn('[seminars-service]: Error registering seminar')
        throw new TemplateApiError(
          {
            summary: applicationMessages.submissionError,
            title: applicationMessages.submissionErrorTitle,
          },
          400,
        )
      })
  }
}
