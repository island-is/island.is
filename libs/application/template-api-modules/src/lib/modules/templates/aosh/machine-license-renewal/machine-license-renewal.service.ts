import { Injectable } from '@nestjs/common'
import { coreErrorMessages } from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  FileUploadDto,
  PaymentRecievedDto,
  SeminarsClientService,
  WorkMachineLicenseDto,
  WorkMachineLicenseRenewalApplicationDto,
} from '@island.is/clients/seminars-ver'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  isLegalDomicile,
  isOtherAddress,
  medicalCertificate,
  payment,
  prerequisites,
  wantsPlasticCard,
} from '@island.is/application/templates/aosh/machine-license-renewal'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { AttachmentS3Service } from '../../../shared/services'
import { TemplateApiModuleActionProps } from '../../../../types'

@Injectable()
export class MachineLicenseRenewalService extends BaseTemplateApiService {
  constructor(
    private readonly seminarsClientService: SeminarsClientService,
    private readonly attachmentService: AttachmentS3Service,
  ) {
    super(ApplicationTypes.MACHINE_LICENSE_RENEWAL)
  }

  async getWorkMachineLicense({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<WorkMachineLicenseDto> {
    const workMachineLicense =
      await this.seminarsClientService.getWorkMachineLicense(
        auth,
        application.id,
      )

    if (!workMachineLicense.workMachineRightsDtos?.length) {
      throw new TemplateApiError(
        {
          title: prerequisites.errors.noRightsTitle,
          summary: prerequisites.errors.noRights,
        },
        400,
      )
    }

    if (!workMachineLicense.hasLicenseRightsToRenew) {
      throw new TemplateApiError(
        {
          title: prerequisites.errors.noRightsToRenewTitle,
          summary: prerequisites.errors.noRightsToRenew,
        },
        400,
      )
    }

    return workMachineLicense
  }

  async submitApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const {
      applicantEmail,
      applicantPhoneNumber,
      deliveryAddress,
      deliveryPostalCode,
      deliveryRecipient,
    } = getApplicationAnswers(application.answers)

    const { applicantName, paymentId } = getApplicationExternalData(
      application.externalData,
    )

    const medicalCertificate = await this.getMedicalCertificate(application)

    const plasticCard = wantsPlasticCard(application.answers)

    const renewalApplication: WorkMachineLicenseRenewalApplicationDto = {
      applicationId: application.id,
      paymentId,
      email: applicantEmail,
      phoneNumber: applicantPhoneNumber,
      wouldLikePlasticCard: plasticCard,
      sendToLegalAddress: plasticCard
        ? isLegalDomicile(application.answers)
        : undefined,
      sendToAddress: isOtherAddress(application.answers)
        ? {
            address: deliveryAddress,
            postalCode: deliveryPostalCode
              ? Number(deliveryPostalCode)
              : undefined,
            addressedTo: deliveryRecipient?.trim() || applicantName,
          }
        : undefined,
      medicalCertificate,
    }

    await this.seminarsClientService.submitWorkMachineLicenseRenewalApplication(
      auth,
      application.id,
      renewalApplication,
    )
  }

  async verifyPaymentReceived({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<PaymentRecievedDto> {
    const { paymentId } = getApplicationExternalData(application.externalData)

    if (!paymentId) {
      throw new Error('Payment id not found in external data')
    }

    const paymentReceived = await this.seminarsClientService.getPaymentReceived(
      auth,
      application.id,
      paymentId,
    )

    if (!paymentReceived.paymentRecieved) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: payment.errors.paymentNotReceived,
        },
        400,
      )
    }

    return paymentReceived
  }

  private async getMedicalCertificate(
    application: ApplicationWithAttachments,
  ): Promise<FileUploadDto> {
    const [file] = await this.attachmentService.getFiles(application, [
      'medicalCertificate',
    ])

    if (!file?.fileContent) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: medicalCertificate.errors.notFound,
        },
        400,
      )
    }

    return {
      content: file.fileContent,
      fileName: file.fileName,
      extension: file.fileName.split('.').pop(),
    }
  }
}
