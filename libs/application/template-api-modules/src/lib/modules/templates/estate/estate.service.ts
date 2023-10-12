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
  transformUploadDataToPDFStream,
} from './utils'
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

  stringifyObject(obj: UploadData): Record<string, string> {
    const result: Record<string, string> = {}
    // Curiously: https://github.com/Microsoft/TypeScript/issues/12870
    for (const key of Object.keys(obj) as Array<keyof typeof obj>) {
      if (typeof obj[key] === 'string') {
        result[key] = obj[key] as string
      } else {
        result[key] = JSON.stringify(obj[key])
      }
    }

    return result
  }

  async syslumennOnEntry({ application }: TemplateApiModuleActionProps) {
    let estateResponse: EstateInfo
    if (
      application.applicant.startsWith('010130') &&
      (application.applicant.endsWith('2399') ||
        application.applicant.endsWith('7789'))
    ) {
      estateResponse = {
        addressOfDeceased: 'Gerviheimili 123, 600 Feneyjar',
        cash: [],
        marriageSettlement: false,
        assets: [
          {
            assetNumber: 'F2318696',
            description: 'Íbúð í Reykjavík',
            share: 1,
          },
          {
            assetNumber: 'F2262202',
            description: 'Raðhús á Akureyri',
            share: 1,
          },
        ],
        vehicles: [
          {
            assetNumber: 'VA334',
            description: 'Nissan Terrano II',
            share: 1,
          },
          {
            assetNumber: 'YZ927',
            description: 'Subaru Forester',
            share: 1,
          },
        ],
        knowledgeOfOtherWills: 'Yes',
        ships: [],
        flyers: [],
        guns: [
          {
            assetNumber: '009-2018-0505',
            description: 'Framhlaðningur (púður)',
            share: 1,
          },
          {
            assetNumber: '007-2018-1380',
            description: 'Mauser P38',
            share: 1,
          },
        ],
        estateMembers: [
          {
            name: 'Gervimaður Afríka',
            relation: 'Sonur',
            nationalId: '0101303019',
          },
          {
            name: 'Gervimaður Færeyja',
            relation: 'Maki',
            nationalId: '0101302399',
          },
          {
            name: 'Gervimaður Bretland',
            relation: 'Faðir',
            nationalId: '0101304929',
          },
        ],
        caseNumber: '2020-000123',
        dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
        nameOfDeceased: 'Lizzy B. Gone',
        nationalIdOfDeceased: '0101301234',
        districtCommissionerHasWill: true,
      }

      const fakeAdvocate = {
        name: 'Gervimaður Evrópa',
        address: 'Gerviheimili 123, 600 Feneyjar',
        nationalId: '0101302719',
        email: '',
        phone: '',
      }

      const fakeChild = {
        name: 'Gervimaður Undir 18 án málsvara',
        relation: 'Barn',
        // This kennitala is for Gervimaður Ísak Miri ÞÍ Jarrah
        // This test will stop serving its purpose on the 24th of September 2034
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalId: '2409151460',
        phone: '',
        email: '',
      }

      if (application.applicant.endsWith('7789')) {
        estateResponse.estateMembers.push(fakeChild)
      } else {
        estateResponse.estateMembers.push({
          ...fakeChild,
          advocate: fakeAdvocate,
        })
      }
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

    const relation =
      externalData?.estate.estateMembers?.find(
        (member) => member.nationalId === application.applicant,
      )?.relation ?? 'Óþekkt'

    const processedAssets = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['assets']
    >(answers?.estate?.assets ?? externalData?.estate?.assets ?? [])

    const processedVehicles = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['vehicles']
    >(answers?.estate?.vehicles ?? externalData?.estate?.vehicles ?? [])

    const processedEstateMembers = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['estateMembers']
    >(
      answers?.estate?.estateMembers ??
        externalData?.estate?.estateMembers ??
        [],
    )

    const uploadData: UploadData = {
      deceased: {
        name: externalData.estate.nameOfDeceased ?? '',
        ssn: externalData.estate.nationalIdOfDeceased ?? '',
        dateOfDeath: externalData.estate.dateOfDeath?.toString() ?? '',
        address: externalData.estate.addressOfDeceased ?? '',
      },
      districtCommissionerHasWill: answers.estate?.testament?.wills ?? '',
      settlement: answers.estate?.testament?.agreement ?? '',
      dividedEstate: answers.estate?.testament?.dividedEstate ?? '',
      remarksOnTestament: answers.estate?.testament?.additionalInfo ?? '',
      guns: answers.estate?.guns ?? [],
      applicationType: answers.selectedEstate,
      caseNumber: externalData?.estate?.caseNumber ?? '',
      assets: processedAssets,
      claims: answers.claims ?? [],
      bankAccounts: answers.bankAccounts ?? [],
      debts: answers.debts ?? [],
      estateMembers: processedEstateMembers,
      inventory: {
        info: answers.inventory?.info ?? '',
        value: answers.inventory?.value ?? '',
      },
      moneyAndDeposit: {
        info: answers.moneyAndDeposit?.info ?? '',
        value: answers.moneyAndDeposit?.value ?? '',
      },
      notifier: {
        email: answers.applicant.email ?? '',
        name: answers.applicant.name,
        phoneNumber: answers.applicant.phone,
        relation: relation ?? '',
        ssn: answers.applicant.nationalId,
      },
      otherAssets: {
        info: answers.otherAssets?.info ?? '',
        value: answers.otherAssets?.value ?? '',
      },
      stocks: answers.stocks ?? [],
      vehicles: processedVehicles,
      ...(answers.representative?.name
        ? {
            representative: {
              email: answers.representative.email ?? '',
              name: answers.representative.name,
              phoneNumber: answers.representative.phone ?? '',
              ssn: answers.representative.nationalId ?? '',
            },
          }
        : { representative: undefined }),
      ...(answers.deceasedWithUndividedEstate?.spouse?.nationalId
        ? {
            deceasedWithUndividedEstate: {
              spouse: {
                name: answers.deceasedWithUndividedEstate.spouse.name ?? '',
                nationalId:
                  answers.deceasedWithUndividedEstate.spouse.nationalId,
              },
              selection: answers.deceasedWithUndividedEstate.selection ?? '',
            },
          }
        : { deceasedWithUndividedEstate: undefined }),
    }

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
        this.stringifyObject(uploadData),
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
