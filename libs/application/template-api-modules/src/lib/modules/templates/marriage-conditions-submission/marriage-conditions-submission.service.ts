import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { generateAssignOtherSpouseApplicationEmail } from './emailGenerators/assignOtherSpouseEmail'
import {
  SyslumennService,
  Person,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { ALLOWED_MARITAL_STATUSES, maritalStatuses, PersonTypes } from './types'
import {
  MarriageConditionsAnswers,
  MarriageConditionsFakeData,
} from '@island.is/application/templates/marriage-conditions/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'

@Injectable()
export class MarriageConditionsSubmissionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {
    super(ApplicationTypes.MARRIAGE_CONDITIONS)
  }

  async maritalStatus(props: TemplateApiModuleActionProps) {
    const { application } = props
    const fakeData = getValueViaPath<MarriageConditionsFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES
    if (useFakeData) {
      return this.handleReturn(fakeData?.maritalStatus || '')
    }

    const spouse = await this.nationalRegistryV3Service.getSpouse(props)
    const maritalStatus = spouse?.maritalStatus || '1'
    return this.handleReturn(maritalStatus)
  }

  async birthCertificate({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<{ hasBirthCertificate: boolean }> {
    const fakeData = getValueViaPath<MarriageConditionsFakeData>(
      application.answers,
      'fakeData',
    )

    if (fakeData?.useFakeData === YES) {
      const lastFour = auth.nationalId.slice(-4)
      return {
        hasBirthCertificate: [
          '3019', // Gervimaður Afríka
          '2399', // Gervimaður Færeyjar
        ].includes(lastFour),
      }
    }

    const res = await this.syslumennService.checkIfBirthCertificateExists(
      auth.nationalId,
    )
    return {
      hasBirthCertificate: res,
    }
  }

  private formatMaritalStatus(maritalCode: string): string {
    return maritalStatuses[maritalCode]
  }

  private allowedCodes(maritalCode: string): boolean {
    return ALLOWED_MARITAL_STATUSES.includes(maritalCode)
  }

  async religionCodes() {
    return await this.nationalRegistryXRoadService.getReligions()
  }

  private handleReturn(maritalStatus: string) {
    if (this.allowedCodes(maritalStatus)) {
      return Promise.resolve({
        maritalStatus: this.formatMaritalStatus(maritalStatus),
      })
    } else {
      this.logger.warn(
        '[marriage-conditions]: invalid marital status - ',
        maritalStatus,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProviderMaritalStatus,
        },
        400,
      )
    }
  }

  async assignSpouse({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherSpouseApplicationEmail,
      application,
    )
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const {
      applicant,
      spouse,
      witness1,
      witness2,
      personalInfo,
      spousePersonalInfo,
      ceremony,
    } = application.answers as MarriageConditionsAnswers

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }
    const personMapper = [
      {
        type: PersonTypes.APPLICANT,
        individual: applicant,
        info: personalInfo,
      },
      {
        type: PersonTypes.SPOUSE,
        individual: spouse,
        info: spousePersonalInfo,
      },
      { type: PersonTypes.WITNESS, individual: witness1 },
      { type: PersonTypes.WITNESS, individual: witness2 },
    ]
    const persons: Person[] = personMapper.map((person) => ({
      name: person.individual.person.name,
      ssn: person.individual.person.nationalId,
      phoneNumber: person.individual.phone,
      email: person.individual.email,
      homeAddress: person.info ? person.info.address : '',
      postalCode: '',
      city: '',
      signed: true,
      type: person.type,
    }))
    const ceremonyPlace: string =
      ceremony.place?.ceremonyPlace === 'office' && ceremony.place?.office
        ? ceremony.place?.office
        : ceremony.place?.society
        ? ceremony.place?.society
        : ''

    const extraData: { [key: string]: string } = {
      vigsluDagur:
        ceremony.date ||
        ceremony.period?.dateFrom + ' - ' + ceremony.period?.dateTo ||
        '',
      vigsluStadur: ceremonyPlace,
      umsaekjandiRikisfang: personalInfo.citizenship,
      umsaekjandiHjuskaparstada: personalInfo.maritalStatus,
      makiRikisfang: spousePersonalInfo.citizenship,
      makiHjuskaparstada: spousePersonalInfo.maritalStatus,
    }
    const uploadDataName = 'hjonavigsla1.0'
    const uploadDataId = 'hjonavigsla1.0'

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(
        persons as Person[],
        undefined,
        extraData,
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
      this.logger.error(
        '[marriage-conditions]: Failed to upload data - ',
        result.message,
      )
      throw new Error(`Application submission failed`)
    }
    return { success: result.success, id: result.caseNumber }
  }
}
