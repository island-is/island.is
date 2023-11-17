import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  error,
  ResidencePermitRenewalAnswers,
} from '@island.is/application/templates/directorate-of-immigration/residence-permit-renewal'
import {
  CriminalRecordViewModel,
  DirectorateOfImmigrationClient,
  StudyViewModel,
} from '@island.is/clients/directorate-of-immigration'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ResidencePermitRenewalService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly directorateOfImmigrationClient: DirectorateOfImmigrationClient,
  ) {
    super(ApplicationTypes.RESIDENCE_PERMIT_RENEWAL)
  }

  async getApplicantCurrentResidencePermit({
    auth,
  }: TemplateApiModuleActionProps): Promise<any> {
    const applicant =
      await this.directorateOfImmigrationClient.getApplicantCurrentResidencePermit(
        auth,
      )

    const children =
      await this.directorateOfImmigrationClient.getChildrenCurrentResidencePermit(
        auth,
      )

    const canAtLeastOneApplyPermanent = !![applicant, ...children].find(
      (x) => x.canApplyRenewal,
    )
    if (!canAtLeastOneApplyPermanent) {
      throw new TemplateApiError(
        {
          title: error.notAllowedToRenew,
          summary: error.notAllowedToRenew,
        },
        400,
      )
    }

    return applicant
  }

  async getChildrenCurrentResidencePermit({
    auth,
  }: TemplateApiModuleActionProps): Promise<any[]> {
    return await this.directorateOfImmigrationClient.getChildrenCurrentResidencePermit(
      auth,
    )
  }

  async getApplicantCurrentResidencePermitType({
    auth,
  }: TemplateApiModuleActionProps): Promise<any> {
    return await this.directorateOfImmigrationClient.getApplicantCurrentResidencePermitType(
      auth,
    )
  }

  async getCurrentCriminalRecordList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CriminalRecordViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentCriminalRecordList(
      auth,
    )
  }

  async getCurrentStudyItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<StudyViewModel | undefined> {
    return this.directorateOfImmigrationClient.getCurrentStudyItem(auth)
  }

  async getCurrentAgentItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<any | undefined> {
    return this.directorateOfImmigrationClient.getCurrentAgentItem(auth)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as ResidencePermitRenewalAnswers

    // Submit the application
    await this.directorateOfImmigrationClient.submitApplicationForResidencePermitRenewal(
      auth,
    )
  }
}
