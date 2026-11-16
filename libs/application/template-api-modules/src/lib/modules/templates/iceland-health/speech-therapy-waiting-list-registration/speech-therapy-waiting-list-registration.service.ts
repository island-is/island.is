import { YES } from '@island.is/application/core'
import {
  errorMessages,
  getApplicationAnswers,
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
    const children = await this.getChildrenAwaitingApproval(props)

    if (children.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.noChildOnWaitingListTitle,
          summary: errorMessages.noChildOnWaitingListSummary,
        },
        400,
      )
    }

    return children
  }

  private async getChildrenAwaitingApproval(
    props: TemplateApiModuleActionProps,
  ) {
    const children =
      await this.nationalRegistryV3Service.childrenCustodyInformation({
        ...props,
        params: undefined,
      })

    const childrenAwaitingApproval = await Promise.all(
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

        return { ...child, address: individual?.address ?? null }
      }),
    )

    return childrenAwaitingApproval.filter((child) => child !== null)
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

  // TODO: Dummy data until the Sjúkra languages endpoint is ready.
  async getLanguages({ auth }: TemplateApiModuleActionProps) {
    // return this.digitalIcelandApiWithAuth(auth).getV1DigitalIcelandLanguages()
    return [
      { id: 'is', code: 'is' },
      { id: 'en', code: 'en' },
      { id: 'pl', code: 'pl' },
    ]
  }

  // TODO: Dummy data until the Sjúkra available locations endpoint is ready.
  async getAvailableLocations({ auth }: TemplateApiModuleActionProps) {
    // return this.digitalIcelandApiWithAuth(
    //   auth,
    // ).getV1DigitalIcelandAvailableLocations()
    return [
      { id: 1, municipality: 'Reykjavíkurborg' },
      { id: 2, municipality: 'Kópavogsbær' },
      { id: 3, municipality: 'Hafnarfjarðarkaupstaður' },
      { id: 4, municipality: 'Akureyrarbær' },
    ]
  }

  // TODO: Dummy data until the Sjúkra speech pathologists endpoint is ready.
  async getSpeechPathologists({ auth }: TemplateApiModuleActionProps) {
    // return this.digitalIcelandApiWithAuth(
    //   auth,
    // ).getV1DigitalIcelandSpeechPathologists()
    return [
      {
        name: 'Anna Jónsdóttir',
        kennitala: '0101302989',
        locations: [
          { id: 1, municipality: 'Reykjavíkurborg' },
          { id: 2, municipality: 'Kópavogsbær' },
        ],
      },
      {
        name: 'Guðrún Sigurðardóttir',
        kennitala: '0101304929',
        locations: [{ id: 3, municipality: 'Hafnarfjarðarkaupstaður' }],
      },
      {
        name: 'Jón Ólafsson',
        kennitala: '0101307789',
        locations: [{ id: 4, municipality: 'Akureyrarbær' }],
      },
    ]
  }

  // TODO: Dummy data until the Sjúkra rejection reasons endpoint is ready.
  async getRejectionReasons({ auth }: TemplateApiModuleActionProps) {
    // return this.digitalIcelandApiWithAuth(
    //   auth,
    // ).getV1DigitalIcelandRejectionReasons()
    return [
      {
        id: 1,
        isName: 'Hafna þjónustu um talþjálfun',
        enName: 'Decline speech therapy services',
        code: 'DECLINE_SERVICE',
      },
      {
        id: 2,
        isName: 'Barn þegar í talþjálfun',
        enName: 'Child already in speech therapy',
        code: 'ALREADY_IN_THERAPY',
      },
    ]
  }

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const { selectedChildNationalId, waitingListConsent } =
      getApplicationAnswers(application.answers)

    if (!selectedChildNationalId) {
      throw new Error('Missing child national id')
    }

    const api = this.digitalIcelandApiWithAuth(auth)

    if (waitingListConsent === YES) {
      await api.putV1DigitalIcelandEntriesKennitala({
        kennitala: selectedChildNationalId,
        updateWaitingListEntryRequestModel:
          transformApplicationToUpdateWaitingListEntry(application),
      })
    } else {
      await api.putV1DigitalIcelandEntriesKennitalaReject({
        kennitala: selectedChildNationalId,
        waitingListEntryRejectRequestModel:
          transformApplicationToRejectWaitingListEntry(application),
      })
    }
  }
}
