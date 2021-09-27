import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { GenericScope } from '@island.is/auth/scopes'
import { User, AuthMiddleware } from '@island.is/auth-nest-tools'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignMinistryOfJusticeApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { PartyLetterRegistryApi } from './gen/fetch/party-letter'
import {
  EndorsementListApi,
  EndorsementMetadataDtoFieldEnum,
  EndorsementListDtoTagsEnum,
  ValidationRuleDtoTypeEnum,
} from './gen/fetch/endorsements'
import type {
  ApplicationSystemClient,
  TemplateApiModuleActionProps,
} from '../../../types'
import type { Logger } from '@island.is/logging'

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60
export const APPLICATION_SYSTEM_CLIENT = 'APPLICATION_SYSTEM_CLIENT'

@Injectable()
export class PartyLetterService {
  constructor(
    private partyLetterRegistryApi: PartyLetterRegistryApi,
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_SYSTEM_CLIENT)
    private systemClient: ApplicationSystemClient,
  ) {}

  partyLetterRegistryApiWithAuth(auth: User) {
    return this.partyLetterRegistryApi.withMiddleware(
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

  async assignMinistryOfJustice({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(auth)
      .endorsementListControllerClose({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          generateAssignMinistryOfJusticeApplicationEmail,
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
        // if we succeed in creating the party letter let the applicant know
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
    const { id } = await this.endorsementListApiWithAuth(
      auth,
    ).endorsementListControllerCreate({
      endorsementListDto: {
        title: application.answers.partyName as string,
        description: application.answers.partyLetter as string,
        endorsementMetadata: [
          { field: EndorsementMetadataDtoFieldEnum.fullName },
          { field: EndorsementMetadataDtoFieldEnum.signedTags },
          { field: EndorsementMetadataDtoFieldEnum.address },
        ],
        tags: [EndorsementListDtoTagsEnum.partyLetter2021],
        validationRules: [
          {
            type: ValidationRuleDtoTypeEnum.minAge,
            value: {
              age: 18,
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

  async submitPartyLetter({ application, auth }: TemplateApiModuleActionProps) {
    return await this.partyLetterRegistryApiWithAuth(
      auth,
    ).partyLetterRegistryControllerCreate({
      createDto: {
        partyLetter: application.answers.partyLetter as string,
        partyName: application.answers.partyName as string,
        managers: [],
        owner: application.applicant,
      },
    })
  }
}
