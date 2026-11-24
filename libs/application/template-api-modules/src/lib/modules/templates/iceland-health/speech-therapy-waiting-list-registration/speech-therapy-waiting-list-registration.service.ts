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

    const childrenAwaitingApproval = (
      await Promise.all(
        children.map(async (child) => {
          if (!(await this.isAwaitingApproval(child.nationalId, props.auth))) {
            return null
          }

          // childrenCustodyInformation does not include the child's address.
          const individual =
            await this.nationalRegistryV3Service.getOtherIndividual(
              child.nationalId,
              props.auth,
            )

          return {
            nationalId: child.nationalId,
            fullName: child.fullName,
            address: individual?.address ?? null,
          }
        }),
      )
    ).filter((child) => child !== null)

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

  async getLanguages({ auth }: TemplateApiModuleActionProps) {
    return this.digitalIcelandApiWithAuth(auth).getV1DigitalIcelandLanguages()
  }

  async getAvailableLocations({ auth }: TemplateApiModuleActionProps) {
    return this.digitalIcelandApiWithAuth(
      auth,
    ).getV1DigitalIcelandAvailableLocations()
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
      await api.putV1DigitalIcelandEntriesKennitala({
        kennitala: child.nationalId,
        updateWaitingListEntryRequestModel:
          transformApplicationToUpdateWaitingListEntry(application),
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
