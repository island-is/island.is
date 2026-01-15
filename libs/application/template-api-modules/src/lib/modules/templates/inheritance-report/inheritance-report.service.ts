import { Inject, Injectable } from '@nestjs/common'
import {
  Attachment,
  DataUploadResponse,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { getFakeData, roundMonetaryFieldsDeep, stringifyObject } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'
import type { Logger } from '@island.is/logging'
import { expandAnswers } from './utils/mappers'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'
import { S3Service } from '@island.is/nest/aws'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

type InheritanceSchema = zinfer<typeof inheritanceReportSchema>

@Injectable()
export class InheritanceReportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
    private readonly nationalRegistryService: NationalRegistryV3Service,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.INHERITANCE_REPORT)
  }

  async syslumennOnEntry({ application }: TemplateApiModuleActionProps) {
    const [relationOptions, inheritanceReportInfos] = await Promise.all([
      this.syslumennService.getEstateRelations(),
      // Get estate info from syslumenn or fakedata depending on application.applicant
      application.applicant.startsWith('110130') &&
      application.applicant.endsWith('2399')
        ? [
            getFakeData('2022-14-14', 'Gervimaður Útlönd', '0101307789'),
            getFakeData('2020-15-04', 'Gervimaður Danmörk', '0101302479'),
          ]
        : this.syslumennService.getEstateInfoForInheritanceReport(
            application.applicant,
          ),
    ])

    // Loop through all inheritanceReportInfos and attach inheritanceTax to each
    await Promise.all(
      inheritanceReportInfos.map(async (inheritanceReportInfo) => {
        return new Promise<void>((resolve) => {
          this.syslumennService
            .getInheritanceTax(inheritanceReportInfo.caseNumber ?? '')
            .then((inheritanceTax) => {
              inheritanceReportInfo.inheritanceTax = inheritanceTax
              resolve()
            })
            .catch((e) => {
              this.logger.warn(
                '[inheritance-report]: Failed to fetch inheritance tax',
                e,
              )
            })
        })
      }),
    )

    if (!inheritanceReportInfos.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary:
            coreErrorMessages.errorDataProviderEstateValidationNothingFoundSummary,
        },
        400,
      )
    }

    return {
      success: true,
      inheritanceReportInfos,
      relationOptions: relationOptions.relations,
    }
  }

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual

    const answers = application.answers as InheritanceSchema

    const person: Person = {
      name: nationalRegistryData?.fullName ?? '',
      ssn: application.applicant,
      phoneNumber: answers?.applicant?.phone ?? '',
      email: answers?.applicant?.email ?? '',
      homeAddress: nationalRegistryData?.address?.streetAddress ?? '',
      postalCode: nationalRegistryData?.address?.postalCode ?? '',
      city: nationalRegistryData?.address?.locality ?? '',
      signed: false,
      type: PersonType.AnnouncerOfDeathCertificate,
    }

    const expanded = expandAnswers(answers)
    const roundedExpanded = roundMonetaryFieldsDeep(expanded) as Record<
      string,
      unknown
    >
    const uploadData = stringifyObject(roundedExpanded)

    const uploadDataName = 'erfdafjarskysla1.0'
    const uploadDataId = 'erfdafjarskysla1.0'
    const attachments: Attachment[] = []

    if (answers?.heirsAdditionalInfoPrivateTransferFiles) {
      attachments.push(
        ...(await Promise.all(
          answers.heirsAdditionalInfoPrivateTransferFiles.map(async (file) => {
            const filename = (
              application.attachments as {
                [key: string]: string
              }
            )[file.key]
            const content = await this.getFileContentBase64(filename)
            return {
              name: file.name,
              content,
            }
          }),
        )),
      )
    }

    if (answers?.heirsAdditionalInfoFilesOtherDocuments) {
      attachments.push(
        ...(await Promise.all(
          answers.heirsAdditionalInfoFilesOtherDocuments.map(async (file) => {
            const filename = (
              application.attachments as {
                [key: string]: string
              }
            )[file.key]
            const content = await this.getFileContentBase64(filename)
            return {
              name: file.name,
              content,
            }
          }),
        )),
      )
    }

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(
        [person],
        attachments,
        uploadData,
        uploadDataName,
        uploadDataId,
      )
      .catch((e) => {
        return {
          success: false,
          message: e.message,
        }
      })

    if (!result.success) {
      this.logger.error(
        '[inheritance-report]: Failed to upload data - ',
        result.message,
      )
      throw new Error(
        `Application submission failed on syslumadur upload data: ${result.message}`,
      )
    }
    return { success: result.success, id: result.caseNumber }
  }

  async maritalStatus(props: TemplateApiModuleActionProps) {
    const spouse = await this.nationalRegistryService.getSpouse(props)
    return { ...spouse, fullName: spouse?.name }
  }

  async getFileContentBase64(fileName: string): Promise<string> {
    try {
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )
      return fileContent || ''
    } catch (e) {
      this.logger.warn(
        '[inherhitance-report]: Failed to get file content - ',
        e,
      )
      return 'err'
    }
  }
}
