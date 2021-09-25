import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationSystemClient,
  TemplateApiModuleActionProps,
} from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignSupremeCourtApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
  GenerateAssignSupremeCourtApplicationEmailOptions,
} from './emailGenerators'
import {
  EndorsementListApi,
  EndorsementListDtoTagsEnum,
  EndorsementListTagsEnum,
  EndorsementMetadataDtoFieldEnum,
  ValidationRuleDtoTypeEnum,
} from './gen/fetch'

import type { Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { GenericScope } from '@island.is/auth/scopes'

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60

export const PARTY_APPLICATION_SERVICE_OPTIONS =
  'PARTY_APPLICATION_SERVICE_OPTIONS'
export const APPLICATION_SYSTEM_CLIENT = 'APPLICATION_SYSTEM_CLIENT'

export interface PartyApplicationServiceOptions {
  adminEmails: GenerateAssignSupremeCourtApplicationEmailOptions
}

interface PartyLetterData {
  partyName: string
  partyLetter: string
}

@Injectable()
export class PartyApplicationService {
  constructor(
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(PARTY_APPLICATION_SERVICE_OPTIONS)
    private options: PartyApplicationServiceOptions,
    @Inject(APPLICATION_SYSTEM_CLIENT)
    private systemClient: ApplicationSystemClient,
  ) {}

  endorsementListApiWithAuth(auth: User) {
    return this.endorsementListApi.withMiddleware(
      new AuthMiddleware(auth, {
        forwardUserInfo: false,
        tokenExchangeOptions: {
          scope: `openid ${GenericScope.system}`,
          requestActorToken: true,
          issuer: this.systemClient.issuer,
          clientId: this.systemClient.clientId,
          clientSecret: this.systemClient.clientSecret,
        },
      }),
    )
  }

  async assignSupremeCourt({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(auth)
      .endorsementListControllerClose({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          generateAssignSupremeCourtApplicationEmail(this.options.adminEmails),
          application,
          ONE_DAY_IN_SECONDS_EXPIRES,
        )
      })
      .catch(() => {
        this.logger.error('Failed to close endorsement list', listId)
        throw new Error('Failed to close endorsement list')
      })
  }

  async applicationRejected({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(auth)
      .endorsementListControllerOpen({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationRejectedEmail,
          application,
        )
      })
      .catch(() => {
        this.logger.error('Failed to open endorsement list', listId)
        throw new Error('Failed to open endorsement list')
      })
  }

  async applicationApproved({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async createEndorsementList({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const partyLetter = application.externalData.partyLetterRegistry
      ?.data as PartyLetterData

    const { id } = await this.endorsementListApiWithAuth(
      auth,
    ).endorsementListControllerCreate({
      endorsementListDto: {
        title: partyLetter.partyName,
        description: partyLetter.partyLetter,
        endorsementMetadata: [
          { field: EndorsementMetadataDtoFieldEnum.fullName },
          { field: EndorsementMetadataDtoFieldEnum.signedTags },
          {
            field: EndorsementMetadataDtoFieldEnum.address,
            keepUpToDate: true,
          },
          {
            field: EndorsementMetadataDtoFieldEnum.voterRegion,
            keepUpToDate: true,
          },
        ],
        tags: [application.answers.constituency as EndorsementListDtoTagsEnum],
        validationRules: [
          {
            type: ValidationRuleDtoTypeEnum.minAgeAtDate,
            value: {
              date: '2021-09-25T00:00:00Z',
              age: 18,
            },
          },
          {
            type: ValidationRuleDtoTypeEnum.uniqueWithinTags,
            value: {
              tags: [
                EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021,
                EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021,
                EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021,
                EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021,
                EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021,
                EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021,
              ],
            },
          },
        ],
        meta: {
          // to be able to link back to this application
          applicationTypeId: application.typeId,
          applicationId: application.id,
        },
      },
    })

    // This gets written to externalData under the key createEndorsementList
    return {
      id,
    }
  }
}
