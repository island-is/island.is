import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'

import { TemplateApiError } from '@island.is/nest/problem'
import {
  ExamCategoryDto,
  PracticalExamsClientService,
} from '@island.is/clients/practical-exams-ver'
import {
  getExamcategories,
  getExaminees,
  getExamLocation,
  getInstructors,
  getPaymentArrangement,
  mapCategoriesWithInstructor,
  mapExaminees,
  mapInstructors,
  mapPaymentArrangement,
} from './practical-exam.utils'

@Injectable()
export class PracticalExamTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly practicalExamClientService: PracticalExamsClientService,
  ) {
    super(ApplicationTypes.PRACTICAL_EXAM)
  }

  async getExamCategories({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<ExamCategoryDto>> {
    try {
      const response = await this.practicalExamClientService.getExamcategories(
        auth,
        { xCorrelationID: application.id },
      )
      if (!response || response.length === 0) {
        this.logger.warning(
          '[practical-exam.service]: Empty or no exam category response',
        )
        throw new TemplateApiError(
          {
            summary:
              'Villa í gögnum frá Vinnueftirliti, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      }
      return response
    } catch (error) {
      this.logger.error(
        '[practical-exam.service]: Error fetching exam categories from VER',
        error,
      )
      throw new TemplateApiError(
        {
          summary:
            'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
          title: 'Villa í umsókn',
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // const answers = application.answers as unknown as PracticalExam
    const answers = application.answers
    const examinees = getExaminees(answers)
    const paymentArrangement = getPaymentArrangement(answers)
    const instructors = getInstructors(answers)
    const examCategoriesAndInstructors = getExamcategories(answers)
    const examLocation = getExamLocation(answers)

    if (
      !examinees ||
      !paymentArrangement ||
      !instructors ||
      !examCategoriesAndInstructors ||
      !examLocation
    ) {
      throw Error('Values from answers are undefined')
    }

    const { address: examAddress, postalCode: examPostalCode } = examLocation
    const examCategories = mapCategoriesWithInstructor(
      examCategoriesAndInstructors,
    )
    const instructorsRequest = mapInstructors(instructors)
    const paymentInfoRequest = mapPaymentArrangement(paymentArrangement)
    const examineesRequest = mapExaminees(examinees, examCategories)

    const payload = {
      xCorrelationID: application.id,
      workMachineExamRegistrationCreateDto: {
        examLocation: {
          address: examAddress,
          postalCode: examPostalCode,
          city: 'Ekki vitað', // TODO We do not have this
        },
        examees: examineesRequest,
        instructors: instructorsRequest,
        paymentInfo: paymentInfoRequest,
        contact: {
          // Part of exam location or paymentArrangement ??
          phoneNumber: examLocation.phone,
          email: examLocation.email,
        },
      },
    }

    try {
      const response =
        await this.practicalExamClientService.submitPracticalExamApplication(
          auth,
          payload,
        )
      console.log('Response', response)
    } catch (e) {
      console.log('ERRROR', e)
    }

    throw new Error('error')

    return Promise.resolve()
  }
}
