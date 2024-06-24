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
import { generateSyslumennNotifyErrorEmail } from './emailGenerators/syslumennNotifyError'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { Identity, UserProfile, SelectedProperty } from './types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class MortgageCertificateSubmissionService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly mortgageCertificateService: MortgageCertificateService,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.MORTGAGE_CERTIFICATE)
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

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

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
  }: TemplateApiModuleActionProps): Promise<MortgageCertificate[]> {
    const selectedProperties = getValueViaPath(
      application.answers,
      'selectedProperties.properties',
      [],
    ) as SelectedProperty[]
    const properties = selectedProperties.map(
      ({ propertyType, propertyNumber }) => {
        return {
          propertyNumber,
          propertyType,
        }
      },
    )

    const documents =
      await this.mortgageCertificateService.getMortgageCertificate(properties)

    // Call sýslumaður to get the document sealed before handing it over to the user
    const sealedDocuments: MortgageCertificate[] = await Promise.all(
      documents.map(async (document) => {
        const sealedDocumentResponse = await this.syslumennService.sealDocument(
          document.contentBase64,
        )
        if (!sealedDocumentResponse?.skjal) {
          throw new Error('Eitthvað fór úrskeiðis.')
        }
        return {
          contentBase64: sealedDocumentResponse.skjal,
          propertyNumber: document.propertyNumber,
        }
      }),
    )

    // Notify Sýslumaður that person has received the mortgage certificate
    await this.notifySyslumenn(application, documents)

    return sealedDocuments
  }

  private async notifySyslumenn(
    application: Application,
    documents: MortgageCertificate[],
  ) {
    const identityData = application.externalData.identity?.data as Identity
    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile

    const person: Person = {
      name: identityData?.name,
      ssn: identityData?.nationalId,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      homeAddress: identityData?.address?.streetAddress || '',
      postalCode: identityData?.address?.postalCode || '',
      city: identityData?.address?.city || '',
      signed: true,
      type: PersonType.MortgageCertificateApplicant,
    }
    const persons: Person[] = [person]

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const attachments: Attachment[] = documents.map((document) => {
      return {
        name: `vedbokarvottord_${document.propertyNumber}_${identityData?.nationalId}_${dateStr}.pdf`,
        content: document.contentBase64,
      }
    })

    const extraData: { [key: string]: string } = {
      propertyNumber: documents
        .map((document) => {
          return document.propertyNumber
        })
        .join(','),
    }

    const uploadDataName = 'Umsókn um veðbókarvottorð frá Ísland.is'
    const uploadDataId = 'Vedbokavottord1.0'

    await this.syslumennService
      .uploadData(persons, attachments, extraData, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotifyErrorEmail,
          application as unknown as Application,
        )
        return undefined
      })
  }
}
