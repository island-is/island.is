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
import { PersonTypes } from './types'
import { MarriageConditionsAnswers } from '@island.is/application/templates/marriage-conditions/types'

@Injectable()
export class MarriageConditionsSubmissionService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AY129',
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async assignSpouse({ application, auth }: TemplateApiModuleActionProps) {
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

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
      ceremony.withDate?.ceremonyPlace === 'office' && ceremony.withDate?.office
        ? ceremony.withDate?.office
        : ceremony.withDate?.society
        ? ceremony.withDate?.society
        : ''

    const extraData: { [key: string]: string } = {
      vigsluDagur:
        ceremony.withDate?.date ||
        ceremony.withPeriod?.dateFrom + ' - ' + ceremony.withPeriod?.dateTil ||
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
      throw new Error(`Application submission failed`)
    }
    return { success: result.success, id: result.caseNumber }
  }
}
