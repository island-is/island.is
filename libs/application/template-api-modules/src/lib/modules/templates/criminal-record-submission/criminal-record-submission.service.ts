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
} from '@island.is/clients/syslumenn'
import { generateSyslumennNotifyErrorEmail } from './emailGenerators/syslumennNotifyError'
import { ApplicationWithAttachments as Application } from '@island.is/application/core'
import { NationalRegistry, UserProfile } from './types'
import { ChargeItemCode } from '@island.is/shared/constants'

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
    try {
      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        id,
        ChargeItemCode.CRIMINAL_RECORD,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      return {
        success: false,
      }
    }

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
    const document = await this.criminalRecordService.getCriminalRecord(
      applicantSsn,
    )

    // Call sýslumaður to get the document sealed before handing it over to the user
    const sealedDocumentResponse = await this.syslumennService.sealDocument(
      document.contentBase64,
    )

    if (!sealedDocumentResponse?.skjal) {
      throw new Error('Eitthvað fór úrskeiðis.')
    }

    const sealedDocument: CriminalRecord = {
      contentBase64: sealedDocumentResponse.skjal,
    }

    // Notify Sýslumaður that person has received the criminal record
    await this.notifySyslumenn(application, sealedDocument)

    return sealedDocument
  }

  private async notifySyslumenn(
    application: Application,
    document: CriminalRecord,
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
      content: document.contentBase64,
    }

    const extraData: { [key: string]: string } = {}

    const uploadDataName = 'Umsókn um sakavottorð frá Ísland.is'
    const uploadDataId = 'Sakavottord2.0'

    await this.syslumennService
      .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotifyErrorEmail,
          (application as unknown) as Application,
        )
        return undefined
      })
  }
}
