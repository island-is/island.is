import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  Area,
  ExemptionForTransportationClient,
  ExemptionRules,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { getValueViaPath } from '@island.is/application/core'
import {
  error as errorMessage,
  ExemptionForTransportationAnswers,
  ExemptionType,
  RegionArea,
} from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import {
  getAllWordsExceptFirst,
  getFirstWord,
  mapApplicant,
  mapEnumByValue,
  mapHaulUnits,
  mapResponsiblePerson,
  mapTransporter,
} from './utils'
import { S3Service } from '@island.is/nest/aws'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly exemptionForTransportationClient: ExemptionForTransportationClient,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async getExemptionRules({
    auth,
  }: TemplateApiModuleActionProps): Promise<ExemptionRules> {
    return this.exemptionForTransportationClient.getRules(auth)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    // Get answers
    const exemptionPeriodAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['exemptionPeriod']
    >(application.answers, 'exemptionPeriod')
    const locationAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['location']
    >(application.answers, 'location')
    const supportingDocumentsAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['supportingDocuments']
    >(application.answers, 'supportingDocuments')
    const freightAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['freight']
    >(application.answers, 'freight')

    // Map applicant, transporter + responsible person
    const applicant = mapApplicant(application)
    const transporter = mapTransporter(application, applicant)
    const responsiblePerson = mapResponsiblePerson(
      application,
      applicant,
      transporter,
    )

    // Map files
    const locationFiles =
      exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
        ? await Promise.all(
            (locationAnswers?.longTerm?.files || []).map(async (file) => {
              return {
                name: file.name,
                content: await this.getAttachmentAsBase64(application, file),
              }
            }),
          )
        : []
    const supportingDocumentsFiles = await Promise.all(
      (supportingDocumentsAnswers?.files || []).map(async (file) => {
        return {
          name: file.name,
          content: await this.getAttachmentAsBase64(application, file),
        }
      }),
    )

    // Submit the application
    const result =
      await this.exemptionForTransportationClient.submitApplication(auth, {
        externalID: application.id,
        applicant: {
          ssn: applicant.nationalId,
          firstName: getFirstWord(applicant.fullName),
          lastName: getAllWordsExceptFirst(applicant.fullName),
          email: applicant.email,
          phone: applicant.phone,
        },
        transporter: {
          ssn: transporter.nationalId,
          name: transporter.fullName,
          address: transporter.address,
          postalCode: transporter.postalCode,
          city: transporter.city,
          email: transporter.email,
          phone: transporter.phone,
        },
        guarantor: responsiblePerson
          ? {
              ssn: responsiblePerson.nationalId,
              firstName: getFirstWord(responsiblePerson.fullName),
              lastName: getAllWordsExceptFirst(responsiblePerson.fullName),
              email: responsiblePerson.email,
              phone: responsiblePerson.phone,
            }
          : undefined,
        dateFrom: new Date(exemptionPeriodAnswers?.dateFrom || ''),
        dateTo: new Date(exemptionPeriodAnswers?.dateTo || ''),
        origin:
          exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM
            ? `${locationAnswers?.shortTerm?.addressFrom}, ${locationAnswers?.shortTerm?.postalCodeAndCityFrom}`
            : undefined,
        destination:
          exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM
            ? `${locationAnswers?.shortTerm?.addressTo}, ${locationAnswers?.shortTerm?.postalCodeAndCityTo}`
            : undefined,
        areas:
          exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
            ? mapEnumByValue(
                RegionArea,
                Area,
                locationAnswers?.longTerm?.regions || [],
              )
            : undefined,
        desiredRoute:
          exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM
            ? locationAnswers?.shortTerm?.directions
            : locationAnswers?.longTerm?.directions,
        documents: (exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
          ? [...locationFiles, ...supportingDocumentsFiles]
          : supportingDocumentsFiles
        ).map((file) => ({
          documentName: file.name,
          documentContent: file.content,
        })),
        comment: supportingDocumentsAnswers?.comments,
        cargoes:
          freightAnswers?.items?.map((item) => ({
            code: item.freightId,
            name: item.name,
            length: Number(item.length),
            weight: Number(item.weight),
          })) || [],
        haulUnits: mapHaulUnits(application),
      })

    if (result.hasError) {
      throw new TemplateApiError(
        {
          title: errorMessage.submitErrorTitle,
          summary: result.errorMessages
            ? result.errorMessages.join(',')
            : errorMessage.submitErrorFallbackMessage,
        },
        400,
      )
    }

    return result
  }

  private async getAttachmentAsBase64(
    application: ApplicationWithAttachments,
    attachment: {
      key: string
      name: string
    },
  ): Promise<string> {
    const attachmentKey = attachment.key

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      throw new Error(
        `Attachment filename not found in application on attachment key: ${attachmentKey}`,
      )
    }

    try {
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )

      if (!fileContent) {
        throw new Error(`File content not found for: ${fileName}`)
      }

      return fileContent
    } catch (error) {
      throw new Error(`Failed to retrieve attachment: ${error.message}`)
    }
  }
}
