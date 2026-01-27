import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { NationalRegistry } from './types'
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
import kennitala from 'kennitala'
import { EstateTypes } from './consts'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'

type EstateSchema = zinfer<typeof estateSchema>

@Injectable()
export class EstateTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.ESTATE)
  }

  async estateProvider({
    application,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const applicationData = (
      application.externalData?.syslumennOnEntry?.data as {
        estates: Array<EstateInfo>
      }
    ).estates

    // Note: Boolean('')/Boolean(undefined)/Boolean(null) are all false which is what we want
    if (
      !applicationData ||
      applicationData.length === 0 ||
      !applicationData.some((estate) => Boolean(estate.caseNumber))
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }

    const applicationAnswers = application.answers as unknown as EstateSchema
    const selectedCaseNumber = applicationAnswers.estateInfoSelection
    const estateData = applicationData.find(
      (estate) => estate.caseNumber === selectedCaseNumber,
    )
    if (
      !estateData?.caseNumber?.length ||
      estateData?.caseNumber.length === 0
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }

    const { availableSettlements } = estateData
    const selectedEstate = applicationAnswers.selectedEstate
    const selectedEstateKey = Object.keys(EstateTypes).find(
      (key) => EstateTypes[key as keyof typeof EstateTypes] === selectedEstate,
    ) as keyof typeof availableSettlements

    if (
      availableSettlements &&
      availableSettlements[selectedEstateKey] !== 'Í lagi'
    ) {
      const message = availableSettlements[selectedEstateKey]
      this.logger.warn(`[estate]: Validation failed with message: ${message}`)

      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProviderEstateValidationFailed,
          summary: {
            values: { message },
            ...coreErrorMessages.errorDataProviderEstateValidationFailedSummary,
          },
        },
        500,
      )
    }

    const youngheirs = estateData.estateMembers.filter(
      (heir) => kennitala.info(heir.nationalId).age < 18,
    )
    // Requirements:
    //   Flag if any heir is under 18 years old without an advocate/defender
    //   Unless official division of estate is taking place, then the incoming data need not be validated
    if (youngheirs.length > 0) {
      if (
        applicationAnswers.selectedEstate !==
        EstateTypes.divisionOfEstateByHeirs
      ) {
        return true
      }

      if (youngheirs.some((heir) => !heir.advocate)) {
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
    let estateResponse: Array<EstateInfo>
    if (
      application.applicant.startsWith('010130') &&
      (application.applicant.endsWith('2399') ||
        application.applicant.endsWith('7789'))
    ) {
      estateResponse = getFakeData(application)
    } else {
      estateResponse =
        await this.syslumennService.getEstateInfoWithAvailableSettlements(
          application.applicant,
        )
    }

    const estates = estateResponse.map(estateTransformer)

    if (!estates.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary:
            coreErrorMessages.errorDataProviderEstateValidationNothingFoundSummary,
        },
        400,
      )
    }

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    return {
      success: true,
      estates,
      relationOptions,
    }
  }

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    const externalData = application.externalData.syslumennOnEntry?.data as {
      estate?: EstateSchema['estate']
      estates?: Array<EstateSchema['estate']>
    }

    const applicantData = application.answers
      .applicant as EstateSchema['applicant']

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: application.applicant,
      phoneNumber: applicantData.phone,
      city: nationalRegistryData?.address?.city,
      homeAddress: nationalRegistryData?.address?.streetAddress,
      postalCode: nationalRegistryData?.address?.postalCode,
      signed: false,
      type: PersonType.AnnouncerOfDeathCertificate,
      email: applicantData.email,
    }

    const uploadDataName = 'danarbusskipti1.0'
    const uploadDataId = 'danarbusskipti1.0'
    const answers = application.answers as unknown as EstateSchema

    let estateData = externalData.estates?.find(
      (estate) => estate.caseNumber === answers.estateInfoSelection,
    )
    // TODO: Remove the singular estate property in the future when
    //       legacy applications clear out of the system
    estateData = estateData ?? externalData.estate ?? undefined
    if (!estateData) {
      throw new Error(
        '[estate]: Selected casenumber not present in external data. Should not happen',
      )
    }

    const uploadData = generateRawUploadData(answers, estateData, application)

    // We deep copy the pdfData since the transform function
    // for the PDF creation mutates the object
    const pdfData = structuredClone(uploadData)

    const attachments: Attachment[] = []

    // Convert form data to a PDF backup for syslumenn
    const pdfBuffer = await transformUploadDataToPDFStream(
      pdfData,
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

    const stringifiedData = stringifyObject(uploadData)

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(
        [person],
        attachments,
        stringifiedData,
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
    try {
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )
      return fileContent || ''
    } catch (e) {
      this.logger.warn('[estate]: Failed to get file content - ', e)
      return 'err'
    }
  }
}
