import { Inject, Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath, YES } from '@island.is/application/core'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class AdditionalDrivingLicenseService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.ADDITIONAL_DRIVING_LICENSE)
  }

  /**
   * DONE-state action. Runs after the applicant has paid (the FJS charge is
   * created by the PAYMENT state's `buildPaymentState`, so there is no separate
   * `createCharge` action here — see constants.ts).
   *
   * NOTE: the actual RLS order is not implemented yet. Two gaps block it and
   * both are RLS-API decisions that live outside this repo:
   *
   *   1. B-advanced (meirapróf) categories (C1/C/D1/D + E and professional
   *      variants) have NO client method in `@island.is/clients/driving-license`.
   *      `postApplicationNewCollaborative` is for stolen/lost duplicates, not
   *      added categories. A new RLS endpoint + client method is required.
   *
   *   2. BE (trailer): `DrivingLicenseService.applyForBELicense` requires an
   *      `instructorSSN` and a full `healthDeclarationModel`. This template's
   *      dataSchema collects neither (only a `healthCertificate` file upload) —
   *      it is the "add rights to an existing full B licence" flow, so calling
   *      applyForBELicense would submit incorrect data. The correct endpoint /
   *      payload must be confirmed with the RLS API owner before wiring.
   *
   * Until then submitApplication throws a typed error on the real path so the
   * unfinished state is loud, while fake-data runs are allowed through so the
   * DONE screen can still be exercised in dev.
   */
  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.logger.error(
        '[additional-driving-license] reached DONE with unfulfilled payment',
        { applicationId: application.id },
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: coreErrorMessages.errorDataProvider,
        },
        500,
      )
    }

    // Dev fake-data escape hatch: skip the (unimplemented) RLS call so the
    // DONE state can be reached and tested locally.
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      answers,
      'fakeData.useFakeData',
    )
    if (useFakeData === YES) {
      this.logger.info(
        '[additional-driving-license] fake data — skipping RLS submission',
      )
      return { success: true }
    }

    // TODO(RLS): implement the real order once the endpoints above exist.
    // Guarded by `readyForProduction: false` on the template, so no real
    // applicant reaches this today.
    this.logger.error(
      '[additional-driving-license] RLS submission not implemented',
      { applicationFor: getValueViaPath(answers, 'applicationFor') },
    )
    throw new TemplateApiError(
      {
        title: coreErrorMessages.failedDataProviderSubmit,
        summary: coreErrorMessages.errorDataProvider,
      },
      500,
    )
  }
}
