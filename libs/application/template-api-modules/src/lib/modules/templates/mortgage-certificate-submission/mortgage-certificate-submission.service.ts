import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { MortgageCertificateService } from '@island.is/api/domains/mortgage-certificate'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  MortgageCertificate,
} from '@island.is/clients/syslumenn'
import { generateSyslumennNotificationEmail } from './emailGenerators/syslumennNotification'
import { Application } from '@island.is/application/core'
import { NationalRegistry, UserProfile } from './types'
import { ChargeItemCode } from '@island.is/shared/constants'

@Injectable()
export class MortgageCertificateSubmissionService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly mortgageCertificateService: MortgageCertificateService,
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
        ChargeItemCode.MORTGAGE_CERTIFICATE,
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

  async getMortgageCertificate({
    application,
  }: TemplateApiModuleActionProps): Promise<MortgageCertificate> {
    const applicantSsn = application.applicant
    const record = await this.mortgageCertificateService.getMortgageCertificate(
      applicantSsn,
    )

    // Call sýslumaður to get the document sealed before handing it over to the user
    const sealedRecordResponse = await this.syslumennService.sealDocument(
      record.contentBase64,
    )

    if (!sealedRecordResponse?.skjal) {
      throw new Error('Eitthvað fór úrskeiðis.')
    }

    const sealedRecord: MortgageCertificate = {
      contentBase64: sealedRecordResponse.skjal,
    }

    // Notify Sýslumaður that person has received the mortgage certificate
    await this.notifySyslumenn(application, sealedRecord)

    return sealedRecord
  }

  private async notifySyslumenn(
    application: Application,
    record: MortgageCertificate,
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
      type: PersonType.MortgageCertificateApplicant,
    }
    const persons: Person[] = [person]

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const attachment: Attachment = {
      name: `vedbokarvottord_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
      content: record.contentBase64,
    }

    const extraData: { [key: string]: string } = {}

    const uploadDataName = 'Umsókn um veðbókarvottorð frá Ísland.is'
    const uploadDataId = 'Vedbokarvottord'

    await this.syslumennService
      .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotificationEmail,
          (application as unknown) as Application,
        )
        return undefined
      })
  }
}
