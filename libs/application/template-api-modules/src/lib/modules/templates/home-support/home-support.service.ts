import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  Adilar,
  ApplicantType,
  ApplicationApi,
  Notandagogn,
} from '@island.is/clients/workpoint/arborg'
import { HomeSupportAnswers } from '@island.is/application/templates/home-support'
import { uuid } from 'uuidv4'
import { YES } from '@island.is/application/core'

@Injectable()
export class HomeSupportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private applicationApi: ApplicationApi,
  ) {
    super(ApplicationTypes.HOME_SUPPORT)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as HomeSupportAnswers

    const applicant = {
      guid: uuid(),
      heiti: answers.applicant.name,
      kennitala: answers.applicant.nationalId,
      heimili: answers.applicant.address,
      postnumer: answers.applicant.postalCode,
      stadur: answers.applicant.city,
      netfang: answers.applicant.email,
      simi: answers.applicant.phoneNumber,
      hlutverk: 'Umsækjandi',
    } as Adilar

    const contacts =
      answers.contacts?.map((contact) => {
        return {
          heiti: contact.name,
          nafn: contact.name,
          kennitala: '',
          heimili: '',
          postnumer: '',
          stadur: '',
          tegund: contact.mainContact?.includes(YES)
            ? ApplicantType.NUMBER_1
            : ApplicantType.NUMBER_0,
          netfang: contact.email,
          simi: contact.phone,
          hlutverk: contact.relation,
        } as Adilar
      }) ?? []

    const adilar = [applicant, ...contacts]

    const reason = {
      guid: uuid(),
      gildi: answers.reason as unknown as object,
      flokkur: 'reason',
      tegund: 'text',
      heiti: 'Ástæða umsóknar',
    } as Notandagogn

    const needsDoctor = {
      guid: uuid(),
      gildi: answers.receivesDoctorService as unknown as object,
      flokkur: 'needsDoctor',
      tegund: 'text',
      heiti: 'Færðu þjónustu nú þegar?',
    } as Notandagogn

    // Disabled for now
    /* const exemption = {
      guid: uuid(),
      gildi: answers.exemption as unknown as object,
      flokkur: 'exemption',
      tegund: 'text',
      heiti: 'Ég vil sækja um undanþágu',
    } as Notandagogn */

    const result = await this.applicationApi.applicationPost({
      applicationSystemInput: {
        adilar,
        language: 'is',
        portalApplicationID: application.id,
        applicationName: 'Heimilishjálp',
        applicationType: ApplicationTypes.HOME_SUPPORT,
        dagssetning: new Date(),
        notandagogn: [reason, needsDoctor],
      },
    })

    return result
  }
}
