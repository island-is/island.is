import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { CriminalRecord } from '@island.is/clients/criminal-record'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'
import { generateSyslumennNotificationEmail } from './emailGenerators/syslumennNotification'
import { Application } from '@island.is/application/core'
import { syslumennDataFromPostalCode } from './utils'
import { NationalRegistry, UserProfile } from './types'

@Injectable()
export class CriminalRecordSubmissionService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly criminalRecordService: CriminalRecordService,
    private readonly syslumennService: SyslumennService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    const result = this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AY101',
    )
    return result
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (isPayment?.fulfilled) {
      return {
        success: true,
      }
    } else {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }
  }

  async getCriminalRecord({
    application,
  }: TemplateApiModuleActionProps): Promise<CriminalRecord> {
    const applicantSsn = application.applicant
    const record = await this.criminalRecordService.getCriminalRecord(
      applicantSsn,
    )

    // Notify Sýslumaður that person has received the criminal record
    await this.notifySyslumenn(application, record)

    return record
  }

  private async notifySyslumenn(
    application: Application,
    record: CriminalRecord,
  ) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      city: nationalRegistryData?.address.city,
      signed: true,
      type: PersonType.CriminalRecordApplicant,
    }
    const persons: Person[] = [person]

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const attachment: Attachment = {
      name: `sakavottord_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
      content: record.contentBase64,
    }

    const extraData: { [key: string]: string } = {}

    const uploadDataName = 'Umsókn um sakavottorð frá Ísland.is'
    const uploadDataId = 'Sakavottord2.0'

    const syslumennData = syslumennDataFromPostalCode(person.postalCode)

    await this.syslumennService
      .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmailWithAttachment(
          generateSyslumennNotificationEmail,
          (application as unknown) as Application,
          Buffer.from(record.contentBase64, 'base64').toString('binary'),
          syslumennData.email,
        )
        return undefined
      })
  }
}
