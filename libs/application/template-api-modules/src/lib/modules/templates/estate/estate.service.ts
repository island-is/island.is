import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { NationalRegistry, UploadData } from './types'
import {
  Attachment,
  DataUploadResponse,
  EstateInfo,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { estateSchema } from '@island.is/application/templates/estate'
import {
  estateTransformer,
  filterAndRemoveRepeaterMetadata,
  generateRawUploadData,
  getFakeData,
  stringifyObject,
  transformUploadDataToPDFStream,
} from './utils/'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  ApplicationAttachments,
  AttachmentPaths,
  ApplicationFile,
} from './types/attachments'
import AmazonS3Uri from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'
import kennitala from 'kennitala'
import { EstateTypes } from './consts'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

type EstateSchema = zinfer<typeof estateSchema>

@Injectable()
export class EstateTemplateService extends BaseTemplateApiService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.ESTATE)
    this.s3 = new S3()
  }

  async estateProvider({
    application,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const applicationData = (
      application.externalData?.syslumennOnEntry?.data as { estate: EstateInfo }
    ).estate

    const applicationAnswers = application.answers as unknown as EstateSchema
    if (
      !applicationData?.caseNumber?.length ||
      applicationData?.caseNumber.length === 0
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }

    const youngheirs = applicationData.estateMembers.filter(
      (heir) => kennitala.info(heir.nationalId).age < 18,
    )
    // Requirements:
    //   Flag if any heir is under 18 years old without an advocate/defender
    //   Unless official division of estate is taking place, then the incoming data need not be validated
    if (youngheirs.length > 0) {
      if (youngheirs.some((heir) => !heir.advocate)) {
        if (
          applicationAnswers.selectedEstate === EstateTypes.officialDivision
        ) {
          return true
        }
        this.logger.warn('[estate]: Heir under 18 without advocate')
        throw new TemplateApiError(
          {
            title:
              coreErrorMessages.errorDataProviderEstateHeirsWithoutAdvocate,
            summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
          },
          400,
        )
      }
    }

    return true
  }

  async syslumennOnEntry({ application }: TemplateApiModuleActionProps) {
    let estateResponse: EstateInfo
    if (
      application.applicant.startsWith('010130') &&
      (application.applicant.endsWith('2399') ||
        application.applicant.endsWith('7789'))
    ) {
      estateResponse = getFakeData(application)
    } else {
      estateResponse = (
        await this.syslumennService.getEstateInfo(application.applicant)
      )[0]
    }

    const estate = estateTransformer(estateResponse)

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    return {
      success: true,
      estate,
      relationOptions,
    }
  }

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    const externalData = application.externalData.syslumennOnEntry
      ?.data as EstateSchema

    const applicantData = application.answers
      .applicant as EstateSchema['applicant']

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: application.applicant,
      phoneNumber: applicantData.phone,
      city: nationalRegistryData?.address.city,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      signed: false,
      type: PersonType.AnnouncerOfDeathCertificate,
      email: applicantData.email,
    }

    const uploadDataName = 'danarbusskipti1.0'
    const uploadDataId = 'danarbusskipti1.0'
    const answers = application.answers as unknown as EstateSchema

    const uploadData = generateRawUploadData(answers, externalData, application)

    const attachments: Attachment[] = []

    // Convert form data to a PDF backup for syslumenn
    const pdfBuffer = await transformUploadDataToPDFStream(
      uploadData,
      application.id,
    )
    attachments.push({
      name: `Form_data_${uploadData.caseNumber}.pdf`,
      content: pdfBuffer.toString('base64'),
    })

    // Retrieve attachments from the application and attach them to the upload data
    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    for (let i = 0; i < AttachmentPaths.length; i++) {
      const { path, prefix } = AttachmentPaths[i]
      const attachmentAnswerData =
        getValueViaPath<ApplicationFile[]>(application.answers, path) ?? []

      for (let index = 0; index < attachmentAnswerData.length; index++) {
        if (attachmentAnswerData[index]) {
          const fileType = attachmentAnswerData[index].name?.split('.').pop()
          const name = `${prefix}_${index}.${dateStr}.${fileType}`
          const fileName = (application.attachments as ApplicationAttachments)[
            attachmentAnswerData[index]?.key
          ]
          const content = await this.getFileContentBase64(fileName)
          attachments.push({ name, content })
        }
      }
    }

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(
        [person],
        attachments,
        stringifyObject(uploadData),
        uploadDataName,
        uploadDataId,
      )
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })

    if (!result.success) {
      this.logger.error('[estate]: Failed to upload data - ', result.message)
      throw new Error('Application submission failed on syslumadur upload data')
    }
    return { sucess: result.success, id: result.caseNumber }
  }
  private async getFileContentBase64(fileName: string): Promise<string> {
    const { bucket, key } = AmazonS3Uri(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({
          Bucket: uploadBucket,
          Key: key,
        })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64') || ''
    } catch (e) {
      this.logger.warn('[estate]: Failed to get file content - ', e)
      return 'err'
    }
  }
}
