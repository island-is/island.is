import { ApplicationAccessService } from '../tools/applicationAccess.service'
import { Test } from '@nestjs/testing'
import { ApplicationService } from '@island.is/application/api/core'
import {
  createApplicationTemplate,
  createApplication,
} from '@island.is/application/testing'
import * as faker from 'faker'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AllowedDelegation } from '@island.is/application/types'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  ActorDelegationsApi,
  AuthPublicApiClientConfig,
  AuthPublicApiClientModule,
} from '@island.is/clients/auth/public-api'
import { ConfigModule } from '@island.is/nest/config'
import { ApplicationValidationService } from '../tools/applicationTemplateValidation.service'
import { LoggingModule } from '@island.is/logging'

const testApplicationTemplate = createApplicationTemplate()

const createMockUser = (nationalId?: string) => {
  return {
    nationalId: nationalId || '111111-3000',
    scope: [],
    authorization: faker.random.word(),
    client: faker.random.word(),
  }
}

const actorDelegationsApiMock = {
  withMiddleware: jest.fn().mockReturnThis(),
  actorDelegationsControllerFindAll: jest.fn().mockResolvedValue([
    {
      fromName: 'Mose b Lowe',
      fromNationalId: '1111111111',
      scopes: [
        {
          delegationId: 'c8804b66-f88e-4d07-a364-b6ea11f3b52c',
          displayName: 'Intranet',
          id: '09d06b03-c58b-46c8-8fc2-c6cf77bd26a4',
          scopeName: 'correctScope',
          validFrom: '2021-11-12T00:00:00.000Z',
          validTo: '2021-11-13T00:00:00.000Z',
        },
      ],
      toName: 'Account',
      toNationalId: '2304769429',
      types: ['Custom'],
      validTo: '2021-11-13T00:00:00.000Z',
    },
  ]),
}

// const actorDelegationsApiMock = {
//   withMiddleware: jest.fn().mockReturnThis(),
//   actorDelegationsControllerFindAll: jest.fn(),
// }

const procurationHolderUser = createCurrentUser({
  delegationType: AuthDelegationType.ProcurationHolder,
})

const legalGuardianUser = createCurrentUser({
  delegationType: AuthDelegationType.LegalGuardian,
})

describe('ApplicationAccesService', () => {
  let applicationAccessService: ApplicationAccessService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationAccessService,
        {
          provide: ApplicationService,
          useValue: {},
        },
        ApplicationValidationService,
        {
          provide: FeatureFlagService,
          useClass: jest.fn(() => ({
            getValue(
              feature: Features,
              defaultValue: boolean | string,
              user?: User,
            ) {
              if (user?.nationalId === procurationHolderUser.nationalId) {
                if (feature === Features.testing) {
                  return true
                }
              }

              if (user?.nationalId === legalGuardianUser.nationalId) {
                if (feature === Features.testing) {
                  return false
                }
              }

              return defaultValue
            },
          })),
        },
        { provide: ActorDelegationsApi, useValue: actorDelegationsApiMock }, // provide the mock
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AuthPublicApiClientConfig],
        }),
        AuthPublicApiClientModule,
        LoggingModule,
      ],
    }).compile()

    applicationAccessService = moduleRef.get<ApplicationAccessService>(
      ApplicationAccessService,
    )
  })

  describe('isDelegationAllowed', () => {
    it('should return true for correct delegation type and feature flag for isDelegationAllowed ', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.ProcurationHolder,
        featureFlag: Features.testing,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })
      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        procurationHolderUser,
        template,
      )
      expect(results).toBe(true)
    })

    it('should return true with no flag and valid delegation type for isDelegationAllowed', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.LegalGuardian,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })
      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        legalGuardianUser,
        template,
      )
      expect(results).toBe(true)
    })

    it('should return false on false feature flag for isDelegationAllowed', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.LegalGuardian,
        featureFlag: Features.testing,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })
      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        legalGuardianUser,
        template,
      )
      expect(results).toBe(false)
    })

    it('should return false on invalid delegation type for isDelegationAllowed', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.PersonalRepresentative,
        featureFlag: Features.testing,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })
      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        procurationHolderUser,
        template,
      )
      expect(results).toBe(false)
    })

    it('should return true for correct custom delegation type with a correct required scope', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })
      const customDelegationUserWithCorrectScope = createCurrentUser({
        delegationType: AuthDelegationType.Custom,
        scope: ['correctScope'],
      })

      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        customDelegationUserWithCorrectScope,
        template,
      )
      expect(results).toBe(true)
    })

    it('should return false for correct custom delegation type with an incorrect required scope', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })
      const customDelegationUserWithIncorrectScope = createCurrentUser({
        delegationType: AuthDelegationType.Custom,
        scope: ['incorrectScope'],
      })

      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        customDelegationUserWithIncorrectScope,
        template,
      )
      expect(results).toBe(false)
    })

    it('should return false for user with procuration delegation type with a correct required scope', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })
      const procurationUserWithCorrectScope = createCurrentUser({
        delegationType: AuthDelegationType.ProcurationHolder,
        scope: ['correctScope'],
      })

      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        procurationUserWithCorrectScope,
        template,
      )
      expect(results).toBe(false)
    })

    it('should return false for user with no delegation type and a correct required scope', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })
      const userWithNoDelegationAndCorrectScope = createCurrentUser({
        scope: ['correctScope'],
      })

      const results = await applicationAccessService.isDelegationAllowed(
        allowedDelegation,
        userWithNoDelegationAndCorrectScope,
        template,
      )
      expect(results).toBe(false)
    })
  })

  describe('hasAccessToTemplate', () => {
    it('should show on Overview if delegations and flags are correct', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.ProcurationHolder,
        featureFlag: Features.testing,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        procurationHolderUser,
      )

      expect(results).toBe(true)
    })

    it('should not show on Overview if delegation is does not match', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.LegalGuardian,
        featureFlag: Features.testing,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        procurationHolderUser,
      )

      expect(results).toBe(false)
    })

    it('should not show on Overview if user has delegation and feature flag returns false', async () => {
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.LegalGuardian,
        featureFlag: Features.testing,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        procurationHolderUser,
      )

      expect(results).toBe(false)
    })

    it('should return true when application is in draft and user is applicant, shouldBeListedForRole defined as true for applicant', async () => {
      const results = await applicationAccessService.hasAccessToTemplate(
        testApplicationTemplate,
        createMockUser(),
      )
      expect(results).toBe(true)
    })

    it('should return true when application is in draft and user is reviewer, shouldBeListedForRole is undefined for reviewer', async () => {
      const results = await applicationAccessService.hasAccessToTemplate(
        testApplicationTemplate,
        createMockUser(),
      )
      expect(results).toBe(true)
    })

    it('should return false when application is in review and user is reviewer, shouldBeListed defined as false', async () => {
      const applicationInReview = createApplication({
        state: 'inReview',
        applicant: '111111-3000',
      })
      const results = applicationAccessService.evaluateIfRoleShouldBeListed(
        applicationInReview,
        createMockUser('111111-3001'),
        testApplicationTemplate,
      )
      expect(results).toBe(false)
    })

    it('should return true when application is in review and user is applicant, shouldBeListed defined as true', async () => {
      const results = await applicationAccessService.hasAccessToTemplate(
        testApplicationTemplate,
        createMockUser(),
      )
      expect(results).toBe(true)
    })

    it('should return false for shouldShowOnOverview if no template provided', async () => {
      const user = createCurrentUser()

      const results = await applicationAccessService.hasAccessToTemplate(
        undefined,
        user,
      )

      expect(results).toBe(false)
    })

    it('should return false for shouldShowOnOverview if user is acting on behalf but application doesnt allow delegation', async () => {
      const user = createCurrentUser({ actor: { nationalId: '111111111111' } })
      const template = createApplicationTemplate()

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
      )

      expect(results).toBe(false)
    })

    it('should return false for shouldShowOnOverview if user has no delegations but application requires them', async () => {
      const user = createCurrentUser({ actor: { nationalId: '111111111111' } })
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.ProcurationHolder,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
      )

      expect(results).toBe(false)
    })

    it('should return false for shouldShowOnOverview if user has custom delegation but it is not valid', async () => {
      const user = createCurrentUser({
        actor: { nationalId: '111111111111' },
        delegationType: AuthDelegationType.Custom,
        scope: ['incorrectScope'],
      })
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
      )

      expect(results).toBe(false)
    })

    it('should return true if user has correct custom delegation and correct scope', async () => {
      const user = createCurrentUser({
        actor: { nationalId: '111111111111' },
        delegationType: AuthDelegationType.Custom,
        scope: ['correctScope'],
      })
      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }
      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
      )

      expect(results).toBe(true)
    })

    it('should return true if user is not acting on behalf and is the applicant', async () => {
      const user = createCurrentUser({ nationalId: '1234567890' })
      const template = createApplicationTemplate({
        mapUserToRole: (nationalId) =>
          nationalId === '1234567890' ? 'Applicant' : 'Other',
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
      )

      expect(results).toBe(true)
    })

    it('should return true if user has correct custom delegation, correct scope, and scopeCheck is true', async () => {
      const user = createCurrentUser({
        actor: { nationalId: '111111111111' },
        delegationType: AuthDelegationType.Custom,
        scope: ['correctScope'],
      })

      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
        true,
      )

      expect(results).toBe(true)
    })

    it('should return false if user has correct custom delegation, incorrect scope, and scopeCheck is true', async () => {
      actorDelegationsApiMock.actorDelegationsControllerFindAll.mockRejectedValue(
        new Error('Error'),
      )
      const user = createCurrentUser({
        actor: { nationalId: '111111111111' },
        delegationType: AuthDelegationType.Custom,
        scope: ['incorrectScope'],
      })

      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
        true,
      )

      expect(results).toBe(false)
    })

    it('should return false if auth public service errors on scope fetch', async () => {
      actorDelegationsApiMock.actorDelegationsControllerFindAll.mockRejectedValueOnce(
        new Error('Error'),
      )
      const user = createCurrentUser({
        actor: { nationalId: '111111111111' },
        delegationType: AuthDelegationType.Custom,
        scope: ['incorrectScope'],
      })

      const allowedDelegation: AllowedDelegation = {
        type: AuthDelegationType.Custom,
      }

      const template = createApplicationTemplate({
        allowedDelegations: [allowedDelegation],
        requiredScopes: ['correctScope'],
      })

      const results = await applicationAccessService.hasAccessToTemplate(
        template,
        user,
        true,
      )

      expect(results).toBe(false)
    })
  })

  describe('canDeleteApplication', () => {
    it('should return true when application is in draft and user is an applicant attempting to delete', async () => {
      const applicationInDraft = createApplication({
        state: 'draft',
        applicant: '111111-3000',
      })
      const results = await applicationAccessService.canDeleteApplication(
        applicationInDraft,
        '111111-3000',
      )
      expect(results).toBe(true)
    })

    it('should return false when application is in inReview and user is an applicant attempting to delete', async () => {
      const applicationInReview = createApplication({
        state: 'inReview',
        applicant: '111111-3000',
      })
      const results = await applicationAccessService.canDeleteApplication(
        applicationInReview,
        '111111-3000',
      )
      expect(results).toBe(false)
    })
  })
})
