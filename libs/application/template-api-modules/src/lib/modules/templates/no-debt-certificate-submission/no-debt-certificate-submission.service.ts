//TODOx cleanup

import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { NoDebtCertificateService } from '@island.is/api/domains/no-debt-certificate'
// import { NoDebtCertificate } from '@island.is/clients/no-debt-certificate'
import { NoDebtCertificate } from '@island.is/api/domains/no-debt-certificate'
// import {
//   SyslumennService,
//   Person,
//   Attachment,
//   PersonType,
// } from '@island.is/clients/syslumenn'
import { ApplicationWithAttachments as Application } from '@island.is/application/core'
import { NationalRegistry, UserProfile } from './types'

@Injectable()
export class NoDebtCertificateSubmissionService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly noDebtCertificateService: NoDebtCertificateService, // private readonly syslumennService: SyslumennService,
  ) {}

  async getNoDebtCertificate({
    application,
  }: TemplateApiModuleActionProps): Promise<NoDebtCertificate> {
    const applicantSsn = application.applicant
    const document = await this.noDebtCertificateService.getNoDebtCertificate(
      applicantSsn,
    )

    return document

    // // Call sýslumaður to get the document sealed before handing it over to the user
    // const sealedDocumentResponse = await this.syslumennService.sealDocument(
    //   document.contentBase64,
    // )

    // if (!sealedDocumentResponse?.skjal) {
    //   throw new Error('Eitthvað fór úrskeiðis.')
    // }

    // const sealedDocument: NoDebtCertificate = {
    //   contentBase64: sealedDocumentResponse.skjal,
    // }

    // // Notify Sýslumaður that person has received the criminal record
    // await this.notifySyslumenn(application, sealedDocument)

    // return sealedDocument
  }

  // private async notifySyslumenn(
  //   application: Application,
  //   document: NoDebtCertificate,
  // ) {
  //   const nationalRegistryData = application.externalData.nationalRegistry
  //     ?.data as NationalRegistry
  //   const userProfileData = application.externalData.userProfile
  //     ?.data as UserProfile

  //   const person: Person = {
  //     name: nationalRegistryData?.fullName,
  //     ssn: nationalRegistryData?.nationalId,
  //     phoneNumber: userProfileData?.mobilePhoneNumber,
  //     email: userProfileData?.email,
  //     homeAddress: nationalRegistryData?.address.streetAddress,
  //     postalCode: nationalRegistryData?.address.postalCode,
  //     city: nationalRegistryData?.address.city,
  //     signed: true,
  //     type: PersonType.NoDebtCertificateApplicant,
  //   }
  //   const persons: Person[] = [person]

  //   const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
  //   const attachment: Attachment = {
  //     name: `sakavottord_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
  //     content: document.contentBase64,
  //   }

  //   const extraData: { [key: string]: string } = {}

  //   const uploadDataName = 'Umsókn um sakavottorð frá Ísland.is'
  //   const uploadDataId = 'Sakavottord2.0'

  //   await this.syslumennService
  //     .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
  //     .catch(async () => {
  //       await this.sharedTemplateAPIService.sendEmail(
  //         generateSyslumennNotifyErrorEmail,
  //         (application as unknown) as Application,
  //       )
  //       return undefined
  //     })
  // }
}
