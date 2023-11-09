import { Inject, Injectable } from '@nestjs/common'
import {
  DataUploadResponse,
  EstateInfo,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { estateTransformer, getFakeData } from './utils'
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

type InheritanceSchema = zinfer<typeof inheritanceReportSchema>

@Injectable()
export class InheritanceReportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.INHERITANCE_REPORT)
  }

  stringifyObject(obj: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {}
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = obj[key] as string
      } else {
        result[key] = JSON.stringify(obj[key])
      }
    }

    return result
  }

  async syslumennOnEntry({ application, auth }: TemplateApiModuleActionProps) {
    const [relationOptions, estateResponse] = await Promise.all([
      this.syslumennService.getEstateRelations(),
      // Get estate info from syslumenn or fakedata depending on application.applicant
      application.applicant.startsWith('010130') &&
      application.applicant.endsWith('2399')
        ? [getFakeData()]
        : this.syslumennService.getEstateInfo(application.applicant),
    ])
    const estate = estateTransformer(estateResponse[0])

    console.log('WE GOT ESTATE', JSON.stringify(estate, null, 2))

    return {
      success: true,
      estate,
      relationOptions,
    }
  }

  async completeApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
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

    const uploadData = this.stringifyObject(expandAnswers(answers))

    const uploadDataName = 'erfdafjarskysla1.0'
    const uploadDataId = 'erfdafjarskysla1.0'

    const result: DataUploadResponse = await this.syslumennService
      .uploadData([person], undefined, uploadData, uploadDataName, uploadDataId)
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
}
