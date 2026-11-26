import { YES } from '@island.is/application/core'
import {
  errorMessages,
  getApplicationAnswers,
  getSelectedChild,
} from '@island.is/application/templates/iceland-health/speech-therapy-waiting-list-registration'
import { ApplicationTypes } from '@island.is/application/types'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { DigitalIcelandApi } from '@island.is/clients/icelandic-health-insurance/speech-therapy'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { StaticText } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'
import {
  transformApplicationToRejectWaitingListEntry,
  transformApplicationToUpdateWaitingListEntry,
} from './speech-therapy-waiting-list-registration.utils'

@Injectable()
export class SpeechTherapyWaitingListRegistrationService extends BaseTemplateApiService {
  constructor(
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly digitalIcelandApi: DigitalIcelandApi,
  ) {
    super(ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION)
  }

  private digitalIcelandApiWithAuth(auth: User) {
    return this.digitalIcelandApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getChildren(props: TemplateApiModuleActionProps) {
    const children =
      await this.nationalRegistryV3Service.childrenCustodyInformation({
        ...props,
        params: undefined,
      })

    const awaitingApproval = await Promise.all(
      children.map((child) =>
        this.isAwaitingApproval(child.nationalId, props.auth),
      ),
    )

    const childrenAwaitingApproval = children
      .filter((_, index) => awaitingApproval[index])
      .map(({ nationalId, fullName }) => ({ nationalId, fullName }))

    if (childrenAwaitingApproval.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.noChildOnWaitingListTitle,
          summary: errorMessages.noChildOnWaitingListSummary,
        },
        400,
      )
    }

    return childrenAwaitingApproval
  }

  // 404: the child is not on the waiting list.
  // 403: the child is on the waiting list but the user is not its guardian.
  private async isAwaitingApproval(childNationalId: string, auth: User) {
    try {
      await this.digitalIcelandApiWithAuth(
        auth,
      ).getV1DigitalIcelandEntriesKennitalaVerify({
        kennitala: childNationalId,
      })
      return true
    } catch (error) {
      if (
        error instanceof FetchError &&
        (error.status === 404 || error.status === 403)
      ) {
        return false
      }
      throw error
    }
  }

  // Choosing a language and a location is required, so an empty list from
  // Sjúkratryggingar would leave the applicant stuck in the draft.
  private throwIfEmpty<T>(options: T[], summary: StaticText): T[] {
    if (options.length === 0) {
      throw new TemplateApiError(
        { title: errorMessages.optionsUnavailableTitle, summary },
        400,
      )
    }

    return options
  }

  async getLanguages({ auth }: TemplateApiModuleActionProps) {
    return this.throwIfEmpty(
      await this.digitalIcelandApiWithAuth(auth).getV1DigitalIcelandLanguages(),
      errorMessages.languagesUnavailableSummary,
    )
  }

  async getAvailableLocations({ auth }: TemplateApiModuleActionProps) {
    return this.throwIfEmpty(
      await this.digitalIcelandApiWithAuth(
        auth,
      ).getV1DigitalIcelandAvailableLocations(),
      errorMessages.locationsUnavailableSummary,
    )
  }

  async getSpeechPathologists({ auth }: TemplateApiModuleActionProps) {
    return this.digitalIcelandApiWithAuth(
      auth,
    ).getV1DigitalIcelandSpeechPathologists()
  }

  async getRejectionReasons({ auth }: TemplateApiModuleActionProps) {
    return this.digitalIcelandApiWithAuth(
      auth,
    ).getV1DigitalIcelandRejectionReasons()
  }

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const { waitingListConsent } = getApplicationAnswers(application.answers)

    const child = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (!child) {
      throw new Error('Missing selected child')
    }

    const api = this.digitalIcelandApiWithAuth(auth)

    if (waitingListConsent === YES) {
      const updateWaitingListEntryRequestModel =
        transformApplicationToUpdateWaitingListEntry(application)

      if (
        updateWaitingListEntryRequestModel.languages.length === 0 ||
        updateWaitingListEntryRequestModel.locations.length === 0
      ) {
        throw new Error('Missing languages or locations')
      }

      await api.putV1DigitalIcelandEntriesKennitala({
        kennitala: child.nationalId,
        updateWaitingListEntryRequestModel,
      })
    } else {
      await api.putV1DigitalIcelandEntriesKennitalaReject({
        kennitala: child.nationalId,
        waitingListEntryRejectRequestModel:
          transformApplicationToRejectWaitingListEntry(application),
      })
    }
  }
}
