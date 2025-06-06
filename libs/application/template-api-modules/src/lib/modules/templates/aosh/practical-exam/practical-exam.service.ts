import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'

import { TemplateApiError } from '@island.is/nest/problem'
import {
  ExamCategoryDto,
  PostCodeDto,
  PracticalExamsClientService,
} from '@island.is/clients/practical-exams-ver'
import {
  getExamcategories,
  getExaminees,
  getExamLocation,
  getInformation,
  getInstructors,
  getPaymentArrangement,
  mapCategoriesWithInstructor,
  mapExaminees,
  mapInstructors,
  mapPaymentArrangement,
} from './practical-exam.utils'
import { getValueViaPath } from '@island.is/application/core'
import {
  externalData,
  shared,
} from '@island.is/application/templates/aosh/practical-exam'
import { S3Service } from '@island.is/nest/aws'
import { sharedModuleConfig } from '../../../shared'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class PracticalExamTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly practicalExamClientService: PracticalExamsClientService,
    private readonly s3Service: S3Service,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
  ) {
    super(ApplicationTypes.PRACTICAL_EXAM)
  }

  async getPostcodes({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<PostCodeDto>> {
    try {
      const response = await this.practicalExamClientService.getPostcodes(
        auth,
        {
          xCorrelationID: application.id,
        },
      )
      return response
    } catch {
      throw new TemplateApiError(
        {
          summary: externalData.ver.dataError,
          title: externalData.ver.errorInApplication,
        },
        400,
      )
    }
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
            summary: externalData.ver.dataError,
            title: externalData.ver.errorInApplication,
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
          summary: externalData.ver.dataError,
          title: externalData.ver.errorInApplication,
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers
    const examinees = getExaminees(answers)
    const information = getInformation(answers)
    const paymentArrangement = getPaymentArrangement(answers)
    const instructors = getInstructors(answers)
    const examCategoriesAndInstructors = getExamcategories(answers)
    const examLocation = getExamLocation(answers)

    if (
      !examinees ||
      !instructors ||
      !examCategoriesAndInstructors ||
      !examLocation ||
      !information
    ) {
      throw new TemplateApiError(
        {
          summary: shared.application.missingData,
          title: shared.application.submissionErrorTitle,
        },
        400,
      )
    }

    const { address: examAddress, postalCode: examPostalCode } = examLocation
    const examCategories = mapCategoriesWithInstructor(
      examCategoriesAndInstructors,
    )

    const instructorsRequest = mapInstructors(instructors)
    const chargeId =
      getValueViaPath<string>(
        application.externalData,
        'createCharge.data.id',
      ) ?? ''

    const paymentInfoRequest = mapPaymentArrangement(
      paymentArrangement || undefined,
      information,
      chargeId,
    )
    const examineesRequest = mapExaminees(examinees, examCategories)

    const examineesRequestWithCertificateUrl = await Promise.all(
      examineesRequest.map(async (examinee) => {
        if (examinee.medicalCertificate?.content) {
          const fileUrl = await this.getUrlForAttachment(
            examinee.medicalCertificate.content,
            application.id,
          )
          return {
            ...examinee,
            medicalCertificate: {
              ...examinee.medicalCertificate,
              content: fileUrl,
            },
          }
        }
        return examinee // Return as-is if there's no content
      }),
    )

    const payload = {
      xCorrelationID: application.id,
      workMachineExamRegistrationCreateDto: {
        examLocation: {
          address: examAddress,
          postalCode: examPostalCode,
        },
        examees: examineesRequestWithCertificateUrl,
        instructors: instructorsRequest,
        paymentInfo: paymentInfoRequest,
        contact: {
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
      return response
    } catch (e) {
      this.logger.warn(
        '[practical-exams-service]: Error registering practical exams',
        e,
      )
      throw new TemplateApiError(
        {
          summary: shared.application.submissionError,
          title: shared.application.submissionErrorTitle,
        },
        400,
      )
    }
  }

  private async getUrlForAttachment(
    attachment: string,
    applicationId: string,
  ): Promise<string> {
    try {
      const url = await this.s3Service.getPresignedUrl(
        {
          bucket: this.config.templateApi.attachmentBucket,
          key: `${applicationId}/${attachment}`,
        },
        300000,
      )
      return url
    } catch (e) {
      throw new TemplateApiError(
        {
          summary: shared.application.submissionError,
          title: shared.application.submissionErrorTitle,
        },
        400,
      )
    }
  }
}
